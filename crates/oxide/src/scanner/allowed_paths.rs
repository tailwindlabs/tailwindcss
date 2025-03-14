use ignore::gitignore::{Gitignore, GitignoreBuilder};
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
    sync::LazyLock::new(|| vec![".git", "node_modules"]);

pub static AUTO_SOURCE_DETECTION_RULES: sync::LazyLock<Gitignore> = sync::LazyLock::new(|| {
    let mut builder = GitignoreBuilder::new("");

    builder
        .add_line(None, &format!("{{{}}}", IGNORED_CONTENT_DIRS.join(",")))
        .unwrap();
    builder
        .add_line(None, &format!("*.{{{}}}", IGNORED_EXTENSIONS.join(",")))
        .unwrap();
    builder
        .add_line(None, &format!("*.{{{}}}", BINARY_EXTENSIONS.join(",")))
        .unwrap();
    builder
        .add_line(None, &format!("{{{}}}", IGNORED_FILES.join(",")))
        .unwrap();

    builder.build().unwrap()
});

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
