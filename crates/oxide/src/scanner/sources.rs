use crate::GlobEntry;
use bexpand::Expression;
use fxhash::{FxHashMap, FxHashSet};
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
    Ignored { base: PathBuf, pattern: String },

    /// External sources are directories that are ignored (by us or .gitignore rules), but should be
    /// included bypassing the default ignore rules.
    ///
    /// Represented by:
    ///
    /// ```css
    /// @source "../node_modules/my-lib";`
    /// @source "../node_modules/my-lib/**/*";`
    /// ```
    External { base: PathBuf },
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

/// When dealing with a pattern, then it could be that we end up with:
///
/// ```json
/// { base: '/some/folder', pattern: 'foo.ts' }
/// ```
///
/// If we just emit `!foo.ts` for the `/some/folder` path, then _everything_ else in that folder
/// would still be walked (but the result will be ignored).
///
/// Instead, we have to ensure that we ignore everything in that folder _except_ for the `foo.ts`
/// pattern.
///
/// This should be equivalent to:
/// ```gitignore
/// *
/// !foo.ts
/// ```
///
/// However, we have to be careful that we don't start ignoring files/folders that already exist.
/// ```css
/// @source "./some/folder/foo.ts";
/// @source "./some/folder/bar.ts";
/// ```
/// Would result in:
/// ```json
/// { base: '/some/folder', pattern: 'foo.ts' }
/// { base: '/some/folder', pattern: 'bar.ts' }
/// ```
///
/// If we were to blindly emit `*` for each pattern, then the `.gitignore` equivalent would look like
/// this:
/// ```gitignore
/// *
/// !foo.ts
/// *
/// !bar.ts
/// ```
///
/// This would result in ignoring the `foo.ts` file as well. Therefore we only want to insert
/// this `*` pattern when nothing else exists yet.
///
/// There is another problem that we need to solve. Let's say you have a pattern that contains a `*`
/// in the pattern:
/// ```css
/// @source './src/ba*/*.html';
/// ```
///
/// This would result in
/// ```json
/// { base: '/src', pattern: '/ba*/*.html' }
/// ```
///
/// If we now inject the `*` pattern for the `/src` folder, then we wouldn't scan any `ba*` folders
/// (e.g. `bar` or `baz`). For this, we have to make sure that we add inverse patterns for these
/// folders. This would essentially result in:
/// ```gitignore
/// *                     ← ignore everything
/// !/ba*/                ← except for the `ba*/` pattern, so we scan these folders
/// !/ba*/*.html          ← then ensure we scan the `*.html` files in it as well
/// ```
///
fn expand_restricted_patterns(sources: Vec<SourceEntry>) -> Vec<SourceEntry> {
    let unrestricted_roots = sources
        .iter()
        .filter_map(|source| match source {
            SourceEntry::Auto { base } | SourceEntry::External { base } => Some(base.clone()),
            SourceEntry::Pattern { base, pattern } if pattern.contains("**") => Some(base.clone()),
            _ => None,
        })
        .collect::<Vec<_>>();

    // Bases of restricted patterns. Each of these becomes its own walk root with its own
    // `*` + `!<pattern>` rules, so an ancestor base must not ignore them recursively.
    let pattern_roots = sources
        .iter()
        .filter_map(|source| match source {
            SourceEntry::Pattern { base, .. } => Some(base.clone()),
            _ => None,
        })
        .collect::<Vec<_>>();

    let mut restricted_roots: FxHashSet<PathBuf> = FxHashSet::default();
    let mut expanded = vec![];

    for source in sources {
        let SourceEntry::Pattern { base, pattern } = &source else {
            expanded.push(source);
            continue;
        };

        // `base` is already included by another `@source` that we know should be walked. This
        // includes the case where `base` is _nested_ inside such a root, because everything under
        // an unrestricted root is walked already. Restricting it would incorrectly hide siblings
        // that the broader source is supposed to pick up.
        if unrestricted_roots.iter().any(|root| base.starts_with(root)) {
            expanded.push(source);
            continue;
        }

        // Ignore everything in the directory. We will later add the specific patterns we are
        // interested in.
        if restricted_roots.insert(base.clone()) {
            // When another source root is nested inside this base — an unrestricted root, or the
            // base of another restricted pattern (which is walked from its own root with its own
            // rules) — only ignore direct children so the nested root can still be walked.
            let has_nested_root = unrestricted_roots.iter().any(|root| root.starts_with(base))
                || pattern_roots
                    .iter()
                    .any(|root| root != base && root.starts_with(base));

            let pattern = if has_nested_root { "/*" } else { "*" };

            expanded.push(SourceEntry::Ignored {
                base: base.clone(),
                pattern: pattern.to_owned(),
            });
        }

        // Ensure to _include_ parent paths, otherwise the `*` from above would block walking the
        // folders that need to be walked.
        //
        // ```css
        // @source './src/ba*/*.html';
        // ```
        //
        // ```gitignore
        // *                     ← added by the above rule
        // !/ba*/                ← this is what we're focusing on in this block
        // !/ba*/*.html          ← this is added later
        // ```
        {
            let mut dir = PathBuf::new();
            let mut components = Path::new(pattern).components().peekable();

            while let Some(component) = components.next() {
                if components.peek().is_none() {
                    break;
                }

                match component {
                    Component::Prefix(_) | Component::RootDir | Component::CurDir => continue,
                    Component::ParentDir | Component::Normal(_) => dir.push(component),
                }

                expanded.push(SourceEntry::Ignored {
                    base: base.clone(),
                    pattern: format!("!/{}/", path_to_posix_string(&dir).trim_start_matches('/')),
                });
            }
        }

        // Track the original source
        expanded.push(source);
    }

    expanded
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
    }
}

