pub mod auto_source_detection;
pub mod detect_sources;
pub mod init_tracing;
pub mod sources;

use crate::extractor::{Extracted, Extractor};
use crate::glob::optimize_patterns;
use crate::scanner::detect_sources::resolve_globs;
use crate::scanner::sources::{
    public_source_entries_to_private_source_entries, PublicSourceEntry, SourceEntry, Sources,
};
use crate::GlobEntry;
use bstr::ByteSlice;
use fast_glob::glob_match;
use fxhash::{FxHashMap, FxHashSet};
use ignore::{
    gitignore::{Gitignore, GitignoreBuilder},
    WalkBuilder,
};
use init_tracing::{init_tracing, SHOULD_TRACE};
use rayon::prelude::*;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use std::time::SystemTime;
use tracing::event;

// # `@source` semantics
//
// Every `@source` directive is classified as one of:
//
// - `Auto`: `@source "some/folder"` or `@source "some/folder/**/*"` — auto source detection.
//   The folder is scanned recursively while respecting `.gitignore` files and the default rules
//   (skip `node_modules`/`.git`/…, skip binary and irrelevant extensions, skip lock files, …).
//
// - `External`: an `Auto` source whose folder is itself ignored (by a `.gitignore` or because
//   it's a default-ignored directory like `node_modules`), e.g.
//   `@source "node_modules/my-ui-lib"`. Since the folder was listed explicitly, its ignoredness
//   is bypassed: everything inside is scanned as if it were an `Auto` source, except that
//   `.gitignore` files no longer apply inside (git ignores the whole tree anyway). The default
//   rules still apply inside: nested `node_modules`, binary extensions, etc. stay ignored.
//
// - `Pattern`: `@source "some/folder/*.html"` — an explicit glob. Only files matching the glob
//   are scanned. The *static* prefix of the glob (`some/folder`) is the explicit part: it is
//   reached even when it is git ignored or hidden behind a default-ignored directory
//   (`@source "node_modules/lib/dist/*.html"` works). The *wildcard* part is not explicit:
//   while expanding it we still respect `.gitignore` files inside the walked subtree and the
//   default-ignored directories (`@source "./**/*.html"` does not descend into `node_modules`
//   or a git ignored `dist/`; `@source "./dist/**/*.html"` does descend into `dist/`).
//   Individual *files* matching the glob are always included, even when git ignored — you were
//   explicit about wanting files of that shape (`@source "git-ignored.html"` and
//   `@source "*.styl"` work). Files that are ignored by default are only included when the
//   pattern is explicit about them: it names a concrete file (`@source "do-include-me.bin"`,
//   `@source ".env"`) or pins an extension (`@source "logo.{jpg,png}"`). A glob that does
//   neither (e.g. `@source "blog/*/post/**/*"`) still applies the default file rules.
//
// - `Ignored`: `@source not "…"` — excludes matching files/folders, even when a `.gitignore`
//   or another `@source` allows them.
//
// Later directives win over earlier ones on conflict: `@source not "./x"` followed by
// `@source "./x/keep.html"` scans `keep.html`, and vice versa excludes it. The same holds for
// directory sources: `@source not "./x"` followed by `@source "./x"` re-includes `./x` (with
// the normal auto source detection rules applied inside).
//
// # Implementation
//
// All sources are scanned in a single file system walk. The vendored `ignore` crate only
// provides the traversal itself (parallel walking, symlink loop handling); its built-in
// gitignore handling is disabled, because it computes one global verdict per path while the
// `@source` semantics are per source: the same directory can be pruned for an auto source but
// walkable for a pattern source, and a file can be gitignored for an auto source but rescued
// by a glob.
//
// Instead, the [`Resolver`] implements the semantics in the walker's `filter_entry` callback,
// backed by its own lazily-loaded cache of the on-disk ignore files (`.gitignore`, `.ignore`,
// and the repository's `.git/info/exclude`, applied up to the git repository root):
//
// - The walk roots are the "maximal" source bases; nested bases are reached by walking, and
//   the resolver keeps the static path towards an explicitly listed base open even through
//   ignored directories.
//
// - A directory is entered when at least one source can contribute files inside of it, where
//   each source kind applies its own rules: auto sources check the default rules and the full
//   gitignore chain, external sources only the default rules, and pattern sources check the
//   default rules, the `.gitignore` files at or below their base, and whether the glob can
//   match anything inside the directory. Directories that cannot contribute anything are
//   never descended into.
//
// - A file is kept when at least one source includes it, honoring the directive order of
//   `@source not` (the later directive wins).

#[derive(Debug, Clone)]
pub enum ChangedContent {
    File(PathBuf, String),
    Content(String, String),
}

#[derive(Debug, Clone)]
pub struct ScanOptions {
    /// Base path to start scanning from
    pub base: Option<String>,

    /// Glob sources
    pub sources: Vec<GlobEntry>,
}

#[derive(Debug, Clone)]
pub struct ScanResult {
    pub candidates: Vec<String>,
    pub files: Vec<String>,
    pub globs: Vec<GlobEntry>,
}

#[derive(Debug, Clone, Default)]
pub struct Scanner {
    /// Content sources
    sources: Sources,

    /// The walker to detect all files that we have to scan
    walker: Option<WalkBuilder>,

    /// The resolver implementing the `@source` semantics for the walker
    resolver: Option<Arc<Resolver>>,

    /// All found extensions
    extensions: FxHashSet<String>,

    /// All files that we have to scan
    files: FxHashSet<PathBuf>,

    /// All directories, sub-directories, etc… we saw during source detection
    dirs: FxHashSet<PathBuf>,

    /// All generated globs, used for setting up watchers
    globs: Option<Vec<GlobEntry>>,

    /// Track unique set of candidates
    candidates: FxHashSet<String>,

    /// Track mtimes for files so incremental scans can skip unchanged files.
    mtimes: FxHashMap<PathBuf, SystemTime>,

    /// Files that were scanned during the last `scan()` call.
    scanned_files: Vec<String>,

