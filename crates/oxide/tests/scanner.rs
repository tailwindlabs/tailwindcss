#[cfg(test)]
mod scanner {
    use pretty_assertions::assert_eq;
    use std::path::{Path, PathBuf};
    use std::process::Command;
    use std::thread::sleep;
    use std::time::Duration;
    use std::{fs, path};

    use tailwindcss_oxide::*;
    use tempfile::tempdir;

    fn symlink<P: AsRef<Path>, Q: AsRef<Path>>(original: P, link: Q) -> std::io::Result<()> {
        #[cfg(not(windows))]
        let result = std::os::unix::fs::symlink(original, link);

        #[cfg(windows)]
        let result = std::os::windows::fs::symlink_dir(original, link);

        result
    }

    fn public_source_entry_from_pattern(dir: PathBuf, pattern: &str) -> PublicSourceEntry {
        let mut parts = pattern.split_whitespace();
        let _ = parts.next().unwrap_or_default();
        let not_or_pattern = parts.next().unwrap_or_default();
        if not_or_pattern == "not" {
            let pattern = parts.next().unwrap_or_default();
            return PublicSourceEntry {
                base: dir.to_string_lossy().into(),
                pattern: pattern[1..pattern.len() - 1].to_string(),
                negated: true,
            };
        }

        PublicSourceEntry {
            base: dir.to_string_lossy().into(),
            pattern: not_or_pattern[1..not_or_pattern.len() - 1].to_string(),
            negated: false,
        }
    }

    struct ScanResult {
        files: Vec<String>,
        globs: Vec<String>,
        normalized_sources: Vec<String>,
        candidates: Vec<String>,
    }

    fn create_files_in(dir: &path::Path, paths: &[(&str, &str)]) {
        // Create the necessary files
        for (path, contents) in paths {
            // Ensure we use the right path separator for the current platform
            let path = dir.join(path.replace('/', path::MAIN_SEPARATOR.to_string().as_str()));
            let parent = path.parent().unwrap();
            if !parent.exists() {
                fs::create_dir_all(parent).unwrap();
            }

            fs::write(path, contents).unwrap()
        }
    }

    fn scan_with_globs(
        paths_with_content: &[(&str, &str)],
        source_directives: Vec<&str>,
    ) -> ScanResult {
        // Create a temporary working directory
        let dir = tempdir().unwrap().into_path();

        // Initialize this directory as a git repository
        let _ = Command::new("git").arg("init").current_dir(&dir).output();

        // Create the necessary files
        self::create_files_in(&dir, paths_with_content);

        let base = format!("{}", dir.display()).replace('\\', "/");

        // Resolve all content paths for the (temporary) current working directory
        let sources: Vec<PublicSourceEntry> = source_directives
            .iter()
            .map(|str| public_source_entry_from_pattern(base.clone().into(), str))
            .collect();

        let mut scanner = Scanner::new(sources);

        let candidates = scanner.scan();

        let base_dir =
            format!("{}{}", dunce::canonicalize(&base).unwrap().display(), "/").replace('\\', "/");

        // Get all scanned files as strings relative to the base directory
        let mut files = scanner
            .get_files()
            .iter()
            // Normalize paths to use unix style separators
            .map(|file| file.replace('\\', "/").replace(&base_dir, ""))
            .collect::<Vec<_>>();
        files.sort();

        // Get all scanned globs as strings relative to the base directory
        let mut globs = scanner
            .get_globs()
            .iter()
            .map(|glob| {
                if glob.pattern.starts_with('/') {
                    format!("{}{}", glob.base, glob.pattern)
                } else {
                    format!("{}/{}", glob.base, glob.pattern)
                }
            })
            // Normalize paths to use unix style separators
            .map(|file| file.replace('\\', "/").replace(&base_dir, ""))
            .collect::<Vec<_>>();
        globs.sort();

        // Get all normalized sources as strings relative to the base directory
        let mut normalized_sources = scanner
            .get_normalized_sources()
            .iter()
            .map(|glob| {
                if glob.pattern.starts_with('/') {
                    format!("{}{}", glob.base, glob.pattern)
                } else {
                    format!("{}/{}", glob.base, glob.pattern)
                }
            })
            // Normalize paths to use unix style separators
            .map(|file| file.replace('\\', "/").replace(&base_dir, ""))
            .collect::<Vec<_>>();
        normalized_sources.sort();

        ScanResult {
            files,
            globs,
            normalized_sources,
            candidates,
        }
    }

    fn scan(paths_with_content: &[(&str, &str)]) -> ScanResult {
        scan_with_globs(paths_with_content, vec!["@source '**/*'"])
    }

    #[test]
    fn it_should_work_with_a_set_of_root_files() {
        let ScanResult {
            files,
            globs,
            normalized_sources,
            ..
        } = scan(&[
            ("index.html", ""),
            ("a.html", ""),
            ("b.html", ""),
            ("c.html", ""),
        ]);
        assert_eq!(files, vec!["a.html", "b.html", "c.html", "index.html"]);
        assert_eq!(globs, vec!["*"]);
        assert_eq!(normalized_sources, vec!["**/*"]);
    }

    #[test]
    fn it_should_work_with_a_set_of_root_files_and_ignore_ignored_files() {
        let ScanResult {
            files,
            globs,
            normalized_sources,
            ..
        } = scan(&[
            (".gitignore", "b.html"),
            ("index.html", ""),
            ("a.html", ""),
            ("b.html", ""),
            ("c.html", ""),
        ]);
        assert_eq!(files, vec!["a.html", "c.html", "index.html"]);
        assert_eq!(globs, vec!["*"]);
        assert_eq!(normalized_sources, vec!["**/*"]);
    }

    #[test]
    fn it_should_list_all_files_in_the_public_folder_explicitly() {
        let ScanResult {
            files,
            globs,
            normalized_sources,
            ..
        } = scan(&[
            ("index.html", ""),
            ("public/a.html", ""),
            ("public/b.html", ""),
            ("public/c.html", ""),
            ("public/nested/c.html", ""),
            ("public/deeply/nested/c.html", ""),
        ]);

        assert_eq!(
            files,
            vec![
                "index.html",
                "public/a.html",
                "public/b.html",
                "public/c.html",
                "public/deeply/nested/c.html",
                "public/nested/c.html",
            ]
        );
        assert_eq!(globs, vec!["*"]);
        assert_eq!(normalized_sources, vec!["**/*"]);
    }

