use ignore::gitignore::{Gitignore, GitignoreBuilder};
use ignore::WalkBuilder;
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

pub static AUTO_SOURCE_DETECTION_RULES: sync::LazyLock<Gitignore> = sync::LazyLock::new(|| {
    let mut builder = GitignoreBuilder::new("");

    for line in IGNORED_CONTENT_DIRS.iter() {
        builder.add_line(None, line).unwrap();
    }

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

pub fn create_walk_builder(root: &Path) -> WalkBuilder {
    let mut builder = WalkBuilder::new(root);

    // Scan hidden files / directories
    builder.hidden(false);

    // Don't respect global gitignore files
    builder.git_global(false);

    // By default, allow .gitignore files to be used regardless of whether or not
    // a .git directory is present. This is an optimization for when projects
    // are first created and may not be in a git repo yet.
    builder.require_git(false);

    // Don't descend into .git directories inside the root folder
    // This is necessary when `root` contains the `.git` dir.
    builder.filter_entry(|entry| entry.file_name() != ".git");

    // If we are in a git repo then require it to ensure that only rules within
    // the repo are used. For example, we don't want to consider a .gitignore file
    // in the user's home folder if we're in a git repo.
    //
    // The alternative is using a call like `.parents(false)` but that will
    // prevent looking at parent directories for .gitignore files from within
    // the repo and that's not what we want.
    //
    // For example, in a project with this structure:
    //
    // home
    // .gitignore
    //  my-project
    //   .gitignore
    //   apps
    //     .gitignore
    //     web
    //       {root}
    //
    // We do want to consider all .gitignore files listed:
    // - home/.gitignore
    // - my-project/.gitignore
    // - my-project/apps/.gitignore
    //
    // However, if a repo is initialized inside my-project then only the following
    // make sense for consideration:
    // - my-project/.gitignore
    // - my-project/apps/.gitignore
    //
    // Setting the require_git(true) flag conditionally allows us to do this.
    for parent in root.ancestors() {
        if parent.join(".git").exists() {
            builder.require_git(true);
            break;
        }
    }

    builder
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
