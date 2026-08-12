use bexpand::Expression;
use fxhash::FxHashMap;
use ignore::gitignore::Gitignore;
use std::path::{Component, Path, PathBuf};
use tracing::{event, Level};

use super::auto_source_detection::IGNORED_CONTENT_DIRS;

#[derive(Debug, Clone)]
pub struct PublicSourceEntry {
    /// Base path of the glob
    pub base: String,

    /// Glob pattern
    pub pattern: String,

    /// Negated flag
    pub negated: bool,
}

#[derive(Debug, Clone, PartialEq)]
pub enum SourceEntry {
    /// Auto source detection
    ///
    /// Represented by:
    ///
    /// ```css
    /// @source "src";`
    /// @source "src/**/*";`
    /// ```
    Auto { base: PathBuf },

    /// An `Auto` source whose directory is itself ignored (by the default rules, e.g.
    /// `node_modules`, or by a `.gitignore`) but was explicitly listed anyway.
    ///
    /// Represented by:
    ///
    /// ```css
    /// @source "../node_modules/my-lib";`
    /// @source "../node_modules/my-lib/**/*";`
    /// ```
    ///
    /// Being explicit bypasses the ignoredness of the directory: everything inside is scanned
    /// as if it were a regular auto source, except that `.gitignore` files from at or above
    /// the directory no longer apply — they (including the self-ignoring `*` file that
    /// generators typically place inside such directories) are what made it ignored in the
    /// first place. `.gitignore` files *deeper inside* the directory still apply, and so do
    /// the default rules, so e.g. nested `node_modules` stay ignored.
    External { base: PathBuf },

    /// Explicit source pattern regardless of any auto source detection rules
    ///
    /// Represented by:
    ///
    /// ```css
    /// @source "src/**/*.html";`
    /// ```
    Pattern { base: PathBuf, pattern: String },

    /// Ignored pattern
    ///
    /// Represented by:
    ///
    /// ```css
    /// @source not "src";`
    /// @source not "src/**/*.html";`
    /// ```
    ///
    /// Note that directory-shaped directives (`@source not "src"`) are normalized to
    /// `base: "src", pattern: "/**/*"`, which is semantically identical: everything under the
    /// directory is ignored.
    Ignored { base: PathBuf, pattern: String },
}

#[derive(Debug, Clone, Default)]
pub struct Sources {
    sources: Vec<SourceEntry>,
}

impl Sources {
    pub fn new(sources: Vec<SourceEntry>) -> Self {
        Self { sources }
    }

    pub fn iter(&self) -> impl Iterator<Item = &SourceEntry> {
        self.sources.iter()
    }
}

impl PublicSourceEntry {
    /// Optimize the PublicSourceEntry by trying to move all the static parts of the pattern to the
    /// base of the PublicSourceEntry.
    ///
    /// ```diff
    /// - { base: '/', pattern: 'src/**/*.html'}
    /// + { base: '/src', pattern: '**/*.html'}
    /// ```
    ///
    /// A file stays in the `pattern` part, because the `base` should only be a directory.
    ///
    /// ```diff
    /// - { base: '/', pattern: 'src/examples/index.html'}
    /// + { base: '/src/examples', pattern: 'index.html'}
    /// ```
    ///
    /// A folder will be moved to the `base` part, and the `pattern` will be set to `**/*`.
    ///
    /// ```diff
    /// - { base: '/', pattern: 'src/examples'}
    /// + { base: '/src/examples', pattern: '**/*'}
    /// ```
    ///
    /// In addition, we will canonicalize the base path so we always work with the correctly
    /// resolved path.
    pub fn optimize(&mut self) {
        // Resolve base path immediately
        let Ok(mut base) = dunce::canonicalize(&self.base) else {
            event!(Level::ERROR, "Failed to resolve base: {:?}", self.base);
            return;
        };

        let mut new_pattern = PathBuf::new();
        enum ComponentStage {
            Base,
            Pattern,
        }
        let mut stage = ComponentStage::Base;

        let mut components = Path::new(&self.pattern).components().peekable();
        while let Some(component) = components.next() {
            match stage {
                ComponentStage::Base => {
                    match component {
                        // Ignore the current dir, e.g. `.`
                        Component::CurDir => {}

                        // Go up a directory, e.g. `..`
                        Component::ParentDir => {
                            base.pop();
                        }

                        // Once we hit a component that contains a wildcard character, then we
                        // can't change the base anymore and we must move to the pattern part.
                        Component::Normal(part) if part.to_string_lossy().contains("*") => {
                            new_pattern.push(component);
                            stage = ComponentStage::Pattern;
                        }

                        // File or folder, but not the last component
                        Component::Normal(part) if components.peek().is_some() => {
                            base.push(part);
                        }

                        // Last file or folder. If it's a folder, we move it to the base,
                        // otherwise we move it to the pattern.
                        Component::Normal(part) => {
                            let full_path = base.join(part);
                            if full_path.is_dir() {
                                base.push(part);
                            } else {
                                new_pattern.push(part);
                            }
                        }

                        // When we're dealing with an absolute path, then we have to bypass the
                        // `base` entirely.
                        Component::Prefix(_) => {
                            base.clear();
                            base.push(component);
                        }
                        Component::RootDir => {
                            #[cfg(not(windows))]
                            base.clear();
                            base.push(component);
                        }
                    }
                }
                ComponentStage::Pattern => {
                    new_pattern.push(component);
                }
            }
        }

        self.base = base.to_string_lossy().to_string();
        self.pattern = path_to_posix_string(&new_pattern);

        // Ensure we have `**/*` when the base is a folder and we don't have a pattern at all
        if self.pattern == "" {
            self.pattern = "/**/*".to_owned();
        }
        // Ensure that the pattern is pinned to the base path.
        else if !self.pattern.starts_with("/") {
            self.pattern = format!("/{}", self.pattern);
        }

        // `src/**` means everything underneath `src`, just like `src/**/*` and `src` do.
        // Normalize it so all three are classified as auto source detection.
        if self.pattern == "/**" {
            self.pattern = "/**/*".to_owned();
        }
    }
}

