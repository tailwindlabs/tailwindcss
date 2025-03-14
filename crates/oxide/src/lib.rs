use crate::glob::optimize_public_source_entry;
use crate::scanner::allowed_paths::AUTO_SOURCE_DETECTION_RULES;
use bexpand::Expression;
use bstr::ByteSlice;
use extractor::{Extracted, Extractor};
use fxhash::{FxHashMap, FxHashSet};
use glob::optimize_patterns;
use ignore::gitignore::GitignoreBuilder;
use paths::Path;
use rayon::prelude::*;
use scanner::allowed_paths::create_walk_builder;
use scanner::detect_sources::resolve_globs;
use std::borrow::Cow;
use std::collections::BTreeMap;
use std::collections::BTreeSet;
use std::fs;
use std::path::PathBuf;
use std::sync;
use std::time::SystemTime;
use tracing::event;

pub mod cursor;
pub mod extractor;
pub mod fast_skip;
pub mod glob;
pub mod paths;
pub mod scanner;
pub mod throughput;

// @source "some/folder";               // This is auto source detection
// @source "some/folder/**/*";          // This is auto source detection
// @source "some/folder/*.html";        // This is just a glob, but new files matching this should be included
// @source "node_modules/my-ui-lib";    // Auto source detection but since node_modules is explicit we allow it
//                                      // Maybe could be considered `external(…)` automatically if:
//                                      // 1. It's git ignored but listed explicitly
//                                      // 2. It exists outside of the current working directory (do we know that?)
//
// @source "do-include-me.bin";         // `.bin` is typically ignored, but now it's explicit so should be included
// @source "git-ignored.html";          // A git ignored file that is listed explicitly, should be scanned

static SHOULD_TRACE: sync::LazyLock<bool> = sync::LazyLock::new(
    || matches!(std::env::var("DEBUG"), Ok(value) if value.eq("*") || (value.contains("tailwindcss:oxide") && !value.contains("-tailwindcss:oxide"))),
);

fn init_tracing() {
    if !*SHOULD_TRACE {
        return;
    }

    _ = tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_span_events(tracing_subscriber::fmt::format::FmtSpan::ACTIVE)
        .compact()
        .try_init();
}

