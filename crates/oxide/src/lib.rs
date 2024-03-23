use crate::parser::Extractor;
use bstr::ByteSlice;
use cache::Cache;
use fxhash::FxHashSet;
use ignore::DirEntry;
use ignore::WalkBuilder;
use lazy_static::lazy_static;
use rayon::prelude::*;
use std::cmp::Ordering;
use std::path::Path;
use std::path::PathBuf;
use std::sync::Mutex;
use tracing::event;
use walkdir::WalkDir;

pub mod cache;
pub mod cursor;
pub mod fast_skip;
pub mod glob;
pub mod parser;

fn init_tracing() {
    if !*SHOULD_TRACE {
        return;
    }

    _ = tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_span_events(tracing_subscriber::fmt::format::FmtSpan::ACTIVE)
        .compact()
        .try_init();
}

#[derive(Debug, Clone)]
pub struct ChangedContent {
    pub file: Option<PathBuf>,
    pub content: Option<String>,
}

#[derive(Debug, Clone)]
pub struct ScanOptions {
    pub base: String,
    pub globs: bool,
}

#[derive(Debug, Clone)]
pub struct ScanResult {
    pub candidates: Vec<String>,
    pub files: Vec<String>,
    pub globs: Vec<GlobEntry>,
}

#[derive(Debug, Clone)]
pub struct GlobEntry {
    pub base: String,
    pub glob: String,
}

pub fn clear_cache() {
    let mut cache = GLOBAL_CACHE.lock().unwrap();
    cache.clear();
}

pub fn scan_dir(opts: ScanOptions) -> ScanResult {
    init_tracing();

    let root = Path::new(&opts.base);

    let (files, dirs) = resolve_files(root);

    let globs = if opts.globs {
        resolve_globs(root, dirs)
    } else {
        vec![]
    };

    let mut cache = GLOBAL_CACHE.lock().unwrap();

    let modified_files = cache.find_modified_files(&files);

    let files = files.iter().map(|x| x.display().to_string()).collect();

    if !modified_files.is_empty() {
        let content: Vec<_> = modified_files
            .into_iter()
            .map(|file| ChangedContent {
                file: Some(file.clone()),
                content: None,
            })
            .collect();

        let candidates = scan_files(content, IO::Parallel as u8 | Parsing::Parallel as u8);
        cache.add_candidates(candidates);
    }

    ScanResult {
        candidates: cache.get_candidates(),
        files,
        globs,
    }
}

