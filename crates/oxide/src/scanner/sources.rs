use crate::glob::split_pattern;
use crate::GlobEntry;
use bexpand::Expression;
use std::path::PathBuf;
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
        let Ok(base) = dunce::canonicalize(&self.base) else {
            event!(Level::ERROR, "Failed to resolve base: {:?}", self.base);
            return;
        };
        self.base = base.to_string_lossy().to_string();

        // No dynamic part, figure out if we are dealing with a file or a directory.
        if !self.pattern.contains('*') {
            let combined_path = if self.pattern.starts_with("/") {
                PathBuf::from(&self.pattern)
            } else {
                PathBuf::from(&self.base).join(&self.pattern)
            };

            match dunce::canonicalize(combined_path) {
                Ok(resolved_path) if resolved_path.is_dir() => {
                    self.base = resolved_path.to_string_lossy().to_string();
                    self.pattern = "**/*".to_owned();
                }
                Ok(resolved_path) if resolved_path.is_file() => {
                    self.base = resolved_path
                        .parent()
                        .unwrap()
                        .to_string_lossy()
                        .to_string();
                    // Ensure leading slash, otherwise it will match against all files in all folders/
                    self.pattern =
                        format!("/{}", resolved_path.file_name().unwrap().to_string_lossy());
                }
                _ => {}
            }
            return;
        }

        // Contains dynamic part
        let (static_part, dynamic_part) = split_pattern(&self.pattern);

        let base: PathBuf = self.base.clone().into();
        let base = match static_part {
            Some(static_part) => {
                // TODO: If the base does not exist on disk, try removing the last slash and try
                // again.
                match dunce::canonicalize(base.join(static_part)) {
                    Ok(base) => base,
                    Err(err) => {
                        event!(tracing::Level::ERROR, "Failed to resolve glob: {:?}", err);
                        return;
                    }
                }
            }
            None => base,
        };

        let pattern = match dynamic_part {
            Some(dynamic_part) => dynamic_part,
            None => {
                if base.is_dir() {
                    "**/*".to_owned()
                } else {
                    "".to_owned()
                }
            }
        };

        self.base = base.to_string_lossy().to_string();
        self.pattern = pattern;
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
