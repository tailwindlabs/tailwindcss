use crate::glob::optimize_public_source_entry;
use crate::GlobEntry;
use bexpand::Expression;
use std::path::PathBuf;

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
    #[cfg(test)]
    pub fn from_pattern(dir: PathBuf, pattern: &str) -> Self {
        let mut parts = pattern.split_whitespace();
        let _ = parts.next().unwrap_or_default();
        let not_or_pattern = parts.next().unwrap_or_default();
        if not_or_pattern == "not" {
            let pattern = parts.next().unwrap_or_default();
            return Self {
                base: dir.to_string_lossy().into(),
                pattern: pattern[1..pattern.len() - 1].to_string(),
                negated: true,
            };
        }

        Self {
            base: dir.to_string_lossy().into(),
            pattern: not_or_pattern[1..not_or_pattern.len() - 1].to_string(),
            negated: false,
        }
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
            optimize_public_source_entry(&mut public_source);
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
            ))
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
