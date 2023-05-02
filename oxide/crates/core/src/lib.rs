use crate::parser::Extractor;
use fxhash::FxHashSet;
use ignore::WalkBuilder;
use rayon::prelude::*;
use std::path::Path;
use std::path::PathBuf;
use tracing::event;

pub mod candidate;
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

// Goals:
//
// 1. Recursively watch all top-level folders but not the root folders.
// 2. Watch files in root directly.
// 3. Watch files in the `public` folder directly (and don't watch the `public` folder itself).
// 4. Always watch a common set of known file extensions
//    (js,jsx,ts,tsx,html,php,vue,svelte,astro,md,mdx,...).
// 5. Merge known list of file extensions with discovered file extensions in the project (marko).

pub fn resolve_content_paths(args: ContentPathInfo) -> Vec<String> {
    let root = Path::new(&args.base);

    // A list of direct folder names where we can't use globs, but we should track each file individually instead.
    // This is because these folders are often used for "src" and also "dist" like files.
    let static_direct_folder_indentifiers = vec!["public"];

    // A list of known extensions + a list of extensions we found in the project.
    let mut found_extensions = FxHashSet::from_iter(vec![
        "js", "ts", "jsx", "tsx", "mjs", "mts", "cjs", "cts", "html", "php", "vue", "svelte",
        "astro", "md", "mdx",
    ]);

    // A list of direct folders, from the root, where we can use globs to watch all files.
    let mut direct_folders = FxHashSet::default();

    // A list of static files that we should track directly.
    let mut static_files = vec![];

    // Collect all valid paths from the root. This will already filter out ignored files, unknown
    // extensions and binary files.
    let paths: Vec<_> = WalkBuilder::new(&root)
        .hidden(false)
        .filter_entry(move |entry| {
            // Skip known ignored folders
            if entry.file_type().unwrap().is_dir() {
                return entry
                    .file_name()
                    .to_str()
                    .map(|s| s != ".git")
                    .unwrap_or(false);
            }

            is_allowed_content_path(entry.path())
        })
        .build()
        .filter_map(Result::ok)
        .collect();

    for path in &paths {
        let path = path.path();

        // If the `path` is a directory, and a direct child of the root and most importantly not a
        // special cased direct folder (like `public`), then we can track the current folder and
        // setup globs later.
        if path.is_dir()
            && path.parent().map(|parent| parent == root).unwrap_or(false)
            && !static_direct_folder_indentifiers
                .iter()
                .any(|p| root.join(p) == path)
        {
            direct_folders.insert(path);
        }

        if let Some(parent) = path.parent() {
            // Collect the extension for future use when building globs.
            if let Some(extension) = path.extension() {
                found_extensions.insert(extension.to_str().unwrap_or_default());
            }

            if path.is_file() {
                // If the parent of the current file is the root folder, then we have to track the
                // current file directly.
                if parent == root {
                    static_files.push(format!("{}", path.display()));
                    continue;
                }

                // If the current file is located in one of the direct folders seen from the root,
                // then we have to track the current file directly.
                if static_direct_folder_indentifiers
                    .iter()
                    .any(|p| parent.starts_with(root.join(p)))
                {
                    static_files.push(format!("{}", path.display()));
                }
            }
        }
    }

    let globs = direct_folders
        .iter()
        .flat_map(|path| {
            match found_extensions.len() {
                0 => None, // This should never happen
                1 => Some(format!(
                    "{}/**/*.{}",
                    path.display(),
                    found_extensions.iter().next().unwrap()
                )),
                _ => Some(format!(
                    "{}/**/*.{{{}}}",
                    path.display(),
                    found_extensions
                        .iter()
                        .map(|x| x.to_string())
                        .collect::<Vec<_>>()
                        .join(",")
                )),
            }
        })
        .collect::<Vec<_>>();

    static_files.extend(globs);
    static_files
}

pub fn is_git_ignored_content_path(base: &Path, path: &Path) -> bool {
    !WalkBuilder::new(base)
        .hidden(false)
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

pub fn parse_candidate_strings_from_files(changed_content: Vec<ChangedContent>) -> Vec<String> {
    init_tracing();
    parse_all_blobs(read_all_files(changed_content))
}

pub fn parse_candidate_strings(input: Vec<ChangedContent>, options: u8) -> Vec<String> {
    init_tracing();

    match (IO::from(options), Parsing::from(options)) {
        (IO::Sequential, Parsing::Sequential) => parse_all_blobs_sync(read_all_files_sync(input)),
        (IO::Sequential, Parsing::Parallel) => parse_all_blobs_sync(read_all_files(input)),
        (IO::Parallel, Parsing::Sequential) => parse_all_blobs(read_all_files_sync(input)),
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
