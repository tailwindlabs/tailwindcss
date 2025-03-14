use crate::glob::optimize_patterns;
use crate::glob::optimize_public_source_entry;
use crate::scanner::allowed_paths::AUTO_SOURCE_DETECTION_RULES;
use bexpand::Expression;
use bstr::ByteSlice;
use extractor::{Extracted, Extractor};
use fxhash::{FxHashMap, FxHashSet};
use ignore::gitignore::GitignoreBuilder;
use ignore::WalkBuilder;
use paths::Path;
use rayon::prelude::*;
use std::collections::BTreeMap;
use std::collections::BTreeSet;
use std::path::PathBuf;
use std::sync;
use std::sync::Arc;
use std::sync::Mutex;
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
}

#[derive(Debug, Clone, Default)]
pub struct Scanner {
    /// Content sources
    walker: Option<WalkBuilder>,

    /// All files that we have to scan
    files: Vec<PathBuf>,

    /// All directories, sub-directories, etc… we saw during source detection
    dirs: Vec<PathBuf>,

    /// All generated globs, used for setting up watchers
    globs: Vec<GlobEntry>,

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
            walker: create_walker(sources, Default::default()),
            ..Default::default()
        }
    }

    pub fn scan(&mut self) -> Vec<String> {
        init_tracing();

        let start = std::time::Instant::now();
        self.scan_sources();
        eprintln!("Scanned sources in {:?}", start.elapsed());

        let mut candidates: Vec<String> = self.candidates.clone().into_par_iter().collect();
        candidates.par_sort_unstable();

        candidates
    }

    #[tracing::instrument(skip_all)]
    pub fn scan_content(&mut self, changed_content: Vec<ChangedContent>) -> Vec<String> {
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
        let start = std::time::Instant::now();
        self.scan_sources();
        eprintln!("Scanned sources in {:?}", start.elapsed());

        self.files
            .par_iter()
            .filter_map(|x| Path::from(x.clone()).canonicalize().ok())
            .map(|x| x.to_string())
            .collect()
    }

    #[tracing::instrument(skip_all)]
    pub fn get_globs(&mut self) -> Vec<GlobEntry> {
        let start = std::time::Instant::now();
        self.scan_sources();
        eprintln!("Scanned sources in {:?}", start.elapsed());

        self.globs.clone()
    }

    #[tracing::instrument(skip_all)]
    fn scan_sources(&mut self) {
        let Some(walker) = &mut self.walker else {
            return;
        };

        let mut changed_content = vec![];

        for entry in walker.build().filter_map(Result::ok) {
            let path = entry.path();
            if path.is_dir() {
                self.dirs.push(path.to_owned());
            }
            if path.is_file() {
                self.files.push(path.to_owned());

                let Some(extension) = path.extension().and_then(|x| x.to_str()) else {
                    continue;
                };
                changed_content.push(ChangedContent::File(
                    path.to_path_buf(),
                    extension.to_owned(),
                ))
            }
        }

        if !changed_content.is_empty() {
            let candidates = parse_all_blobs(read_all_files(changed_content));
            self.candidates.par_extend(candidates);
        }

        // TODO: BEWARE OF THE DRAGONS
        // for root in auto_content_roots {
        //     let globs = resolve_globs(root.to_path_buf(), &self.dirs);
        //     self.globs.extend(globs);
        // }

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

fn create_walker(
    sources: Sources,
    mtimes: Arc<Mutex<FxHashMap<PathBuf, SystemTime>>>,
) -> Option<WalkBuilder> {
    let mut roots: FxHashSet<&PathBuf> = FxHashSet::default();
    let mut ignores: BTreeMap<&PathBuf, BTreeSet<String>> = Default::default();

    let mut auto_content_roots = FxHashSet::default();

    for source in sources.iter() {
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

    for _root in &roots {
        // Insert a glob for the base path, so we can see new files/folders in the directory itself.
        // self.globs.push(GlobEntry {
        //     base: root.to_string_lossy().into(),
        //     pattern: "*".into(),
        // });
    }

    // PERF: Prevent scanning the same directory multiple times. Get rid of roots which
    // parent is already in the list of roots.
    let roots: Vec<&PathBuf> = roots.into_iter().collect();
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
    let first_root = roots.next()?;

    let mut builder = WalkBuilder::new(first_root);

    // Scan hidden files / directories
    builder.hidden(false);

    // Don't respect global gitignore files
    builder.git_global(false);

    // By default, allow .gitignore files to be used regardless of whether or not
    // a .git directory is present. This is an optimization for when projects
    // are first created and may not be in a git repo yet.
    builder.require_git(false);

    // Don't descend into .git directories inside the root folder
    // This is necessary when `root` contains the `.git` dir.
    builder.filter_entry(|entry| entry.file_name() != ".git");

    // If we are in a git repo then require it to ensure that only rules within
    // the repo are used. For example, we don't want to consider a .gitignore file
    // in the user's home folder if we're in a git repo.
    //
    // The alternative is using a call like `.parents(false)` but that will
    // prevent looking at parent directories for .gitignore files from within
    // the repo and that's not what we want.
    //
    // For example, in a project with this structure:
    //
    // home
    // .gitignore
    //  my-project
    //   .gitignore
    //   apps
    //     .gitignore
    //     web
    //       {root}
    //
    // We do want to consider all .gitignore files listed:
    // - home/.gitignore
    // - my-project/.gitignore
    // - my-project/apps/.gitignore
    //
    // However, if a repo is initialized inside my-project then only the following
    // make sense for consideration:
    // - my-project/.gitignore
    // - my-project/apps/.gitignore
    //
    // Setting the require_git(true) flag conditionally allows us to do this.
    for parent in first_root.ancestors() {
        if parent.join(".git").exists() {
            builder.require_git(true);
            break;
        }
    }

    // Add other roots
    for root in roots {
        builder.add(root);
    }

    // Setup auto source detection rules
    builder.add_gitignore(AUTO_SOURCE_DETECTION_RULES.clone());

    // Setup ignores based on `@source` definitions
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

    // Setup filter based on changed files
    let mtimes = Arc::clone(&mtimes);
    builder.filter_entry({
        move |entry| {
            let current_time = match entry.metadata() {
                Ok(metadata) => metadata.modified().unwrap_or(SystemTime::now()),
                Err(_) => SystemTime::now(),
            };

            let mut mtimes = mtimes.lock().unwrap();
            let previous_time = mtimes.insert(entry.clone().into_path(), current_time);

            match previous_time {
                // Time has changed, so we need to re-scan the entry
                Some(prev) if prev != current_time => true,

                // Entry was in the cache, no need to re-scan
                Some(_) => false,

                // Entry didn't exist before, so we need to scan it
                None => true,
            }
        }
    });

    Some(builder)
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
