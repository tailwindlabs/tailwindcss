use std::{
    collections::HashMap,
    path::{Path, PathBuf},
    sync::OnceLock,
};

use crate::{
    Error, Match, PartialErrorBuilder, dir::Ignore, pathutil::is_hidden_path,
};

/// A cached matcher for checking paths against hierarchical ignore files.
///
/// An `IncrementalIgnore` is built from a [`crate::WalkBuilder`]. Unlike a
/// recursive walk, it can check individual paths while still respecting the
/// ignore files in every relevant parent directory. Matchers for directories
/// are compiled on first use and then retained for later queries.
/// Each matcher corresponds to exactly one root configured on the builder,
/// and paths passed to it are interpreted relative to that root.
/// A matcher for the special `-` root representing standard input is inert
/// and always returns a non-match.
///
/// The matcher checks path-based filters in the same precedence order as
/// a traversal. This includes glob overrides, `.ignore`, `.gitignore`,
/// `.git/info/exclude`, global and explicitly added ignore files, custom
/// ignore file names and file type selections. It does not apply filters that
/// require a directory entry or other traversal state, such as custom entry
/// predicates. Hidden-file detection, minimum and maximum depth limits and the
/// maximum file size are applied.
///
/// A matcher is a snapshot at directory granularity. Once the ignore files in
/// a directory have been loaded, edits to those files are not observed. Build
/// a new matcher to reload them.
///
/// # Warning
///
/// The incremental path checking here necessarily needs to do a lot more work
/// per path matched. Callers should _not_ use this to run directory traversal.
/// This is intended to avoid the work of re-traversing an entire directory
/// tree when only a few changes are detected. (For example, in response to
/// file additions or deletions.)
///
/// # Example
///
/// ```rust,no_run
/// use ignore::WalkBuilder;
///
/// let mut builder = WalkBuilder::new(".");
/// builder.add_custom_ignore_filename(".rgignore");
/// let mut matchers = builder.build_matchers();
/// let matcher = &mut matchers[0];
///
/// if matcher.matched("src/generated.rs", false).is_ignore() {
///     println!("ignored");
/// }
/// ```
#[derive(Clone, Debug)]
pub struct IncrementalIgnore {
    /// The root exactly as it was given to `WalkBuilder`.
    root: PathBuf,
    /// The normalized root used only by the opt-in normalization routine.
    normalized_root: OnceLock<Option<PathBuf>>,
    /// The matcher for the configured root directory, loaded on first use.
    ignore: RootIgnore,
    /// Directory paths relative to `root`, excluding the root itself.
    dirs: HashMap<PathBuf, CachedDir>,
    /// Options for additional filtering beyond gitignore.
    options: IncrementalIgnoreOptions,
}

/// The options for a matcher, mostly meant to duplicate as much as we can from
/// `WalkParallel`.
#[derive(Clone, Debug)]
pub(crate) struct IncrementalIgnoreOptions {
    pub(crate) min_depth: Option<usize>,
    pub(crate) max_depth: Option<usize>,
    pub(crate) max_filesize: Option<u64>,
    pub(crate) hidden: bool,
    pub(crate) follow_links: bool,
}

#[derive(Clone, Debug)]
enum RootIgnore {
    Unloaded(Ignore),
    Loaded(Ignore),
    NotDirectory,
    Stdin,
}

/// Cached traversal state for a directory relative to the configured root.
///
/// The presence of an entry means that the directory and every ancestor
/// between it and the root have already been checked.
#[derive(Clone, Debug)]
enum CachedDir {
    /// The directory may be descended into. The matcher includes the ignore
    /// rules loaded through this directory and is therefore the matcher to use
    /// for its children.
    Allowed(Ignore),
    /// The directory may not be descended into because it was ignored by a
    /// path rule or hidden-file filtering. Every descendant is consequently
    /// ignored, and ignore files inside this directory are not loaded.
    Ignored,
}

impl IncrementalIgnore {
    pub(crate) fn new(
        root: PathBuf,
        ignore: Ignore,
        options: IncrementalIgnoreOptions,
    ) -> IncrementalIgnore {
        // File traversal special cases `-` to search stdin, so we recognize
        // it here for completeness too. In particular, we really want
        // `WalkBuilder::build_matchers` to return a matcher for every root,
        // even when it's a simple file (handled automatically) or when it's
        // stdin (necessarily special cased).
        //
        // If callers need to search a file or directory named `-`, then they
        // can use `./-`. As is the case for file traversal too.
        let ignore = if root == Path::new("-") {
            RootIgnore::Stdin
        } else {
            RootIgnore::Unloaded(ignore)
        };
        IncrementalIgnore {
            root,
            normalized_root: OnceLock::new(),
            ignore,
            dirs: HashMap::new(),
            options,
        }
    }

    /// Return the root that paths matched by this matcher are relative to.
    pub fn root(&self) -> &Path {
        &self.root
    }

    /// Normalize `path` and return it relative to this matcher's root.
    ///
    /// This returns `None` when `path` cannot be made absolute or
    /// when it is known to be outside this matcher's root. Unlike
    /// [`IncrementalIgnore::matched`], this performs absolute path conversion,
    /// lexical normalization and allocation. It is intended as an opt-in
    /// convenience for callers that do not already have root-relative paths.
    ///
    /// Note that `.` is interpreted relative to the process level current
    /// working directory. It is _not_ interpreted relative to the root of
    /// this matcher.
    ///
    /// Note also that this may reject paths that only differ in casing. For
    /// example, if the root path for this matcher is `/FOO` but the provided
    /// path is `/foo/bar`, then this may return `None`. Callers must ensure
    /// casing is consistent between the path provided and the root path for
    /// this matcher.
    pub fn normalize<P: AsRef<Path>>(&self, path: P) -> Option<PathBuf> {
        if matches!(self.ignore, RootIgnore::Stdin) {
            return None;
        }
        let path = normalize_absolute(path.as_ref())?;
        let root = self
            .normalized_root
            .get_or_init(|| normalize_absolute(&self.root))
            .as_ref()?;
        path.strip_prefix(root).ok().map(Path::to_path_buf)
    }

