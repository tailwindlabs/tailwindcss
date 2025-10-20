use ignore::gitignore::GitignoreBuilder;

const IGNORE_FILE: &'static str = "tests/gitignore_skip_bom.gitignore";

/// Skip a Byte-Order Mark (BOM) at the beginning of the file, matching Git's
/// behavior.
///
/// Ref: <https://github.com/BurntSushi/ripgrep/issues/2177>
#[test]
fn gitignore_skip_bom() {
    let mut builder = GitignoreBuilder::new("ROOT");
    let error = builder.add(IGNORE_FILE);
    assert!(error.is_none(), "failed to open gitignore file");
    let g = builder.build().unwrap();

    assert!(g.matched("ignore/this/path", false).is_ignore());
}
