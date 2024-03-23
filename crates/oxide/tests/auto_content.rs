#[cfg(test)]
mod auto_content {
    use std::fs;
    use std::process::Command;

    use tailwindcss_oxide::*;
    use tempfile::tempdir;

    fn scan(paths_with_content: &[(&str, Option<&str>)]) -> (Vec<String>, Vec<String>) {
        // Create a temporary working directory
        let dir = tempdir().unwrap().into_path();

        // Initialize this directory as a git repository
        let _ = Command::new("git").arg("init").current_dir(&dir).output();

        // Create the necessary files
        for (path, contents) in paths_with_content {
            let path = dir.join(path);
            let parent = path.parent().unwrap();
            if !parent.exists() {
                fs::create_dir_all(parent).unwrap();
            }

            match contents {
                Some(contents) => fs::write(path, contents).unwrap(),
                None => fs::write(path, "").unwrap(),
            }
        }

        let base = format!("{}", dir.display());

        // Resolve all content paths for the (temporary) current working directory
        let result = scan_dir(ScanOptions {
            base: base.clone(),
            globs: true,
        });

        let mut paths: Vec<_> = result
            .files
            .into_iter()
            .map(|x| x.replace(&format!("{}/", &base), ""))
            .collect();

        for glob in result.globs {
            paths.push(format!("{}/{}", glob.base, glob.glob));
        }

        paths = paths
            .into_iter()
            .map(|x| {
                let parent_dir = format!("{}/", &base.to_string());
                x.replace(&parent_dir, "")
            })
            .collect();

        // Sort the output for easier comparison (depending on internal datastructure the order
        // _could_ be random)
        paths.sort();

        (paths, result.candidates)
    }

    fn test(paths_with_content: &[(&str, Option<&str>)]) -> Vec<String> {
        scan(paths_with_content).0
    }

    #[test]
    fn it_should_work_with_a_set_of_root_files() {
        let globs = test(&[
            ("index.html", None),
            ("a.html", None),
            ("b.html", None),
            ("c.html", None),
        ]);
        assert_eq!(globs, vec!["a.html", "b.html", "c.html", "index.html"]);
    }

    #[test]
    fn it_should_work_with_a_set_of_root_files_and_ignore_ignored_files() {
        let globs = test(&[
            (".gitignore", Some("b.html")),
            ("index.html", None),
            ("a.html", None),
            ("b.html", None),
            ("c.html", None),
        ]);
        assert_eq!(globs, vec!["a.html", "c.html", "index.html"]);
    }