    /// Match a root-relative path against ignore files in its directory and
    /// all relevant parent directories.
    ///
    /// `is_dir` should be true when `path` should be matched as a directory.
    ///
    /// For the return value, use [`IncrementalMatch::is_ignore`],
    /// [`IncrementalMatch::is_whitelist`] or [`IncrementalMatch::is_none`] to
    /// inspect it.
    ///
    /// Matchers for previously unseen directories are loaded and cached during
    /// this call. Errors encountered while loading ignore files are logged. To
    /// receive those errors, use [`IncrementalIgnore::matched_with_errors`].
    ///
    /// `path` must be relative to this matcher's root and must not contain a
    /// parent directory (`..`) component. Behavior is unspecified when these
    /// preconditions are violated. Callers with an absolute path or with a
    /// path containing `.` or `..` may use [`IncrementalIgnore::normalize`]
    /// to get a path satisfying these preconditions. In all cases, a relative
    /// path is *assumed* to be relative to the root of this ignore matcher.
    ///
    /// In general, it is intended that callers doing recursive directory
    /// traversal on the root of this matcher may provide relative paths to
    /// this routine *without* calling [`IncrementalIgnore::normalize`].
    ///
    /// The empty path represents the explicitly configured root and also
    /// returns non-match, consistent with recursive traversal where a root is
    /// always treated as being at depth zero.
    pub fn matched<P: AsRef<Path>>(
        &mut self,
        path: P,
        is_dir: bool,
    ) -> IncrementalMatch {
        let (matched, err) = self.matched_with_errors(path, is_dir);
        if let Some(err) = err {
            log::debug!("error while loading ignore files: {err}");
        }
        matched
    }

    /// Match a root-relative path and return errors encountered while loading
    /// ignore files.
    ///
    /// This is equivalent to [`IncrementalIgnore::matched`], except that
    /// it returns any errors from newly loaded ignore files. Loading can
    /// partially succeed, so valid rules are always applied to the returned
    /// match even when an error is present.
    pub fn matched_with_errors<P: AsRef<Path>>(
        &mut self,
        path: P,
        is_dir: bool,
    ) -> (IncrementalMatch, Option<Error>) {
        let mut errs = PartialErrorBuilder::default();
        let matched =
            self.matched_with_errors_impl(path.as_ref(), is_dir, &mut errs);
        (matched, errs.into_error_option())
    }

    fn matched_with_errors_impl(
        &mut self,
        relative: &Path,
        is_dir: bool,
        errs: &mut PartialErrorBuilder,
    ) -> IncrementalMatch {
        // We short-circuit here when our matcher corresponds to `Stdin` in
        // order to always return a non-match. This is somewhat redundant with
        // `root_ignore()` which does this too, but we do it here so that it
        // always happens, e.g., before depth filtering.
        if relative.is_absolute() || matches!(self.ignore, RootIgnore::Stdin) {
            return IncrementalMatch::none(is_dir);
        }

        let (mut satisfies_min, mut edge_max) = (true, false);
        if self.options.min_depth.is_some() || self.options.max_depth.is_some()
        {
            let depth = relative
                .components()
                .filter_map(|component| match component {
                    std::path::Component::CurDir => None,
                    component => Some(component),
                })
                .count();
            satisfies_min =
                self.options.min_depth.is_none_or(|min| depth >= min);
            let satisfies_max =
                self.options.max_depth.is_none_or(|max| depth <= max);
            edge_max = self.options.max_depth.is_some_and(|max| depth == max);
            // When we have a file that isn't past our min depth, we can give
            // up right away.
            if !is_dir && !satisfies_min {
                return IncrementalMatch::ignore().not_within_depth();
            }
            // Same for *anything* that exceeds our max depth.
            if !satisfies_max {
                return IncrementalMatch::ignore().not_within_depth();
            }
        }

        // When the path is invalid in some way, we bail out early to avoid
        // potentially doing a stat call below.
        let (mut mat, valid) = self
            .matched_with_errors_ignore(relative, is_dir, errs)
            .map(|mat| (mat, true))
            .unwrap_or_else(|| (IncrementalMatch::none(is_dir), false));

        if !is_dir
            && !mat.is_ignore()
            && valid
            && let Some(max_filesize) = self.options.max_filesize
        {
            let path = self.root().join(relative);
            let result = if self.options.follow_links {
                path.metadata()
            } else {
                path.symlink_metadata()
            };
            match result {
                Ok(md) if md.len() > max_filesize => {
                    return IncrementalMatch::ignore();
                }
                Ok(_) => {}
                Err(err) => {
                    // Record the error but otherwise fall through
                    let err = Error::from(err);
                    errs.push(err.with_path(path));
                }
            }
        }

        // We still need to tag our `mat` if it doesn't pass the depth filter,
        // or if it's a directory on the edge of a depth filter. This can only
        // happen when the path is reported as a directory. Otherwise regular
        // files are always handled above.
        if is_dir {
            if !satisfies_min {
                mat = mat.not_within_depth();
            }
            if edge_max {
                mat = mat.no_descent();
            }
        }
        mat
    }

