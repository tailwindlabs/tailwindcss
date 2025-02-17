#[cfg(test)]
mod scanner {
    use std::process::Command;
    use std::thread::sleep;
    use std::time::Duration;
    use std::{fs, path};

    use tailwindcss_oxide::*;
    use tempfile::tempdir;

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
        globs: Vec<&str>,
    ) -> (Vec<String>, Vec<String>) {
        // Create a temporary working directory
        let dir = tempdir().unwrap().into_path();

        // Initialize this directory as a git repository
        let _ = Command::new("git").arg("init").current_dir(&dir).output();

        // Create the necessary files
        self::create_files_in(&dir, paths_with_content);

        let base = format!("{}", dir.display()).replace('\\', "/");

        // Resolve all content paths for the (temporary) current working directory
        let mut sources: Vec<GlobEntry> = globs
            .iter()
            .map(|x| GlobEntry {
                base: base.clone(),
                pattern: x.to_string(),
            })
            .collect();

        sources.push(GlobEntry {
            base: base.clone(),
            pattern: "**/*".to_string(),
        });

        let mut scanner = Scanner::new(Some(sources));

        let candidates = scanner.scan();

        let mut paths: Vec<_> = scanner.get_files();

        for glob in scanner.get_globs() {
            paths.push(format!("{}{}{}", glob.base, "/", glob.pattern));
        }

        let parent_dir =
            format!("{}{}", dunce::canonicalize(&base).unwrap().display(), "/").replace('\\', "/");

        paths = paths
            .into_iter()
            .map(|x| {
                // Normalize paths to use unix style separators
                x.replace('\\', "/").replace(&parent_dir, "")
            })
            .collect();

        // Sort the output for easier comparison (depending on internal data structure the order
        // _could_ be random)
        paths.sort();

        (paths, candidates)
    }

    fn scan(paths_with_content: &[(&str, &str)]) -> (Vec<String>, Vec<String>) {
        scan_with_globs(paths_with_content, vec![])
    }

    fn test(paths_with_content: &[(&str, &str)]) -> Vec<String> {
        scan(paths_with_content).0
    }

    #[test]
    fn it_should_work_with_a_set_of_root_files() {
        let globs = test(&[
            ("index.html", ""),
            ("a.html", ""),
            ("b.html", ""),
            ("c.html", ""),
        ]);
        assert_eq!(globs, vec!["*", "a.html", "b.html", "c.html", "index.html"]);
    }

    #[test]
    fn it_should_work_with_a_set_of_root_files_and_ignore_ignored_files() {
        let globs = test(&[
            (".gitignore", "b.html"),
            ("index.html", ""),
            ("a.html", ""),
            ("b.html", ""),
            ("c.html", ""),
        ]);
        assert_eq!(globs, vec!["*", "a.html", "c.html", "index.html"]);
    }

    #[test]
    fn it_should_list_all_files_in_the_public_folder_explicitly() {
        let globs = test(&[
            ("index.html", ""),
            ("public/a.html", ""),
            ("public/b.html", ""),
            ("public/c.html", ""),
        ]);
        assert_eq!(
            globs,
            vec![
                "*",
                "index.html",
                "public/a.html",
                "public/b.html",
                "public/c.html",
            ]
        );
    }

    #[test]
    fn it_should_list_nested_folders_explicitly_in_the_public_folder() {
        let globs = test(&[
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
            globs,
            vec![
                "*",
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
    }

    #[test]
    fn it_should_list_all_files_in_the_public_folder_explicitly_except_ignored_files() {
        let globs = test(&[
            (".gitignore", "public/b.html\na.html"),
            ("index.html", ""),
            ("public/a.html", ""),
            ("public/b.html", ""),
            ("public/c.html", ""),
        ]);
        assert_eq!(globs, vec!["*", "index.html", "public/c.html",]);
    }

    #[test]
    fn it_should_use_a_glob_for_top_level_folders() {
        let globs = test(&[
            ("index.html", ""),
            ("src/a.html", ""),
            ("src/b.html", ""),
            ("src/c.html", ""),
        ]);
        assert_eq!(globs, vec!["*",
            "index.html",
            "src/**/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
            "src/a.html",
            "src/b.html",
            "src/c.html"
        ]);
    }

    #[test]
    fn it_should_ignore_binary_files() {
        let globs = test(&[
            ("index.html", ""),
            ("a.mp4", ""),
            ("b.png", ""),
            ("c.lock", ""),
        ]);
        assert_eq!(globs, vec!["*", "index.html"]);
    }

    #[test]
    fn it_should_ignore_known_extensions() {
        let globs = test(&[
            ("index.html", ""),
            ("a.css", ""),
            ("b.sass", ""),
            ("c.less", ""),
        ]);
        assert_eq!(globs, vec!["*", "index.html"]);
    }

    #[test]
    fn it_should_ignore_known_files() {
        let globs = test(&[
            ("index.html", ""),
            ("package-lock.json", ""),
            ("yarn.lock", ""),
        ]);
        assert_eq!(globs, vec!["*", "index.html"]);
    }

    #[test]
    fn it_should_ignore_and_expand_nested_ignored_folders() {
        let globs = test(&[
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
            globs,
            vec![
                "*",
                "bar.html",
                "baz.html",
                "foo.html",
                "nested-a/**/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
                "nested-a/bar.html",
                "nested-a/baz.html",
                "nested-a/foo.html",
                "nested-b/**/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
                "nested-b/deeply-nested/bar.html",
                "nested-b/deeply-nested/baz.html",
                "nested-b/deeply-nested/foo.html",
                "nested-c/*/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
                "nested-c/bar.html",
                "nested-c/baz.html",
                "nested-c/foo.html",
                "nested-c/sibling-folder/**/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
                "nested-c/sibling-folder/bar.html",
                "nested-c/sibling-folder/baz.html",
                "nested-c/sibling-folder/foo.html",
                "nested-d/*/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
                "nested-d/bar.html",
                "nested-d/baz.html",
                "nested-d/foo.html",
                "nested-d/very/*/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
                "nested-d/very/deeply/*/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
                "nested-d/very/deeply/nested/*/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
                "nested-d/very/deeply/nested/bar.html",
                "nested-d/very/deeply/nested/baz.html",
                "nested-d/very/deeply/nested/directory/**/*.{aspx,astro,cjs,cts,eex,erb,gjs,gts,haml,handlebars,hbs,heex,html,jade,js,jsx,liquid,md,mdx,mjs,mts,mustache,njk,nunjucks,php,pug,py,razor,rb,rhtml,rs,slim,svelte,tpl,ts,tsx,twig,vue}",
                "nested-d/very/deeply/nested/directory/again/foo.html",
                "nested-d/very/deeply/nested/directory/bar.html",
                "nested-d/very/deeply/nested/directory/baz.html",
                "nested-d/very/deeply/nested/directory/foo.html",
                "nested-d/very/deeply/nested/foo.html",
            ]
        );
    }

    #[test]
    fn it_should_scan_for_utilities() {
        let mut ignores = String::new();
        ignores.push_str("# md:font-bold\n");
        ignores.push_str("foo.html\n");

        let candidates = scan(&[
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
        ])
        .1;

        assert_eq!(
            candidates,
            vec![
                "bool",
                "condition",
                "div",
                "font-bold",
                "md:flex",
                "px-4",
                "px-5",
                "px-6",
                "px-7",
                "underline"
            ]
        );
    }

    #[test]
    fn it_should_be_possible_to_scan_in_the_parent_directory() {
        let candidates = scan_with_globs(
            &[("foo/bar/baz/foo.html", "content-['foo.html']")],
            vec!["./foo/bar/baz/.."],
        )
        .1;

        assert_eq!(candidates, vec!["content-['foo.html']"]);
    }

    #[test]
    fn it_should_scan_files_without_extensions() {
        // These look like folders, but they are files
        let candidates =
            scan_with_globs(&[("my-file", "content-['my-file']")], vec!["./my-file"]).1;

        assert_eq!(candidates, vec!["content-['my-file']"]);
    }

    #[test]
    fn it_should_scan_folders_with_extensions() {
        // These look like files, but they are folders
        let candidates = scan_with_globs(
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
            vec!["./my-folder.templates", "./my-folder.bin"],
        )
        .1;

        assert_eq!(
            candidates,
            vec![
                "content-['my-folder.bin/foo.html']",
                "content-['my-folder.templates/foo.html']",
            ]
        );
    }

    #[test]
    fn it_should_scan_content_paths() {
        let candidates = scan_with_globs(
            &[
                // We know that `.styl` extensions are ignored, so they are not covered by auto content
                // detection.
                ("foo.styl", "content-['foo.styl']"),
            ],
            vec!["*.styl"],
        )
        .1;

        assert_eq!(candidates, vec!["content-['foo.styl']"]);
    }

    #[test]
    fn it_should_scan_next_dynamic_folders() {
        let candidates = scan_with_globs(
            &[
                // We know that `.styl` extensions are ignored, so they are not covered by auto content
                // detection.
                ("app/[slug]/page.styl", "content-['[slug]']"),
                ("app/[...slug]/page.styl", "content-['[...slug]']"),
                ("app/[[...slug]]/page.styl", "content-['[[...slug]]']"),
                ("app/(theme)/page.styl", "content-['(theme)']"),
            ],
            vec!["./**/*.{styl}"],
        )
        .1;

        assert_eq!(
            candidates,
            vec![
                "content-['(theme)']",
                "content-['[...slug]']",
                "content-['[[...slug]]']",
                "content-['[slug]']",
            ],
        );
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

        let sources = vec![GlobEntry {
            base: full_path.clone(),
            pattern: full_path.clone(),
        }];

        let mut scanner = Scanner::new(Some(sources));
        let candidates = scanner.scan();

        // We've done the initial scan and found the files
        assert_eq!(
            candidates,
            vec![
                "content-['project-a/index.html']".to_owned(),
                "content-['project-b/index.html']".to_owned(),
            ]
        );
    }

    #[test]
    fn it_should_scan_content_paths_even_when_they_are_git_ignored() {
        let candidates = scan_with_globs(
            &[
                (".gitignore", "foo.styl"),
                // We know that `.styl` extensions are ignored, so they are not covered by auto content
                // detection.
                ("foo.styl", "content-['foo.styl']"),
            ],
            vec!["foo.styl"],
        )
        .1;

        assert_eq!(candidates, vec!["content-['foo.styl']"]);
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
            GlobEntry {
                base: dir.join("project-a").to_string_lossy().to_string(),
                pattern: "**/*".to_owned(),
            },
            GlobEntry {
                base: dir.join("project-b").to_string_lossy().to_string(),
                pattern: "**/*".to_owned(),
            },
        ];

        let mut scanner = Scanner::new(Some(sources));
        let candidates = scanner.scan();

        // We've done the initial scan and found the files
        assert_eq!(
            candidates,
            vec![
                "content-['project-a/index.html']".to_owned(),
                "content-['project-b/index.html']".to_owned(),
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
                "content-['project-a/index.html']".to_owned(),
                "content-['project-a/new.html']".to_owned(),
                "content-['project-b/index.html']".to_owned(),
                "content-['project-b/new.html']".to_owned(),
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
                "content-['project-a/index.html']".to_owned(),
                "content-['project-a/new.html']".to_owned(),
                "content-['project-a/sub1/sub2/index.html']".to_owned(),
                "content-['project-b/index.html']".to_owned(),
                "content-['project-b/new.html']".to_owned(),
                "content-['project-b/sub1/sub2/index.html']".to_owned(),
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
                "content-['project-a/index.html']".to_owned(),
                "content-['project-a/new.html']".to_owned(),
                "content-['project-a/sub1/sub2/index.html']".to_owned(),
                "content-['project-a/sub1/sub2/new.html']".to_owned(),
                "content-['project-b/index.html']".to_owned(),
                "content-['project-b/new.html']".to_owned(),
                "content-['project-b/sub1/sub2/index.html']".to_owned(),
                "content-['project-b/sub1/sub2/new.html']".to_owned(),
            ]
        );
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
            ],
        );

        let sources = vec![GlobEntry {
            base: dir
                .join("home/project/apps/web")
                .to_string_lossy()
                .to_string(),
            pattern: "**/*".to_owned(),
        }];

        let candidates = Scanner::new(Some(sources.clone())).scan();

        // All ignore files are applied because there's no git repo
        assert_eq!(candidates, vec!["content-['index.html']".to_owned(),]);

        // Initialize `home` as a git repository and scan again
        // The results should be the same as before
        _ = Command::new("git")
            .arg("init")
            .current_dir(dir.join("home"))
            .output();
        let candidates = Scanner::new(Some(sources.clone())).scan();

        assert_eq!(candidates, vec!["content-['index.html']".to_owned(),]);

        // Drop the .git folder
        fs::remove_dir_all(dir.join("home/.git")).unwrap();

        // Initialize `home/project` as a git repository and scan again
        _ = Command::new("git")
            .arg("init")
            .current_dir(dir.join("home/project"))
            .output();
        let candidates = Scanner::new(Some(sources.clone())).scan();

        assert_eq!(
            candidates,
            vec![
                "content-['ignore-home.html']".to_owned(),
                "content-['index.html']".to_owned(),
            ]
        );

        // Drop the .git folder
        fs::remove_dir_all(dir.join("home/project/.git")).unwrap();

        // Initialize `home/project/apps` as a git repository and scan again
        _ = Command::new("git")
            .arg("init")
            .current_dir(dir.join("home/project/apps"))
            .output();
        let candidates = Scanner::new(Some(sources.clone())).scan();

        assert_eq!(
            candidates,
            vec![
                "content-['ignore-home.html']".to_owned(),
                "content-['ignore-project.html']".to_owned(),
                "content-['index.html']".to_owned(),
            ]
        );

        // Drop the .git folder
        fs::remove_dir_all(dir.join("home/project/apps/.git")).unwrap();

        // Initialize `home/project/apps` as a git repository and scan again
        _ = Command::new("git")
            .arg("init")
            .current_dir(dir.join("home/project/apps/web"))
            .output();
        let candidates = Scanner::new(Some(sources.clone())).scan();

        assert_eq!(
            candidates,
            vec![
                "content-['ignore-apps.html']".to_owned(),
                "content-['ignore-home.html']".to_owned(),
                "content-['ignore-project.html']".to_owned(),
                "content-['index.html']".to_owned(),
            ]
        );
    }
}