    /// Whether we've completed at least one full scan. When false, we skip
    /// mtime tracking entirely so the initial build stays fast.
    has_scanned_once: bool,

    /// Whether sources have been scanned since the last `scan()` call
    sources_scanned: bool,
}

impl Scanner {
    pub fn new(sources: Vec<PublicSourceEntry>) -> Self {
        init_tracing();

        if *SHOULD_TRACE {
            event!(tracing::Level::INFO, "Provided sources:");
            for source in &sources {
                event!(tracing::Level::INFO, "Source: {:?}", source);
            }
        }

        let sources = Sources::new(public_source_entries_to_private_source_entries(sources));
        if *SHOULD_TRACE {
            event!(tracing::Level::INFO, "Optimized sources:");
            for source in sources.iter() {
                event!(tracing::Level::INFO, "Source: {:?}", source);
            }
        }

        let resolver = Arc::new(Resolver::new(&sources));
        let walker = create_walker(resolver.clone());

        Self {
            sources,
            walker,
            resolver: Some(resolver),
            ..Default::default()
        }
    }

    pub fn scan(&mut self) -> Vec<String> {
        self.sources_scanned = false;

        let (scanned_blobs, css_files, files) = self.discover_sources();

        self.extract_candidates(scanned_blobs, css_files);
        self.scanned_files = files;

        // Return all candidates sorted
        let mut result = self.candidates.iter().cloned().collect::<Vec<_>>();
        result.par_sort_unstable();
        result
    }

    #[tracing::instrument(skip_all)]
    pub fn scan_content(&mut self, changed_content: Vec<ChangedContent>) -> Vec<String> {
        let (changed_files, changed_contents) =
            changed_content
                .into_iter()
                .partition::<Vec<_>, _>(|x| match x {
                    ChangedContent::File(_, _) => true,
                    ChangedContent::Content(_, _) => false,
                });

        // Raw content can be parsed directly, no need to verify if the file exists and is allowed
        // to be scanned.
        let mut content_to_scan: Vec<ChangedContent> = changed_contents;

        // Fully resolve all files
        let changed_files = changed_files
            .into_iter()
            .filter_map(|changed_content| match changed_content {
                ChangedContent::File(file, extension) => {
                    let Ok(file) = dunce::canonicalize(file) else {
                        return None;
                    };
                    Some(ChangedContent::File(file, extension))
                }
                _ => unreachable!(),
            })
            .collect::<Vec<_>>();

        let (known_files, mut new_unknown_files) = changed_files
            .into_iter()
            .partition::<Vec<_>, _>(|changed_file| match changed_file {
                ChangedContent::Content(_, _) => unreachable!(),
                ChangedContent::File(file, _) => self.files.contains(file),
            });

        // All known files are allowed to be scanned
        content_to_scan.extend(known_files);

        // Figure out if the new unknown files are allowed to be scanned
        if !new_unknown_files.is_empty() {
            if let Some(walk_builder) = &mut self.walker {
                for entry in walk_builder.build().filter_map(Result::ok) {
                    let path = entry.path();
                    if !path.is_file() {
                        continue;
                    }

                    // The walked path can contain symlinks, while the changed files have already
                    // been canonicalized. Lazily canonicalize the walked path so we can compare
                    // the real paths as well.
                    let mut canonical_path: Option<PathBuf> = None;

                    let mut drop_file_indexes = vec![];
                    for (idx, changed_file) in new_unknown_files.iter().enumerate().rev() {
                        let ChangedContent::File(file, _) = changed_file else {
                            continue;
                        };

                        // When the file is found on disk it means that all the rules pass. We can
                        // extract the current file and remove it from the list of passed in files.
                        let matches = file == path
                            || (file.file_name() == path.file_name() && {
                                if canonical_path.is_none() {
                                    canonical_path = dunce::canonicalize(path).ok();
                                }
                                canonical_path.as_deref() == Some(file.as_path())
                            });

                        if matches {
                            self.files.insert(path.to_path_buf()); // Track for future use
                            content_to_scan.push(changed_file.clone()); // Track for parsing
                            drop_file_indexes.push(idx);
                        }
                    }

                    // Remove all files that we found on disk
                    if !drop_file_indexes.is_empty() {
                        drop_file_indexes.into_iter().for_each(|idx| {
                            new_unknown_files.remove(idx);
                        });
                    }

                    // We can stop walking the file system if all files we are interested in have
                    // been found.
                    if new_unknown_files.is_empty() {
                        break;
                    }
                }
            }
        }

        // Read all content into blobs for extraction
        let blobs = read_all_files(content_to_scan);
        self.extract_candidates(blobs, vec![])
    }

    #[tracing::instrument(skip_all)]
    fn extract_candidates(&mut self, blobs: Vec<Vec<u8>>, css_files: Vec<PathBuf>) -> Vec<String> {
        // Extract all candidates from the pre-read blobs
        let mut new_candidates = parse_all_blobs(blobs);

        // Extract all CSS variables from the CSS files
        if !css_files.is_empty() {
            let css_variables = extract_css_variables(read_all_files(
                css_files
                    .into_iter()
                    .map(|file| ChangedContent::File(file, "css".into()))
                    .collect(),
            ));

            new_candidates.extend(css_variables);
        }

        // Only keep candidates we haven't seen before
        for existing in self.candidates.iter() {
            new_candidates.remove(existing);
        }

        // Track new candidates for subsequent calls
        self.candidates.extend(new_candidates.iter().cloned());

        let mut result: Vec<String> = new_candidates.into_iter().collect();
        result.par_sort_unstable();

        result
    }

    #[tracing::instrument(skip_all)]
    pub fn get_files(&mut self) -> Vec<String> {
        let _ = self.discover_sources();

        self.files
            .par_iter()
            .filter_map(|x| x.clone().into_os_string().into_string().ok())
            .collect()
    }

    #[tracing::instrument(skip_all)]
    pub fn get_scanned_files(&self) -> Vec<String> {
        self.scanned_files.clone()
    }