    fn matched_with_errors_ignore(
        &mut self,
        relative: &Path,
        is_dir: bool,
        errs: &mut PartialErrorBuilder,
    ) -> Option<IncrementalMatch> {
        let mut components = relative
            .components()
            .filter_map(|component| match component {
                std::path::Component::CurDir => None,
                component => Some(component),
            })
            .peekable();
        components.peek()?;

        // If the exact parent is cached, then all of its ancestors have
        // already been checked. An allowed cache entry is the matcher to use
        // for children of that directory, while an ignored cache entry is
        // terminal for every descendant. In the usual case, this avoids both
        // walking every component and allocating a relative directory path.
        //
        // Only try the fast path when the final component is a normal path
        // component. Invalid paths are handled by the component walk below.
        let has_normal_final_component =
            relative.components().next_back().is_some_and(|component| {
                matches!(component, std::path::Component::Normal(_))
            });
        if has_normal_final_component && let Some(parent) = relative.parent() {
            match self.dirs.get(parent) {
                Some(CachedDir::Allowed(ignore)) => {
                    return Some(self.match_path(ignore, relative, is_dir));
                }
                Some(CachedDir::Ignored) => {
                    return Some(IncrementalMatch::ignore());
                }
                None => {}
            }
        }

        let mut ignore = self.root_ignore(errs)?;
        let mut dir = PathBuf::new();
        while let Some(component) = components.next() {
            match component {
                std::path::Component::ParentDir
                | std::path::Component::RootDir
                | std::path::Component::Prefix(_) => {
                    return None;
                }
                std::path::Component::CurDir => continue,
                std::path::Component::Normal(_) => {}
            }
            if components.peek().is_none() {
                break;
            }
            dir.push(component.as_os_str());
            match self.dirs.get(&dir) {
                Some(CachedDir::Allowed(cached)) => {
                    ignore = cached.clone();
                    continue;
                }
                Some(CachedDir::Ignored) => {
                    return Some(IncrementalMatch::ignore());
                }
                None => {}
            }

            let path = self.root.join(&dir);
            let mat = ignore.matched(&path, true);
            let is_hidden =
                self.options.hidden && mat.is_none() && is_hidden_path(&path);
            if mat.is_ignore() || is_hidden {
                self.dirs.insert(dir.clone(), CachedDir::Ignored);
                return Some(IncrementalMatch::ignore());
            }
            let (child, err) = ignore.add_child(&path);
            errs.maybe_push(err);
            self.dirs.insert(dir.clone(), CachedDir::Allowed(child.clone()));
            ignore = child;
        }

        Some(self.match_path(&ignore, relative, is_dir))
    }

    fn match_path(
        &self,
        ignore: &Ignore,
        relative: &Path,
        is_dir: bool,
    ) -> IncrementalMatch {
        let path = self.root.join(relative);
        let mut mat = IncrementalMatch::from_match(
            ignore.matched(&path, is_dir).map(|_| ()),
            is_dir,
        );
        // Whether a file is hidden or not has low precedence in filtering. We
        // only check it if we haven't matched anything above. This permits
        // callers to whitelist hidden files or directories.
        if self.options.hidden && mat.is_none() && is_hidden_path(&path) {
            mat = IncrementalMatch::ignore();
        }
        mat
    }

    fn root_ignore(
        &mut self,
        errs: &mut PartialErrorBuilder,
    ) -> Option<Ignore> {
        let ignore = match self.ignore {
            RootIgnore::Unloaded(ref ignore) => ignore.clone(),
            RootIgnore::Loaded(ref ignore) => return Some(ignore.clone()),
            RootIgnore::NotDirectory | RootIgnore::Stdin => return None,
        };
        if !self.root.is_dir() {
            self.ignore = RootIgnore::NotDirectory;
            return None;
        }

        let (parents, err) = ignore.add_parents(&self.root);
        errs.maybe_push(err);
        let (root, err) = parents.add_child(&self.root);
        errs.maybe_push(err);
        self.ignore = RootIgnore::Loaded(root.clone());
        Some(root)
    }
}

/// The result of an incremental match.
///
/// This is similar to [`Match`] in that it reports whether a file path should
/// be ignored, whitelisted or didn't match anything at all. It also has extra
/// data, such as whether a directory matched but should not be descended into.
///
/// Generally speaking, callers that only care about specific files can stick
/// to the `is_none()`, `is_ignore()` or `is_whitelist()` predicates. Directory
/// entries are more complicated because we sometimes want to yield directories
/// to descend into, but not actually visit (e.g., for the minimum depth
/// filter). Or, we may want to yield a directory to visit but not descend into
/// (e.g., for the maximum depth filter).
#[derive(Clone, Debug)]
pub struct IncrementalMatch {
    mat: Match<()>,
    should_descend: bool,
    is_within_depth: bool,
}

impl IncrementalMatch {
    fn none(is_dir: bool) -> IncrementalMatch {
        IncrementalMatch {
            mat: Match::None,
            should_descend: is_dir,
            is_within_depth: true,
        }
    }

    fn ignore() -> IncrementalMatch {
        IncrementalMatch {
            mat: Match::Ignore(()),
            should_descend: false,
            is_within_depth: true,
        }
    }

    fn from_match(mat: Match<()>, is_dir: bool) -> IncrementalMatch {
        let should_descend = is_dir && !mat.is_ignore();
        IncrementalMatch { mat, should_descend, is_within_depth: true }
    }

    fn no_descent(self) -> IncrementalMatch {
        IncrementalMatch { should_descend: false, ..self }
    }

    fn not_within_depth(self) -> IncrementalMatch {
        IncrementalMatch { is_within_depth: false, ..self }
    }

    /// Returns true if the match result didn't match anything.
    pub fn is_none(&self) -> bool {
        self.mat.is_none()
    }

    /// Returns true if the match result implies the path should be ignored.
    pub fn is_ignore(&self) -> bool {
        self.mat.is_ignore()
    }

    /// Returns true if the match result implies the path should be
    /// whitelisted.
    pub fn is_whitelist(&self) -> bool {
        self.mat.is_whitelist()
    }

    /// Returns true only when this match corresponds to a directory *and*
    /// whether the caller should look inside this directory for additional
    /// results.
    ///
    /// It is possible for a match to report `false` for
    /// [`IncrementalMatch::is_ignore`] _and_ `false` for
    /// [`IncrementalMatch::should_descend`]. This can occur, for example, when
    /// a maximum depth setting allows a directory through, but where none of
    /// its children entries should be visited.
    ///
    /// This is always `false` for a file path that does *not* correspond to a
    /// directory.
    pub fn should_descend(&self) -> bool {
        self.should_descend
    }

