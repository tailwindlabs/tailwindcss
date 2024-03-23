use std::iter;
use std::path::{Path, PathBuf};

pub fn fast_glob(
    base_path: &Path,
    patterns: &Vec<String>,
) -> Result<impl iter::Iterator<Item = PathBuf>, std::io::Error> {
    Ok(get_fast_patterns(base_path, patterns)
        .into_iter()
        .flat_map(|(base_path, patterns)| {
            globwalk::GlobWalkerBuilder::from_patterns(base_path, &patterns)
                .follow_links(true)
                .build()
                .unwrap()
                .filter_map(Result::ok)
                .map(|file| file.path().to_path_buf())
        }))
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
fn get_fast_patterns(base_path: &Path, patterns: &Vec<String>) -> Vec<(PathBuf, Vec<String>)> {
    let mut optimized_patterns: Vec<(PathBuf, Vec<String>)> = vec![];

    for pattern in patterns {
        let is_negated = pattern.starts_with('!');
        let mut pattern = pattern.clone();
        if is_negated {
            pattern.remove(0);
        }

        let mut folders = pattern.split('/').collect::<Vec<_>>();

        if folders.len() <= 1 {
            // No paths we can simplify, so let's use it as-is.
            optimized_patterns.push((base_path.to_path_buf(), vec![pattern]));
        } else {
            // We do have folders because `/` exists. Let's try to simplify the globs!
            // Safety: We know that the length is greater than 1, so we can safely unwrap.
            let file_pattern = folders.pop().unwrap();
            let all_folders = folders.clone();
            let mut temp_paths = vec![base_path.to_path_buf()];

            let mut bail = false;

            for (i, folder) in folders.into_iter().enumerate() {
                // There is a wildcard in the folder, so we have to bail now... 😢 But this also
                // means that we can skip looking at the rest of the folders, so there is at least
                // this small optimization we can apply!
                if folder.contains('*') {
                    // Get all the remaining folders, attach the existing file_pattern so that this
                    // can now be the final pattern we use.
                    let mut remaining_folders = all_folders[i..].to_vec();
                    remaining_folders.push(file_pattern);

                    let pattern = remaining_folders.join("/");
                    for path in &temp_paths {
                        optimized_patterns.push((path.to_path_buf(), vec![pattern.to_string()]));
                    }

                    bail = true;
                    break;
                }

                // The folder is very likely using an expandable pattern which we can expand!
                if folder.contains('{') && folder.contains('}') {
                    let branches = expand_braces(folder);

                    let existing_paths = temp_paths;
                    temp_paths = branches
                        .iter()
                        .flat_map(|branch| {
                            existing_paths
                                .clone()
                                .into_iter()
                                .map(|path| path.join(branch))
                                .collect::<Vec<_>>()
                        })
                        .collect::<Vec<_>>();
                }
                // The folder should just be a simple folder name without any glob magic. We should
                // be able to safely add it to the existing paths.
                else {
                    temp_paths = temp_paths
                        .into_iter()
                        .map(|path| path.join(folder))
                        .collect();
                }
            }

            // As long as we didn't bail, we can now add the current expanded patterns to the
            // optimized patterns.
            if !bail {
                for path in &temp_paths {
                    optimized_patterns.push((path.to_path_buf(), vec![file_pattern.to_string()]));
                }
            }
        }

        // Ensure that we re-add all the `!` signs to the patterns.
        if is_negated {
            for (_, patterns) in &mut optimized_patterns {
                for pattern in patterns {
                    pattern.insert(0, '!');
                }
            }
        }
    }

    optimized_patterns
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
    use std::path::PathBuf;

    #[test]
    fn it_should_keep_globs_that_start_with_file_wildcards_as_is() {
        let actual = get_fast_patterns(&PathBuf::from("/projects"), &vec!["*.html".to_string()]);
        let expected = vec![(PathBuf::from("/projects"), vec!["*.html".to_string()])];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_keep_globs_that_start_with_folder_wildcards_as_is() {
        let actual = get_fast_patterns(&PathBuf::from("/projects"), &vec!["**/*.html".to_string()]);
        let expected = vec![(PathBuf::from("/projects"), vec!["**/*.html".to_string()])];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_move_the_starting_folder_to_the_path() {
        let actual = get_fast_patterns(
            &PathBuf::from("/projects"),
            &vec!["example/*.html".to_string()],
        );
        let expected = vec![(
            PathBuf::from("/projects/example"),
            vec!["*.html".to_string()],
        )];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_move_the_starting_folders_to_the_path() {
        let actual = get_fast_patterns(
            &PathBuf::from("/projects"),
            &vec!["example/other/*.html".to_string()],
        );
        let expected = vec![(
            PathBuf::from("/projects/example/other"),
            vec!["*.html".to_string()],
        )];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_branch_expandable_folders() {
        let actual = get_fast_patterns(
            &PathBuf::from("/projects"),
            &vec!["{foo,bar}/*.html".to_string()],
        );
        let expected = vec![
            (PathBuf::from("/projects/foo"), vec!["*.html".to_string()]),
            (PathBuf::from("/projects/bar"), vec!["*.html".to_string()]),
        ];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_expand_multiple_expansions_in_the_same_folder() {
        let actual = get_fast_patterns(
            &PathBuf::from("/projects"),
            &vec!["a-{b,c}-d-{e,f}-g/*.html".to_string()],
        );
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
        let actual = get_fast_patterns(
            &PathBuf::from("/projects"),
            &vec!["{a,b}-c-{d,e}-f/{b,c}-d-{e,f}-g/*.html".to_string()],
        );
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
        let actual = get_fast_patterns(
            &PathBuf::from("/projects"),
            &vec!["{foo,bar}/example/**/{baz,qux}/*.html".to_string()],
        );
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
        let actual = get_fast_patterns(
            &PathBuf::from("/projects"),
            &vec!["!{foo,bar}/*.html".to_string()],
        );
        let expected = vec![
            (PathBuf::from("/projects/foo"), vec!["!*.html".to_string()]),
            (PathBuf::from("/projects/bar"), vec!["!*.html".to_string()]),
        ];

        assert_eq!(actual, expected,);
    }

    #[test]
    fn it_should_expand_a_complex_example() {
        let actual = get_fast_patterns(
            &PathBuf::from("/projects"),
            &vec!["a/{b,c}/d/{e,f}/g/*.html".to_string()],
        );
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