#[tracing::instrument(skip(root))]
fn resolve_globs(root: &Path, dirs: Vec<PathBuf>) -> Vec<GlobEntry> {
    let allowed_paths = FxHashSet::from_iter(dirs);

    // A list of directory names where we can't use globs, but we should track each file
    // individually instead. This is because these directories are often used for both source and
    // destination files.
    let mut forced_static_directories = vec![root.join("public")];

    // A list of known extensions + a list of extensions we found in the project.
    let mut found_extensions = FxHashSet::from_iter(
        include_str!("fixtures/template-extensions.txt")
            .trim()
            .lines()
            .filter(|x| !x.starts_with('#')) // Drop commented lines
            .filter(|x| !x.is_empty()) // Drop empty lines
            .map(|x| x.to_string()),
    );

    // All root directories.
    let mut root_directories = FxHashSet::from_iter(vec![root.to_path_buf()]);

    // All directories where we can safely use deeply nested globs to watch all files.
    // In other comments we refer to these as "deep glob directories" or similar.
    //
    // E.g.: `./src/**/*.{html,js}`
    let mut deep_globable_directories: FxHashSet<PathBuf> = FxHashSet::default();

    // All directories where we can only use shallow globs to watch all direct files but not
    // folders.
    // In other comments we refer to these as "shallow glob directories" or similar.
    //
    // E.g.: `./src/*/*.{html,js}`
    let mut shallow_globable_directories: FxHashSet<PathBuf> = FxHashSet::default();

    // Collect all valid paths from the root. This will already filter out ignored files, unknown
    // extensions and binary files.
    let mut it = WalkDir::new(root)
        // Sorting to make sure that we always see the directories before the files. Also sorting
        // alphabetically by default.
        .sort_by(
            |a, z| match (a.file_type().is_dir(), z.file_type().is_dir()) {
                (true, false) => Ordering::Less,
                (false, true) => Ordering::Greater,
                _ => a.file_name().cmp(z.file_name()),
            },
        )
        .into_iter();

    loop {
        // We are only interested in valid entries
        let entry = match it.next() {
            Some(Ok(entry)) => entry,
            _ => break,
        };

        // Ignore known directories that we don't want to traverse into.
        if entry.file_type().is_dir() && entry.file_name() == ".git" {
            it.skip_current_dir();
            continue;
        }

        if entry.file_type().is_dir() {
            // If we are in a directory where we know that we can't use any globs, then we have to
            // track each file individually.
            if forced_static_directories.contains(&entry.path().to_path_buf()) {
                forced_static_directories.push(entry.path().to_path_buf());
                root_directories.insert(entry.path().to_path_buf());
                continue;
            }

            // If we are in a directory where the parent is a forced static directory, then this
            // will become a forced static directory as well.
            if forced_static_directories.contains(&entry.path().parent().unwrap().to_path_buf()) {
                forced_static_directories.push(entry.path().to_path_buf());
                root_directories.insert(entry.path().to_path_buf());
                continue;
            }

            // If we are in a directory, and the directory is git ignored, then we don't have to
            // descent into the directory. However, we have to make sure that we mark the _parent_
            // directory as a shallow glob directory because using deep globs from any of the
            // parent directories will include this ignored directory which should not be the case.
            //
            // Another important part is that if one of the ignored directories is a deep glob
            // directory, then all of its parents (until the root) should be marked as shallow glob
            // directories as well.
            if !allowed_paths.contains(&entry.path().to_path_buf()) {
                let mut parent = entry.path().parent();
                while let Some(parent_path) = parent {
                    // If the parent is already marked as a valid deep glob directory, then we have
                    // to mark it as a shallow glob directory instead, because we won't be able to
                    // use deep globs for this directory anymore.
                    if deep_globable_directories.contains(parent_path) {
                        deep_globable_directories.remove(parent_path);
                        shallow_globable_directories.insert(parent_path.to_path_buf());
                    }

                    // If we reached the root, then we can stop.
                    if parent_path == root {
                        break;
                    }

                    // Mark the parent directory as a shallow glob directory and continue with its
                    // parent.
                    shallow_globable_directories.insert(parent_path.to_path_buf());
                    parent = parent_path.parent();
                }

                it.skip_current_dir();
                continue;
            }

            // If we are in a directory that is not git ignored, then we can mark this directory as
            // a valid deep glob directory. This is only necessary if any of its parents aren't
            // marked as deep glob directories already.
            let mut found_deep_glob_parent = false;
            let mut parent = entry.path().parent();
            while let Some(parent_path) = parent {
                // If we reached the root, then we can stop.
                if parent_path == root {
                    break;
                }

                // If the parent is already marked as a deep glob directory, then we can stop
                // because this glob will match the current directory already.
                if deep_globable_directories.contains(parent_path) {
                    found_deep_glob_parent = true;
                    break;
                }

                parent = parent_path.parent();
            }

            // If we didn't find a deep glob directory parent, then we can mark this directory as a
            // deep glob directory (unless it is the root).
            if !found_deep_glob_parent && entry.path() != root {
                deep_globable_directories.insert(entry.path().to_path_buf());
            }
        }

        // Handle allowed content paths
        if is_allowed_content_path(entry.path())
            && allowed_paths.contains(&entry.path().to_path_buf())
        {
            let path = entry.path();

            // Collect the extension for future use when building globs.
            if let Some(extension) = path.extension().and_then(|x| x.to_str()) {
                found_extensions.insert(extension.to_string());
            }
        }
    }

    let extension_list = found_extensions.into_iter().collect::<Vec<_>>().join(",");

    // Build the globs for all globable directories.
    let shallow_globs = shallow_globable_directories.iter().map(|path| GlobEntry {
        base: path.display().to_string(),
        glob: format!("*/*.{{{}}}", extension_list),
    });

    let deep_globs = deep_globable_directories.iter().map(|path| GlobEntry {
        base: path.display().to_string(),
        glob: format!("**/*.{{{}}}", extension_list),
    });

    shallow_globs.chain(deep_globs).collect::<Vec<_>>()
}