    /// Returns true only when this result corresponds to an entry that is
    /// within the depth filter.
    ///
    /// This is `false` when a path corresponds to a directory and is less than
    /// the minimum depth. In this case, callers should continue looking inside
    /// that directory.
    ///
    /// This is always `true` for a match corresponding to a file path that
    /// isn't a directory.
    pub fn is_within_depth(&self) -> bool {
        self.is_within_depth
    }

    /// Inverts the match so that `Ignore` becomes `Whitelist` and
    /// `Whitelist` becomes `Ignore`. A non-match remains the same.
    pub fn invert(self) -> IncrementalMatch {
        IncrementalMatch { mat: self.mat.invert(), ..self }
    }
}

/// Return a lexically normalized absolute representation of `path`.
///
/// This collapses `.` and `..`, but intentionally does not canonicalize or
/// resolve symlinks. Ignore rules apply to the lexical path, and resolving a
/// symlink below a root could move the result outside of that root.
fn normalize_absolute(path: &Path) -> Option<PathBuf> {
    let absolute = std::path::absolute(path).ok()?;
    let mut normalized = PathBuf::new();
    for component in absolute.components() {
        match component {
            std::path::Component::CurDir => {}
            std::path::Component::ParentDir => {
                normalized.pop();
            }
            _ => normalized.push(component.as_os_str()),
        }
    }
    Some(normalized)
}

#[cfg(test)]
mod tests {
    use std::{
        fs::{self, File},
        io::Write,
        path::{Path, PathBuf},
    };

    use crate::{
        IncrementalIgnore, IncrementalMatch, WalkBuilder,
        overrides::OverrideBuilder, tests::TempDir, types::TypesBuilder,
    };

    use super::CachedDir;

    fn wfile<P: AsRef<Path>>(path: P, contents: &str) {
        let mut file = File::create(path).unwrap();
        file.write_all(contents.as_bytes()).unwrap();
    }

    fn mkdirp<P: AsRef<Path>>(path: P) {
        fs::create_dir_all(path).unwrap();
    }

    fn tmpdir() -> TempDir {
        TempDir::new().unwrap()
    }

    fn builder<P: AsRef<Path>>(path: P) -> WalkBuilder {
        let mut builder = WalkBuilder::new(path);
        builder.git_global(false);
        builder
    }

    fn one_matcher(builder: &WalkBuilder) -> IncrementalIgnore {
        let mut matchers = builder.build_matchers();
        assert_eq!(matchers.len(), 1);
        matchers.pop().unwrap()
    }

    fn builders<I: IntoIterator<Item = P>, P: AsRef<Path>>(
        paths: I,
    ) -> WalkBuilder {
        let mut builder = WalkBuilder::from_iter(paths);
        builder.git_global(false);
        builder
    }

    fn matchers(builder: &WalkBuilder) -> Vec<IncrementalIgnore> {
        builder.build_matchers()
    }

    fn matchedf<P: AsRef<Path>>(
        matcher: &mut IncrementalIgnore,
        path: P,
    ) -> IncrementalMatch {
        let (matched, err) = matcher.matched_with_errors(path, false);
        assert!(err.is_none(), "unexpected matcher error: {err:?}");
        matched
    }

    fn matchedd<P: AsRef<Path>>(
        matcher: &mut IncrementalIgnore,
        path: P,
    ) -> IncrementalMatch {
        let (matched, err) = matcher.matched_with_errors(path, true);
        assert!(err.is_none(), "unexpected matcher error: {err:?}");
        matched
    }

    // Test that multiple parent ignore files, when nested, are respected.
    #[test]
    fn nested_parent_gitignores() {
        let td = tmpdir();
        let root = td.path().join("project/work");
        mkdirp(td.path().join(".git"));
        mkdirp(root.join("src"));
        wfile(td.path().join(".gitignore"), "*.tmp\n");
        wfile(td.path().join("project/.gitignore"), "!keep.tmp\nnested.log\n");

        let mut m = one_matcher(&builder(&root));
        assert_eq!(m.root(), root);
        assert!(matchedf(&mut m, "src/drop.tmp").is_ignore());
        assert!(matchedf(&mut m, "src/keep.tmp").is_whitelist());
        assert!(matchedf(&mut m, "src/nested.log").is_ignore());
        assert!(matchedf(&mut m, "src/ok.rs").is_none());
    }

    // Test that an anchored rule in a child directory is matched relative to
    // that directory, not relative to the configured root.
    #[test]
    fn anchored_child_rule_uses_child_root() {
        let td = tmpdir();
        let root = td.path().join("root");
        mkdirp(root.join("a"));
        wfile(root.join("a/.ignore"), "/foo\n");

        let mut m = one_matcher(&builder(&root));
        assert!(matchedf(&mut m, "a/foo").is_ignore());
        assert!(matchedf(&mut m, "a/b/foo").is_none());
    }

    // Test that a leading `./` impacts how the rules are matched.
    #[cfg(not(windows))]
    #[test]
    fn leading_dot_slash_impacts_matching() {
        let td = tmpdir();
        let root = td.path().join("root");
        mkdirp(root.join("a"));
        wfile(root.join(".ignore"), "/foo\n");
        wfile(root.join("a/.ignore"), "/foo\n");

        let mut m = one_matcher(&builder(&root));
        assert!(matchedf(&mut m, "foo").is_ignore());
        assert!(matchedf(&mut m, "./foo").is_none());
        assert!(matchedf(&mut m, "a/allowed").is_none());
        assert!(matchedf(&mut m, "a/foo").is_ignore());
        assert!(matchedf(&mut m, "./a/foo").is_none());
    }

