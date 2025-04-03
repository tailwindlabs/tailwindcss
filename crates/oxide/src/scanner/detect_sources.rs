use crate::scanner::auto_source_detection::IGNORED_CONTENT_DIRS;
use crate::GlobEntry;
use fxhash::FxHashSet;
use globwalk::DirEntry;
use std::cmp::Ordering;
use std::path::PathBuf;
use std::sync;
use walkdir::WalkDir;

static KNOWN_EXTENSIONS: sync::LazyLock<Vec<&'static str>> = sync::LazyLock::new(|| {
    include_str!("fixtures/template-extensions.txt")
        .trim()
        .lines()
        // Drop commented lines
        .filter(|x| !x.starts_with('#'))
        // Drop empty lines
        .filter(|x| !x.is_empty())
        .collect()
});

// Sorting to make sure that we always see the directories before the files. Also sorting
// alphabetically by default.
fn sort_by_dir_and_name(a: &DirEntry, z: &DirEntry) -> Ordering {
    match (a.file_type().is_dir(), z.file_type().is_dir()) {
        (true, false) => Ordering::Less,
        (false, true) => Ordering::Greater,
        _ => a.file_name().cmp(z.file_name()),
    }
}

pub fn resolve_globs(
    base: PathBuf,
    dirs: &[PathBuf],
    extensions: &FxHashSet<String>,
) -> Vec<GlobEntry> {
    let allowed_paths: FxHashSet<PathBuf> = FxHashSet::from_iter(dirs.iter().cloned());

    // A list of known extensions + a list of extensions we found in the project.
    let mut found_extensions: FxHashSet<String> =
        FxHashSet::from_iter(KNOWN_EXTENSIONS.iter().map(|x| x.to_string()));
    found_extensions.extend(extensions.iter().cloned());

    // A list of directory names where we can't use globs, but we should track each file
    // individually instead. This is because these directories are often used for both source and
    // destination files.
    let forced_static_directories: FxHashSet<PathBuf> =
        FxHashSet::from_iter(vec![base.join("public")]);

    // All directories where we can safely use deeply nested globs to watch all files.
    // In other comments we refer to these as "deep glob directories" or similar.
    //
    // E.g.: `./src/**/*.{html,js}`
    let mut deep_globable_directories: FxHashSet<PathBuf> = Default::default();

    // All directories where we can only use shallow globs to watch all direct files but not
    // folders.
    // In other comments we refer to these as "shallow glob directories" or similar.
    //
    // E.g.: `./src/*/*.{html,js}`
    let mut shallow_globable_directories: FxHashSet<PathBuf> = Default::default();

    // Collect all valid paths from the root. This will already filter out ignored files, unknown
    // extensions and binary files.
    let mut it = WalkDir::new(&base)
        .sort_by(sort_by_dir_and_name)
        .into_iter();

    // Figure out all the shallow globable directories.
    while let Some(Ok(entry)) = it.next() {
        let path = entry.path();
        if !path.is_dir() {
            continue;
        }

        if !allowed_paths.contains(path) {
            let mut path = path;
            while let Some(parent) = path.parent() {
                if parent == base {
                    break;
                }

                shallow_globable_directories.insert(parent.to_path_buf());
                path = parent
            }

            it.skip_current_dir();
        }
    }

    // Figure out all the deep globable directories.
    let mut it = WalkDir::new(&base)
        .sort_by(sort_by_dir_and_name)
        .into_iter();

    while let Some(Ok(entry)) = it.next() {
        let path = entry.path();
        if path.is_file() {
            continue;
        }

        if path == base {
            continue;
        }

        if IGNORED_CONTENT_DIRS
            .iter()
            .any(|dir| match path.file_name() {
                Some(name) => name == *dir,
                None => false,
            })
        {
            it.skip_current_dir();
            continue;
        }

        if !allowed_paths.contains(path) {
            continue;
        }

        // Already marked as a shallow globable directory.
        if shallow_globable_directories.contains(path) {
            continue;
        }

        if forced_static_directories.contains(path) {
            it.skip_current_dir();
            continue;
        }

        // Track deep globable directories.
        deep_globable_directories.insert(path.to_path_buf());
        it.skip_current_dir();
    }

    let mut extension_list = found_extensions.clone().into_iter().collect::<Vec<_>>();

    extension_list.sort();

    let extension_list = extension_list.join(",");

    // Build the globs for all globable directories.
    let shallow_globs = shallow_globable_directories.iter().map(|path| GlobEntry {
        base: path.display().to_string(),
        pattern: format!("*/*.{{{}}}", extension_list),
    });

    let deep_globs = deep_globable_directories.iter().map(|path| GlobEntry {
        base: path.display().to_string(),
        pattern: format!("**/*.{{{}}}", extension_list),
    });

    shallow_globs
        .chain(deep_globs)
        // Insert a glob for the base path, so we can see new files/folders in the directory
        // itself
        .chain(vec![GlobEntry {
            base: base.to_string_lossy().into(),
            pattern: "*".into(),
        }])
        .collect::<Vec<_>>()
}
