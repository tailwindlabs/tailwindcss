use crate::parser::Extractor;
use fxhash::FxHashSet;
use ignore::WalkBuilder;
use rayon::prelude::*;
use std::cmp::Ordering;
use std::path::Path;
use std::path::PathBuf;
use tracing::event;
use walkdir::WalkDir;

pub mod candidate;
pub mod cursor;
pub mod fast_skip;
pub mod glob;
pub mod location;
pub mod modifier;
pub mod parser;
pub mod utility;
pub mod variant;

fn init_tracing() {
    if matches!(std::env::var("DEBUG"), Ok(value) if value.eq("*") || value.eq("1") || value.eq("true") || value.contains("tailwind"))
    {
        tracing_subscriber::fmt()
            .with_max_level(tracing::Level::INFO)
            .with_span_events(tracing_subscriber::fmt::format::FmtSpan::ACTIVE)
            .compact()
            .init();
    }
}

#[derive(Debug, Clone)]
pub struct ChangedContent {
    pub file: Option<PathBuf>,
    pub content: Option<String>,
    pub extension: String,
}

#[derive(Debug, Clone)]
pub struct ContentPathInfo {
    pub base: String,
}

pub fn resolve_content_paths(args: ContentPathInfo) -> Vec<String> {
    let root = Path::new(&args.base);

    let allowed_paths = FxHashSet::from_iter(
        WalkBuilder::new(root)
            .hidden(false)
            .filter_entry(|entry| match entry.file_type() {
                Some(file_type) if file_type.is_dir() => entry
                    .file_name()
                    .to_str()
                    .map(|s| s != ".git")
                    .unwrap_or(false),
                _ => true,
            })
            .build()
            .filter_map(Result::ok)
            .map(|x| x.into_path()),
    );

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

    // A list of static files that we should track directly.
    let mut static_files = vec![];

    // All root directories.
    let mut root_directories = FxHashSet::from_iter(vec![root.to_path_buf()]);

    // All directories where we can safely use deeply nested globs to watch all files.
    // In other comments we refer to these as "deep glob directories" or similar.
    //
    // E.g.: ./src/**/*.{html,js}
    let mut deep_globable_directories: FxHashSet<PathBuf> = FxHashSet::default();

    // All directories where we can only use shallow globs to watch all direct files but not
    // folders.
    // In other comments we refer to these as "shallow glob directories" or similar.
    //
    // E.g.: ./src/*/*.{html,js}
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
            else {
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

                // If we didn't find a deep glob directory parent, then we can mark this directory
                // as a deep glob directory (unless it is the root).
                if !found_deep_glob_parent && entry.path() != root {
                    deep_globable_directories.insert(entry.path().to_path_buf());
                }
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

            // If the current path is a file inside any of the root directories, then we have to
            // track it directly as a static file.
            if let Some(parent_path) = path.parent() {
                if root_directories.contains(parent_path) {
                    static_files.push(format!("{}", path.display()));
                }
            }
        }
    }

    // Build the globs for all globable directories.
    let shallow_globs = shallow_globable_directories
        .iter()
        .map(|path| format!("{}", path.display()));
    let deep_globs = deep_globable_directories
        .iter()
        .map(|path| format!("{}/**", path.display()));
    let globs = shallow_globs
        .chain(deep_globs)
        .flat_map(|path| match found_extensions.len() {
            0 => None, // This should never happen
            1 => Some(format!(
                "{}/*.{}",
                path,
                found_extensions.iter().next().unwrap()
            )),
            _ => Some(format!(
                "{}/*.{{{}}}",
                path,
                found_extensions
                    .iter()
                    .map(|x| x.to_string())
                    .collect::<Vec<_>>()
                    .join(","),
            )),
        })
        .collect::<Vec<_>>();

    static_files.extend(globs);
    static_files
}

pub fn is_git_ignored_content_path(base: &Path, path: &Path) -> bool {
    !WalkBuilder::new(base)
        .hidden(false)
        .filter_entry(|entry| match entry.file_type() {
            Some(file_type) if file_type.is_dir() => entry
                .file_name()
                .to_str()
                .map(|s| s != ".git")
                .unwrap_or(false),
            _ => true,
        })
        .build()
        .filter_map(Result::ok)
        .any(|e| e.path() == path)
}

pub fn is_allowed_content_path(path: &Path) -> bool {
    let binary_extensions = include_str!("fixtures/binary-extensions.txt")
        .trim()
        .lines()
        .collect::<Vec<_>>();
    let ignored_extensions = include_str!("fixtures/ignored-extensions.txt")
        .trim()
        .lines()
        .collect::<Vec<_>>();
    let ignored_files = include_str!("fixtures/ignored-files.txt")
        .trim()
        .lines()
        .collect::<Vec<_>>();

    let path = PathBuf::from(path);

    // Skip known ignored files
    if path
        .file_name()
        .unwrap()
        .to_str()
        .map(|s| ignored_files.contains(&s))
        .unwrap_or(false)
    {
        return false;
    }

    // Skip known ignored extensions
    return path
        .extension()
        .map(|s| s.to_str().unwrap_or_default())
        .map(|ext| !ignored_extensions.contains(&ext) && !binary_extensions.contains(&ext))
        .unwrap_or(false);
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

pub fn parse_candidate_strings(input: Vec<ChangedContent>, options: u8) -> Vec<String> {
    init_tracing();

    match (IO::from(options), Parsing::from(options)) {
        (IO::Sequential, Parsing::Sequential) => parse_all_blobs_sync(read_all_files_sync(input)),
        (IO::Sequential, Parsing::Parallel) => parse_all_blobs(read_all_files_sync(input)),
        (IO::Parallel, Parsing::Sequential) => parse_all_blobs_sync(read_all_files(input)),
        (IO::Parallel, Parsing::Parallel) => parse_all_blobs(read_all_files(input)),
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
        .map(|c| match (c.file, c.content) {
            (Some(file), None) => match std::fs::read(file) {
                Ok(content) => content,
                Err(e) => {
                    event!(tracing::Level::ERROR, "Failed to read file: {:?}", e);
                    Default::default()
                }
            },
            (None, Some(content)) => content.into_bytes(),
            _ => Default::default(),
        })
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
        .map(|c| match (c.file, c.content) {
            (Some(file), None) => std::fs::read(file).unwrap(),
            (None, Some(content)) => content.into_bytes(),
            _ => Default::default(),
        })
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