    // Test that custom ignore files are respected.
    #[test]
    fn parent_ignore_and_custom_ignore() {
        let td = tmpdir();
        let root = td.path().join("project/work");
        mkdirp(root.join("src"));
        wfile(td.path().join(".ignore"), "*.cache\n");
        wfile(td.path().join(".rgignore"), "*.svg\n");
        wfile(td.path().join("project/.ignore"), "!keep.cache\n");
        wfile(td.path().join("project/.rgignore"), "!keep.svg\n");

        let mut builder = builder(&root);
        builder.add_custom_ignore_filename(".rgignore");
        let mut m = one_matcher(&builder);
        assert!(matchedf(&mut m, "src/drop.cache").is_ignore());
        assert!(matchedf(&mut m, "src/keep.cache").is_whitelist());
        assert!(matchedf(&mut m, "src/drop.svg").is_ignore());
        assert!(matchedf(&mut m, "src/keep.svg").is_whitelist());
    }

    // Test that glob overrides take precedence over ignore files.
    #[test]
    fn glob_overrides_are_applied() {
        let td = tmpdir();
        wfile(td.path().join(".ignore"), "keep.rs\n!drop.rs\n");

        let mut overrides = OverrideBuilder::new(td.path());
        overrides.add("keep.rs").unwrap();
        overrides.add("!drop.rs").unwrap();
        let mut b = builder(td.path());
        b.overrides(overrides.build().unwrap());
        let mut m = one_matcher(&b);

        assert!(matchedf(&mut m, "keep.rs").is_whitelist());
        assert!(matchedf(&mut m, "drop.rs").is_ignore());
    }

    // Test that an override-ignored directory prevents matching rules below
    // it, just as it prevents a traversal from descending into the directory.
    #[test]
    fn glob_overrides_apply_to_ancestors() {
        let td = tmpdir();
        mkdirp(td.path().join("blocked"));
        wfile(td.path().join("blocked/.ignore"), "!keep.rs\n");

        let mut overrides = OverrideBuilder::new(td.path());
        overrides.add("!blocked/").unwrap();
        let mut b = builder(td.path());
        b.overrides(overrides.build().unwrap());
        let mut m = one_matcher(&b);

        assert!(matchedf(&mut m, "blocked/keep.rs").is_ignore());
    }

    // Test that file type selections are applied to files, but not
    // directories.
    #[test]
    fn file_types_are_applied() {
        let td = tmpdir();
        mkdirp(td.path().join("src"));

        let mut types = TypesBuilder::new();
        types.add("rust", "*.rs").unwrap();
        types.select("rust");
        let mut b = builder(td.path());
        b.types(types.build().unwrap());
        let mut m = one_matcher(&b);

        assert!(matchedd(&mut m, "src").is_none());
        assert!(matchedf(&mut m, "src/lib.rs").is_whitelist());
        assert!(matchedf(&mut m, "README.md").is_ignore());
    }

    #[test]
    fn directly_ignored_directory_is_not_descended() {
        let td = tmpdir();
        mkdirp(td.path().join(".git"));
        mkdirp(td.path().join("blocked"));
        wfile(td.path().join(".gitignore"), "blocked/\n");

        let mut m = one_matcher(&builder(td.path()));
        let dir = matchedd(&mut m, "blocked");
        assert!(dir.is_ignore());
        assert!(!dir.should_descend());
    }

    // Test that when a directory is ignored, anything below it always ignored
    // even when there are explicit whitelist rules. This matches directory
    // traversal semantics.
    #[test]
    fn ignored_ancestor_wins() {
        let td = tmpdir();
        mkdirp(td.path().join(".git"));
        mkdirp(td.path().join("blocked"));
        mkdirp(td.path().join("open"));
        // This is the key line: since the entire `blocked` directory is
        // ignored, a proper file traversal won't ever descend into it. So
        // `blocked/keep.rs` should be ignored even if there are ignore rules
        // "beneath" it that whitelist it.
        wfile(td.path().join(".gitignore"), "blocked/\n!blocked/keep.rs\n");
        wfile(td.path().join("blocked/.gitignore"), "!keep.rs\n");

        let mut m = one_matcher(&builder(td.path()));
        assert!(matchedf(&mut m, "blocked/keep.rs").is_ignore());
        assert!(matchedf(&mut m, "blocked/other.rs").is_ignore());
        assert!(matchedf(&mut m, "open/keep.rs").is_none());
    }

    // Test that we respect git boundaries. And that we don't respect git
    // boundaries when not configured to do so.
    #[test]
    fn respects_git_repository_boundaries() {
        let td = tmpdir();
        let root = td.path().join("repo/src");
        mkdirp(td.path().join("repo/.git"));
        mkdirp(&root);
        wfile(td.path().join(".gitignore"), "outside-rule\n");
        wfile(td.path().join(".ignore"), "tool-rule\n");
        wfile(td.path().join("repo/.gitignore"), "inside-rule\n");

        let mut m = one_matcher(&builder(&root));
        assert!(matchedf(&mut m, "inside-rule").is_ignore());
        assert!(matchedf(&mut m, "outside-rule").is_none());
        assert!(matchedf(&mut m, "tool-rule").is_ignore());

        let mut no_git_required = builder(&root);
        no_git_required.require_git(false);
        let mut m = one_matcher(&no_git_required);
        assert!(matchedf(&mut m, "outside-rule").is_ignore());
    }

    // Test that when a gitignore matcher in a parent directory is created, we
    // reuse that matcher from memory even if it's changed on disk.
    #[test]
    fn compiled_matchers_are_reused() {
        let td = tmpdir();
        mkdirp(td.path().join("a"));
        wfile(td.path().join("a/.ignore"), "*.tmp\n");

        let mut m = one_matcher(&builder(td.path()));
        assert!(matchedf(&mut m, "a/first.tmp").is_ignore());

        // Below demonstrates that this new ignore file contents
        // aren't actually picked up because it was already loaded.
        wfile(td.path().join("a/.ignore"), "!*.tmp\n*.rs\n");
        assert!(matchedf(&mut m, "a/first.tmp").is_ignore());
        assert!(matchedf(&mut m, "a/second.tmp").is_ignore());
        assert!(matchedf(&mut m, "a/keep.rs").is_none());
        // To get the new ignore file, we need to rebuild the matcher.
        let mut m = one_matcher(&builder(td.path()));
        assert!(matchedf(&mut m, "a/first.tmp").is_whitelist());
        assert!(matchedf(&mut m, "a/second.tmp").is_whitelist());
        assert!(matchedf(&mut m, "a/keep.rs").is_ignore());
    }

