use crate::GlobEntry;
use bexpand::Expression;
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

    /// External sources are sources outside of your git root which should not
    /// follow gitignore rules.
    ///
    /// Represented by:
    ///
    /// ```css
    /// @source "../node_modules/my-lib";`
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

                                // Ensure we have a pattern since the last component is a
                                // directory.
                                new_pattern.push("**/*");
                            } else {
                                new_pattern.push("/");
                                new_pattern.push(part);
                            }
                        }

                        Component::Prefix(_) | Component::RootDir => {
                            new_pattern.push(component);
                            stage = ComponentStage::Pattern;
                        }
                    }
                }
                ComponentStage::Pattern => {
                    new_pattern.push(component);
                }
            }
        }

        // Ensure we have `**/*` when the base is a folder and we don't have a pattern at all
        if new_pattern.as_os_str().is_empty() && base.is_dir() {
            new_pattern.push("**/*");
        }

        self.base = base.to_string_lossy().to_string();
        self.pattern = new_pattern.to_string_lossy().to_string();
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

    // Convert from public SourceEntry to private SourceEntry
    expanded_globs
        .into_iter()
        .map(Into::into)
        .collect::<Vec<_>>()
}

/// Convert a public source entry to a source entry
impl From<PublicSourceEntry> for SourceEntry {
    fn from(value: PublicSourceEntry) -> Self {
        let auto = value.pattern.ends_with("**/*")
            || PathBuf::from(&value.base).join(&value.pattern).is_dir();

        let inside_ignored_content_dir = IGNORED_CONTENT_DIRS.iter().any(|dir| {
            value.base.contains(&format!(
                "{}{}{}",
                std::path::MAIN_SEPARATOR,
                dir,
                std::path::MAIN_SEPARATOR
            )) || value
                .base
                .ends_with(&format!("{}{}", std::path::MAIN_SEPARATOR, dir,))
        });

        match (value.negated, auto, inside_ignored_content_dir) {
            (false, true, false) => SourceEntry::Auto {
                base: value.base.into(),
            },
            (false, true, true) => SourceEntry::External {
                base: value.base.into(),
            },
            (false, false, _) => SourceEntry::Pattern {
                base: value.base.into(),
                pattern: value.pattern,
            },
            (true, _, _) => SourceEntry::Ignored {
                base: value.base.into(),
                pattern: value.pattern,
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
