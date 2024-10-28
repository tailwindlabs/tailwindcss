use fxhash::{FxHashMap, FxHashSet};
use glob_match::glob_match;
use std::iter;
use std::path::{Path, PathBuf};
use tracing::event;

use crate::GlobEntry;

pub fn fast_glob(
    patterns: &Vec<GlobEntry>,
) -> Result<impl iter::Iterator<Item = PathBuf>, std::io::Error> {
    Ok(optimize_patterns(patterns)
        .into_iter()
        .flat_map(|glob_entry| {
            globwalk::GlobWalkerBuilder::from_patterns(
                glob_entry.base,
                &[glob_entry.pattern.as_str()][..],
            )
            .follow_links(true)
            .build()
            .unwrap()
            .filter_map(Result::ok)
            .map(|file| file.path().to_path_buf())
        }))
}

pub fn hoist_static_glob_parts(entries: &Vec<GlobEntry>) -> Vec<GlobEntry> {
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
            None => "**/*".to_owned(),
        };

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
    let entries = hoist_static_glob_parts(entries);

    // Track all base paths and their patterns. Later we will turn them back into `GlobalEntry`s.
    let mut pattern_map: FxHashMap<String, FxHashSet<String>> = FxHashMap::default();

    for glob_entry in entries {
        let entry = pattern_map.entry(glob_entry.base).or_default();
        entry.insert(glob_entry.pattern.clone());
    }

    // TODO: Optimization, if any of the patterns result in `**/*`, then we can do two things:
    // 1. All base paths in the pattern_map, that start with the current base path, can be removed.
    // 2. All patterns that are not `**/*` can be removed from the current base path.

    pattern_map
        .into_iter()
        .map(|(base, patterns)| {
            let size = patterns.len();
            let mut patterns = patterns.into_iter().collect::<Vec<_>>();
            patterns.sort();
            let combined_patterns = patterns.join(",");

            // TODO: Right now this will generate something like `{**/*.html,**/*.js}`, but maybe
            // we want to generate this instead:`**/*.{html,js}`.

            GlobEntry {
                base,
                pattern: match size {
                    1 => combined_patterns,
                    _ => format!("{{{}}}", combined_patterns),
                },
            }
        })
        .collect::<Vec<GlobEntry>>()
}

// Split a glob pattern into a `static` and `dynamic` part.
//
// Assumption: we assume that all globs are expanded, which means that the only dynamic parts are
// using `*`.
//
// E.g.:
//  Original input: `../project-b/**/*.{html,js}`
//  Expanded input: `../project-b/**/*.html` & `../project-b/**/*.js`
//  Split on first input: ("../project-b", "**/*.html")
//  Split on second input: ("../project-b", "**/*.js")
fn split_pattern(input: &str) -> (Option<String>, Option<String>) {
    // No dynamic parts, so we can just return the input as-is.
    if !input.contains('*') {
        return (Some(input.to_owned()), None);
    }

    let mut last_slash_position = None;

    for (i, c) in input.char_indices() {
        if c == '/' {
            last_slash_position = Some(i);
        }

        if c == '*' {
            break;
        }
    }

    // Very first character is a `*`, therefore there is no static part, only a dynamic part.
    let Some(last_slash_position) = last_slash_position else {
        return (None, Some(input.to_owned()));
    };

    let static_part = input[..last_slash_position].to_owned();
    let dynamic_part = input[last_slash_position + 1..].to_owned();

    let static_part = (!static_part.is_empty()).then_some(static_part);
    let dynamic_part = (!dynamic_part.is_empty()).then_some(dynamic_part);

    (static_part, dynamic_part)
}

pub fn path_matches_globs(path: &Path, globs: &[GlobEntry]) -> bool {
    let path = path.to_string_lossy();

    globs
        .iter()
        .any(|g| glob_match(&format!("{}/{}", g.base, g.pattern), &path))
}

/// Given this input: a-{b,c}-d-{e,f}
/// We will get:
/// [
///   a-b-d-e
///   a-b-d-f
///   a-c-d-e
///   a-c-d-f
/// ]
/// TODO: There is probably a way nicer way of doing this, but this works for now.
fn expand_braces(input: &str) -> Vec<String> {
    let mut result: Vec<String> = vec![];

    let mut in_braces = false;
    let mut last_char: char = '\0';

    let mut current = String::new();

    // Given the input: a-{b,c}-d-{e,f}-g
    // The template will look like this: ["a-", "-d-", "g"].
    let mut template: Vec<String> = vec![];

    // The branches will look like this: [["b", "c"], ["e", "f"]].
    let mut branches: Vec<Vec<String>> = vec![];

    for (i, c) in input.char_indices() {
        let is_escaped = i > 0 && last_char == '\\';
        last_char = c;

        match c {
            '{' if !is_escaped => {
                // Ensure that when a new set of braces is opened, that we at least have 1
                // template.
                if template.is_empty() {
                    template.push(String::new());
                }

                in_braces = true;
                branches.push(vec![]);
                template.push(String::new());
            }
            '}' if !is_escaped => {
                in_braces = false;
                if let Some(last) = branches.last_mut() {
                    last.push(current.clone());
                }
                current.clear();
            }
            ',' if !is_escaped && in_braces => {
                if let Some(last) = branches.last_mut() {
                    last.push(current.clone());
                }
                current.clear();
            }
            _ if in_braces => current.push(c),
            _ => {
                if template.is_empty() {
                    template.push(String::new());
                }

                if let Some(last) = template.last_mut() {
                    last.push(c);
                }
            }
        };
    }

    // Ensure we have a string that we can start adding information too.
    if !template.is_empty() && !branches.is_empty() {
        result.push("".to_string());
    }

    // Let's try to generate everything!
    for (i, template) in template.into_iter().enumerate() {
        // Append current template string to all existing results.
        result = result.into_iter().map(|x| x + &template).collect();

        // Get the results, and copy it for every single branch.
        if let Some(branches) = branches.get(i) {
            result = branches
                .iter()
                .flat_map(|branch| {
                    result
                        .clone()
                        .into_iter()
                        .map(|x| x + branch)
                        .collect::<Vec<_>>()
                })
                .collect::<Vec<_>>();
        }
    }

    result
}