    #[test]
    fn cached_allowed_parent_matches_children() {
        let td = tmpdir();
        mkdirp(td.path().join("a/b"));
        wfile(td.path().join("a/b/.ignore"), "ignored\n");

        let mut m = one_matcher(&builder(td.path()));
        assert!(matchedf(&mut m, "a/b/allowed").is_none());
        assert!(matches!(
            m.dirs.get(Path::new("a/b")),
            Some(CachedDir::Allowed(_))
        ));
        assert!(matchedf(&mut m, "a/b/ignored").is_ignore());
    }

    #[test]
    fn cached_ignored_parent_matches_children() {
        let td = tmpdir();
        mkdirp(td.path().join("blocked"));
        wfile(td.path().join(".ignore"), "blocked/\n");

        let mut m = one_matcher(&builder(td.path()));
        assert!(matchedf(&mut m, "blocked/first").is_ignore());
        assert!(matches!(
            m.dirs.get(Path::new("blocked")),
            Some(CachedDir::Ignored)
        ));
        assert!(matchedf(&mut m, "blocked/second").is_ignore());
    }

    #[test]
    fn cached_parent_matcher_is_used_for_directory() {
        let td = tmpdir();
        mkdirp(td.path().join("a/b"));
        wfile(td.path().join("a/b/.ignore"), "**\n");

        let mut m = one_matcher(&builder(td.path()));
        assert!(matchedf(&mut m, "a/b/file").is_ignore());
        assert!(matches!(
            m.dirs.get(Path::new("a/b")),
            Some(CachedDir::Allowed(_))
        ));
        let dir = matchedd(&mut m, "a/b");
        assert!(dir.is_none());
        assert!(dir.should_descend());
    }

    // Like `compiled_matchers_are_reused`, but with multiple roots.
    #[test]
    fn compiled_multi_matchers_are_reused() {
        let td = tmpdir();
        mkdirp(td.path().join("a/b/c"));

        wfile(td.path().join("a/.ignore"), "*.tmp\n");
        let mut mats = matchers(&builders([
            td.path().join("a/b"),
            td.path().join("a/b/c"),
        ]));
        assert!(matchedf(&mut mats[0], "first.tmp").is_ignore());
        assert!(matchedf(&mut mats[0], "c/first.tmp").is_ignore());

        // Even though we haven't used the second matcher, it should still
        // reuse the `a/.ignore` above. If it didn't, then `a/b/c/first.tmp`
        // below would be whitelisted.
        wfile(td.path().join("a/.ignore"), "!*.tmp\n");
        assert!(matchedf(&mut mats[1], "first.tmp").is_ignore());
    }

    #[test]
    fn compiled_multi_child_matchers_are_not_reused() {
        let td = tmpdir();
        mkdirp(td.path().join("a/b/c/d/e"));

        wfile(td.path().join("a/b/c/d/e/.ignore"), "*.tmp\n");
        let mut mats = matchers(&builders([
            td.path().join("a/b"),
            td.path().join("a/b/c"),
        ]));
        // Some sanity checking first.
        assert!(matchedf(&mut mats[0], "c/first.tmp").is_none());
        assert!(matchedf(&mut mats[0], "c/d/first.tmp").is_none());
        assert!(matchedf(&mut mats[0], "c/d/e/first.tmp").is_ignore());

        // Now write a new ignore file at the same location as above
        // and check that the other matcher still uses the "stale" data.
        wfile(td.path().join("a/b/c/d/e/.ignore"), "!*.tmp\n");
        assert!(matchedf(&mut mats[1], "first.tmp").is_none());
        assert!(matchedf(&mut mats[1], "d/first.tmp").is_none());
        // This is the punch line: because we didn't load `mats[1]` before
        // changing the ignore file, it loads it here and thus this path gets
        // whitelisted.
        assert!(matchedf(&mut mats[1], "d/e/first.tmp").is_whitelist());
        // ... but `mats[0]` still uses the stale gitignore matcher cached in
        // memory!
        assert!(matchedf(&mut mats[0], "c/d/e/first.tmp").is_ignore());

        // If we rebuilder the matcher... then we force reloading and they're
        // now consistent with one another.
        let mut mats = matchers(&builders([
            td.path().join("a/b"),
            td.path().join("a/b/c"),
        ]));
        assert!(matchedf(&mut mats[0], "c/d/e/first.tmp").is_whitelist());
        assert!(matchedf(&mut mats[1], "d/e/first.tmp").is_whitelist());
    }

    // Tests that even when there is an error with a glob pattern, we still
    // respect other glob patterns that are valid.
    #[test]
    fn partial_errors_keep_valid_rules() {
        let td = tmpdir();
        let root = td.path().join("work");
        mkdirp(&root);
        wfile(td.path().join(".ignore"), "{bad\n*.tmp\n");

        let mut builder = builder(&root);
        builder.git_ignore(false).git_exclude(false);
        let mut m = one_matcher(&builder);
        let (matched, err) = m.matched_with_errors("drop.tmp", false);
        assert!(err.is_some());
        assert!(matched.is_ignore());
    }

    // Tests that parent rules are not respected if the matcher is configured
    // not to do so.
    #[test]
    fn parent_loading_can_be_disabled() {
        let td = tmpdir();
        let root = td.path().join("work");
        mkdirp(&root);
        wfile(td.path().join(".ignore"), "parent-rule\n");
        wfile(root.join(".ignore"), "root-rule\n");

        let mut b = builder(&root);
        b.parents(false);
        let mut m = one_matcher(&b);
        assert!(matchedf(&mut m, "parent-rule").is_none());
        assert!(matchedf(&mut m, "root-rule").is_ignore());

        // Sanity check that without `parents(false)`, the parent rule is
        // respected.
        let mut m = one_matcher(&builder(&root));
        assert!(matchedf(&mut m, "parent-rule").is_ignore());
        assert!(matchedf(&mut m, "root-rule").is_ignore());
    }

