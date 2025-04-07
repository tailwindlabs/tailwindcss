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

    builder.add_line(None, &IGNORED_CONTENT_DIRS_GLOB).unwrap();
    builder.add_line(None, &IGNORED_EXTENSIONS_GLOB).unwrap();
    for glob in BINARY_EXTENSIONS_GLOB.clone() {
        builder.add_line(None, &glob).unwrap();
    }
    builder.add_line(None, &IGNORED_FILES_GLOB).unwrap();

    builder.build().unwrap()
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

pub static BINARY_EXTENSIONS_GLOB: sync::LazyLock<Vec<String>> = sync::LazyLock::new(|| {
    vec![
        // Ignore the extensions
        format!(
            "*.{{{}}}",
            include_str!("fixtures/binary-extensions.txt")
                .trim()
                .lines()
                .collect::<Vec<&str>>()
                .join(","),
        ),
        // Do not ignore folders that happen to end with a binary extension
        format!(
            "!*.{{{}}}/",
            include_str!("fixtures/binary-extensions.txt")
                .trim()
                .lines()
                .collect::<Vec<&str>>()
                .join(","),
        ),
    ]
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
