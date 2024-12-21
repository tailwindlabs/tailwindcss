use ignore::{DirEntry, WalkBuilder};
use std::{path::Path, sync};

static BINARY_EXTENSIONS: sync::LazyLock<Vec<&'static str>> = sync::LazyLock::new(|| {
    include_str!("fixtures/binary-extensions.txt")
        .trim()
        .lines()
        .collect()
});

static IGNORED_EXTENSIONS: sync::LazyLock<Vec<&'static str>> = sync::LazyLock::new(|| {
    include_str!("fixtures/ignored-extensions.txt")
        .trim()
        .lines()
        .collect()
});

static IGNORED_FILES: sync::LazyLock<Vec<&'static str>> = sync::LazyLock::new(|| {
    include_str!("fixtures/ignored-files.txt")
        .trim()
        .lines()
        .collect()
});

static IGNORED_CONTENT_DIRS: sync::LazyLock<Vec<&'static str>> =
    sync::LazyLock::new(|| vec![".git"]);

#[tracing::instrument(skip_all)]
pub fn resolve_allowed_paths(root: &Path) -> impl Iterator<Item = DirEntry> {
    // Read the directory recursively with no depth limit
    read_dir(root, None)
}

#[tracing::instrument(skip_all)]
pub fn resolve_paths(root: &Path) -> impl Iterator<Item = DirEntry> {
    WalkBuilder::new(root)
        .hidden(false)
        .require_git(false)
        .build()
        .filter_map(Result::ok)
}

pub fn read_dir(root: &Path, depth: Option<usize>) -> impl Iterator<Item = DirEntry> {
    WalkBuilder::new(root)
        .hidden(false)
        .require_git(false)
        .max_depth(depth)
        .filter_entry(move |entry| match entry.file_type() {
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

pub fn is_allowed_content_path(path: &Path) -> bool {
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