    // Tests that we can normalize a file path that isn't already in "normal"
    // relative form, and then use that to match on ignore files.
    #[test]
    fn paths_are_relative_to_the_root() {
        let td = tmpdir();
        let root = td.path().join("root");
        let outside = td.path().join("outside");
        mkdirp(&root);
        mkdirp(&outside);
        wfile(root.join(".ignore"), "file\n");

        let mut m = one_matcher(&builder(&root));
        assert!(matchedd(&mut m, "").is_none());
        assert!(matchedd(&mut m, ".").is_none());
        assert!(matchedf(&mut m, "file").is_ignore());
        // Doesn't work because it isn't relative to the root. It's absolute.
        assert!(matchedf(&mut m, root.join("file")).is_none());
        // Also doesn't work because while it's relative, it contains `..`.
        assert!(matchedf(&mut m, "dir/../file").is_none());

        let norm = m.normalize(root.join("dir/../file")).unwrap();
        assert_eq!(norm, Path::new("file"));
        assert!(matchedf(&mut m, "file").is_ignore());

        // Doesn't normalize because its an absolute path outside of our root.
        assert_eq!(m.normalize(outside.join("file")), None);
    }

    // Tests that two matchers in two different directories correctly interpret
    // the same parent gitignore file.
    #[test]
    fn multiple_roots_keep_their_own_context() {
        let td = tmpdir();
        let root_a = td.path().join("a");
        let root_b = td.path().join("b");
        mkdirp(td.path().join(".git"));
        mkdirp(&root_a);
        mkdirp(&root_b);
        wfile(td.path().join(".gitignore"), "/a/*.tmp\n/b/*.log\n");

        let mut builder =
            builders([root_a.as_path(), Path::new("-"), root_b.as_path()]);
        builder.git_global(false);
        let mut ms = matchers(&builder);
        assert_eq!(ms.len(), 3);
        assert_eq!(ms[0].root(), root_a);
        assert_eq!(ms[1].root(), Path::new("-"));
        assert_eq!(ms[2].root(), root_b);
        assert!(matchedf(&mut ms[0], "drop.tmp").is_ignore());
        assert!(matchedf(&mut ms[0], "keep.log").is_none());
        assert!(matchedf(&mut ms[1], "anything").is_none());
        assert_eq!(ms[1].normalize("anything"), None);
        assert!(matchedf(&mut ms[2], "keep.tmp").is_none());
        assert!(matchedf(&mut ms[2], "drop.log").is_ignore());
    }

    // Tests that only the exact `-` root represents standard input.
    #[test]
    fn dot_dash_root_is_not_stdin() {
        let m = one_matcher(&builder("./-"));
        assert_eq!(m.root(), Path::new("./-"));
        assert_eq!(m.normalize("./-/file"), Some(PathBuf::from("file")));
    }

    #[test]
    fn stdin_is_inert_with_depth_limits() {
        let mut b = builder("-");
        b.min_depth(Some(2));
        let mut m = one_matcher(&b);
        let mat = matchedf(&mut m, "file");
        assert!(mat.is_none());
        assert!(mat.is_within_depth());

        let mut b = builder("-");
        b.max_depth(Some(0));
        let mut m = one_matcher(&b);
        let mat = matchedd(&mut m, "dir");
        assert!(mat.is_none());
        assert!(mat.is_within_depth());
        assert!(mat.should_descend());
    }

    // Tests that ignore matching works lexically, and doesn't accidentally
    // resolve symbolic links.
    #[cfg(unix)]
    #[test]
    fn symlink_path_stays_under_lexical_root() {
        use std::os::unix::fs::symlink;

        let td = tmpdir();
        let root = td.path().join("root");
        let outside = td.path().join("outside");
        mkdirp(&root);
        mkdirp(&outside);
        wfile(root.join(".ignore"), "link\n");
        wfile(outside.join("target"), "");
        symlink(outside.join("target"), root.join("link")).unwrap();

        let mut m = one_matcher(&builder(&root));
        assert!(matchedf(&mut m, "link").is_ignore());
    }

    #[test]
    fn depth_limits() {
        let td = tmpdir();
        mkdirp(td.path().join("a/b/c/d"));

        let mut b = builder(td.path());
        b.min_depth(Some(2)).max_depth(Some(3));
        let mut m = one_matcher(&b);

        let dir = matchedd(&mut m, "a");
        assert!(!dir.is_within_depth());
        assert!(dir.should_descend());
        assert!(matchedf(&mut m, "file").is_ignore());

        let dir = matchedd(&mut m, "a/b");
        assert!(dir.is_within_depth());
        assert!(dir.should_descend());
        assert!(!matchedf(&mut m, "a/file").is_ignore());

        let dir = matchedd(&mut m, "a/b/c");
        assert!(dir.is_within_depth());
        assert!(!dir.should_descend());
        assert!(!matchedf(&mut m, "a/b/file").is_ignore());
        assert!(matchedf(&mut m, "a/b/c/file").is_ignore());

        let dir = matchedd(&mut m, "a/b/c/d");
        assert!(dir.is_ignore());
        assert!(!dir.is_within_depth());
        assert!(!dir.should_descend());
        assert!(matchedf(&mut m, "a/b/c/d/file").is_ignore());
    }

