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
pub static RULES: sync::LazyLock<Vec<Gitignore>> = sync::LazyLock::new(|| {
    let mut builder = GitignoreBuilder::new("");

    builder.add_line(None, &IGNORED_CONTENT_DIRS_GLOB).unwrap();
    builder.add_line(None, &IGNORED_EXTENSIONS_GLOB).unwrap();
    builder.add_line(None, &IGNORED_FILES_GLOB).unwrap();

    // Ensure these rules do not match on folder names
    let mut file_only_builder = GitignoreBuilder::new("");
    file_only_builder
        .only_on_files(true)
        .add_line(None, &BINARY_EXTENSIONS_GLOB)
        .unwrap();

    vec![builder.build().unwrap(), file_only_builder.build().unwrap()]
});

pub static IGNORED_CONTENT_DIRS: sync::LazyLock<Vec<&'static str>> = sync::LazyLock::new(|| {
    include_str!("fixtures/ignored-content-dirs.txt")
        .trim()
        .lines()
        .collect()
});

static IGNORED_CONTENT_DIRS_GLOB: sync::LazyLock<String> =
    sync::LazyLock::new(|| format!("{{{}}}/", IGNORED_CONTENT_DIRS.join(",")));

static IGNORED_EXTENSIONS_GLOB: sync::LazyLock<String> = sync::LazyLock::new(|| {
    format!(
        "*.{{{}}}",
        include_str!("fixtures/ignored-extensions.txt")
            .trim()
            .lines()
            .collect::<Vec<&str>>()
            .join(",")
    )
});

pub static BINARY_EXTENSIONS_GLOB: sync::LazyLock<String> = sync::LazyLock::new(|| {
    format!(
        "*.{{{}}}",
        include_str!("fixtures/binary-extensions.txt")
            .trim()
            .lines()
            .collect::<Vec<&str>>()
            .join(",")
    )
});

static IGNORED_FILES_GLOB: sync::LazyLock<String> = sync::LazyLock::new(|| {
    format!(
        "{{{}}}",
        include_str!("fixtures/ignored-files.txt")
            .trim()
            .lines()
            .collect::<Vec<&str>>()
            .join(",")
    )
});