    #[test]
    fn it_should_list_all_files_in_the_public_folder_explicitly() {
        let globs = test(&[
            ("index.html", None),
            ("public/a.html", None),
            ("public/b.html", None),
            ("public/c.html", None),
        ]);
        assert_eq!(
            globs,
            vec![
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
            ("index.html", None),
            ("public/a.html", None),
            ("public/b.html", None),
            ("public/c.html", None),
            ("public/nested/a.html", None),
            ("public/nested/b.html", None),
            ("public/nested/c.html", None),
            ("public/nested/again/a.html", None),
            ("public/very/deeply/nested/a.html", None),
        ]);
        assert_eq!(
            globs,
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
    }

    #[test]
    fn it_should_list_all_files_in_the_public_folder_explicitly_except_ignored_files() {
        let globs = test(&[
            (".gitignore", Some("public/b.html\na.html")),
            ("index.html", None),
            ("public/a.html", None),
            ("public/b.html", None),
            ("public/c.html", None),
        ]);
        assert_eq!(globs, vec!["index.html", "public/c.html",]);
    }

    #[test]
    fn it_should_use_a_glob_for_top_level_folders() {
        let globs = test(&[
            ("index.html", None),
            ("src/a.html", None),
            ("src/b.html", None),
            ("src/c.html", None),
        ]);
        assert_eq!(globs, vec![
            "index.html",
            "src/**/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",
            "src/a.html",
            "src/b.html",
            "src/c.html"
        ]);
    }

    #[test]
    fn it_should_ignore_binary_files() {
        let globs = test(&[
            ("index.html", None),
            ("a.mp4", None),
            ("b.png", None),
            ("c.lock", None),
        ]);
        assert_eq!(globs, vec!["index.html"]);
    }

    #[test]
    fn it_should_ignore_known_extensions() {
        let globs = test(&[
            ("index.html", None),
            ("a.css", None),
            ("b.sass", None),
            ("c.less", None),
        ]);
        assert_eq!(globs, vec!["index.html"]);
    }

    #[test]
    fn it_should_ignore_known_files() {
        let globs = test(&[
            ("index.html", None),
            ("package-lock.json", None),
            ("yarn.lock", None),
        ]);
        assert_eq!(globs, vec!["index.html"]);
    }

    #[test]
    fn it_should_ignore_and_expand_nested_ignored_folders() {
        let globs = test(&[
            // Explicitly listed root files
            ("foo.html", None),
            ("bar.html", None),
            ("baz.html", None),
            // Nested folder A, using glob
            ("nested-a/foo.html", None),
            ("nested-a/bar.html", None),
            ("nested-a/baz.html", None),
            // Nested folder B, with deeply nested files, using glob
            ("nested-b/deeply-nested/foo.html", None),
            ("nested-b/deeply-nested/bar.html", None),
            ("nested-b/deeply-nested/baz.html", None),
            // Nested folder C, with ignored sub-folder
            ("nested-c/foo.html", None),
            ("nested-c/bar.html", None),
            ("nested-c/baz.html", None),
            //   Ignored folder
            ("nested-c/.gitignore", Some("ignored-folder/")),
            ("nested-c/ignored-folder/foo.html", None),
            ("nested-c/ignored-folder/bar.html", None),
            ("nested-c/ignored-folder/baz.html", None),
            //   Deeply nested, without issues
            ("nested-c/sibling-folder/foo.html", None),
            ("nested-c/sibling-folder/bar.html", None),
            ("nested-c/sibling-folder/baz.html", None),
            // Nested folder D, with deeply nested ignored folder
            ("nested-d/foo.html", None),
            ("nested-d/bar.html", None),
            ("nested-d/baz.html", None),
            ("nested-d/.gitignore", Some("deep/")),
            ("nested-d/very/deeply/nested/deep/foo.html", None),
            ("nested-d/very/deeply/nested/deep/bar.html", None),
            ("nested-d/very/deeply/nested/deep/baz.html", None),
            ("nested-d/very/deeply/nested/foo.html", None),
            ("nested-d/very/deeply/nested/bar.html", None),
            ("nested-d/very/deeply/nested/baz.html", None),
            ("nested-d/very/deeply/nested/directory/foo.html", None),
            ("nested-d/very/deeply/nested/directory/bar.html", None),
            ("nested-d/very/deeply/nested/directory/baz.html", None),
            ("nested-d/very/deeply/nested/directory/again/foo.html", None),
        ]);

        assert_eq!(
            globs,
            vec![
                "bar.html",
                "baz.html",
                "foo.html",
                "nested-a/**/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",
                "nested-a/bar.html",
                "nested-a/baz.html",
                "nested-a/foo.html",
                "nested-b/**/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",
                "nested-b/deeply-nested/bar.html",
                "nested-b/deeply-nested/baz.html",
                "nested-b/deeply-nested/foo.html",
                "nested-c/*/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",
                "nested-c/bar.html",
                "nested-c/baz.html",
                "nested-c/foo.html",
                "nested-c/sibling-folder/**/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",
                "nested-c/sibling-folder/bar.html",
                "nested-c/sibling-folder/baz.html",
                "nested-c/sibling-folder/foo.html",
                "nested-d/*/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",
                "nested-d/bar.html",
                "nested-d/baz.html",
                "nested-d/foo.html",
                "nested-d/very/*/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",
                "nested-d/very/deeply/*/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",
                "nested-d/very/deeply/nested/*/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",
                "nested-d/very/deeply/nested/bar.html",
                "nested-d/very/deeply/nested/baz.html",
                "nested-d/very/deeply/nested/directory/**/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",
                "nested-d/very/deeply/nested/directory/again/foo.html",
                "nested-d/very/deeply/nested/directory/bar.html",
                "nested-d/very/deeply/nested/directory/baz.html",
                "nested-d/very/deeply/nested/directory/foo.html",
                "nested-d/very/deeply/nested/foo.html"
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
            (".gitignore", Some(&ignores)),
            // A file that should definitely be scanned
            ("index.html", Some("font-bold md:flex")),
            // A file that should definitely not be scanned
            ("foo.jpg", Some("xl:font-bold")),
            // A file that is ignored
            ("foo.html", Some("lg:font-bold")),
            // A svelte file with `class:foo="bar"` syntax
            ("index.svelte", Some("<div class:px-4='condition'></div>")),
        ])
        .1;

        assert_eq!(
            candidates,
            vec!["condition", "div", "font-bold", "md:flex", "px-4"]
        );
    }
}