    #[test]
    fn depth_limits_apply_to_root() {
        let td = tmpdir();

        let mut b = builder(td.path());
        b.min_depth(Some(1));
        let mut m = one_matcher(&b);
        for path in ["", "."] {
            let root = matchedd(&mut m, path);
            assert!(root.is_none());
            assert!(!root.is_within_depth());
            assert!(root.should_descend());
        }

        let mut b = builder(td.path());
        b.max_depth(Some(0));
        let mut m = one_matcher(&b);
        for path in ["", "."] {
            let root = matchedd(&mut m, path);
            assert!(root.is_none());
            assert!(root.is_within_depth());
            assert!(!root.should_descend());
        }
    }

    #[test]
    fn max_filesize() {
        let td = tmpdir();
        mkdirp(td.path().join("dir"));
        wfile(td.path().join("empty"), "");
        wfile(td.path().join("at-limit"), "12345");
        wfile(td.path().join("over-limit"), "123456");

        let mut b = builder(td.path());
        b.max_filesize(Some(5));
        let mut m = one_matcher(&b);

        assert!(matchedf(&mut m, "empty").is_none());
        assert!(matchedf(&mut m, "at-limit").is_none());
        assert!(matchedf(&mut m, "over-limit").is_ignore());

        let dir = matchedd(&mut m, "dir");
        assert!(dir.is_none());
        assert!(dir.should_descend());
    }

    #[test]
    fn max_filesize_does_not_stat_ignored_file() {
        let td = tmpdir();
        wfile(td.path().join(".ignore"), "ignored\n");

        let mut b = builder(td.path());
        b.max_filesize(Some(0));
        let mut m = one_matcher(&b);
        let (mat, err) = m.matched_with_errors("ignored", false);
        assert!(mat.is_ignore());
        assert!(err.is_none(), "ignored missing file was statted: {err:?}");
    }

    #[cfg(unix)]
    #[test]
    fn max_filesize_respects_follow_links() {
        use std::os::unix::fs::symlink;

        let td = tmpdir();
        wfile(
            td.path().join("target"),
            "target contents are much longer than the size limit",
        );
        symlink("target", td.path().join("link")).unwrap();

        let mut b = builder(td.path());
        b.max_filesize(Some(10));
        let mut m = one_matcher(&b);
        assert!(matchedf(&mut m, "link").is_none());

        b.follow_links(true);
        let mut m = one_matcher(&b);
        assert!(matchedf(&mut m, "link").is_ignore());
    }

    #[test]
    fn hidden_files_and_directories() {
        let td = tmpdir();
        mkdirp(td.path().join(".hidden-dir"));
        mkdirp(td.path().join("visible-dir"));
        wfile(td.path().join(".hidden-file"), "");
        wfile(td.path().join("visible-file"), "");

        let mut m = one_matcher(&builder(td.path()));
        assert!(matchedf(&mut m, ".hidden-file").is_ignore());
        let dir = matchedd(&mut m, ".hidden-dir");
        assert!(dir.is_ignore());
        assert!(!dir.should_descend());
        assert!(matchedf(&mut m, "visible-file").is_none());
        let dir = matchedd(&mut m, "visible-dir");
        assert!(dir.is_none());
        assert!(dir.should_descend());

        let mut b = builder(td.path());
        b.hidden(false);
        let mut m = one_matcher(&b);
        assert!(matchedf(&mut m, ".hidden-file").is_none());
        let dir = matchedd(&mut m, ".hidden-dir");
        assert!(dir.is_none());
        assert!(dir.should_descend());
    }

    #[test]
    fn gitignore_whitelist_overrides_hidden_filter() {
        let td = tmpdir();
        mkdirp(td.path().join(".git"));
        mkdirp(td.path().join(".hidden-dir"));
        wfile(td.path().join(".hidden-file"), "");
        wfile(td.path().join(".gitignore"), "!.hidden-file\n!.hidden-dir/\n");

        let mut m = one_matcher(&builder(td.path()));
        assert!(matchedf(&mut m, ".hidden-file").is_whitelist());
        let dir = matchedd(&mut m, ".hidden-dir");
        assert!(dir.is_whitelist());
        assert!(dir.should_descend());
    }

    #[test]
    fn descendants_of_hidden_directories_are_ignored() {
        let td = tmpdir();
        mkdirp(td.path().join(".git"));
        mkdirp(td.path().join(".hidden/nested"));
        mkdirp(td.path().join("visible/.hidden"));
        wfile(td.path().join(".hidden/file"), "");
        wfile(td.path().join(".hidden/nested/file"), "");
        wfile(td.path().join("visible/.hidden/file"), "");
        wfile(td.path().join(".hidden/.gitignore"), "!file\n");

        let mut m = one_matcher(&builder(td.path()));
        assert!(matchedf(&mut m, ".hidden/file").is_ignore());
        assert!(matchedf(&mut m, ".hidden/nested/file").is_ignore());
        assert!(matchedf(&mut m, "visible/.hidden/file").is_ignore());
    }

    #[test]
    fn whitelisted_hidden_directory_allows_descendants() {
        let td = tmpdir();
        mkdirp(td.path().join(".git"));
        mkdirp(td.path().join(".hidden"));
        wfile(td.path().join(".hidden/file"), "");
        wfile(td.path().join(".gitignore"), "!.hidden/\n");

        let mut m = one_matcher(&builder(td.path()));
        let dir = matchedd(&mut m, ".hidden");
        assert!(dir.is_whitelist());
        assert!(dir.should_descend());
        assert!(matchedf(&mut m, ".hidden/file").is_none());
    }

    #[test]
    fn hidden_directories_outside_depth_limits() {
        let td = tmpdir();
        mkdirp(td.path().join("a/.hidden"));

        let mut b = builder(td.path());
        b.min_depth(Some(3));
        let mut m = one_matcher(&b);
        let dir = matchedd(&mut m, "a/.hidden");
        assert!(dir.is_ignore());
        assert!(!dir.is_within_depth());

        let mut b = builder(td.path());
        b.max_depth(Some(1));
        let mut m = one_matcher(&b);
        let dir = matchedd(&mut m, "a/.hidden");
        assert!(dir.is_ignore());
        assert!(!dir.is_within_depth());
    }
}