    #[tracing::instrument(skip_all)]
    pub fn get_globs(&mut self) -> Vec<GlobEntry> {
        if let Some(globs) = &self.globs {
            return globs.clone();
        }

        let _ = self.discover_sources();

        let mut globs = vec![];
        for source in self.sources.iter() {
            match source {
                SourceEntry::Auto { base } | SourceEntry::External { base } => {
                    globs.extend(resolve_globs(
                        base.to_path_buf(),
                        &self.dirs,
                        &self.extensions,
                    ));
                }
                SourceEntry::Pattern { base, pattern } => {
                    globs.push(GlobEntry {
                        base: base.to_string_lossy().to_string(),
                        pattern: pattern.to_string(),
                    });
                }
                _ => {}
            }
        }

        // Re-optimize the globs to reduce the number of patterns we have to scan.
        globs = optimize_patterns(&globs);

        // Track the globs for subsequent calls
        self.globs = Some(globs.clone());

        globs
    }

    #[tracing::instrument(skip_all)]
    pub fn get_normalized_sources(&self) -> Vec<GlobEntry> {
        self.sources
            .iter()
            .filter_map(|source| match source {
                SourceEntry::Auto { base } | SourceEntry::External { base } => Some(GlobEntry {
                    base: base.to_string_lossy().to_string(),
                    pattern: "**/*".to_string(),
                }),
                SourceEntry::Pattern { base, pattern } => Some(GlobEntry {
                    base: base.to_string_lossy().to_string(),
                    pattern: pattern.to_string(),
                }),
                _ => None,
            })
            .collect()
    }

    #[tracing::instrument(skip_all)]
    pub fn get_candidates_with_positions(
        &mut self,
        changed_content: ChangedContent,
    ) -> Vec<(String, usize)> {
        let content = read_changed_content(changed_content).unwrap_or_default();
        let original_content = &content;

        // Workaround for legacy upgrades:
        //
        // `-[]` won't parse in the new parser (`[…]` must contain _something_), but we do need it
        // for people using `group-[]` (which we will later replace with `in-[.group]` instead).
        let content = content.replace("-[]", "XYZ");
        let offset = content.as_ptr() as usize;

        let mut extractor = Extractor::new(&content[..]);

        extractor
            .extract()
            .into_par_iter()
            .flat_map(|extracted| match extracted {
                Extracted::Candidate(s) => {
                    let i = s.as_ptr() as usize - offset;
                    let original = &original_content[i..i + s.len()];
                    if original.contains_str("-[]") {
                        return Some(unsafe {
                            (String::from_utf8_unchecked(original.to_vec()), i)
                        });
                    }

                    // SAFETY: When we parsed the candidates, we already guaranteed that the byte
                    // slices are valid, therefore we don't have to re-check here when we want to
                    // convert it back to a string.
                    Some(unsafe { (String::from_utf8_unchecked(s.to_vec()), i) })
                }

                _ => None,
            })
            .collect()
    }

    #[tracing::instrument(skip_all)]
    fn discover_sources(&mut self) -> (Vec<Vec<u8>>, Vec<PathBuf>, Vec<String>) {
        if self.sources_scanned {
            return (vec![], vec![], vec![]);
        }
        self.sources_scanned = true;

        let Some(walker) = &mut self.walker else {
            return (vec![], vec![], vec![]);
        };

        // Use synchronous walk for the initial build (lower overhead) and parallel
        // walk for subsequent calls (watch mode) where the overhead is amortised.
        let all_entries = if self.has_scanned_once {
            walk_parallel(walker)
        } else {
            walk_synchronous(walker)
        };

        let mut css_files: Vec<PathBuf> = vec![];
        let mut content_paths: Vec<(PathBuf, String)> = vec![];
        let mut changed_files = vec![];

        // Fresh state
        self.files.clear();
        self.dirs.clear();
        self.extensions.clear();
        self.globs = None;

        // Cache canonicalized folders in case a file itself is not symlinked, but any of the parent
        // folders are symlinked.
        let mut cached_canonical_dirs: FxHashMap<PathBuf, PathBuf> = FxHashMap::default();

        for entry in all_entries {
            match entry {
                WalkEntry::Dir(path) => {
                    // Directories that are only walked to reach an explicitly listed base are
                    // not part of any source's content: they must not widen the generated
                    // file watcher globs.
                    let contributes = self
                        .resolver
                        .as_ref()
                        .is_some_and(|resolver| resolver.contributes_dir(&path));
                    if contributes {
                        self.dirs.insert(path);
                    }
                }
                WalkEntry::File {
                    path,
                    mtime,
                    is_symlink,
                } => {
                    // Deduplicate: parallel walk can visit the same file from multiple threads
                    if !self.files.insert(path.clone()) {
                        continue;
                    }

                    // Track canonicalized paths in addition to potentially symlinked file paths
                    let canonical = if is_symlink {
                        dunce::canonicalize(&path).ok()
                    } else {
                        path.parent().and_then(|parent| {
                            // Perf: cache the canonicalized parent path such that sibling files don't
                            // have to canonicalize over and over again.
                            let canonical_parent = cached_canonical_dirs
                                .entry(parent.to_path_buf())
                                .or_insert_with(|| {
                                    dunce::canonicalize(parent)
                                        .unwrap_or_else(|_| parent.to_path_buf())
                                });

                            if canonical_parent.as_path() != parent {
                                path.file_name()
                                    .map(|file_name| canonical_parent.join(file_name))
                            } else {
                                None
                            }
                        })
                    };

                    if let Some(canonical) = canonical {
                        if canonical != path {
                            self.files.insert(canonical);
                        }
                    }
                    let extension = path
                        .extension()
                        .and_then(|x| x.to_str())
                        .unwrap_or_default()
                        .to_owned();

                    self.extensions.insert(extension.to_owned());

                    // On incremental scans, check mtime to skip unchanged files.
                    // On the first scan, track mtimes while still scanning every file.
                    let changed = if self.has_scanned_once {
                        match mtime {
                            Some(mtime) => {
                                let prev = self.mtimes.insert(path.clone(), mtime);
                                prev.is_none_or(|prev| prev != mtime)
                            }
                            None => true,
                        }
                    } else {
                        if let Some(mtime) = mtime {
                            self.mtimes.insert(path.clone(), mtime);
                        }

                        true
                    };

                    if !changed {
                        continue;
                    }

                    if let Ok(file) = path.clone().into_os_string().into_string() {
                        changed_files.push(file);
                    }

                    match extension.as_str() {
                        // Special handing for CSS files, we don't want to extract candidates from
                        // these files, but we do want to extract used CSS variables.
                        "css" => css_files.push(path),
                        _ => content_paths.push((path, extension)),
                    }
                }
            }
        }

        // Ensure `mtimes` don't include stale files
        self.mtimes.retain(|path, _| self.files.contains(path));

        // Read + preprocess all discovered files in parallel
        let scanned_blobs: Vec<Vec<u8>> = content_paths
            .into_par_iter()
            .filter_map(|(path, ext)| {
                let content = std::fs::read(&path).ok()?;
                event!(tracing::Level::INFO, "Reading {:?}", path);
                let processed = pre_process_input(content, &ext);
                if processed.is_empty() {
                    None
                } else {
                    Some(processed)
                }
            })
            .collect();

        if !self.has_scanned_once {
            self.has_scanned_once = true;
        }

        changed_files.par_sort_unstable();

        (scanned_blobs, css_files, changed_files)
    }
}

