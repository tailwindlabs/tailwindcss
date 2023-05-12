#[cfg(test)]
mod auto_content {
    use std::fs;
    use std::process::Command;

    use tailwindcss_core::*;
    use tempfile::tempdir;

    fn test(paths_with_content: &[(&str, Option<&str>)]) -> Vec<String> {
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
        let mut paths: Vec<_> = resolve_content_paths(ContentPathInfo { base: base.clone() })
            .into_iter()
            .map(|x| x.replace(&format!("{}/", &base), ""))
            .collect();

        // Sort the output for easier comparison (depending on internal datastructure the order
        // _could_ be random)
        paths.sort();

        paths
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
        assert_eq!(globs, vec!["index.html", "src/**/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}"]);
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
                // Listed explicitly because they are in the root
                "bar.html",
                "baz.html",
                "foo.html",

                // Listed using a deep glob, because nothing inside is ignored
                "nested-a/**/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",

                // Listed using a deep glob, because nothing inside is ignored (but contains deeply
                // nested folders)
                "nested-b/**/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",

                // Listed using a shallow glob, because `nested-c` contains ignored folders, deeply
                // nested globs can't be used anymore
                "nested-c/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",

                // Deeply nested folder can use a deep glob again
                "nested-c/sibling-folder/**/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",

                // The deeply nested folder can use a deep glob, however all of its parents can
                // only contain a shallow glob because of the ignored folder
                "nested-d/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",
                "nested-d/very/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",
                "nested-d/very/deeply/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",
                "nested-d/very/deeply/nested/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",
                "nested-d/very/deeply/nested/directory/**/*.{py,tpl,js,vue,php,mjs,cts,jsx,tsx,rhtml,slim,handlebars,twig,rs,njk,svelte,liquid,pug,md,ts,heex,mts,astro,nunjucks,rb,eex,haml,cjs,html,hbs,jade,aspx,razor,erb,mustache,mdx}",
            ]
        );
    }
}