#[tracing::instrument(skip(root))]
fn resolve_files(root: &Path) -> (Vec<PathBuf>, Vec<PathBuf>) {
    let mut files: Vec<PathBuf> = vec![];
    let mut dirs: Vec<PathBuf> = vec![];

    for entry in resolve_allowed_paths(root) {
        let Some(file_type) = entry.file_type() else {
            continue;
        };

        if file_type.is_file() {
            files.push(entry.into_path());
        } else if file_type.is_dir() {
            dirs.push(entry.into_path());
        }
    }

    (files, dirs)
}

#[tracing::instrument(skip(root))]
pub fn resolve_allowed_paths(root: &Path) -> impl Iterator<Item = DirEntry> {
    WalkBuilder::new(root)
        .hidden(false)
        .require_git(false)
        .filter_entry(|entry| match entry.file_type() {
            Some(file_type) if file_type.is_dir() => match entry.file_name().to_str() {
                Some(dir) => !IGNORED_CONTENT_DIRS.contains(&dir),
                None => false,
            },
            Some(file_type) if file_type.is_file() || file_type.is_symlink() => {
                is_allowed_content_path(entry.path())
            }
            _ => false,
        })
        .build()
        .filter_map(Result::ok)
}

lazy_static! {
    static ref BINARY_EXTENSIONS: Vec<&'static str> =
        include_str!("fixtures/binary-extensions.txt")
            .trim()
            .lines()
            .collect::<Vec<_>>();
    static ref IGNORED_EXTENSIONS: Vec<&'static str> =
        include_str!("fixtures/ignored-extensions.txt")
            .trim()
            .lines()
            .collect::<Vec<_>>();
    static ref IGNORED_FILES: Vec<&'static str> = include_str!("fixtures/ignored-files.txt")
        .trim()
        .lines()
        .collect::<Vec<_>>();
    static ref IGNORED_CONTENT_DIRS: Vec<&'static str> = vec![".git"];
    static ref SHOULD_TRACE: bool = {
        matches!(std::env::var("DEBUG"), Ok(value) if value.eq("*") || value.eq("1") || value.eq("true") || value.contains("tailwind"))
    };

    /// Track file modification times and cache candidates. This cache lives for the lifetime of
    /// the process and simply adds candidates when files are modified. Since candidates aren't
    /// removed, incremental builds may contain extra candidates.
    static ref GLOBAL_CACHE: Mutex<Cache> = {
        Mutex::new(Cache::default())
    };
}

pub fn is_allowed_content_path(path: &Path) -> bool {
    let path = PathBuf::from(path);

    // Skip known ignored files
    if path
        .file_name()
        .unwrap()
        .to_str()
        .map(|s| IGNORED_FILES.contains(&s))
        .unwrap_or(false)
    {
        return false;
    }

    // Skip known ignored extensions
    path.extension()
        .map(|s| s.to_str().unwrap_or_default())
        .map(|ext| !IGNORED_EXTENSIONS.contains(&ext) && !BINARY_EXTENSIONS.contains(&ext))
        .unwrap_or(false)
}

#[derive(Debug)]
pub enum IO {
    Sequential = 0b0001,
    Parallel = 0b0010,
}

impl From<u8> for IO {
    fn from(item: u8) -> Self {
        match item & 0b0011 {
            0b0001 => IO::Sequential,
            0b0010 => IO::Parallel,
            _ => unimplemented!("Unknown 'IO' strategy"),
        }
    }
}