fn read_changed_content(c: ChangedContent) -> Option<Vec<u8>> {
    let (content, extension) = match c {
        ChangedContent::File(file, extension) => match std::fs::read(&file) {
            Ok(content) => {
                event!(tracing::Level::INFO, "Reading {:?}", file);
                (content, extension)
            }
            Err(e) => {
                event!(tracing::Level::ERROR, "Failed to read file: {:?}", e);
                return None;
            }
        },

        ChangedContent::Content(contents, extension) => (contents.into_bytes(), extension),
    };

    Some(pre_process_input(content, &extension))
}

pub fn pre_process_input(content: Vec<u8>, extension: &str) -> Vec<u8> {
    use crate::extractor::pre_processors::*;

    match extension {
        "clj" | "cljs" | "cljc" => Clojure.process(&content),
        "heex" | "eex" | "ex" | "exs" => Elixir.process(&content),
        "cshtml" | "razor" => Razor.process(&content),
        "haml" => Haml.process(&content),
        "json" | "jsonl" | "ndjson" => Json.process(&content),
        "md" | "mdx" => Markdown.process(&content),
        "pug" => Pug.process(&content),
        "rb" | "erb" => Ruby.process(&content),
        "slim" | "slang" => Slim.process(&content),
        "svelte" => Svelte.process(&content),
        "rs" => Rust.process(&content),
        "tt" | "tt2" | "tx" => TemplateToolkit.process(&content),
        "twig" => Twig.process(&content),
        "vue" => Vue.process(&content),
        _ => content,
    }
}

#[tracing::instrument(skip_all)]
fn read_all_files(changed_content: Vec<ChangedContent>) -> Vec<Vec<u8>> {
    event!(
        tracing::Level::INFO,
        "Reading {:?} file(s)",
        changed_content.len()
    );

    changed_content
        .into_par_iter()
        .filter_map(read_changed_content)
        .collect()
}

#[tracing::instrument(skip_all)]
fn extract_css_variables(blobs: Vec<Vec<u8>>) -> FxHashSet<String> {
    extract(blobs, |mut extractor| {
        extractor.extract_variables_from_css()
    })
}

#[tracing::instrument(skip_all)]
fn parse_all_blobs(blobs: Vec<Vec<u8>>) -> FxHashSet<String> {
    extract(blobs, |mut extractor| extractor.extract())
}

#[tracing::instrument(skip_all)]
fn extract<H>(blobs: Vec<Vec<u8>>, handle: H) -> FxHashSet<String>
where
    H: Fn(Extractor) -> Vec<Extracted> + std::marker::Sync,
{
    blobs
        .par_iter()
        .flat_map(|blob| blob.par_split(|x| *x == b'\n'))
        .filter_map(|blob| {
            if blob.is_empty() {
                return None;
            }

            let extracted = handle(crate::extractor::Extractor::new(blob));
            if extracted.is_empty() {
                return None;
            }

            Some(FxHashSet::from_iter(extracted.into_iter().map(
                |x| match x {
                    Extracted::Candidate(bytes) => bytes,
                    Extracted::CssVariable(bytes) => bytes,
                },
            )))
        })
        .reduce(Default::default, |mut a, b| {
            a.extend(b);
            a
        })
        .into_iter()
        .map(|s| unsafe { String::from_utf8_unchecked(s.to_vec()) })
        .collect()
}

#[derive(Debug)]
enum WalkEntry {
    Dir(PathBuf),
    File {
        path: PathBuf,
        mtime: Option<SystemTime>,

        /// Whether the path itself is a symlink
        is_symlink: bool,
    },
}

impl From<ignore::DirEntry> for WalkEntry {
    fn from(entry: ignore::DirEntry) -> Self {
        let is_dir = entry.file_type().map(|ft| ft.is_dir()).unwrap_or(false);
        let is_symlink = entry.path_is_symlink();
        let path = entry.into_path();

        if is_dir {
            WalkEntry::Dir(path)
        } else {
            let mtime = path.metadata().ok().and_then(|m| m.modified().ok());
            WalkEntry::File {
                path,
                mtime,
                is_symlink,
            }
        }
    }
}

/// Walk the file system synchronously. Used for the initial build where the overhead of spawning
/// parallel walker threads is not worth it.
#[tracing::instrument(skip_all)]
fn walk_synchronous(walker: &mut WalkBuilder) -> Vec<WalkEntry> {
    walker
        .build()
        .filter_map(Result::ok)
        .map(WalkEntry::from)
        .collect()
}

