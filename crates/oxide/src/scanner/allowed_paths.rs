use ignore::{DirEntry, WalkBuilder};
use lazy_static::lazy_static;
use std::path::Path;

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