    #[test]
    fn it_should_list_nested_folders_explicitly_in_the_public_folder() {
        let ScanResult {
            files,
            globs,
            normalized_sources,
            ..
        } = scan(&[
            ("index.html", ""),
            ("public/a.html", ""),
            ("public/b.html", ""),
            ("public/c.html", ""),
            ("public/nested/a.html", ""),
            ("public/nested/b.html", ""),
            ("public/nested/c.html", ""),
            ("public/nested/again/a.html", ""),
            ("public/very/deeply/nested/a.html", ""),
        ]);

        assert_eq!(
            files,
            vec![
                "index.html",
                "public/a.html",
                "public/b.html",
                "public/c.html",
                "public/nested/a.html",
                "public/nested/again/a.html",
                "public/nested/b.html",
                "public/nested/c.html",
                "public/very/deeply/nested/a.html",
            ]
        );
        assert_eq!(globs, vec!["*",]);
        assert_eq!(normalized_sources, vec!["**/*"]);
    }

    #[test]
    fn it_should_list_all_files_in_the_public_folder_explicitly_except_ignored_files() {
        let ScanResult {
            files,
            globs,
            normalized_sources,
            ..
        } = scan(&[
            (".gitignore", "public/b.html\na.html"),
            ("index.html", ""),
            ("public/a.html", ""),
            ("public/b.html", ""),
            ("public/c.html", ""),
        ]);

        assert_eq!(files, vec!["index.html", "public/c.html",]);
        assert_eq!(globs, vec!["*"]);
        assert_eq!(normalized_sources, vec!["**/*"]);
    }

    #[test]
    fn it_should_use_a_glob_for_top_level_folders() {
        let ScanResult {
            files,
            globs,
            normalized_sources,
            ..
        } = scan(&[
            ("index.html", ""),
            ("src/a.html", ""),
            ("src/b.html", ""),
            ("src/c.html", ""),
        ]);

        assert_eq!(
            files,
            vec!["index.html", "src/a.html", "src/b.html", "src/c.html"]
        );
        assert_eq!(globs, vec![
            "*",
            "src/**/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
        ]);
        assert_eq!(normalized_sources, vec!["**/*"]);
    }