/// Walk the file system in parallel. Used in watch mode where the parallel walker overhead is
/// amortised across many rebuilds and subsequent calls are much faster.
#[tracing::instrument(skip_all)]
fn walk_parallel(walker: &mut WalkBuilder) -> Vec<WalkEntry> {
    struct FlushOnDrop {
        local: Vec<WalkEntry>,
        shared: Arc<Mutex<Vec<WalkEntry>>>,
    }

    impl Drop for FlushOnDrop {
        fn drop(&mut self) {
            if !self.local.is_empty() {
                self.shared.lock().unwrap().append(&mut self.local);
            }
        }
    }

    let collected: Arc<Mutex<Vec<WalkEntry>>> = Arc::new(Mutex::new(vec![]));

    walker.build_parallel().run(|| {
        let mut buf = FlushOnDrop {
            local: Vec::with_capacity(256),
            shared: collected.clone(),
        };

        Box::new(move |entry| {
            let Ok(entry) = entry else {
                return ignore::WalkState::Continue;
            };

            buf.local.push(WalkEntry::from(entry));

            if buf.local.len() >= 256 {
                buf.shared.lock().unwrap().append(&mut buf.local);
            }

            ignore::WalkState::Continue
        })
    });

    // All threads have finished and flushed their buffers via FlushOnDrop::drop
    Arc::try_unwrap(collected).unwrap().into_inner().unwrap()
}

/// Sets up the single walker for all sources.
///
/// The walker is only used for the (parallel, symlink aware) traversal itself: all ignore
/// semantics are implemented by the [`Resolver`] in the `filter_entry` callback. The crate's
/// built-in gitignore handling can't be used because it computes one global verdict per path,
/// while the `@source` semantics are per source (see the spec at the top of this file): the
/// same directory can be pruned for an auto source but walkable for a pattern source, and a
/// file can be gitignored for an auto source but rescued by a glob.
///
/// The walk roots are the "maximal" source bases: a base contained in another base is reached
/// by walking, which the resolver allows even through ignored directories (the static path to
/// an explicit base bypasses ignore rules).
fn create_walker(resolver: Arc<Resolver>) -> Option<WalkBuilder> {
    let mut roots = resolver.walk_roots().into_iter();
    let first_root = roots.next()?;

    let mut builder = WalkBuilder::new(first_root);
    for root in roots {
        builder.add(root);
    }

    // We have to follow symlinks
    builder.follow_links(true);

    // Disable all of the built-in filtering (hidden files, .gitignore files, parent
    // directories, global gitignore files, …): the resolver implements the ignore semantics.
    builder.standard_filters(false);

    builder.filter_entry(move |entry| resolver.keep(entry));

    Some(builder)
}

/// Implements the `@source` semantics for a single file system walk.
///
/// For every walked entry, the resolver computes the union of the per-source verdicts:
///
/// - a directory is entered when at least one source can contribute files inside of it
/// - a file is kept when at least one source includes it, honoring the directive order of
///   `@source not` (the later directive wins)
///
/// The per-source verdicts require gitignore decisions relative to different anchors (an auto
/// source respects the full `.gitignore` chain, a pattern source only the `.gitignore` files
/// at or below its base, an external source none at all), so the resolver maintains its own
/// lazily-loaded cache of ignore files instead of using the walker's built-in handling.
#[derive(Debug)]
struct Resolver {
    /// `Auto` sources: directive position and base
    autos: Vec<(usize, PathBuf)>,

    /// `External` sources: directive position and base
    externals: Vec<(usize, PathBuf)>,

    /// `Pattern` sources: base and the pattern with its directive position
    patterns: Vec<(PathBuf, PatternRule)>,

    /// `@source not` directives
    nots: Vec<NotRule>,

    /// Lazily loaded ignore files (`.gitignore`, `.ignore`, `.git/info/exclude`) per directory
    ignore_files: IgnoreFiles,

    /// Memoized "is this directory reachable for an auto source": every directory on the path
    /// from an auto base down to it passes the gitignore chain and the default rules
    auto_reachable: Mutex<FxHashMap<PathBuf, bool>>,

    /// Memoized "is this directory reachable for an external source": like `auto_reachable`,
    /// but without the gitignore chain (git ignores the whole tree anyway)
    external_reachable: Mutex<FxHashMap<PathBuf, bool>>,

    /// Memoized "is this directory reachable for a pattern source with this base": like
    /// `auto_reachable`, but only `.gitignore` files at or below the base apply (the static
    /// base is explicit, everything above it is bypassed)
    pattern_reachable: Mutex<FxHashMap<(PathBuf, PathBuf), bool>>,
}

impl Resolver {
    fn new(sources: &Sources) -> Self {
        let mut autos = vec![];
        let mut externals = vec![];
        let mut patterns = vec![];

        for (idx, source) in sources.iter().enumerate() {
            match source {
                SourceEntry::Auto { base } => autos.push((idx, base.clone())),
                SourceEntry::External { base } => externals.push((idx, base.clone())),
                SourceEntry::Pattern { base, pattern } => patterns.push((
                    base.clone(),
                    PatternRule {
                        idx,
                        pattern: pattern.clone(),
                        bypasses_default_file_rules: pattern_bypasses_default_file_rules(
                            pattern,
                        ),
                    },
                )),
                SourceEntry::Ignored { .. } => {}
            }
        }

        Self {
            autos,
            externals,
            patterns,
            nots: collect_not_rules(sources),
            ignore_files: IgnoreFiles::default(),
            auto_reachable: Default::default(),
            external_reachable: Default::default(),
            pattern_reachable: Default::default(),
        }
    }

    /// All source bases
    fn bases(&self) -> impl Iterator<Item = &PathBuf> {
        self.autos
            .iter()
            .map(|(_, base)| base)
            .chain(self.externals.iter().map(|(_, base)| base))
            .chain(self.patterns.iter().map(|(base, _)| base))
    }

    /// The walk roots: all bases that are not contained in another base. Nested bases are
    /// reached by walking (the resolver keeps the path to an explicit base open).
    fn walk_roots(&self) -> Vec<PathBuf> {
        let mut roots: Vec<PathBuf> = vec![];
        for base in self.bases() {
            if self
                .bases()
                .any(|other| other != base && base.starts_with(other))
            {
                continue;
            }
            if !roots.contains(base) {
                roots.push(base.clone());
            }
        }
        roots
    }

