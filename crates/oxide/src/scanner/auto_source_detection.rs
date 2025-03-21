use ignore::gitignore::{Gitignore, GitignoreBuilder};
use std::sync;

/// All the default rules for auto source detection.
///
/// This includes:
///
/// - Ignoring common content directories like `.git` and `node_modules`
/// - Ignoring file extensions we definitely don't want to include like `.css` and `.scss`
/// - Ignoring common binary file extensions like `.png` and `.jpg`
/// - Ignoring common files like `yarn.lock` and `package-lock.json`
///
pub static RULES: sync::LazyLock<Gitignore> = sync::LazyLock::new(|| {
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