#[cfg(test)]
mod tests {
    use super::get_fast_patterns;
    use crate::GlobEntry;
    use std::path::PathBuf;

    #[test]
    fn it_should_keep_globs_that_start_with_file_wildcards_as_is() {
        let actual = get_fast_patterns(&vec![GlobEntry {
            base: "/projects".to_string(),
            pattern: "*.html".to_string(),
        }]);
        let expected = vec![(PathBuf::from("/projects"), vec!["*.html".to_string()])];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_keep_globs_that_start_with_folder_wildcards_as_is() {
        let actual = get_fast_patterns(&vec![GlobEntry {
            base: "/projects".to_string(),
            pattern: "**/*.html".to_string(),
        }]);

        let expected = vec![(PathBuf::from("/projects"), vec!["**/*.html".to_string()])];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_move_the_starting_folder_to_the_path() {
        let actual = get_fast_patterns(&vec![GlobEntry {
            base: "/projects".to_string(),
            pattern: "example/*.html".to_string(),
        }]);
        let expected = vec![(
            PathBuf::from("/projects/example"),
            vec!["*.html".to_string()],
        )];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_move_the_starting_folders_to_the_path() {
        let actual = get_fast_patterns(&vec![GlobEntry {
            base: "/projects".to_string(),
            pattern: "example/other/*.html".to_string(),
        }]);
        let expected = vec![(
            PathBuf::from("/projects/example/other"),
            vec!["*.html".to_string()],
        )];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_branch_expandable_folders() {
        let actual = get_fast_patterns(&vec![GlobEntry {
            base: "/projects".to_string(),
            pattern: "{foo,bar}/*.html".to_string(),
        }]);

        let expected = vec![
            (PathBuf::from("/projects/foo"), vec!["*.html".to_string()]),
            (PathBuf::from("/projects/bar"), vec!["*.html".to_string()]),
        ];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_expand_multiple_expansions_in_the_same_folder() {
        let actual = get_fast_patterns(&vec![GlobEntry {
            base: "/projects".to_string(),
            pattern: "a-{b,c}-d-{e,f}-g/*.html".to_string(),
        }]);
        let expected = vec![
            (
                PathBuf::from("/projects/a-b-d-e-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/a-c-d-e-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/a-b-d-f-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/a-c-d-f-g"),
                vec!["*.html".to_string()],
            ),
        ];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn multiple_expansions_per_folder_starting_at_the_root() {
        let actual = get_fast_patterns(&vec![GlobEntry {
            base: "/projects".to_string(),
            pattern: "{a,b}-c-{d,e}-f/{b,c}-d-{e,f}-g/*.html".to_string(),
        }]);
        let expected = vec![
            (
                PathBuf::from("/projects/a-c-d-f/b-d-e-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/b-c-d-f/b-d-e-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/a-c-e-f/b-d-e-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/b-c-e-f/b-d-e-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/a-c-d-f/c-d-e-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/b-c-d-f/c-d-e-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/a-c-e-f/c-d-e-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/b-c-e-f/c-d-e-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/a-c-d-f/b-d-f-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/b-c-d-f/b-d-f-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/a-c-e-f/b-d-f-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/b-c-e-f/b-d-f-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/a-c-d-f/c-d-f-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/b-c-d-f/c-d-f-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/a-c-e-f/c-d-f-g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/b-c-e-f/c-d-f-g"),
                vec!["*.html".to_string()],
            ),
        ];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_stop_expanding_once_we_hit_a_wildcard() {
        let actual = get_fast_patterns(&vec![GlobEntry {
            base: "/projects".to_string(),
            pattern: "{foo,bar}/example/**/{baz,qux}/*.html".to_string(),
        }]);

        let expected = vec![
            (
                PathBuf::from("/projects/foo/example"),
                vec!["**/{baz,qux}/*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/bar/example"),
                vec!["**/{baz,qux}/*.html".to_string()],
            ),
        ];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_keep_the_negation_symbol_for_all_new_patterns() {
        let actual = get_fast_patterns(&vec![GlobEntry {
            base: "/projects".to_string(),
            pattern: "!{foo,bar}/*.html".to_string(),
        }]);
        let expected = vec![
            (PathBuf::from("/projects/foo"), vec!["!*.html".to_string()]),
            (PathBuf::from("/projects/bar"), vec!["!*.html".to_string()]),
        ];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_expand_a_complex_example() {
        let actual = get_fast_patterns(&vec![GlobEntry {
            base: "/projects".to_string(),
            pattern: "a/{b,c}/d/{e,f}/g/*.html".to_string(),
        }]);
        let expected = vec![
            (
                PathBuf::from("/projects/a/b/d/e/g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/a/c/d/e/g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/a/b/d/f/g"),
                vec!["*.html".to_string()],
            ),
            (
                PathBuf::from("/projects/a/c/d/f/g"),
                vec!["*.html".to_string()],
            ),
        ];

        assert_eq!(actual, expected,);
    }
}