    /// Whether to keep the given walk entry
    fn keep(&self, entry: &ignore::DirEntry) -> bool {
        // Always keep the walk roots themselves; they are explicitly listed bases
        if entry.depth() == 0 {
            return true;
        }

        let path = entry.path();
        let is_dir = entry.file_type().map(|ft| ft.is_dir()).unwrap_or(false);

        if is_dir {
            self.keep_dir(path)
        } else {
            self.keep_file(path)
        }
    }

    /// Whether to keep walking the given directory: either a source can contribute files
    /// inside of it, or it is on the static path towards an explicitly listed base.
    fn keep_dir(&self, dir: &Path) -> bool {
        // A directory on the static path to an explicit base can always be entered (the base
        // is explicit, so its ignoredness is bypassed), unless everything below it is excluded
        // again by a later `@source not` directive.
        let leads_to_base = |idx: usize, base: &PathBuf| {
            base != dir
                && base.starts_with(dir)
                && !self
                    .nots
                    .iter()
                    .any(|not| not.idx > idx && not.matches(base))
        };
        if self.autos.iter().any(|(idx, base)| leads_to_base(*idx, base))
            || self
                .externals
                .iter()
                .any(|(idx, base)| leads_to_base(*idx, base))
            || self
                .patterns
                .iter()
                .any(|(base, pattern)| leads_to_base(pattern.idx, base))
        {
            return true;
        }

        self.contributes_dir(dir)
    }

    /// Whether at least one source can contribute files inside the given directory. Unlike
    /// [`Resolver::keep_dir`], directories that are only walked to reach an explicitly listed
    /// base don't count: they are not part of any source's content, e.g. for the purpose of
    /// generating file watcher globs.
    fn contributes_dir(&self, dir: &Path) -> bool {
        // Some source must be able to contribute files inside the directory, and not be
        // overridden by a later `@source not` directive.
        let not_after = |idx: usize| {
            self.nots
                .iter()
                .any(|not| not.idx > idx && not.matches(dir))
        };

        if self
            .autos
            .iter()
            .any(|(idx, _)| self.auto_reachable(dir) && !not_after(*idx))
        {
            return true;
        }

        if self
            .externals
            .iter()
            .any(|(idx, _)| self.external_reachable(dir) && !not_after(*idx))
        {
            return true;
        }

        self.patterns.iter().any(|(base, pattern)| {
            dir.strip_prefix(base).is_ok_and(|remainder| {
                dir_could_contain_matches(&pattern.pattern, remainder)
                    && self.pattern_reachable(base, dir)
                    && !not_after(pattern.idx)
            })
        })
    }

    /// Whether at least one source includes the given file
    fn keep_file(&self, file: &Path) -> bool {
        let Some(parent) = file.parent() else {
            return false;
        };

        let not_after = |idx: usize| {
            self.nots
                .iter()
                .any(|not| not.idx > idx && not.matches(file))
        };

        // Auto sources: the file must pass the default rules and the gitignore chain
        if self.autos.iter().any(|(idx, base)| {
            file.starts_with(base)
                && self.auto_reachable(parent)
                && !is_ignored_by_default_file_rules(file)
                && self.ignore_files.matched(file, false, parent, None) != Some(Match::Ignore)
                && !not_after(*idx)
        }) {
            return true;
        }

        // External sources: like auto sources, but the gitignore chain doesn't apply
        if self.externals.iter().any(|(idx, base)| {
            file.starts_with(base)
                && self.external_reachable(parent)
                && !is_ignored_by_default_file_rules(file)
                && !not_after(*idx)
        }) {
            return true;
        }

        // Pattern sources: the file must match the glob. A match beats file-level gitignore
        // rules — you were explicit about wanting files of that shape — and the default file
        // rules only apply when the pattern isn't explicit about the file's shape.
        self.patterns.iter().any(|(base, pattern)| {
            file.strip_prefix(base).is_ok_and(|remainder| {
                glob_match(&pattern.pattern, rooted_posix(remainder).as_bytes())
                    && self.pattern_reachable(base, parent)
                    && (pattern.bypasses_default_file_rules
                        || !is_ignored_by_default_file_rules(file))
                    && !not_after(pattern.idx)
            })
        })
    }

    /// Whether the given directory is reachable for an auto source: every directory on the
    /// path from the auto base down to it passes the default rules and the gitignore chain.
    /// Auto bases themselves are always reachable — a base that is itself ignored would have
    /// been promoted to an external source.
    fn auto_reachable(&self, dir: &Path) -> bool {
        if let Some(reachable) = self.auto_reachable.lock().unwrap().get(dir) {
            return *reachable;
        }

        let reachable = if self.autos.iter().any(|(_, base)| base == dir) {
            true
        } else if !self.autos.iter().any(|(_, base)| dir.starts_with(base)) {
            false
        } else {
            dir.parent().is_some_and(|parent| {
                self.auto_reachable(parent)
                    && !is_ignored_by_default_dir_rules(dir)
                    && self.ignore_files.matched(dir, true, parent, None) != Some(Match::Ignore)
            })
        };

        self.auto_reachable
            .lock()
            .unwrap()
            .insert(dir.to_path_buf(), reachable);
        reachable
    }

    /// Like [`Resolver::auto_reachable`], but for external sources: the gitignore chain
    /// doesn't apply inside of them (git ignores the whole tree anyway), only the default
    /// rules do.
    fn external_reachable(&self, dir: &Path) -> bool {
        if let Some(reachable) = self.external_reachable.lock().unwrap().get(dir) {
            return *reachable;
        }

        let reachable = if self.externals.iter().any(|(_, base)| base == dir) {
            true
        } else if !self.externals.iter().any(|(_, base)| dir.starts_with(base)) {
            false
        } else {
            dir.parent().is_some_and(|parent| {
                self.external_reachable(parent) && !is_ignored_by_default_dir_rules(dir)
            })
        };

        self.external_reachable
            .lock()
            .unwrap()
            .insert(dir.to_path_buf(), reachable);
        reachable
    }