fn path_to_posix_string(path: &Path) -> String {
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
    fn concrete_patterns_are_expanded_to_restrict_their_base() {
        let dir = tempdir().unwrap();
        fs::create_dir_all(dir.path().join("src")).unwrap();
        let base = dunce::canonicalize(dir.path().join("src")).unwrap();

        let sources = public_source_entries_to_private_source_entries(vec![PublicSourceEntry {
            base: dir.path().to_string_lossy().to_string(),
            pattern: "src/foo.html".to_string(),
            negated: false,
        }]);

        assert_eq!(
            sources,
            vec![
                SourceEntry::Ignored {
                    base: base.clone(),
                    pattern: "*".to_string(),
                },
                SourceEntry::Pattern {
                    base,
                    pattern: "/foo.html".to_string(),
                },
            ]
        );
    }

    #[test]
    fn restricted_patterns_include_parent_directory_allow_rules() {
        let dir = tempdir().unwrap();
        fs::create_dir_all(dir.path().join("src")).unwrap();
        let base = dunce::canonicalize(dir.path().join("src")).unwrap();

        let sources = public_source_entries_to_private_source_entries(vec![PublicSourceEntry {
            base: dir.path().to_string_lossy().to_string(),
            pattern: "src/ef*/*.html".to_string(),
            negated: false,
        }]);

        assert_eq!(
            sources,
            vec![
                SourceEntry::Ignored {
                    base: base.clone(),
                    pattern: "*".to_string(),
                },
                SourceEntry::Ignored {
                    base: base.clone(),
                    pattern: "!/ef*/".to_string(),
                },
                SourceEntry::Pattern {
                    base,
                    pattern: "/ef*/*.html".to_string(),
                },
            ]
        );
    }

    #[test]
    fn unrestricted_sources_do_not_expand_patterns_for_the_same_base() {
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
        ]);

        assert_eq!(
            sources,
            vec![
                SourceEntry::Auto { base: base.clone() },
                SourceEntry::Pattern {
                    base,
                    pattern: "/foo.html".to_string(),
                },
            ]
        );
    }

    #[test]
    fn restricted_parent_bases_do_not_open_unrelated_siblings() {
        let dir = tempdir().unwrap();
        let project = dir.path().join("Users").join("robin").join("docus-test");
        fs::create_dir_all(&project).unwrap();

        let users = dunce::canonicalize(dir.path().join("Users")).unwrap();
        let project = dunce::canonicalize(project).unwrap();

        let sources = public_source_entries_to_private_source_entries(vec![
            PublicSourceEntry {
                base: project.to_string_lossy().to_string(),
                pattern: "**/*".to_string(),
                negated: false,
            },
            PublicSourceEntry {
                base: project.to_string_lossy().to_string(),
                pattern: "../../app.config.ts".to_string(),
                negated: false,
            },
        ]);

        assert_eq!(
            sources,
            vec![
                SourceEntry::Auto {
                    base: project.clone(),
                },
                SourceEntry::Ignored {
                    base: users.clone(),
                    pattern: "/*".to_string(),
                },
                SourceEntry::Pattern {
                    base: users,
                    pattern: "/app.config.ts".to_string(),
                },
            ]
        );
    }

    #[test]
    fn restricted_patterns_preserve_source_order() {
        let dir = tempdir().unwrap();
        fs::create_dir_all(dir.path().join("src")).unwrap();
        let base = dunce::canonicalize(dir.path().join("src")).unwrap();

        let sources = public_source_entries_to_private_source_entries(vec![
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
                SourceEntry::Ignored {
                    base: base.clone(),
                    pattern: "*".to_string(),
                },
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

        assert_eq!(auto_source_entry(&base), SourceEntry::Auto { base });
    }

    #[test]
    fn folders_ignored_by_default_become_external_sources() {
        let dir = tempdir().unwrap();
        let base = dir.path().join("node_modules").join("my-lib");
        fs::create_dir_all(&base).unwrap();
        let base = dunce::canonicalize(&base).unwrap();

        assert_eq!(auto_source_entry(&base), SourceEntry::External { base });
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

        assert_eq!(auto_source_entry(&base), SourceEntry::External { base });
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

        assert_eq!(auto_source_entry(&base), SourceEntry::External { base });
    }

    #[test]
    fn folders_not_ignored_by_gitignore_stay_auto_sources() {
        let dir = tempdir().unwrap();
        fs::create_dir_all(dir.path().join(".git")).unwrap();
        fs::write(dir.path().join(".gitignore"), "dist/\n").unwrap();

        let base = dir.path().join("src");
        fs::create_dir_all(&base).unwrap();
        let base = dunce::canonicalize(&base).unwrap();

        assert_eq!(auto_source_entry(&base), SourceEntry::Auto { base });
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
    // `.gitignore` file at most once, even though entries commonly share ancestor directories
    // (e.g. the repository root). A cached `None` means the directory has no `.gitignore` file.
    let mut gitignores: FxHashMap<PathBuf, Option<Gitignore>> = FxHashMap::default();

    // Boundary for the `.gitignore` walk when a source is not inside a git repository (see
    // below).
    let cwd = std::env::current_dir()
        .map(|cwd| dunce::canonicalize(&cwd).unwrap_or(cwd))
        .ok();

    // Convert from public SourceEntry to private SourceEntry
    let sources = expanded_globs
        .into_iter()
        .map(|public_source| {
            let mut source: SourceEntry = public_source.into();

            // Promote auto-sources to external sources if they were gitignored
            if let SourceEntry::Auto { ref base } = source {
                let inside_git_repo = base.ancestors().any(|dir| dir.join(".git").exists());

                // Walk up from the folder, applying each `.gitignore` relative to the directory
                // that contains it (matching git), and stop at the git repository root so
                // `.gitignore` files outside of the repo are not considered.
                for dir in base.ancestors() {
                    let gitignore = gitignores.entry(dir.to_path_buf()).or_insert_with(|| {
                        let path = dir.join(".gitignore");

                        // `Gitignore::new` roots the matcher at the directory
                        // containing the file, so patterns match relative to it.
                        path.is_file().then(|| Gitignore::new(&path).0)
                    });

                    if let Some(gitignore) = gitignore {
                        if gitignore
                            .matched_path_or_any_parents(&base, true)
                            .is_ignore()
                        {
                            source = SourceEntry::External { base: base.into() };
                            break;
                        }
                    }

                    // Stop at the git repository root.
                    if dir.join(".git").exists() {
                        break;
                    }

                    // Without a git repository there is no repository root to stop at. Stop
                    // once the directory contains the current working directory instead, so
                    // `.gitignore` files outside of the project (e.g. in the user's home
                    // directory) can never promote a source to an external source. Note that
                    // the file walker still applies those `.gitignore` files when deciding
                    // which files to scan.
                    if !inside_git_repo && cwd.as_ref().is_some_and(|cwd| cwd.starts_with(dir)) {
                        break;
                    }
                }
            }

            source
        })
        .collect::<Vec<SourceEntry>>();

    expand_restricted_patterns(sources)
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

        let auto =
            value.pattern == "/**/*" || PathBuf::from(&value.base).join(&value.pattern).is_dir();

        if !auto {
            return SourceEntry::Pattern {
                base: value.base.into(),
                pattern: value.pattern,
            };
        }

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

impl From<GlobEntry> for SourceEntry {
    fn from(value: GlobEntry) -> Self {
        SourceEntry::Pattern {
            base: PathBuf::from(value.base),
            pattern: value.pattern,
        }
    }
}

impl From<SourceEntry> for GlobEntry {
    fn from(value: SourceEntry) -> Self {
        match value {
            SourceEntry::Auto { base } | SourceEntry::External { base } => GlobEntry {
                base: base.to_string_lossy().into(),
                pattern: "**/*".into(),
            },
            SourceEntry::Pattern { base, pattern } => GlobEntry {
                base: base.to_string_lossy().into(),
                pattern: pattern.clone(),
            },
            SourceEntry::Ignored { base, pattern } => GlobEntry {
                base: base.to_string_lossy().into(),
                pattern: pattern.clone(),
            },
        }
    }
}

impl From<&SourceEntry> for GlobEntry {
    fn from(value: &SourceEntry) -> Self {
        match value {
            SourceEntry::Auto { base } | SourceEntry::External { base } => GlobEntry {
                base: base.to_string_lossy().into(),
                pattern: "**/*".into(),
            },
            SourceEntry::Pattern { base, pattern } => GlobEntry {
                base: base.to_string_lossy().into(),
                pattern: pattern.clone(),
            },
            SourceEntry::Ignored { base, pattern } => GlobEntry {
                base: base.to_string_lossy().into(),
                pattern: pattern.clone(),
            },
        }
    }
}