#[derive(Debug)]
pub enum Parsing {
    Sequential = 0b0100,
    Parallel = 0b1000,
}

impl From<u8> for Parsing {
    fn from(item: u8) -> Self {
        match item & 0b1100 {
            0b0100 => Parsing::Sequential,
            0b1000 => Parsing::Parallel,
            _ => unimplemented!("Unknown 'Parsing' strategy"),
        }
    }
}

#[tracing::instrument(skip(input, options))]
pub fn scan_files(input: Vec<ChangedContent>, options: u8) -> Vec<String> {
    match (IO::from(options), Parsing::from(options)) {
        (IO::Sequential, Parsing::Sequential) => parse_all_blobs_sync(read_all_files_sync(input)),
        (IO::Sequential, Parsing::Parallel) => parse_all_blobs(read_all_files_sync(input)),
        (IO::Parallel, Parsing::Sequential) => parse_all_blobs_sync(read_all_files(input)),
        (IO::Parallel, Parsing::Parallel) => parse_all_blobs(read_all_files(input)),
    }
}

fn read_changed_content(c: ChangedContent) -> Option<Vec<u8>> {
    if let Some(content) = c.content {
        return Some(content.into_bytes());
    }

    let Some(file) = c.file else {
        return Default::default();
    };

    let Ok(content) = std::fs::read(&file).map_err(|e| {
        event!(tracing::Level::ERROR, "Failed to read file: {:?}", e);
        e
    }) else {
        return Default::default();
    };

    let Some(extension) = file.extension().map(|x| x.to_str()) else {
        return Some(content);
    };

    match extension {
        Some("svelte") => Some(content.replace(" class:", " ")),
        _ => Some(content),
    }
}

#[tracing::instrument(skip(changed_content))]
fn read_all_files(changed_content: Vec<ChangedContent>) -> Vec<Vec<u8>> {
    event!(
        tracing::Level::INFO,
        "Reading {:?} file(s)",
        changed_content.len()
    );

    changed_content
        .into_par_iter()
        .filter_map(read_changed_content)
        .collect()
}

#[tracing::instrument(skip(changed_content))]
fn read_all_files_sync(changed_content: Vec<ChangedContent>) -> Vec<Vec<u8>> {
    event!(
        tracing::Level::INFO,
        "Reading {:?} file(s)",
        changed_content.len()
    );

    changed_content
        .into_iter()
        .filter_map(read_changed_content)
        .collect()
}

#[tracing::instrument(skip(blobs))]
fn parse_all_blobs(blobs: Vec<Vec<u8>>) -> Vec<String> {
    let input: Vec<_> = blobs.iter().map(|blob| &blob[..]).collect();
    let input = &input[..];

    let mut result: Vec<String> = input
        .par_iter()
        .map(|input| Extractor::unique(input, Default::default()))
        .reduce(Default::default, |mut a, b| {
            a.extend(b);
            a
        })
        .into_iter()
        .map(|s| {
            // SAFETY: When we parsed the candidates, we already guaranteed that the byte slices
            // are valid, therefore we don't have to re-check here when we want to convert it back
            // to a string.
            unsafe { String::from_utf8_unchecked(s.to_vec()) }
        })
        .collect();
    result.sort();
    result
}

#[tracing::instrument(skip(blobs))]
fn parse_all_blobs_sync(blobs: Vec<Vec<u8>>) -> Vec<String> {
    let input: Vec<_> = blobs.iter().map(|blob| &blob[..]).collect();
    let input = &input[..];

    let mut result: Vec<String> = input
        .iter()
        .map(|input| Extractor::unique(input, Default::default()))
        .fold(FxHashSet::default(), |mut a, b| {
            a.extend(b);
            a
        })
        .into_iter()
        .map(|s| {
            // SAFETY: When we parsed the candidates, we already guaranteed that the byte slices
            // are valid, therefore we don't have to re-check here when we want to convert it back
            // to a string.
            unsafe { String::from_utf8_unchecked(s.to_vec()) }
        })
        .collect();
    result.sort();
    result
}