    /// Like [`Resolver::auto_reachable`], but for a pattern source with the given base: only
    /// `.gitignore` files at or below the base apply — the static base is explicit, so
    /// everything above it is bypassed.
    fn pattern_reachable(&self, base: &Path, dir: &Path) -> bool {
        if let Some(reachable) = self
            .pattern_reachable
            .lock()
            .unwrap()
            .get(&(base.to_path_buf(), dir.to_path_buf()))
        {
            return *reachable;
        }

        let reachable = if base == dir {
            true
        } else if !dir.starts_with(base) {
            false
        } else {
            dir.parent().is_some_and(|parent| {
                self.pattern_reachable(base, parent)
                    && !is_ignored_by_default_dir_rules(dir)
                    && self.ignore_files.matched(dir, true, parent, Some(base))
                        != Some(Match::Ignore)
            })
        };

        self.pattern_reachable
            .lock()
            .unwrap()
            .insert((base.to_path_buf(), dir.to_path_buf()), reachable);
        reachable
    }
}

/// The verdict of the on-disk ignore files for a path
#[derive(Debug, Clone, Copy, PartialEq)]
enum Match {
    Ignore,
    Whitelist,
}

/// A lazily-loaded cache of the on-disk ignore files (`.gitignore`, `.ignore` and the
/// repository's `.git/info/exclude`).
#[derive(Debug, Default)]
struct IgnoreFiles {
    /// Compiled ignore rules per directory (`None` when the directory has no ignore files)
    matchers: Mutex<FxHashMap<PathBuf, Option<Arc<Gitignore>>>>,

    /// The matcher chains per directory: all matchers that apply to paths inside the
    /// directory, deepest first, from the directory itself up to the repository root (or the
    /// file system root outside of a git repository, matching `git init`-less projects where
    /// all ancestor `.gitignore` files apply)
    chains: Mutex<FxHashMap<PathBuf, Arc<Vec<Arc<Gitignore>>>>>,
}

impl IgnoreFiles {
    /// The verdict of the ignore files for the given path. `dir` is the directory containing
    /// the path (matchers are looked up for that directory), and `below` optionally restricts
    /// the chain to ignore files at or below the given directory.
    ///
    /// The deepest ignore file with a definitive answer wins, matching git's precedence.
    fn matched(&self, path: &Path, is_dir: bool, dir: &Path, below: Option<&Path>) -> Option<Match> {
        for matcher in self.chain(dir).iter() {
            if below.is_some_and(|below| !matcher.path().starts_with(below)) {
                // Chains are ordered deepest first, so nothing below the boundary can follow
                break;
            }

            match matcher.matched(path, is_dir) {
                ignore::Match::Ignore(_) => return Some(Match::Ignore),
                ignore::Match::Whitelist(_) => return Some(Match::Whitelist),
                ignore::Match::None => {}
            }
        }

        None
    }

    /// The matcher chain for paths inside the given directory: the directory's own matcher
    /// first, then its parents' matchers, up to and including the git repository root.
    fn chain(&self, dir: &Path) -> Arc<Vec<Arc<Gitignore>>> {
        if let Some(chain) = self.chains.lock().unwrap().get(dir) {
            return chain.clone();
        }

        let is_repo_root = dir.join(".git").exists();

        let mut chain = vec![];
        if let Some(matcher) = self.matcher(dir, is_repo_root) {
            chain.push(matcher);
        }

        // Stop at the git repository root so that ignore files outside of the repository are
        // not considered. Without a repository, all ancestor ignore files apply.
        if !is_repo_root {
            if let Some(parent) = dir.parent() {
                chain.extend(self.chain(parent).iter().cloned());
            }
        }

        let chain = Arc::new(chain);
        self.chains
            .lock()
            .unwrap()
            .insert(dir.to_path_buf(), chain.clone());
        chain
    }

    /// The compiled ignore rules of the given directory, combining (from low to high
    /// precedence) the repository's `.git/info/exclude`, the `.gitignore` file, and the
    /// `.ignore` file.
    fn matcher(&self, dir: &Path, is_repo_root: bool) -> Option<Arc<Gitignore>> {
        if let Some(matcher) = self.matchers.lock().unwrap().get(dir) {
            return matcher.clone();
        }

        let mut builder = GitignoreBuilder::new(dir);
        let mut any = false;

        let mut add = |file: PathBuf| {
            if file.is_file() {
                // I/O errors and partially invalid ignore files are ignored, matching the
                // walker's behavior.
                let _ = builder.add(file);
                any = true;
            }
        };

        if is_repo_root {
            add(dir.join(".git").join("info").join("exclude"));
        }
        add(dir.join(".gitignore"));
        add(dir.join(".ignore"));

        let matcher = if any {
            builder.build().ok().map(Arc::new)
        } else {
            None
        };

        self.matchers
            .lock()
            .unwrap()
            .insert(dir.to_path_buf(), matcher.clone());
        matcher
    }
}

/// Whether a directory is ignored by the default rules (e.g. `node_modules`). Only the
/// directory's own name is checked; the path towards it is checked by the reachability
/// helpers one directory at a time.
fn is_ignored_by_default_dir_rules(dir: &Path) -> bool {
    auto_source_detection::RULES
        .iter()
        .any(|ignore| ignore.matched(dir, true).is_ignore())
}

/// A glob pattern of a `Pattern` source, together with the position of its `@source` directive.
#[derive(Debug, Clone)]
struct PatternRule {
    /// Position of the `@source` directive, used to resolve conflicts with `@source not`
    /// directives: the later directive wins.
    idx: usize,

    /// The glob pattern, relative to the walker's base, e.g. `/ba*/*.html`
    pattern: String,

    /// Whether the pattern is explicit enough to bypass the default file rules: it names a
    /// concrete file (e.g. `.env` or `do-include-me.bin`) or pins a specific extension (e.g.
    /// `*.html` or `logo.png`). Patterns that don't (e.g. `blog/*/**/*`) re-apply the default
    /// file rules.
    bypasses_default_file_rules: bool,
}