pub(crate) fn path_to_posix_string(path: &Path) -> String {
    let mut parts = Vec::new();
    let mut is_rooted = false;

    for component in path.components() {
        match component {
            Component::Prefix(prefix) => {
                parts.push(prefix.as_os_str().to_string_lossy().to_string());
            }
            Component::RootDir => {
                is_rooted = true;
                if parts.is_empty() {
                    parts.push(String::new());
                }
            }
            Component::CurDir => {
                parts.push(".".to_string());
            }
            Component::ParentDir => {
                parts.push("..".to_string());
            }
            Component::Normal(part) => {
                parts.push(part.to_string_lossy().to_string());
            }
        }
    }

    let result = parts.join("/");
    if result.is_empty() && is_rooted {
        "/".to_string()
    } else {
        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use pretty_assertions::assert_eq;
    use std::fs;
    use tempfile::tempdir;

    #[test]
    fn path_to_posix_string_serializes_relative_paths() {
        let path = PathBuf::from("src").join("**").join("*.html");

        assert_eq!(path_to_posix_string(&path), "src/**/*.html");
    }

    #[test]
    fn path_to_posix_string_serializes_rooted_paths() {
        let path = PathBuf::from(std::path::MAIN_SEPARATOR.to_string())
            .join("src")
            .join("**")
            .join("*.html");

        assert_eq!(path_to_posix_string(&path), "/src/**/*.html");
    }

    #[test]
    fn path_to_posix_string_serializes_empty_paths() {
        assert_eq!(path_to_posix_string(&PathBuf::new()), "");
    }

    #[test]
    fn optimize_hoists_static_directories_and_keeps_files_in_the_pattern() {
        let dir = tempdir().unwrap();
        fs::create_dir_all(dir.path().join("src").join("examples")).unwrap();

        let mut source = PublicSourceEntry {
            base: dir.path().to_string_lossy().to_string(),
            pattern: "src/examples/index.html".to_string(),
            negated: false,
        };

        source.optimize();

        assert_eq!(
            source.base,
            dunce::canonicalize(dir.path().join("src").join("examples"))
                .unwrap()
                .to_string_lossy()
        );
        assert_eq!(source.pattern, "/index.html");
    }

    #[test]
    fn optimize_hoists_folder_patterns() {
        let dir = tempdir().unwrap();
        fs::create_dir_all(dir.path().join("src").join("examples")).unwrap();

        let mut source = PublicSourceEntry {
            base: dir.path().to_string_lossy().to_string(),
            pattern: "src/examples".to_string(),
            negated: false,
        };

        source.optimize();

        assert_eq!(
            source.base,
            dunce::canonicalize(dir.path().join("src").join("examples"))
                .unwrap()
                .to_string_lossy()
        );
        assert_eq!(source.pattern, "/**/*");
    }

    #[test]
    fn optimize_keeps_wildcards_in_the_pattern() {
        let dir = tempdir().unwrap();
        fs::create_dir_all(dir.path().join("src")).unwrap();

        let mut source = PublicSourceEntry {
            base: dir.path().to_string_lossy().to_string(),
            pattern: "src/**/*.html".to_string(),
            negated: false,
        };

        source.optimize();

        assert_eq!(
            source.base,
            dunce::canonicalize(dir.path().join("src"))
                .unwrap()
                .to_string_lossy()
        );
        assert_eq!(source.pattern, "/**/*.html");
    }

    #[test]
    fn optimize_normalizes_double_star_to_auto_source_detection() {
        let dir = tempdir().unwrap();
        fs::create_dir_all(dir.path().join("src")).unwrap();

        let mut source = PublicSourceEntry {
            base: dir.path().to_string_lossy().to_string(),
            pattern: "src/**".to_string(),
            negated: false,
        };

        source.optimize();

        assert_eq!(source.pattern, "/**/*");

        // …and therefore `src/**` is classified as an auto source, like `src/**/*` and `src`
        let base = dunce::canonicalize(dir.path().join("src")).unwrap();
        let sources = public_source_entries_to_private_source_entries(vec![PublicSourceEntry {
            base: dir.path().to_string_lossy().to_string(),
            pattern: "src/**".to_string(),
            negated: false,
        }]);
        assert_eq!(sources, vec![SourceEntry::Auto { base }]);
    }

    #[test]
    fn sources_are_converted_in_order() {
        let dir = tempdir().unwrap();
        fs::create_dir_all(dir.path().join("src")).unwrap();
        let base = dunce::canonicalize(dir.path().join("src")).unwrap();

        let sources = public_source_entries_to_private_source_entries(vec![
            PublicSourceEntry {
                base: dir.path().to_string_lossy().to_string(),
                pattern: "src".to_string(),
                negated: false,
            },
            PublicSourceEntry {
                base: dir.path().to_string_lossy().to_string(),
                pattern: "src/foo.html".to_string(),
                negated: false,
            },
            PublicSourceEntry {
                base: dir.path().to_string_lossy().to_string(),
                pattern: "src/foo.html".to_string(),
                negated: true,
            },
        ]);

        assert_eq!(
            sources,
            vec![
                SourceEntry::Auto { base: base.clone() },
                SourceEntry::Pattern {
                    base: base.clone(),
                    pattern: "/foo.html".to_string(),
                },
                SourceEntry::Ignored {
                    base,
                    pattern: "/foo.html".to_string(),
                },
            ]
        );
    }

    /// Run the public-to-private conversion for an auto-detected source pointing at `base` and
    /// return the resulting entry.
    fn auto_source_entry(base: &Path) -> SourceEntry {
        public_source_entries_to_private_source_entries(vec![PublicSourceEntry {
            base: base.to_string_lossy().to_string(),
            pattern: "**/*".to_string(),
            negated: false,
        }])
        .into_iter()
        .next()
        .unwrap()
    }

    #[test]
    fn auto_detected_folders_become_auto_sources() {
        let dir = tempdir().unwrap();
        let base = dir.path().join("src");
        fs::create_dir_all(&base).unwrap();
        let base = dunce::canonicalize(&base).unwrap();

        assert_eq!(
            auto_source_entry(&base),
            SourceEntry::Auto { base }
        );
    }

    #[test]
    fn folders_ignored_by_default_become_external_sources() {
        let dir = tempdir().unwrap();
        let base = dir.path().join("node_modules").join("my-lib");
        fs::create_dir_all(&base).unwrap();
        let base = dunce::canonicalize(&base).unwrap();

        assert_eq!(
            auto_source_entry(&base),
            SourceEntry::External { base }
        );
    }

    #[test]
    fn folders_ignored_by_gitignore_become_external_sources() {
        let dir = tempdir().unwrap();
        // Pretend this is a git repository so the `.gitignore` search is bounded to it.
        fs::create_dir_all(dir.path().join(".git")).unwrap();
        fs::write(dir.path().join(".gitignore"), "dist/\n").unwrap();

        let base = dir.path().join("dist");
        fs::create_dir_all(&base).unwrap();
        let base = dunce::canonicalize(&base).unwrap();

        assert_eq!(
            auto_source_entry(&base),
            SourceEntry::External { base }
        );
    }

    #[test]
    fn folders_ignored_by_a_parent_gitignore_become_external_sources() {
        let dir = tempdir().unwrap();
        fs::create_dir_all(dir.path().join(".git")).unwrap();
        // A `.gitignore` higher up in the tree should still apply to nested directories.
        fs::write(dir.path().join(".gitignore"), "generated/\n").unwrap();

        let base = dir.path().join("packages").join("app").join("generated");
        fs::create_dir_all(&base).unwrap();
        let base = dunce::canonicalize(&base).unwrap();

        assert_eq!(
            auto_source_entry(&base),
            SourceEntry::External { base }
        );
    }

    #[test]
    fn folders_reincluded_by_a_deeper_gitignore_stay_auto_sources() {
        let dir = tempdir().unwrap();
        fs::create_dir_all(dir.path().join(".git")).unwrap();
        fs::write(dir.path().join(".gitignore"), "generated/\n").unwrap();
        // The deepest `.gitignore` with a definitive answer wins: the re-include is reachable
        // (no parent directory of `generated` is excluded), so `generated` is not ignored.
        fs::create_dir_all(dir.path().join("packages").join("app")).unwrap();
        fs::write(
            dir.path().join("packages").join("app").join(".gitignore"),
            "!generated/\n",
        )
        .unwrap();

        let base = dir.path().join("packages").join("app").join("generated");
        fs::create_dir_all(&base).unwrap();
        let base = dunce::canonicalize(&base).unwrap();

        assert_eq!(
            auto_source_entry(&base),
            SourceEntry::Auto { base }
        );
    }

    #[test]
    fn folders_inside_excluded_directories_become_external_sources() {
        let dir = tempdir().unwrap();
        fs::create_dir_all(dir.path().join(".git")).unwrap();
        fs::write(dir.path().join(".gitignore"), "parent/\n").unwrap();
        // This whitelist is unreachable: `parent` itself is excluded, so git never descends
        // into it and the re-include of `child` has no effect.
        fs::create_dir_all(dir.path().join("parent")).unwrap();
        fs::write(dir.path().join("parent").join(".gitignore"), "!child/\n").unwrap();

        let base = dir.path().join("parent").join("child");
        fs::create_dir_all(&base).unwrap();
        let base = dunce::canonicalize(&base).unwrap();

        assert_eq!(
            auto_source_entry(&base),
            SourceEntry::External { base }
        );
    }

    #[test]
    fn folders_not_ignored_by_gitignore_stay_auto_sources() {
        let dir = tempdir().unwrap();
        fs::create_dir_all(dir.path().join(".git")).unwrap();
        fs::write(dir.path().join(".gitignore"), "dist/\n").unwrap();

        let base = dir.path().join("src");
        fs::create_dir_all(&base).unwrap();
        let base = dunce::canonicalize(&base).unwrap();

        assert_eq!(
            auto_source_entry(&base),
            SourceEntry::Auto { base }
        );
    }
}

/// For each public source entry:
///
/// 1. Perform brace expansion
///
/// ```diff
/// - { base: '/', pattern: 'src/{foo,bar}.html'}
/// + { base: '/', pattern: 'src/foo.html'}
/// + { base: '/', pattern: 'src/bar.html'}
/// ```
///
/// 2. Hoist static parts, e.g.:
///
/// ```diff
/// - { base: '/', pattern: 'src/**/*.html'}
/// + { base: '/src', pattern: '**/*.html'}
/// ```
///
/// 3. Convert to private SourceEntry
///
pub fn public_source_entries_to_private_source_entries(
    sources: Vec<PublicSourceEntry>,
) -> Vec<SourceEntry> {
    // Perform brace expansion
    let expanded_globs = sources
        .into_iter()
        .flat_map(|source| {
            let expression: Result<Expression, _> = source.pattern[..].try_into();
            let Ok(expression) = expression else {
                return vec![source];
            };

            expression
                .into_iter()
                .filter_map(Result::ok)
                .map(move |pattern| PublicSourceEntry {
                    base: source.base.clone(),
                    pattern: pattern.into(),
                    negated: source.negated,
                })
                .collect::<Vec<_>>()
        })
        .map(|mut public_source| {
            public_source.optimize();
            public_source
        })
        .collect::<Vec<_>>();

    // Compiled `.gitignore` matchers are cached per directory so we read and parse each
    // `.gitignore` file at most once, even though entries commonly share ancestor directories (e.g.
    // the repository root). A cached `None` means the directory has no `.gitignore` file.
    let mut gitignores: FxHashMap<PathBuf, Option<Gitignore>> = FxHashMap::default();

    // Boundary for the `.gitignore` walk when a source is not inside a git repository (see below).
    let cwd = std::env::current_dir()
        .map(|cwd| dunce::canonicalize(&cwd).unwrap_or(cwd))
        .ok();

    // Convert from public SourceEntry to private SourceEntry
    let sources = expanded_globs
        .into_iter()
        .map(|public_source| {
            let mut source: SourceEntry = public_source.into();

            // Mark auto sources as external if their directory is gitignored
            if let SourceEntry::Auto { ref base } = source {
                let inside_git_repo = base.ancestors().any(|dir| dir.join(".git").exists());

                // The chain of directories whose `.gitignore` files can apply: `base` itself and
                // its ancestors, up to and including the git repository root so `.gitignore`
                // files outside of the repo are not considered.
                //
                // Without a git repository there is no repository root to stop at. Stop once the
                // directory contains the current working directory instead, so `.gitignore`
                // files outside of the project (e.g. in the user's home directory) can never
                // promote a source to an external source. Note that the file walker still
                // applies those `.gitignore` files when deciding which files to scan.
                let mut chain: Vec<&Path> = vec![];
                for dir in base.ancestors() {
                    chain.push(dir);

                    if dir.join(".git").exists() {
                        break;
                    }

                    if !inside_git_repo && cwd.as_ref().is_some_and(|cwd| cwd.starts_with(dir)) {
                        break;
                    }
                }

                // Match git's semantics: a directory is ignored when the directory itself or any
                // of its parent directories is excluded, and it is not possible to re-include a
                // directory once a parent directory is excluded — git never descends into an
                // excluded directory, so whitelist rules inside of it are unreachable.
                //
                // So walk the path from the top down (`chain` is ordered bottom-up: `base` at
                // index 0, the boundary last) and decide for every directory along the way
                // whether it is excluded. The first excluded directory settles it. For a single
                // directory, only `.gitignore` files in its parent directories can match it (its
                // own `.gitignore` only matches paths _inside_ of it), and the deepest
                // `.gitignore` with a definitive answer wins, so a directory that is re-included
                // by a deeper `!the-directory` pattern is not ignored, even when an ancestor
                // `.gitignore` ignores it.
                'prefixes: for i in (0..chain.len().saturating_sub(1)).rev() {
                    let prefix = chain[i];

                    for dir in &chain[i + 1..] {
                        let gitignore = gitignores.entry(dir.to_path_buf()).or_insert_with(|| {
                            let path = dir.join(".gitignore");

                            // `Gitignore::new` roots the matcher at the directory containing the
                            // file, so patterns match relative to it.
                            path.is_file().then(|| Gitignore::new(&path).0)
                        });

                        let Some(gitignore) = gitignore else {
                            continue;
                        };

                        match gitignore.matched(prefix, true) {
                            ignore::Match::Ignore(_) => {
                                source = SourceEntry::External { base: base.into() };
                                break 'prefixes;
                            }
                            // Re-included; this directory is reachable, move on to the next one.
                            ignore::Match::Whitelist(_) => continue 'prefixes,
                            ignore::Match::None => {}
                        }
                    }
                }
            }

            source
        })
        .collect::<Vec<SourceEntry>>();

    sources
}

