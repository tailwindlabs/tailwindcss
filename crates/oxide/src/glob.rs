use fxhash::{FxHashMap, FxHashSet};
use std::path::PathBuf;
use tracing::event;

#[derive(Debug, Clone, PartialEq)]
pub struct GlobEntry {
    /// Base path of the glob
    pub base: String,

    /// Glob pattern
    pub pattern: String,
}

pub fn hoist_static_glob_parts(entries: &Vec<GlobEntry>, emit_parent_glob: bool) -> Vec<GlobEntry> {
    let mut result = vec![];

    for entry in entries {
        let (static_part, dynamic_part) = split_pattern(&entry.pattern);

        let base: PathBuf = entry.base.clone().into();
        let base = match static_part {
            Some(static_part) => base.join(static_part),
            None => base,
        };

        let base = match dunce::canonicalize(&base) {
            Ok(base) => base,
            Err(err) => {
                event!(tracing::Level::ERROR, "Failed to resolve glob: {:?}", err);
                // If we can't resolve the new base on disk, let's just skip this entry.
                continue;
            }
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

        // If the base path is a file, then we want to move the file to the pattern, and point the
        // directory to the base. This is necessary for file watchers that can only listen to
        // folders.
        if emit_parent_glob && pattern.is_empty() && base.is_file() {
            result.push(GlobEntry {
                // SAFETY: `parent()` will be available because we verify `base` is a file, thus a
                // parent folder exists.
                base: base.parent().unwrap().to_string_lossy().to_string(),
                // SAFETY: `file_name()` will be available because we verify `base` is a file.
                pattern: base.file_name().unwrap().to_string_lossy().to_string(),
            });
        }

        result.push(GlobEntry {
            base: base.to_string_lossy().to_string(),
            pattern,
        });
    }

    result
}

/// This function attempts to optimize the glob patterns to improve performance. The problem is
/// that if you run the following command:
/// ```sh
/// tailwind --pwd ./project --content "{pages,components}/**/*.js"
/// ```
/// Then the globwalk library will scan every single file and folder in the `./project` folder,
/// then it will check if the file matches the glob pattern and keep it if it does. This is very
/// slow, because if you have vendor folders (like node_modules), then this will take a while...
///
/// Instead, we will optimize the pattern, and move as many directories as possible to the base
/// path. This will allow us to scope the globwalk library to only scan the directories that we
/// care about.
///
/// This means, that the following command:
/// ```sh
/// tailwind --pwd ./project --content "{pages,components}/**/*.js"
/// ```
///
/// Will now conceptually do this instead behind the scenes:
/// ```sh
/// tailwind --pwd ./project/pages --content "**/*.js"
/// tailwind --pwd ./project/components --content "**/*.js"
/// ```
pub fn optimize_patterns(entries: &Vec<GlobEntry>) -> Vec<GlobEntry> {
    let entries = hoist_static_glob_parts(entries, true);

    // Track all base paths and their patterns. Later we will turn them back into `GlobalEntry`s.
    let mut pattern_map: FxHashMap<String, FxHashSet<String>> = FxHashMap::default();

    for glob_entry in entries {
        let entry = pattern_map.entry(glob_entry.base).or_default();
        entry.insert(glob_entry.pattern.clone());
    }

    let mut glob_entries = pattern_map
        .into_iter()
        .map(|(base, patterns)| {
            let size = patterns.len();

            let mut patterns = patterns.into_iter();

            GlobEntry {
                base,
                pattern: match size {
                    // SAFETY: we can unwrap here because we know that the size is 1.
                    1 => patterns.next().unwrap(),
                    _ => {
                        let mut patterns = patterns.collect::<Vec<_>>();

                        // Sort the patterns to ensure stable results.
                        patterns.sort();

                        // TODO: Right now this will generate something like `{**/*.html,**/*.js}`,
                        // but maybe we want to generate this instead:`**/*.{html,js}`.
                        format!("{{{}}}", patterns.join(","))
                    }
                },
            }
        })
        .collect::<Vec<GlobEntry>>();

    // Sort the entries by base path to ensure we have stable results.
    glob_entries.sort_by(|a, z| a.base.cmp(&z.base));

    glob_entries
}

// Split a glob pattern into a `static` and `dynamic` part.
//
// Assumption: we assume that all globs are expanded, which means that the only dynamic parts are
// using `*`.
//
// E.g.:
//
//  Input:
//  - `../project-b/**/*.html`
//  - `../project-b/**/*.js`
//
//  Split results in:
//  - `("../project-b", "**/*.html")`
//  - `("../project-b", "**/*.js")`
//
// A static file glob should also be considered as a dynamic part.
//
// E.g.:
//
// Input: `../project-b/foo/bar.html`
// Split results in: `("../project-b/foo", "bar.html")`
//
pub fn split_pattern(pattern: &str) -> (Option<String>, Option<String>) {
    // No dynamic parts, so we can just return the input as-is.
    if !pattern.contains('*') {
        return (Some(pattern.to_owned()), None);
    }

    let mut last_slash_position = None;

    for (i, c) in pattern.char_indices() {
        if c == '/' {
            last_slash_position = Some(i);
        }

        if c == '*' || c == '!' {
            break;
        }
    }

    // Very first character is a `*`, therefore there is no static part, only a dynamic part.
    let Some(last_slash_position) = last_slash_position else {
        return (None, Some(pattern.to_owned()));
    };

    let static_part = pattern[..last_slash_position].to_owned();
    let dynamic_part = pattern[last_slash_position + 1..].to_owned();

    let static_part = (!static_part.is_empty()).then_some(static_part);
    let dynamic_part = (!dynamic_part.is_empty()).then_some(dynamic_part);

    (static_part, dynamic_part)
}

#[cfg(test)]
mod tests {
    use super::optimize_patterns;
    use crate::GlobEntry;
    use bexpand::Expression;
    use pretty_assertions::assert_eq;
    use std::process::Command;
    use std::{fs, path};
    use tempfile::tempdir;

    fn create_folders(folders: &[&str]) -> String {
        // Create a temporary working directory
        let dir = tempdir().unwrap().into_path();

        // Initialize this directory as a git repository
        let _ = Command::new("git").arg("init").current_dir(&dir).output();

        // Create the necessary files
        for path in folders {
            // Ensure we use the right path separator for the current platform
            let path = dir.join(path.replace('/', path::MAIN_SEPARATOR.to_string().as_str()));
            let parent = path.parent().unwrap();
            if !parent.exists() {
                fs::create_dir_all(parent).unwrap();
            }

            fs::write(path, "").unwrap();
        }

        let base = format!("{}", dir.display());

        base
    }

    fn test(base: &str, sources: &[GlobEntry]) -> Vec<GlobEntry> {
        // Resolve all content paths for the (temporary) current working directory
        let sources: Vec<GlobEntry> = sources
            .iter()
            .map(|x| GlobEntry {
                base: format!("{}{}", base, x.base),
                pattern: x.pattern.clone(),
            })
            .collect();

        // Expand glob patterns into multiple `GlobEntry`s.
        let sources = sources
            .iter()
            .flat_map(|source| {
                let expression: Result<Expression, _> = source.pattern[..].try_into();
                let Ok(expression) = expression else {
                    return vec![source.clone()];
                };

                expression
                    .into_iter()
                    .filter_map(Result::ok)
                    .map(move |pattern| GlobEntry {
                        base: source.base.clone(),
                        pattern: pattern.into(),
                    })
                    .collect::<Vec<_>>()
            })
            .collect::<Vec<_>>();

        let optimized_sources = optimize_patterns(&sources);

        let parent_dir =
            format!("{}{}", dunce::canonicalize(base).unwrap().display(), "/").replace('\\', "/");

        // Remove the temporary directory from the base
        optimized_sources
            .into_iter()
            .map(|source| {
                GlobEntry {
                    // Normalize paths to use unix style separators
                    base: source.base.replace('\\', "/").replace(&parent_dir, "/"),
                    pattern: source.pattern,
                }
            })
            .collect()
    }

    #[test]
    fn it_should_keep_globs_that_start_with_file_wildcards_as_is() {
        let base = create_folders(&["projects"]);

        let actual = test(
            &base,
            &[GlobEntry {
                base: "/projects".to_string(),
                pattern: "*.html".to_string(),
            }],
        );

        let expected = vec![GlobEntry {
            base: "/projects".to_string(),
            pattern: "*.html".to_string(),
        }];

        assert_eq!(actual, expected);
    }

    #[test]
    fn it_should_keep_globs_that_start_with_folder_wildcards_as_is() {
        let base = create_folders(&["projects"]);

        let actual = test(
            &base,
            &[GlobEntry {
                base: "/projects".to_string(),
                pattern: "**/*.html".to_string(),
            }],
        );

        let expected = vec![GlobEntry {
            base: "/projects".to_string(),
            pattern: "**/*.html".to_string(),
        }];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_move_the_starting_folder_to_the_path() {
        let base = create_folders(&["projects/example"]);

        let actual = test(
            &base,
            &[GlobEntry {
                base: "/projects".to_string(),
                pattern: "example/*.html".to_string(),
            }],
        );

        let expected = vec![GlobEntry {
            base: "/projects/example".to_string(),
            pattern: "*.html".to_string(),
        }];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_move_the_starting_folders_to_the_path() {
        let base = create_folders(&["projects/example/other"]);

        let actual = test(
            &base,
            &[GlobEntry {
                base: "/projects".to_string(),
                pattern: "example/other/*.html".to_string(),
            }],
        );

        let expected = vec![GlobEntry {
            base: "/projects/example/other".to_string(),
            pattern: "*.html".to_string(),
        }];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_branch_expandable_folders() {
        let base = create_folders(&["projects/foo", "projects/bar"]);

        let actual = test(
            &base,
            &[GlobEntry {
                base: "/projects".to_string(),
                pattern: "{foo,bar}/*.html".to_string(),
            }],
        );

        let expected = vec![
            GlobEntry {
                base: "/projects/bar".to_string(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/foo".to_string(),
                pattern: "*.html".to_string(),
            },
        ];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_expand_multiple_expansions_in_the_same_folder() {
        let base = create_folders(&[
            "projects/a-b-d-e-g",
            "projects/a-b-d-f-g",
            "projects/a-c-d-e-g",
            "projects/a-c-d-f-g",
        ]);

        let actual = test(
            &base,
            &[GlobEntry {
                base: "/projects".to_string(),
                pattern: "a-{b,c}-d-{e,f}-g/*.html".to_string(),
            }],
        );

        let expected = vec![
            GlobEntry {
                base: "/projects/a-b-d-e-g".to_string(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/a-b-d-f-g".to_string(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/a-c-d-e-g".to_string(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/a-c-d-f-g".to_string(),
                pattern: "*.html".to_string(),
            },
        ];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn multiple_expansions_per_folder_starting_at_the_root() {
        let base = create_folders(&[
            "projects/a-c-d-f/b-d-e-g",
            "projects/a-c-d-f/b-d-f-g",
            "projects/a-c-d-f/c-d-e-g",
            "projects/a-c-d-f/c-d-f-g",
            "projects/a-c-e-f/b-d-e-g",
            "projects/a-c-e-f/b-d-f-g",
            "projects/a-c-e-f/c-d-e-g",
            "projects/a-c-e-f/c-d-f-g",
            "projects/b-c-d-f/b-d-e-g",
            "projects/b-c-d-f/b-d-f-g",
            "projects/b-c-d-f/c-d-e-g",
            "projects/b-c-d-f/c-d-f-g",
            "projects/b-c-e-f/b-d-e-g",
            "projects/b-c-e-f/b-d-f-g",
            "projects/b-c-e-f/c-d-e-g",
            "projects/b-c-e-f/c-d-f-g",
        ]);

        let actual = test(
            &base,
            &[GlobEntry {
                base: "/projects".to_string(),
                pattern: "{a,b}-c-{d,e}-f/{b,c}-d-{e,f}-g/*.html".to_string(),
            }],
        );

        let expected = vec![
            GlobEntry {
                base: "/projects/a-c-d-f/b-d-e-g".into(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/a-c-d-f/b-d-f-g".into(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/a-c-d-f/c-d-e-g".into(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/a-c-d-f/c-d-f-g".into(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/a-c-e-f/b-d-e-g".into(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/a-c-e-f/b-d-f-g".into(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/a-c-e-f/c-d-e-g".into(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/a-c-e-f/c-d-f-g".into(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/b-c-d-f/b-d-e-g".into(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/b-c-d-f/b-d-f-g".into(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/b-c-d-f/c-d-e-g".into(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/b-c-d-f/c-d-f-g".into(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/b-c-e-f/b-d-e-g".into(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/b-c-e-f/b-d-f-g".into(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/b-c-e-f/c-d-e-g".into(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/b-c-e-f/c-d-f-g".into(),
                pattern: "*.html".to_string(),
            },
        ];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_stop_expanding_once_we_hit_a_wildcard() {
        let base = create_folders(&["projects/bar/example", "projects/foo/example"]);

        let actual = test(
            &base,
            &[GlobEntry {
                base: "/projects".to_string(),
                pattern: "{foo,bar}/example/**/{baz,qux}/*.html".to_string(),
            }],
        );

        let expected = vec![
            GlobEntry {
                base: "/projects/bar/example".to_string(),
                pattern: "{**/baz/*.html,**/qux/*.html}".to_string(),
            },
            GlobEntry {
                base: "/projects/foo/example".to_string(),
                pattern: "{**/baz/*.html,**/qux/*.html}".to_string(),
            },
        ];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_keep_the_negation_symbol_for_all_new_patterns() {
        let base = create_folders(&["projects"]);

        let actual = test(
            &base,
            &[GlobEntry {
                base: "/projects".to_string(),
                pattern: "!{foo,bar}/*.html".to_string(),
            }],
        );

        let expected = vec![GlobEntry {
            base: "/projects".to_string(),
            // TODO: This is wrong, because `!` should be in front. But right now we don't support
            // `@source "!../foo/bar";` anyway.
            pattern: "{!bar/*.html,!foo/*.html}".to_string(),
        }];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_expand_a_complex_example() {
        let base = create_folders(&[
            "projects/a/b/d/e/g",
            "projects/a/b/d/f/g",
            "projects/a/c/d/e/g",
            "projects/a/c/d/f/g",
        ]);

        let actual = test(
            &base,
            &[GlobEntry {
                base: "/projects".to_string(),
                pattern: "a/{b,c}/d/{e,f}/g/*.html".to_string(),
            }],
        );

        let expected = vec![
            GlobEntry {
                base: "/projects/a/b/d/e/g".to_string(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/a/b/d/f/g".to_string(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/a/c/d/e/g".to_string(),
                pattern: "*.html".to_string(),
            },
            GlobEntry {
                base: "/projects/a/c/d/f/g".to_string(),
                pattern: "*.html".to_string(),
            },
        ];

        assert_eq!(actual, expected,);
    }
}