    #[test]
    fn it_should_ignore_binary_files() {
        let ScanResult {
            files,
            globs,
            normalized_sources,
            ..
        } = scan(&[
            ("index.html", ""),
            ("a.mp4", ""),
            ("b.png", ""),
            ("c.lock", ""),
        ]);

        assert_eq!(files, vec!["index.html"]);
        assert_eq!(globs, vec!["*"]);
        assert_eq!(normalized_sources, vec!["**/*"]);
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/17569
    #[test]
    fn it_should_not_ignore_folders_that_end_with_a_binary_extension() {
        let ScanResult {
            files,
            globs,
            normalized_sources,
            ..
        } = scan(&[
            // Looks like `.pages` binary extension, but it's a folder
            ("some.pages/index.html", "content-['some.pages/index.html']"),
            // Ignore a specific folder. This is to ensure that this still "wins" from the internal
            // solution of dealing with binary extensions for files only.
            (".gitignore", "other.pages"),
            (
                "other.pages/index.html",
                "content-['other.pages/index.html']",
            ),
        ]);

        assert_eq!(files, vec!["some.pages/index.html"]);
        assert_eq!(globs, vec!["*", "some.pages/**/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}"]);
        assert_eq!(normalized_sources, vec!["**/*"]);
    }

    #[test]
    fn it_should_ignore_known_extensions() {
        let ScanResult {
            files,
            globs,
            normalized_sources,
            ..
        } = scan(&[
            ("index.html", ""),
            ("a.css", ""),
            ("b.sass", ""),
            ("c.less", ""),
        ]);

        assert_eq!(files, vec!["a.css", "index.html"]);
        assert_eq!(globs, vec!["*"]);
        assert_eq!(normalized_sources, vec!["**/*"]);
    }

    #[test]
    fn it_should_find_new_extensions() {
        let ScanResult {
            files,
            globs,
            normalized_sources,
            ..
        } = scan(&[("src/index.my-extension", "")]);

        assert_eq!(files, vec!["src/index.my-extension"]);
        assert_eq!(globs, vec!["*", "src/**/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,my-extension,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}"]);
        assert_eq!(normalized_sources, vec!["**/*"]);
    }

    #[test]
    fn it_should_ignore_known_files() {
        let ScanResult {
            files,
            globs,
            normalized_sources,
            ..
        } = scan(&[
            ("index.html", ""),
            ("package-lock.json", ""),
            ("yarn.lock", ""),
        ]);

        assert_eq!(files, vec!["index.html"]);
        assert_eq!(globs, vec!["*"]);
        assert_eq!(normalized_sources, vec!["**/*"]);
    }

    #[test]
    fn it_should_ignore_and_expand_nested_ignored_folders() {
        let ScanResult {
            files,
            globs,
            normalized_sources,
            ..
        } = scan(&[
            // Explicitly listed root files
            ("foo.html", ""),
            ("bar.html", ""),
            ("baz.html", ""),
            // Nested folder A, using glob
            ("nested-a/foo.html", ""),
            ("nested-a/bar.html", ""),
            ("nested-a/baz.html", ""),
            // Nested folder B, with deeply nested files, using glob
            ("nested-b/deeply-nested/foo.html", ""),
            ("nested-b/deeply-nested/bar.html", ""),
            ("nested-b/deeply-nested/baz.html", ""),
            // Nested folder C, with ignored sub-folder
            ("nested-c/foo.html", ""),
            ("nested-c/bar.html", ""),
            ("nested-c/baz.html", ""),
            //   Ignored folder
            ("nested-c/.gitignore", "ignored-folder/"),
            ("nested-c/ignored-folder/foo.html", ""),
            ("nested-c/ignored-folder/bar.html", ""),
            ("nested-c/ignored-folder/baz.html", ""),
            //   Deeply nested, without issues
            ("nested-c/sibling-folder/foo.html", ""),
            ("nested-c/sibling-folder/bar.html", ""),
            ("nested-c/sibling-folder/baz.html", ""),
            // Nested folder D, with deeply nested ignored folder
            ("nested-d/foo.html", ""),
            ("nested-d/bar.html", ""),
            ("nested-d/baz.html", ""),
            ("nested-d/.gitignore", "deep/"),
            ("nested-d/very/deeply/nested/deep/foo.html", ""),
            ("nested-d/very/deeply/nested/deep/bar.html", ""),
            ("nested-d/very/deeply/nested/deep/baz.html", ""),
            ("nested-d/very/deeply/nested/foo.html", ""),
            ("nested-d/very/deeply/nested/bar.html", ""),
            ("nested-d/very/deeply/nested/baz.html", ""),
            ("nested-d/very/deeply/nested/directory/foo.html", ""),
            ("nested-d/very/deeply/nested/directory/bar.html", ""),
            ("nested-d/very/deeply/nested/directory/baz.html", ""),
            ("nested-d/very/deeply/nested/directory/again/foo.html", ""),
        ]);

        assert_eq!(
            files,
            vec![
                "bar.html",
                "baz.html",
                "foo.html",
                "nested-a/bar.html",
                "nested-a/baz.html",
                "nested-a/foo.html",
                "nested-b/deeply-nested/bar.html",
                "nested-b/deeply-nested/baz.html",
                "nested-b/deeply-nested/foo.html",
                "nested-c/bar.html",
                "nested-c/baz.html",
                "nested-c/foo.html",
                "nested-c/sibling-folder/bar.html",
                "nested-c/sibling-folder/baz.html",
                "nested-c/sibling-folder/foo.html",
                "nested-d/bar.html",
                "nested-d/baz.html",
                "nested-d/foo.html",
                "nested-d/very/deeply/nested/bar.html",
                "nested-d/very/deeply/nested/baz.html",
                "nested-d/very/deeply/nested/directory/again/foo.html",
                "nested-d/very/deeply/nested/directory/bar.html",
                "nested-d/very/deeply/nested/directory/baz.html",
                "nested-d/very/deeply/nested/directory/foo.html",
                "nested-d/very/deeply/nested/foo.html",
            ]
        );
        assert_eq!(globs, vec![
            "*",
            "nested-a/**/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
            "nested-b/**/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
            "nested-c/*/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
            "nested-c/sibling-folder/**/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
            "nested-d/*/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
            "nested-d/very/*/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
            "nested-d/very/deeply/*/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
            "nested-d/very/deeply/nested/*/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
            "nested-d/very/deeply/nested/directory/**/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
        ]);
        assert_eq!(normalized_sources, vec!["**/*"]);
    }

    #[test]
    fn it_should_scan_for_utilities() {
        let mut ignores = String::new();
        ignores.push_str("# md:font-bold\n");
        ignores.push_str("foo.html\n");

        let ScanResult {
            candidates,
            normalized_sources,
            ..
        } = scan(&[
            // The gitignore file is used to filter out files but not scanned for candidates
            (".gitignore", &ignores),
            // A file that should definitely be scanned
            ("index.html", "font-bold md:flex"),
            // A file that should definitely not be scanned
            ("foo.jpg", "xl:font-bold"),
            // A file that is ignored
            ("foo.html", "lg:font-bold"),
            // An Angular file using the class shorthand syntax
            (
                "index.angular.html",
                "<div [class.underline]=\"bool\"></div>",
            ),
            // A svelte file with `class:foo="bar"` syntax
            ("index.svelte", "<div class:px-4='condition'></div>"),
            ("index2.svelte", "<div\n\tclass:px-5='condition'></div>"),
            ("index3.svelte", "<div\n  class:px-6='condition'></div>"),
            ("index4.svelte", "<div\nclass:px-7='condition'></div>"),
        ]);

        assert_eq!(
            candidates,
            vec![
                "bool",
                "class",
                "condition",
                "font-bold",
                "md:flex",
                "px-4",
                "px-5",
                "px-6",
                "px-7",
                "underline"
            ]
        );
        assert_eq!(normalized_sources, vec!["**/*"]);
    }

    #[test]
    fn it_should_be_possible_to_scan_in_the_parent_directory() {
        let ScanResult {
            candidates,
            normalized_sources,
            ..
        } = scan_with_globs(
            &[("foo/bar/baz/foo.html", "content-['foo.html']")],
            vec!["@source '**/*'", "@source './foo/bar/baz/..'"],
        );

        assert_eq!(candidates, vec!["content-['foo.html']"]);
        assert_eq!(normalized_sources, vec!["**/*", "foo/bar/**/*"]);
    }

    #[test]
    fn it_should_scan_files_without_extensions() {
        // These look like folders, but they are files
        let ScanResult {
            candidates,
            normalized_sources,
            ..
        } = scan_with_globs(
            &[("my-file", "content-['my-file']")],
            vec!["@source '**/*'", "@source './my-file'"],
        );

        assert_eq!(candidates, vec!["content-['my-file']"]);
        assert_eq!(normalized_sources, vec!["**/*", "my-file"]);
    }

    #[test]
    fn it_should_scan_folders_with_extensions() {
        // These look like files, but they are folders
        let ScanResult {
            candidates,
            normalized_sources,
            ..
        } = scan_with_globs(
            &[
                (
                    "my-folder.templates/foo.html",
                    "content-['my-folder.templates/foo.html']",
                ),
                (
                    "my-folder.bin/foo.html",
                    "content-['my-folder.bin/foo.html']",
                ),
            ],
            vec![
                "@source '**/*'",
                "@source './my-folder.templates'",
                "@source './my-folder.bin'",
            ],
        );

        assert_eq!(
            candidates,
            vec![
                "content-['my-folder.bin/foo.html']",
                "content-['my-folder.templates/foo.html']",
            ]
        );
        assert_eq!(
            normalized_sources,
            vec!["**/*", "my-folder.bin/**/*", "my-folder.templates/**/*"]
        );
    }

    #[test]
    fn it_should_scan_content_paths() {
        let ScanResult {
            candidates,
            normalized_sources,
            ..
        } = scan_with_globs(
            &[
                // We know that `.styl` extensions are ignored, so they are not covered by auto content
                // detection.
                ("foo.styl", "content-['foo.styl']"),
            ],
            vec!["@source '**/*'", "@source '*.styl'"],
        );

        assert_eq!(candidates, vec!["content-['foo.styl']"]);
        assert_eq!(normalized_sources, vec!["**/*", "*.styl"]);
    }

    #[test]
    fn it_should_scan_next_dynamic_folders() {
        let ScanResult {
            candidates,
            normalized_sources,
            ..
        } = scan_with_globs(
            &[
                // We know that `.styl` extensions are ignored, so they are not covered by auto content
                // detection.
                ("app/[slug]/page.styl", "content-['[slug]']"),
                ("app/[...slug]/page.styl", "content-['[...slug]']"),
                ("app/[[...slug]]/page.styl", "content-['[[...slug]]']"),
                ("app/(theme)/page.styl", "content-['(theme)']"),
            ],
            vec!["@source '**/*'", "@source './**/*.{styl}'"],
        );

        assert_eq!(
            candidates,
            vec![
                "content-['(theme)']",
                "content-['[...slug]']",
                "content-['[[...slug]]']",
                "content-['[slug]']",
            ],
        );
        assert_eq!(normalized_sources, vec!["**/*", "**/*.styl"]);
    }

    #[test]
    fn it_should_scan_absolute_paths() {
        // Create a temporary working directory
        let dir = tempdir().unwrap().into_path();

        // Initialize this directory as a git repository
        let _ = Command::new("git").arg("init").current_dir(&dir).output();

        // Create files
        create_files_in(
            &dir,
            &[
                ("project-a/index.html", "content-['project-a/index.html']"),
                ("project-b/index.html", "content-['project-b/index.html']"),
            ],
        );

        // Get POSIX-style absolute path
        let full_path = format!("{}", dir.display()).replace('\\', "/");

        let sources = vec![PublicSourceEntry {
            base: full_path.clone(),
            pattern: full_path.clone(),
            negated: false,
        }];

        let mut scanner = Scanner::new(sources);
        let candidates = scanner.scan();

        // We've done the initial scan and found the files
        assert_eq!(
            candidates,
            vec![
                "content-['project-a/index.html']",
                "content-['project-b/index.html']"
            ]
        );
    }

    #[test]
    fn it_should_scan_content_paths_even_when_they_are_git_ignored() {
        let ScanResult {
            candidates,
            normalized_sources,
            ..
        } = scan_with_globs(
            &[
                (".gitignore", "foo.styl"),
                // We know that `.styl` extensions are ignored, so they are not covered by auto content
                // detection.
                ("foo.styl", "content-['foo.styl']"),
            ],
            // But explicitly including them should still work
            vec!["@source '**/*'", "@source 'foo.styl'"],
        );

        assert_eq!(candidates, vec!["content-['foo.styl']"]);
        assert_eq!(normalized_sources, vec!["**/*", "foo.styl"]);
    }

    #[test]
    fn it_should_pick_up_new_files() {
        // Create a temporary working directory
        let dir = tempdir().unwrap().into_path();

        // Initialize this directory as a git repository
        let _ = Command::new("git").arg("init").current_dir(&dir).output();

        // Create files
        create_files_in(
            &dir,
            &[
                ("project-a/index.html", "content-['project-a/index.html']"),
                ("project-b/index.html", "content-['project-b/index.html']"),
            ],
        );

        let sources = vec![
            public_source_entry_from_pattern(dir.join("project-a"), "@source '**/*'"),
            public_source_entry_from_pattern(dir.join("project-b"), "@source '**/*'"),
        ];

        let mut scanner = Scanner::new(sources);
        let candidates = scanner.scan();

        // We've done the initial scan and found the files
        assert_eq!(
            candidates,
            vec![
                "content-['project-a/index.html']",
                "content-['project-b/index.html']"
            ]
        );

        // We have to sleep because it might run too fast (seriously) and the
        // mtimes of the directories end up being the same as the last time we
        // checked them
        sleep(Duration::from_millis(100));

        // Create files
        create_files_in(
            &dir,
            &[
                ("project-a/new.html", "content-['project-a/new.html']"),
                ("project-b/new.html", "content-['project-b/new.html']"),
            ],
        );

        let candidates = scanner.scan();

        assert_eq!(
            candidates,
            vec![
                "content-['project-a/index.html']",
                "content-['project-a/new.html']",
                "content-['project-b/index.html']",
                "content-['project-b/new.html']"
            ]
        );

        // We have to sleep because it might run too fast (seriously) and the
        // mtimes of the directories end up being the same as the last time we
        // checked them
        sleep(Duration::from_millis(100));

        // Create folders
        create_files_in(
            &dir,
            &[
                (
                    "project-a/sub1/sub2/index.html",
                    "content-['project-a/sub1/sub2/index.html']",
                ),
                (
                    "project-b/sub1/sub2/index.html",
                    "content-['project-b/sub1/sub2/index.html']",
                ),
            ],
        );

        let candidates = scanner.scan();

        assert_eq!(
            candidates,
            vec![
                "content-['project-a/index.html']",
                "content-['project-a/new.html']",
                "content-['project-a/sub1/sub2/index.html']",
                "content-['project-b/index.html']",
                "content-['project-b/new.html']",
                "content-['project-b/sub1/sub2/index.html']"
            ]
        );

        // We have to sleep because it might run too fast (seriously) and the
        // mtimes of the directories end up being the same as the last time we
        // checked them
        sleep(Duration::from_millis(100));

        // Create folders
        create_files_in(
            &dir,
            &[
                (
                    "project-a/sub1/sub2/new.html",
                    "content-['project-a/sub1/sub2/new.html']",
                ),
                (
                    "project-b/sub1/sub2/new.html",
                    "content-['project-b/sub1/sub2/new.html']",
                ),
            ],
        );

        let candidates = scanner.scan();

        assert_eq!(
            candidates,
            vec![
                "content-['project-a/index.html']",
                "content-['project-a/new.html']",
                "content-['project-a/sub1/sub2/index.html']",
                "content-['project-a/sub1/sub2/new.html']",
                "content-['project-b/index.html']",
                "content-['project-b/new.html']",
                "content-['project-b/sub1/sub2/index.html']",
                "content-['project-b/sub1/sub2/new.html']"
            ]
        );
    }

    #[test]
    fn it_should_ignore_negated_custom_sources() {
        let ScanResult {
            candidates,
            files,
            globs,
            normalized_sources,
        } = scan_with_globs(
            &[
                ("src/index.ts", "content-['src/index.ts']"),
                ("src/colors/red.jsx", "content-['src/colors/red.jsx']"),
                ("src/colors/blue.tsx", "content-['src/colors/blue.tsx']"),
                ("src/colors/green.tsx", "content-['src/colors/green.tsx']"),
                ("src/utils/string.ts", "content-['src/utils/string.ts']"),
                ("src/utils/date.ts", "content-['src/utils/date.ts']"),
                ("src/utils/file.ts", "content-['src/utils/file.ts']"),
                (
                    "src/admin/foo/template.html",
                    "content-['src/admin/template.html']",
                ),
                (
                    "src/templates/index.html",
                    "content-['src/templates/index.html']",
                ),
            ],
            vec![
                "@source '**/*'",
                "@source not 'src/index.ts'",
                "@source not '**/*.{jsx,tsx}'",
                "@source not 'src/utils'",
                "@source not 'dist'",
            ],
        );

        assert_eq!(
            candidates,
            vec![
                "content-['src/admin/template.html']",
                "content-['src/templates/index.html']",
            ]
        );

        assert_eq!(
            files,
            vec![
                "src/admin/foo/template.html",
                "src/templates/index.html",
                // These files are ignored and thus do not need to be watched:

                // "src/colors/blue.tsx",
                // "src/colors/green.tsx",
                // "src/colors/red.jsx",
                // "src/index.ts",
                // "src/utils/date.ts",
                // "src/utils/file.ts",
                // "src/utils/string.ts"
            ]
        );
        assert_eq!(
            globs,
            vec![
                "*",
                "src/*/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
                "src/admin/**/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
                "src/colors/**/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
                "src/templates/**/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
            ]
        );

        assert_eq!(normalized_sources, vec!["**/*",]);
    }

    #[test]
    fn it_should_include_defined_extensions_that_are_ignored_by_default() {
        let ScanResult {
            candidates,
            files,
            globs,
            normalized_sources,
        } = scan_with_globs(
            // Typically skipped
            &[
                ("src/index.exe", "content-['src/index.exe']"),
                ("src/index.bin", "content-['src/index.bin']"),
                ("out/out.exe", "content-['out/out.exe']"),
            ],
            // But explicitly included
            vec!["@source '**/*'", "@source 'src/**/*.{exe,bin}'"],
        );

        assert_eq!(
            candidates,
            vec!["content-['src/index.bin']", "content-['src/index.exe']",]
        );
        assert_eq!(files, vec!["src/index.bin", "src/index.exe",]);
        assert_eq!(
            globs,
            vec![
                "*",
                // Contains `.exe` and `.bin` in the list
                "out/**/*.{aspx,astro,bin,cjs,cts,eex,erb,exe,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
                "src/{**/*.bin,**/*.exe,**/*.{aspx,astro,bin,cjs,cts,eex,erb,exe,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}}",
            ]
        );
        assert_eq!(
            normalized_sources,
            vec!["**/*", "src/**/*.bin", "src/**/*.exe"]
        );
    }

    #[test]
    fn it_should_work_with_manual_glob_only() {
        let ScanResult {
            candidates,
            files,
            globs,
            normalized_sources,
        } = scan_with_globs(
            &[
                ("index.html", "content-['index.html']"),
                ("src/index.html", "content-['src/index.html']"),
                ("src/ignore.html", "content-['src/ignore.html']"),
                ("src/admin/index.html", "content-['src/admin/index.html']"),
                ("src/admin/ignore.html", "content-['src/admin/ignore.html']"),
                (
                    "src/dashboard/index.html",
                    "content-['src/dashboard/index.html']",
                ),
                (
                    "src/dashboard/ignore.html",
                    "content-['src/dashboard/ignore.html']",
                ),
                ("src/lib.ts", "content-['src/lib.ts']"),
            ],
            vec![
                "@source './src/**/*.html'",
                "@source not './src/index.html'",
                "@source not './src/**/ignore.html'",
            ],
        );

        assert_eq!(
            candidates,
            vec![
                "content-['src/admin/index.html']",
                "content-['src/dashboard/index.html']",
            ]
        );

        assert_eq!(
            files,
            vec!["src/admin/index.html", "src/dashboard/index.html",]
        );
        assert_eq!(globs, vec!["src/**/*.html"]);
        assert_eq!(normalized_sources, vec!["src/**/*.html"]);
    }

    #[test]
    fn it_respects_gitignore_in_workspace_root() {
        let ScanResult {
            candidates,
            files,
            globs,
            normalized_sources,
        } = scan_with_globs(
            &[
                (".gitignore", "ignore-1.html\nweb/ignore-2.html"),
                ("src/index.html", "content-['src/index.html']"),
                ("web/index.html", "content-['web/index.html']"),
                ("web/ignore-1.html", "content-['web/ignore-1.html']"),
                ("web/ignore-2.html", "content-['web/ignore-2.html']"),
            ],
            vec!["@source './src'", "@source './web'"],
        );

        assert_eq!(
            candidates,
            vec!["content-['src/index.html']", "content-['web/index.html']",]
        );

        assert_eq!(files, vec!["src/index.html", "web/index.html",]);
        assert_eq!(globs, vec!["src/*", "web/*",]);
        assert_eq!(normalized_sources, vec!["src/**/*", "web/**/*",]);
    }

    #[test]
    fn it_includes_skipped_by_default_extensions_with_a_specific_source() {
        let ScanResult {
            candidates,
            files,
            globs,
            normalized_sources,
        } = scan_with_globs(
            &[
                ("src/logo.jpg", "content-['/src/logo.jpg']"),
                ("src/logo.png", "content-['/src/logo.png']"),
            ],
            vec!["@source './src/logo.{jpg,png}'"],
        );

        assert_eq!(
            candidates,
            vec!["content-['/src/logo.jpg']", "content-['/src/logo.png']"]
        );
        assert_eq!(files, vec!["src/logo.jpg", "src/logo.png"]);
        assert!(globs.is_empty());
        assert_eq!(normalized_sources, vec!["src/logo.jpg", "src/logo.png"]);
    }

    #[test]
    fn it_respects_gitignore_in_workspace_root_for_manual_globs() {
        let ScanResult {
            candidates,
            files,
            globs,
            normalized_sources,
        } = scan_with_globs(
            &[
                (".gitignore", "ignore-1.html\n/web/ignore-2.html"),
                ("web/index.html", "content-['web/index.html']"),
                ("web/ignore-1.html", "content-['web/ignore-1.html']"),
                ("web/ignore-2.html", "content-['web/ignore-2.html']"),
            ],
            vec!["@source './web'", "@source './web/ignore-1.html'"],
        );
        assert_eq!(
            candidates,
            vec![
                "content-['web/ignore-1.html']",
                "content-['web/index.html']",
            ]
        );

        assert_eq!(files, vec!["web/ignore-1.html", "web/index.html",]);
        assert_eq!(globs, vec!["web/*"]);
        assert_eq!(normalized_sources, vec!["web/**/*", "web/ignore-1.html"]);
    }

    #[test]
    fn skips_ignore_files_outside_of_a_repo() {
        // Create a temporary working directory
        let dir = tempdir().unwrap().into_path();

        // Create files
        create_files_in(
            &dir,
            &[
                // This file should always be picked up
                ("home/project/apps/web/index.html", "content-['index.html']"),
                // Set up various ignore rules
                ("home/.gitignore", "ignore-home.html"),
                ("home/project/.gitignore", "ignore-project.html"),
                ("home/project/apps/.gitignore", "ignore-apps.html"),
                ("home/project/apps/web/.gitignore", "ignore-web.html"),
                // Some of these should be ignored depending on which dir is the repo root
                (
                    "home/project/apps/web/ignore-home.html",
                    "content-['ignore-home.html']",
                ),
                (
                    "home/project/apps/web/ignore-project.html",
                    "content-['ignore-project.html']",
                ),
                (
                    "home/project/apps/web/ignore-apps.html",
                    "content-['ignore-apps.html']",
                ),
                (
                    "home/project/apps/web/ignore-web.html",
                    "content-['ignore-web.html']",
                ),
                // Auto content detection outside of `web/`
                (
                    "home/project/apps/admin/index.html",
                    "content-['home/project/apps/admin/index.html']",
                ),
                // Manual sources outside of `web/`
                (
                    "home/project/apps/dashboard/index.html",
                    "content-['home/project/apps/dashboard/index.html']",
                ),
            ],
        );

        let sources = vec![
            public_source_entry_from_pattern(
                dir.join("home/project/apps/web")
                    .to_string_lossy()
                    .to_string()
                    .into(),
                "@source '**/*'",
            ),
            public_source_entry_from_pattern(
                dir.join("home/project/apps/web")
                    .to_string_lossy()
                    .to_string()
                    .into(),
                "@source '../admin'",
            ),
            public_source_entry_from_pattern(
                dir.join("home/project/apps/web")
                    .to_string_lossy()
                    .to_string()
                    .into(),
                "@source '../dashboard/*.html'",
            ),
        ];

        let candidates = Scanner::new(sources.clone()).scan();

        // All ignore files are applied because there's no git repo
        assert_eq!(
            candidates,
            vec![
                "content-['home/project/apps/admin/index.html']",
                "content-['home/project/apps/dashboard/index.html']",
                "content-['index.html']"
            ]
        );

        // Initialize `home` as a git repository and scan again
        // The results should be the same as before
        _ = Command::new("git")
            .arg("init")
            .current_dir(dir.join("home"))
            .output();
        let candidates = Scanner::new(sources.clone()).scan();

        assert_eq!(
            candidates,
            vec![
                "content-['home/project/apps/admin/index.html']",
                "content-['home/project/apps/dashboard/index.html']",
                "content-['index.html']"
            ]
        );

        // Drop the .git folder
        fs::remove_dir_all(dir.join("home/.git")).unwrap();

        // Initialize `home/project` as a git repository and scan again
        _ = Command::new("git")
            .arg("init")
            .current_dir(dir.join("home/project"))
            .output();
        let candidates = Scanner::new(sources.clone()).scan();

        assert_eq!(
            candidates,
            vec![
                "content-['home/project/apps/admin/index.html']",
                "content-['home/project/apps/dashboard/index.html']",
                "content-['ignore-home.html']",
                "content-['index.html']"
            ]
        );

        // Drop the .git folder
        fs::remove_dir_all(dir.join("home/project/.git")).unwrap();

        // Initialize `home/project/apps` as a git repository and scan again
        _ = Command::new("git")
            .arg("init")
            .current_dir(dir.join("home/project/apps"))
            .output();
        let candidates = Scanner::new(sources.clone()).scan();

        assert_eq!(
            candidates,
            vec![
                "content-['home/project/apps/admin/index.html']",
                "content-['home/project/apps/dashboard/index.html']",
                "content-['ignore-home.html']",
                "content-['ignore-project.html']",
                "content-['index.html']"
            ]
        );

        // Drop the .git folder
        fs::remove_dir_all(dir.join("home/project/apps/.git")).unwrap();

        // Initialize `home/project/apps` as a git repository and scan again
        _ = Command::new("git")
            .arg("init")
            .current_dir(dir.join("home/project/apps/web"))
            .output();

        let candidates = Scanner::new(sources.clone()).scan();

        assert_eq!(
            candidates,
            vec![
                "content-['home/project/apps/admin/index.html']",
                "content-['home/project/apps/dashboard/index.html']",
                "content-['ignore-apps.html']",
                "content-['ignore-home.html']",
                "content-['ignore-project.html']",
                "content-['index.html']",
            ]
        );
    }

    #[test]
    fn test_explicitly_ignore_explicitly_allowed_files() {
        // Create a temporary working directory
        let dir = tempdir().unwrap().into_path();

        // Create files
        create_files_in(
            &dir,
            &[
                ("src/keep-me.html", "content-['keep-me.html']"),
                ("src/ignore-me.html", "content-['ignore-me.html']"),
            ],
        );

        let sources = vec![
            public_source_entry_from_pattern(dir.clone(), "@source '**/*.html'"),
            public_source_entry_from_pattern(dir.clone(), "@source not 'src/ignore-me.html'"),
        ];

        let candidates = Scanner::new(sources.clone()).scan();

        assert_eq!(candidates, vec!["content-['keep-me.html']"]);
    }

    #[test]
    fn test_works_with_filenames_containing_glob_characters() {
        // Create a temporary working directory
        let dir = tempdir().unwrap().into_path();

        // Create files
        create_files_in(
            &dir,
            &[
                ("src/app/[foo]/ignore-me.html", "content-['ignore-me.html']"),
                ("src/app/[foo]/keep-me.html", "content-['keep-me.html']"),
            ],
        );

        let sources = vec![
            public_source_entry_from_pattern(dir.clone(), "@source '**/*'"),
            public_source_entry_from_pattern(
                dir.clone(),
                "@source not 'src/app/[foo]/ignore*.html'",
            ),
        ];

        let candidates = Scanner::new(sources.clone()).scan();

        assert_eq!(candidates, vec!["content-['keep-me.html']"]);
    }

    #[test]
    fn test_ignore_files_can_be_included_with_custom_source_rule() {
        // Create a temporary working directory
        let dir = tempdir().unwrap().into_path();

        // Create files
        create_files_in(
            &dir,
            &[("src/keep-me.html", "content-['src/keep-me.html']")],
        );

        let mut scanner = Scanner::new(vec![
            public_source_entry_from_pattern(dir.clone(), "@source '**/*.html'"),
            public_source_entry_from_pattern(
                dir.clone(),
                "@source not 'src/ignored-by-source-not.html'",
            ),
        ]);

        let candidates = scanner.scan();
        assert_eq!(candidates, vec!["content-['src/keep-me.html']"]);

        // Create new files that should definitely be ignored
        create_files_in(
            &dir,
            &[
                // Create new file that matches the `@source '…'` glob
                ("src/new-file.html", "content-['src/new-file.html']"),
                // Create new file that is ignored based on file extension
                (
                    "src/ignore-by-extension.bin",
                    "content-['src/ignore-by-extension.bin']",
                ),
                // Create a file that is ignored based on the `.gitignore` file
                (".gitignore", "src/ignored-by-gitignore.html"),
                (
                    "src/ignored-by-gitignore.html",
                    "content-['src/ignored-by-gitignore.html']",
                ),
                // Create a file that is ignored by the `@source not '…'`
                (
                    "src/ignored-by-source-not.html",
                    "content-['src/ignored-by-source-not.html']",
                ),
            ],
        );

        let candidates = scanner.scan();

        assert_eq!(
            candidates,
            vec![
                // Ignored by git ignore BUT included by `@source "**/*.html"`
                "content-['src/ignored-by-gitignore.html']",
                "content-['src/keep-me.html']",
                "content-['src/new-file.html']"
            ]
        );
    }

    #[test]
    fn test_allow_default_ignored_files() {
        // Create a temporary working directory
        let dir = tempdir().unwrap().into_path();

        // Create files
        create_files_in(&dir, &[("foo.styl", "content-['foo.styl']")]);

        let sources = vec![public_source_entry_from_pattern(
            dir.clone(),
            "@source '**/*'",
        )];

        let mut scanner = Scanner::new(sources.clone());

        let candidates = scanner.scan();
        assert!(candidates.is_empty());

        // Explicitly allow `.styl` files
        let mut scanner = Scanner::new(vec![
            public_source_entry_from_pattern(dir.clone(), "@source '**/*'"),
            public_source_entry_from_pattern(dir.clone(), "@source '*.styl'"),
        ]);

        let candidates = scanner.scan();
        assert_eq!(candidates, vec!["content-['foo.styl']"]);
    }

    #[test]
    fn test_allow_default_ignored_files_via_gitignore() {
        // Create a temporary working directory
        let dir = tempdir().unwrap().into_path();

        // Create files
        create_files_in(
            &dir,
            &[
                ("index.html", "content-['index.html']"),
                (".gitignore", "index.html"),
            ],
        );

        let mut scanner = Scanner::new(vec![public_source_entry_from_pattern(
            dir.clone(),
            "@source '**/*'",
        )]);

        let candidates = scanner.scan();
        assert!(candidates.is_empty());

        let mut scanner = Scanner::new(vec![
            public_source_entry_from_pattern(dir.clone(), "@source '**/*'"),
            public_source_entry_from_pattern(dir.clone(), "@source './*.html'"),
        ]);

        let candidates = scanner.scan();
        assert_eq!(candidates, vec!["content-['index.html']"]);
    }

    #[test]
    fn test_allow_explicit_node_modules_paths() {
        // Create a temporary working directory
        let dir = tempdir().unwrap().into_path();

        // Create files
        create_files_in(
            &dir,
            &[
                // Current project
                ("src/index.html", "content-['src/index.html']"),
                // Ignore file
                (".gitignore", "node_modules"),
                // Library ignored by default
                (
                    "node_modules/my-ui-lib/index.html",
                    "content-['node_modules/my-ui-lib/index.html']",
                ),
            ],
        );

        // Default auto source detection
        let sources = vec![public_source_entry_from_pattern(
            dir.clone(),
            "@source './'",
        )];

        let mut scanner = Scanner::new(sources.clone());

        let candidates = scanner.scan();
        assert_eq!(candidates, vec!["content-['src/index.html']"]);

        // Explicitly listing all `*.html` files, should not include `node_modules` because it's
        // ignored
        let sources = vec![public_source_entry_from_pattern(
            dir.clone(),
            "@source '**/*.html'",
        )];

        let mut scanner = Scanner::new(sources.clone());
        let candidates = scanner.scan();
        assert_eq!(candidates, vec!["content-['src/index.html']"]);

        // Explicitly listing all `*.html` files
        // Explicitly list the `node_modules/my-ui-lib`
        //
        let sources = vec![
            public_source_entry_from_pattern(dir.clone(), "@source '**/*.html'"),
            public_source_entry_from_pattern(dir.clone(), "@source 'node_modules/my-ui-lib'"),
        ];

        let mut scanner = Scanner::new(sources.clone());
        let candidates = scanner.scan();
        assert_eq!(
            candidates,
            vec![
                "content-['node_modules/my-ui-lib/index.html']",
                "content-['src/index.html']"
            ]
        );
    }

    #[test]
    fn test_ignore_node_modules_without_gitignore() {
        let ScanResult {
            candidates,
            files,
            globs,
            normalized_sources,
        } = scan_with_globs(
            &[
                (
                    "packages/web/index.html",
                    "content-['packages/web/index.html']",
                ),
                (
                    "node_modules/index.html",
                    "content-['node_modules/index.html']",
                ),
                (
                    "packages/web/node_modules/index.html",
                    "content-['packages/web/node_modules/index.html']",
                ),
            ],
            vec!["@source '**/*'"],
        );

        assert_eq!(candidates, vec!["content-['packages/web/index.html']"]);

        assert_eq!(files, vec!["packages/web/index.html",]);
        assert_eq!(globs, vec!["*", "packages/*/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}", "packages/web/*/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}"]);
        assert_eq!(normalized_sources, vec!["**/*"]);
    }

    #[test]
    fn test_ignore_gitignore_in_node_modules_source() {
        let ScanResult {
            candidates,
            files,
            globs,
            normalized_sources,
        } = scan_with_globs(
            &[
                (".gitignore", "node_modules\ndist"),
                (
                    "node_modules/my-ui-lib/dist/index.html",
                    "content-['node_modules/my-ui-lib/dist/index.html']",
                ),
                (
                    "node_modules/my-ui-lib/node.exe",
                    "content-['node_modules/my-ui-lib/node.exe']",
                ),
            ],
            vec!["@source 'node_modules/my-ui-lib'"],
        );

        assert_eq!(
            candidates,
            vec!["content-['node_modules/my-ui-lib/dist/index.html']"]
        );
        assert_eq!(files, vec!["node_modules/my-ui-lib/dist/index.html"]);
        assert_eq!(globs, vec!["node_modules/my-ui-lib/*", "node_modules/my-ui-lib/dist/**/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}"]);
        assert_eq!(normalized_sources, vec!["node_modules/my-ui-lib/**/*"]);
    }

    #[test]
    fn test_manually_scanning_files_should_follow_all_rules() {
        // Create a temporary working directory
        let dir = tempdir().unwrap().into_path();

        // Create files
        create_files_in(
            &dir,
            &[
                // Ignore all `.jsx` files, and all `generated` folders
                (".gitignore", "*.jsx\ngenerated/"),
                // .tsx files are allowed
                (
                    "src/components/button.tsx",
                    "content-['src/components/button.tsx']",
                ),
                // .jsx files are not allowed
                (
                    "src/components/button.jsx",
                    "content-['src/components/button.jsx']",
                ),
            ],
        );

        let mut scanner = Scanner::new(vec![public_source_entry_from_pattern(
            dir.clone(),
            "@source '**/*'",
        )]);

        let candidates = scanner.scan();
        assert_eq!(candidates, vec!["content-['src/components/button.tsx']"]);

        // Create 2 new files, one "good" and one "bad" file, and manually scan them. This should
        // only return the "good" file because the "bad" one is ignored by a `.gitignore` file.
        create_files_in(
            &dir,
            &[
                (
                    "src/components/good.tsx",
                    "content-['src/components/good.tsx']",
                ),
                (
                    "src/components/bad.jsx",
                    "content-['src/components/bad.jsx']",
                ),
            ],
        );

        let candidates = scanner.scan_content(vec![
            ChangedContent::File(dir.join("src/components/good.tsx"), "tsx".to_owned()),
            ChangedContent::File(dir.join("src/components/bad.jsx"), "jsx".to_owned()),
        ]);

        assert_eq!(candidates, vec!["content-['src/components/good.tsx']"]);

        // Create a generated file in a nested folder that is ignored by a `.gitignore` file higher
        // up the tree.
        create_files_in(
            &dir,
            &[
                (
                    "src/components/generated/bad.tsx",
                    "content-['src/components/generated/bad.tsx']",
                ),
                (
                    "src/components/generated/bad.jsx",
                    "content-['src/components/generated/bad.jsx']",
                ),
            ],
        );

        let candidates = scanner.scan_content(vec![
            ChangedContent::File(
                dir.join("src/components/generated/bad.tsx"),
                "tsx".to_owned(),
            ),
            ChangedContent::File(
                dir.join("src/components/generated/bad.jsx"),
                "jsx".to_owned(),
            ),
        ]);

        assert!(candidates.is_empty());
    }

    #[test]
    fn test_works_with_utf8_special_character_paths() {
        let ScanResult {
            candidates,
            files,
            globs,
            normalized_sources,
        } = scan_with_globs(
            &[
                ("src/💩.js", "content-['src/💩.js']"),
                ("src/🤦‍♂️.tsx", "content-['src/🤦‍♂️.tsx']"),
                ("src/🤦‍♂️/foo.tsx", "content-['src/🤦‍♂️/foo.tsx']"),
            ],
            vec!["@source '**/*'", "@source not 'src/🤦‍♂️'"],
        );

        assert_eq!(
            candidates,
            vec!["content-['src/💩.js']", "content-['src/🤦‍♂️.tsx']"]
        );

        assert_eq!(files, vec!["src/💩.js", "src/🤦‍♂️.tsx"]);
        assert_eq!(globs, vec!["*", "src/*/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}"]);
        assert_eq!(normalized_sources, vec!["**/*"]);
    }

    #[test]
    fn test_glob_with_symlinks() {
        let dir = tempdir().unwrap().into_path();
        create_files_in(
            &dir,
            &[
                (".gitignore", "node_modules\ndist"),
                (
                    "node_modules/.pnpm/@org+my-ui-library/dist/index.ts",
                    "content-['node_modules/.pnpm/@org+my-ui-library/dist/index.ts']",
                ),
                // Make sure the `@org` does exist
                ("node_modules/@org/.gitkeep", ""),
            ],
        );
        let _ = symlink(
            dir.join("node_modules/.pnpm/@org+my-ui-library"),
            dir.join("node_modules/@org/my-ui-library"),
        );

        let mut scanner = Scanner::new(vec![public_source_entry_from_pattern(
            dir.clone(),
            "@source 'node_modules'",
        )]);
        let candidates = scanner.scan();

        assert_eq!(
            candidates,
            vec!["content-['node_modules/.pnpm/@org+my-ui-library/dist/index.ts']"]
        );

        let mut scanner = Scanner::new(vec![public_source_entry_from_pattern(
            dir.clone(),
            "@source 'node_modules/@org/my-ui-library'",
        )]);
        let candidates = scanner.scan();

        assert_eq!(
            candidates,
            vec!["content-['node_modules/.pnpm/@org+my-ui-library/dist/index.ts']"]
        );

        let mut scanner = Scanner::new(vec![public_source_entry_from_pattern(
            dir.clone(),
            "@source 'node_modules/@org'",
        )]);
        let candidates = scanner.scan();

        assert_eq!(
            candidates,
            vec!["content-['node_modules/.pnpm/@org+my-ui-library/dist/index.ts']"]
        );
    }

    #[test]
    fn test_globs_with_recursive_symlinks() {
        let dir = tempdir().unwrap().into_path();
        create_files_in(
            &dir,
            &[
                ("b/index.html", "content-['b/index.html']"),
                ("z/index.html", "content-['z/index.html']"),
            ],
        );

        // Create recursive symlinks
        let _ = symlink(dir.join("a"), dir.join("b"));
        let _ = symlink(dir.join("b/c"), dir.join("c"));
        let _ = symlink(dir.join("b/root"), &dir);
        let _ = symlink(dir.join("c"), dir.join("a"));

        let mut scanner = Scanner::new(vec![public_source_entry_from_pattern(
            dir.clone(),
            "@source '.'",
        )]);
        let candidates = scanner.scan();

        assert_eq!(
            candidates,
            vec!["content-['b/index.html']", "content-['z/index.html']"]
        );
    }

    #[test]
    fn test_partial_globs_with_symlinks() {
        let dir = tempdir().unwrap().into_path();
        create_files_in(&dir, &[("abcd/xyz.html", "content-['abcd/xyz.html']")]);
        let _ = symlink(dir.join("abcd"), dir.join("efgh"));

        // No sources should find nothing
        let mut scanner = Scanner::new(vec![]);
        let candidates = scanner.scan();
        assert!(candidates.is_empty());

        // Full symlinked folder name, should find the file
        let mut scanner = Scanner::new(vec![public_source_entry_from_pattern(
            dir.clone(),
            "@source 'efgh/*.html'",
        )]);
        let candidates = scanner.scan();

        assert_eq!(candidates, vec!["content-['abcd/xyz.html']"]);

        // Partially referencing the symlinked folder with a glob, should find the file
        let mut scanner = Scanner::new(vec![public_source_entry_from_pattern(
            dir.clone(),
            "@source 'ef*/*.html'",
        )]);
        let candidates = scanner.scan();

        assert_eq!(candidates, vec!["content-['abcd/xyz.html']"]);
    }

    #[test]
    fn test_extract_used_css_variables_from_css() {
        let dir = tempdir().unwrap().into_path();
        create_files_in(
            &dir,
            &[
                (
                    "src/index.css",
                    r#"
                        @theme {
                            --color-red: #ff0000; /* Not used, so don't extract */
                            --color-green: #00ff00; /* Not used, so don't extract */
                        }

                        .button {
                            color: var(--color-red); /* Used, so extract */
                        }
                    "#,
                ),
                ("src/used-at-start.css", "var(--color-used-at-start)"),
                // Here to verify that we don't crash when trying to find `var(` in front of the
                // variable.
                ("src/defined-at-start.css", "--color-defined-at-start: red;"),
            ],
        );

        let mut scanner = Scanner::new(vec![public_source_entry_from_pattern(
            dir.clone(),
            "@source './'",
        )]);
        let candidates = scanner.scan();

        assert_eq!(candidates, vec!["--color-red", "--color-used-at-start"]);
    }
}