#[derive(Debug, Clone)]
pub enum ChangedContent<'a> {
    File(PathBuf, Cow<'a, str>),
    Content(String, Cow<'a, str>),
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

#[derive(Debug, Clone, PartialEq)]
pub struct GlobEntry {
    pub base: String,
    pub pattern: String,
}

#[derive(Debug, Clone)]
pub struct PublicSourceEntry {
    /// Base path of the glob
    pub base: String,

    /// Glob pattern
    pub pattern: String,

    /// Negated flag
    pub negated: bool,
}

impl PublicSourceEntry {
    pub fn from_pattern(dir: PathBuf, pattern: &str) -> Self {
        let mut parts = pattern.split_whitespace();
        let _ = parts.next().unwrap_or_default();
        let not_or_pattern = parts.next().unwrap_or_default();
        if not_or_pattern == "not" {
            let pattern = parts.next().unwrap_or_default();
            return Self {
                base: dir.to_string_lossy().into(),
                pattern: pattern[1..pattern.len() - 1].to_string(),
                negated: true,
            };
        }

        Self {
            base: dir.to_string_lossy().into(),
            pattern: not_or_pattern[1..not_or_pattern.len() - 1].to_string(),
            negated: false,
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub enum SourceEntry {
    /// Auto source detection
    ///
    /// Represented by:
    ///
    /// ```css
    /// @source "src";`
    /// @source "src/**/*";`
    /// ```
    Auto { base: PathBuf },

    /// Ignored auto source detection
    ///
    /// Represented by:
    ///
    /// ```css
    /// @source not "src";`
    /// @source not "src/**/*";`
    /// ```
    IgnoredAuto { base: PathBuf },

    /// Explicit source pattern regardless of any auto source detection rules
    ///
    /// Represented by:
    ///
    /// ```css
    /// @source "src/**/*.html";`
    /// ```
    Pattern { base: PathBuf, pattern: String },

    /// Explicit ignored source pattern regardless of any auto source detection rules
    ///
    /// Represented by:
    ///
    /// ```css
    /// @source not "src/**/*.html";`
    /// ```
    IgnoredPattern { base: PathBuf, pattern: String },
}

impl From<SourceEntry> for GlobEntry {
    fn from(value: SourceEntry) -> Self {
        match value {
            SourceEntry::Auto { base } => GlobEntry {
                base: base.to_string_lossy().into(),
                pattern: "**/*".into(),
            },
            SourceEntry::Pattern { base, pattern } => GlobEntry {
                base: base.to_string_lossy().into(),
                pattern: pattern.clone(),
            },
            SourceEntry::IgnoredAuto { base } => GlobEntry {
                base: base.to_string_lossy().into(),
                pattern: "**/*".into(),
            },
            SourceEntry::IgnoredPattern { base, pattern } => GlobEntry {
                base: base.to_string_lossy().into(),
                pattern: pattern.clone(),
            },
        }
    }
}

impl From<&SourceEntry> for GlobEntry {
    fn from(value: &SourceEntry) -> Self {
        match value {
            SourceEntry::Auto { base } => GlobEntry {
                base: base.to_string_lossy().into(),
                pattern: "**/*".into(),
            },
            SourceEntry::Pattern { base, pattern } => GlobEntry {
                base: base.to_string_lossy().into(),
                pattern: pattern.clone(),
            },
            SourceEntry::IgnoredAuto { base } => GlobEntry {
                base: base.to_string_lossy().into(),
                pattern: "**/*".into(),
            },
            SourceEntry::IgnoredPattern { base, pattern } => GlobEntry {
                base: base.to_string_lossy().into(),
                pattern: pattern.clone(),
            },
        }
    }
}

#[derive(Debug, Clone, Default)]
pub struct Sources {
    sources: Vec<SourceEntry>,
}

impl Sources {
    fn new(sources: Vec<SourceEntry>) -> Self {
        Self { sources }
    }

    fn iter(&self) -> impl Iterator<Item = &SourceEntry> {
        self.sources.iter()
    }

    fn is_empty(&self) -> bool {
        self.sources.is_empty()
    }
}

#[derive(Debug, Clone, Default)]
pub struct Scanner {
    /// Content sources
    sources: Sources,

    /// Scanner is ready to scan. We delay the file system traversal for detecting all files until
    /// we actually need them.
    ready: bool,

    /// All files that we have to scan
    files: Vec<PathBuf>,

    /// All directories, sub-directories, etc… we saw during source detection
    dirs: Vec<PathBuf>,

    /// All generated globs, used for setting up watchers
    globs: Vec<GlobEntry>,

    /// Track file modification times
    mtimes: FxHashMap<PathBuf, SystemTime>,

    /// Track unique set of candidates
    candidates: FxHashSet<String>,
}

/// For each public source entry:
///
/// 1. Perform brace expansion
///
/// ```diff
/// - { base: '/', pattern: 'src/{foo,bar}.html'}
/// + { base: '/', pattern: 'src/foo.html'}
/// + { base: '/', pattern: 'src/bar.html'}
/// ```
///
/// 2. Hoist static parts, e.g.:
///
/// ```diff
/// - { base: '/', pattern: 'src/**/*.html'}
/// + { base: '/src', pattern: '**/*.html'}
/// ```
///
/// 3. Convert to private SourceEntry
///
pub fn public_source_entries_to_private_source_entries(
    sources: Vec<PublicSourceEntry>,
) -> Vec<SourceEntry> {
    // Perform brace expansion
    let expanded_globs = sources
        .into_iter()
        .flat_map(|source| {
            let expression: Result<Expression, _> = source.pattern[..].try_into();
            let Ok(expression) = expression else {
                return vec![source];
            };

            expression
                .into_iter()
                .filter_map(Result::ok)
                .map(move |pattern| PublicSourceEntry {
                    base: source.base.clone(),
                    pattern: pattern.into(),
                    negated: source.negated,
                })
                .collect::<Vec<_>>()
        })
        .map(|mut public_source| {
            optimize_public_source_entry(&mut public_source);
            public_source
        })
        .collect::<Vec<_>>();

    // Convert from public SourceEntry to private SourceEntry
    expanded_globs
        .into_iter()
        .map(Into::into)
        .collect::<Vec<_>>()
}

impl From<PublicSourceEntry> for SourceEntry {
    fn from(value: PublicSourceEntry) -> Self {
        let auto = value.pattern.ends_with("**/*")
            || PathBuf::from(&value.base).join(&value.pattern).is_dir();

        match (value.negated, auto) {
            (false, true) => SourceEntry::Auto {
                base: value.base.into(),
            },
            (false, false) => SourceEntry::Pattern {
                base: value.base.into(),
                pattern: value.pattern,
            },
            (true, true) => SourceEntry::IgnoredAuto {
                base: value.base.into(),
            },
            (true, false) => SourceEntry::IgnoredPattern {
                base: value.base.into(),
                pattern: value.pattern,
            },
        }
    }
}

impl From<GlobEntry> for SourceEntry {
    fn from(value: GlobEntry) -> Self {
        SourceEntry::Pattern {
            base: PathBuf::from(value.base),
            pattern: value.pattern,
        }
    }
}

impl Scanner {
    pub fn new(sources: Vec<PublicSourceEntry>) -> Self {
        let sources = public_source_entries_to_private_source_entries(sources);
        let sources = Sources::new(sources);

        Self {
            sources,
            ..Default::default()
        }
    }

    pub fn scan(&mut self) -> Vec<String> {
        init_tracing();

        self.prepare();
        self.compute_candidates();

        let mut candidates: Vec<String> = self.candidates.clone().into_par_iter().collect();
        candidates.par_sort_unstable();

        candidates
    }

    #[tracing::instrument(skip_all)]
    pub fn scan_content(&mut self, changed_content: Vec<ChangedContent>) -> Vec<String> {
        self.prepare();
        let candidates = parse_all_blobs(read_all_files(changed_content));

        let mut new_candidates = vec![];
        for candidate in candidates {
            if self.candidates.contains(&candidate) {
                continue;
            }
            self.candidates.insert(candidate.clone());
            new_candidates.push(candidate);
        }

        new_candidates
    }

    #[tracing::instrument(skip_all)]
    pub fn get_candidates_with_positions(
        &mut self,
        changed_content: ChangedContent,
    ) -> Vec<(String, usize)> {
        self.prepare();

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
    pub fn get_files(&mut self) -> Vec<String> {
        self.prepare();

        self.files
            .par_iter()
            .filter_map(|x| Path::from(x.clone()).canonicalize().ok())
            .map(|x| x.to_string())
            .collect()
    }

    #[tracing::instrument(skip_all)]
    pub fn get_globs(&mut self) -> Vec<GlobEntry> {
        self.prepare();

        self.globs.clone()
    }

    #[tracing::instrument(skip_all)]
    fn compute_candidates(&mut self) {
        let mut changed_content = vec![];

        let current_mtimes = self
            .files
            .par_iter()
            .map(|path| {
                fs::metadata(path)
                    .and_then(|m| m.modified())
                    .unwrap_or(SystemTime::now())
            })
            .collect::<Vec<_>>();

        for (idx, path) in self.files.iter().enumerate() {
            let current_time = current_mtimes[idx];
            let previous_time = self.mtimes.insert(path.clone(), current_time);

            let should_scan_file = match previous_time {
                // Time has changed, so we need to re-scan the file
                Some(prev) if prev != current_time => true,

                // File was in the cache, no need to re-scan
                Some(_) => false,

                // File didn't exist before, so we need to scan it
                None => true,
            };

            if should_scan_file {
                let extension = path.extension().unwrap_or_default().to_string_lossy();
                changed_content.push(ChangedContent::File(path.to_path_buf(), extension))
            }
        }

        if !changed_content.is_empty() {
            let candidates = parse_all_blobs(read_all_files(changed_content));
            self.candidates.par_extend(candidates);
        }
    }

    // Ensures that all files/globs are resolved and the scanner is ready to scan
    // content for candidates.
    fn prepare(&mut self) {
        if self.ready {
            self.check_for_new_files();
            return;
        }

        let start = std::time::Instant::now();
        self.scan_sources();
        eprintln!("Scanned sources in {:?}", start.elapsed());

        self.ready = true;
    }

    #[tracing::instrument(skip_all)]
    fn check_for_new_files(&mut self) {
        // let current_mtimes = self
        //     .dirs
        //     .par_iter()
        //     .map(|path| {
        //         fs::metadata(path)
        //             .and_then(|m| m.modified())
        //             .unwrap_or(SystemTime::now())
        //     })
        //     .collect::<Vec<_>>();
        //
        // let mut modified_dirs: Vec<PathBuf> = vec![];
        //
        // // Check all directories to see if they were modified
        // for (idx, path) in self.dirs.iter().enumerate() {
        //     let current_time = current_mtimes[idx];
        //     let previous_time = self.mtimes.insert(path.clone(), current_time);
        //
        //     let should_scan = match previous_time {
        //         // Time has changed, so we need to re-scan the file
        //         Some(prev) if prev != current_time => true,
        //
        //         // File was in the cache, no need to re-scan
        //         Some(_) => false,
        //
        //         // File didn't exist before, so we need to scan it
        //         None => true,
        //     };
        //
        //     if should_scan {
        //         modified_dirs.push(path.clone());
        //     }
        // }
        //
        // // Scan all modified directories for their immediate files
        // let mut known = FxHashSet::from_iter(self.files.iter().chain(self.dirs.iter()).cloned());
        // while !modified_dirs.is_empty() {
        //     let new_entries = modified_dirs
        //         .iter()
        //         .flat_map(|dir| read_dir(dir, Some(1)))
        //         .map(|entry| entry.path().to_owned())
        //         .filter(|path| !known.contains(path))
        //         .collect::<Vec<_>>();
        //
        //     modified_dirs.clear();
        //
        //     for path in new_entries {
        //         if !self.sources.is_allowed(path.clone()) {
        //             continue;
        //         }
        //
        //         if path.is_file() {
        //             known.insert(path.clone());
        //             self.files.push(path);
        //         } else if path.is_dir() {
        //             known.insert(path.clone());
        //             self.dirs.push(path.clone());
        //
        //             // Recursively scan the new directory for files
        //             modified_dirs.push(path);
        //         }
        //     }
        // }
    }

    #[tracing::instrument(skip_all)]
    fn scan_sources(&mut self) {
        if self.sources.is_empty() {
            return;
        }

        let mut roots: FxHashSet<&PathBuf> = FxHashSet::default();
        let mut ignores: BTreeMap<&PathBuf, BTreeSet<String>> = Default::default();

        let mut auto_content_roots = FxHashSet::default();

        for source in self.sources.iter() {
            match source {
                SourceEntry::Auto { base } => {
                    auto_content_roots.insert(base);
                    roots.insert(base);
                }
                SourceEntry::IgnoredAuto { base } => {
                    ignores.entry(base).or_default().insert("**/*".to_string());
                }
                SourceEntry::Pattern { base, pattern } => {
                    roots.insert(base);
                    ignores
                        .entry(base)
                        .or_default()
                        .insert(format!("!{}", pattern));
                }
                SourceEntry::IgnoredPattern { base, pattern } => {
                    ignores.entry(base).or_default().insert(pattern.to_string());
                }
            }
        }
        for root in &roots {
            // Insert a glob for the base path, so we can see new files/folders in the directory itself.
            self.globs.push(GlobEntry {
                base: root.to_string_lossy().into(),
                pattern: "*".into(),
            });
        }

        // PERF: Prevent scanning the same directory multiple times. Get rid of roots which
        // parent is already in the list of roots.
        let roots: Vec<&PathBuf> = roots.into_iter().collect();
        dbg!(&roots);
        // let parents = roots.clone();
        // roots.retain(|root| {
        //     let mut parent = root.parent();
        //     while let Some(p) = parent {
        //         let path_buf = p.to_path_buf();
        //         if parents.contains(&&path_buf) {
        //             return false;
        //         }
        //         parent = p.parent();
        //     }
        //     true
        // });

        // Leftover roots
        let roots = roots.iter().collect::<Vec<_>>();

        let mut roots = roots.into_iter();
        let Some(first_root) = roots.next() else {
            return;
        };

        let mut builder = create_walk_builder(first_root);

        // Add other roots
        for root in roots {
            builder.add(root);
        }

        builder.add_gitignore(AUTO_SOURCE_DETECTION_RULES.clone());

        // Add all additional gitignore rules
        for (base, patterns) in ignores {
            let mut ignore_builder = GitignoreBuilder::new("");
            for pattern in patterns {
                // So... we have to combine patterns with the base path and make them absolute. For
                // some reason this is not handled by the `ignore` crate. (I'm pretty sure we might
                // be doing something wrong as well. But this solves it, for now.)
                let absolute_pattern = match pattern.strip_prefix("!") {
                    Some(pattern) => format!("!{}/{}", base.to_string_lossy(), pattern),
                    None => format!("{}/{}", base.to_string_lossy(), pattern),
                };
                ignore_builder.add_line(None, &absolute_pattern).unwrap();
            }
            let ignore = ignore_builder.build().unwrap();
            builder.add_gitignore(ignore);
        }

        for entry in builder.build().filter_map(Result::ok) {
            let path = entry.path();
            if path.is_dir() {
                self.dirs.push(path.to_owned());
            }
            if path.is_file() {
                self.files.push(path.to_owned());
            }
        }

        // TODO: BEWARE OF THE DRAGONS
        for root in auto_content_roots {
            let globs = resolve_globs(root.to_path_buf(), &self.dirs);
            self.globs.extend(globs);
        }

        // Re-optimize the globs to reduce the number of patterns we have to scan.
        self.globs = optimize_patterns(&self.globs);
    }
}

fn read_changed_content(c: ChangedContent) -> Option<Vec<u8>> {
    let (content, extension) = match c {
        ChangedContent::File(file, extension) => match std::fs::read(&file) {
            Ok(content) => (content, extension),
            Err(e) => {
                event!(tracing::Level::ERROR, "Failed to read file: {:?}", e);
                return None;
            }
        },

        ChangedContent::Content(contents, extension) => (contents.into_bytes(), extension),
    };

    Some(pre_process_input(&content, &extension))
}

pub fn pre_process_input(content: &[u8], extension: &str) -> Vec<u8> {
    use crate::extractor::pre_processors::*;

    match extension {
        "cshtml" | "razor" => Razor.process(content),
        "haml" => Haml.process(content),
        "json" => Json.process(content),
        "pug" => Pug.process(content),
        "rb" | "erb" => Ruby.process(content),
        "slim" => Slim.process(content),
        "svelte" => Svelte.process(content),
        _ => content.to_vec(),
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
fn parse_all_blobs(blobs: Vec<Vec<u8>>) -> Vec<String> {
    let mut result: Vec<_> = blobs
        .par_iter()
        .flat_map(|blob| blob.par_split(|x| *x == b'\n'))
        .filter_map(|blob| {
            if blob.is_empty() {
                return None;
            }

            let extracted = crate::extractor::Extractor::new(blob).extract();
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
        .collect();

    // SAFETY: Unstable sort is faster and in this scenario it's also safe because we are
    //         guaranteed to have unique candidates.
    result.par_sort_unstable();

    result
}

#[cfg(test)]
mod tests {
    use crate::Scanner;

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
            let candidates = scanner.get_candidates_with_positions(crate::ChangedContent::Content(
                input.to_string(),
                "html".into(),
            ));
            assert_eq!(candidates, expected);
        }
    }
}