/// Convert a public source entry to a source entry
impl From<PublicSourceEntry> for SourceEntry {
    fn from(value: PublicSourceEntry) -> Self {
        if value.negated {
            return SourceEntry::Ignored {
                base: value.base.into(),
                pattern: value.pattern,
            };
        }

        // After a successful `optimize()` any trailing concrete directory has already been
        // hoisted into the base, so a folder source always has the `/**/*` pattern. The
        // `is_dir` check only matters when `optimize()` could not canonicalize the base and
        // left the entry untouched. Note that the pinned leading `/` has to be stripped, since
        // joining an absolute-looking path onto the base would discard the base entirely.
        let auto = value.pattern == "/**/*"
            || PathBuf::from(&value.base)
                .join(value.pattern.trim_start_matches('/'))
                .is_dir();

        if !auto {
            return SourceEntry::Pattern {
                base: value.base.into(),
                pattern: value.pattern,
            };
        }

        // A directory inside e.g. `node_modules` is ignored by default, so listing it
        // explicitly makes it an external source.
        let inside_ignored_content_dir = IGNORED_CONTENT_DIRS.iter().any(|dir| {
            value.base.contains(&format!(
                "{}{}{}",
                std::path::MAIN_SEPARATOR,
                dir,
                std::path::MAIN_SEPARATOR
            )) || value
                .base
                .ends_with(&format!("{}{}", std::path::MAIN_SEPARATOR, dir))
        });

        match inside_ignored_content_dir {
            false => SourceEntry::Auto {
                base: value.base.into(),
            },
            true => SourceEntry::External {
                base: value.base.into(),
            },
        }
    }
}