/// An `@source not` directive, together with its position.
#[derive(Debug, Clone)]
struct NotRule {
    /// Position of the `@source not` directive
    idx: usize,

    base: PathBuf,

    /// The glob pattern, relative to `base`, e.g. `/ignored/**/*`
    pattern: String,
}

impl NotRule {
    /// Whether this directive excludes the given path: a file, or a directory and thereby
    /// everything inside of it.
    ///
    /// Like a gitignore rule, the pattern excludes a whole subtree when it matches a
    /// directory, so besides the path itself every ancestor directory (up to the directive's
    /// base) is tested as well. E.g. `@source not "./src/ba*"` excludes `src/bar/index.html`
    /// because `/ba*` matches the `src/bar` directory. Note that directory-shaped directives
    /// (`@source not "./some/dir"`) are normalized to a `/**/*` pattern with the directory as
    /// its base, which matches everything inside the directory directly.
    fn matches(&self, path: &Path) -> bool {
        let Ok(remainder) = path.strip_prefix(&self.base) else {
            return false;
        };

        // A directory-shaped directive (normalized to a `/**/*` pattern) also excludes the
        // base directory itself, not just its contents, so the directory can be pruned.
        if remainder.as_os_str().is_empty() {
            return self.pattern == "/**/*";
        }

        remainder.ancestors().any(|prefix| {
            !prefix.as_os_str().is_empty()
                && glob_match(&self.pattern, rooted_posix(prefix).as_bytes())
        })
    }
}

/// Collect all `@source not` directives with their positions.
fn collect_not_rules(sources: &Sources) -> Vec<NotRule> {
    sources
        .iter()
        .enumerate()
        .filter_map(|(idx, source)| match source {
            SourceEntry::Ignored { base, pattern } => Some(NotRule {
                idx,
                base: base.clone(),
                pattern: pattern.clone(),
            }),
            _ => None,
        })
        .collect()
}

/// Serialize a path relative to some base as a `/`-rooted posix style string, e.g.
/// `/ba*/index.html`, matching how source patterns are stored.
fn rooted_posix(path: &Path) -> String {
    let posix = crate::scanner::sources::path_to_posix_string(path);
    if posix.starts_with('/') {
        posix
    } else {
        format!("/{posix}")
    }
}

/// Whether a directory (relative to the pattern's base) can contain files matching the pattern.
/// Used to prune directories that can never contribute, e.g. for `/ba*/*.html` only `ba*`
/// directories are entered.
fn dir_could_contain_matches(pattern: &str, dir: &Path) -> bool {
    let pattern_components: Vec<&str> = pattern
        .trim_start_matches('/')
        .split('/')
        .filter(|c| !c.is_empty())
        .collect();

    for (i, component) in dir.components().enumerate() {
        let component = component.as_os_str().to_string_lossy();

        // Once we see a `**` everything nested can contain matches
        match pattern_components.get(i) {
            Some(&"**") => return true,
            // The last pattern component matches files, not directories. A directory nested
            // deeper than the pattern's directory part can never contain matches.
            Some(_) if i + 1 >= pattern_components.len() => return false,
            Some(pattern_component) => {
                if !glob_match(pattern_component, component.as_bytes()) {
                    return false;
                }
            }
            None => return false,
        }
    }

    true
}

/// Whether a pattern is explicit enough to bypass the default file rules.
///
/// A pattern without any wildcards names a concrete file, e.g. `/.env` or
/// `/do-include-me.bin` — you asked for exactly this file, so the default rules never apply.
/// A pattern that pins a specific extension, e.g. `/*.html` or `/**/*.bin`, bypasses them as
/// well. Patterns that do neither (e.g. `/blog/*/**/*`) keep the default file rules applied.
fn pattern_bypasses_default_file_rules(pattern: &str) -> bool {
    // Concrete file, no wildcards (braces have already been expanded away)
    if !pattern.contains(['*', '?', '[']) {
        return true;
    }

    // Pinned extension
    match Path::new(pattern).extension().and_then(|ext| ext.to_str()) {
        Some(ext) => !ext.contains(['*', '?', '[']),
        None => false,
    }
}

/// Whether a file is ignored by the default file-level rules (binary extensions, ignored
/// extensions, lock files, …).
fn is_ignored_by_default_file_rules(path: &Path) -> bool {
    auto_source_detection::RULES
        .iter()
        .any(|ignore| ignore.matched(path, false).is_ignore())
}

#[cfg(test)]
mod tests {
    use super::{ChangedContent, Scanner};
    use pretty_assertions::assert_eq;

    #[test]
    fn test_positions() {
        let mut scanner = Scanner::new(vec![]);

        for (input, expected) in [
            // Before migrations
            (
                r#"<div class="!tw__flex sm:!tw__block tw__bg-gradient-to-t flex tw:[color:red] group-[]:tw__flex"#,
                vec![
                    ("class".to_string(), 5),
                    ("!tw__flex".to_string(), 12),
                    ("sm:!tw__block".to_string(), 22),
                    ("tw__bg-gradient-to-t".to_string(), 36),
                    ("flex".to_string(), 57),
                    ("tw:[color:red]".to_string(), 62),
                    ("group-[]:tw__flex".to_string(), 77),
                ],
            ),
            // After migrations
            (
                r#"<div class="tw:flex! tw:sm:block! tw:bg-linear-to-t flex tw:[color:red] tw:in-[.tw\:group]:flex"></div>"#,
                vec![
                    ("class".to_string(), 5),
                    ("tw:flex!".to_string(), 12),
                    ("tw:sm:block!".to_string(), 21),
                    ("tw:bg-linear-to-t".to_string(), 34),
                    ("flex".to_string(), 52),
                    ("tw:[color:red]".to_string(), 57),
                    ("tw:in-[.tw\\:group]:flex".to_string(), 72),
                ],
            ),
        ] {
            let candidates = scanner.get_candidates_with_positions(ChangedContent::Content(
                input.to_string(),
                "html".into(),
            ));
            assert_eq!(candidates, expected);
        }
    }
}
