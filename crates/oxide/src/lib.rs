use crate::parser::Extractor;
use crate::scanner::allowed_paths::{is_allowed_content_path, resolve_allowed_paths};
use bstr::ByteSlice;
use cache::Cache;
use fxhash::FxHashSet;
use glob::fast_glob;
use glob::get_fast_patterns;
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
pub mod scanner;

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
    /// Base path to start scanning from
    pub base: Option<String>,
    /// Glob sources
    pub sources: Vec<GlobEntry>,
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
    pub pattern: String,
}

pub fn clear_cache() {
    let mut cache = GLOBAL_CACHE.lock().unwrap();
    cache.clear();
}

pub fn scan_dir(opts: ScanOptions) -> ScanResult {
    init_tracing();

    let (mut files, mut globs) = match opts.base {
        Some(base) => {
            // Only enable auto content detection when `base` is provided.
            let base = Path::new(&base);
            let (files, dirs) = resolve_files(base);
            let globs = resolve_globs(base, dirs);

            (files, globs)
        }
        None => (vec![], vec![]),
    };

    // If we have additional sources, then we have to resolve them as well.
    if !opts.sources.is_empty() {
        let resolved_files: Vec<_> = match fast_glob(&opts.sources) {
            Ok(matches) => matches
                .filter_map(|x| dunce::canonicalize(&x).ok())
                .collect(),
            Err(err) => {
                event!(tracing::Level::ERROR, "Failed to resolve glob: {:?}", err);
                vec![]
            }
        };

        files.extend(resolved_files);

        let optimized_incoming_globs = get_fast_patterns(&opts.sources)
            .iter()
            .flat_map(|(root, globs)| {
                globs.iter().filter_map(|glob| {
                    let root = match dunce::canonicalize(root.clone()) {
                        Ok(root) => root,
                        Err(error) => {
                            event!(
                                tracing::Level::ERROR,
                                "Failed to canonicalize base path {:?}",
                                error
                            );
                            return None;
                        }
                    };

                    let base = root.display().to_string();
                    let glob = glob.to_string();
                    Some(GlobEntry {
                        base,
                        pattern: glob,
                    })
                })
            })
            .collect::<Vec<GlobEntry>>();

        globs.extend(optimized_incoming_globs);
    }

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

        let candidates = scan_files(content);
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
        include_str!("scanner/fixtures/template-extensions.txt")
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
        pattern: format!("*/*.{{{}}}", extension_list),
    });

    let deep_globs = deep_globable_directories.iter().map(|path| GlobEntry {
        base: path.display().to_string(),
        pattern: format!("**/*.{{{}}}", extension_list),
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

lazy_static! {
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

#[tracing::instrument(skip(input))]
pub fn scan_files(input: Vec<ChangedContent>) -> Vec<String> {
    parse_all_blobs(read_all_files(input))
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
