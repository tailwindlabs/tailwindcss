use crate::glob::hoist_static_glob_parts;
use crate::scanner::allowed_paths::resolve_paths;
use crate::scanner::detect_sources::DetectSources;
use bexpand::Expression;
use bstr::ByteSlice;
use extractor::{Extracted, Extractor};
use fast_glob::glob_match;
use fxhash::{FxHashMap, FxHashSet};
use glob::optimize_patterns;
use paths::Path;
use rayon::prelude::*;
use scanner::allowed_paths::read_dir;
use std::borrow::Cow;
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

#[derive(Debug, Clone, Default)]
pub struct Scanner {
    /// Glob sources
    sources: Option<Vec<GlobEntry>>,

    /// Scanner is ready to scan. We delay the file system traversal for detecting all files until
    /// we actually need them.
    ready: bool,

    /// All files that we have to scan
    files: Vec<PathBuf>,

    /// All directories, sub-directories, etc… we saw during source detection
    dirs: Vec<PathBuf>,

    /// All generated globs
    globs: Vec<GlobEntry>,

    /// Track file modification times
    mtimes: FxHashMap<PathBuf, SystemTime>,

    /// Track unique set of candidates
    candidates: FxHashSet<String>,
}

impl Scanner {
    pub fn new(sources: Option<Vec<GlobEntry>>) -> Self {
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

        self.scan_sources();

        self.ready = true;
    }

    #[tracing::instrument(skip_all)]
    fn check_for_new_files(&mut self) {
        let current_mtimes = self
            .dirs
            .par_iter()
            .map(|path| {
                fs::metadata(path)
                    .and_then(|m| m.modified())
                    .unwrap_or(SystemTime::now())
            })
            .collect::<Vec<_>>();

        let mut modified_dirs: Vec<PathBuf> = vec![];

        // Check all directories to see if they were modified
        for (idx, path) in self.dirs.iter().enumerate() {
            let current_time = current_mtimes[idx];
            let previous_time = self.mtimes.insert(path.clone(), current_time);

            let should_scan = match previous_time {
                // Time has changed, so we need to re-scan the file
                Some(prev) if prev != current_time => true,

                // File was in the cache, no need to re-scan
                Some(_) => false,

                // File didn't exist before, so we need to scan it
                None => true,
            };

            if should_scan {
                modified_dirs.push(path.clone());
            }
        }

        // Scan all modified directories for their immediate files
        let mut known = FxHashSet::from_iter(self.files.iter().chain(self.dirs.iter()).cloned());

        while !modified_dirs.is_empty() {
            let new_entries = modified_dirs
                .iter()
                .flat_map(|dir| read_dir(dir, Some(1)))
                .map(|entry| entry.path().to_owned())
                .filter(|path| !known.contains(path))
                .collect::<Vec<_>>();

            modified_dirs.clear();

            for path in new_entries {
                if path.is_file() {
                    known.insert(path.clone());
                    self.files.push(path);
                } else if path.is_dir() {
                    known.insert(path.clone());
                    self.dirs.push(path.clone());

                    // Recursively scan the new directory for files
                    modified_dirs.push(path);
                }
            }
        }
    }

    #[tracing::instrument(skip_all)]
    fn scan_sources(&mut self) {
        let Some(sources) = &self.sources else {
            return;
        };

        if sources.is_empty() {
            return;
        }

        // Expand glob patterns and create new `GlobEntry` instances for each expanded pattern.
        let sources = sources
            .iter()
            .flat_map(|source| {
                let expression: Result<Expression, _> = source.pattern[..].try_into();
                let Ok(expression) = expression else {
                    return vec![source.clone()];
                };

                expression
                    .into_iter()
                    .filter_map(Result::ok)
                    .map(move |pattern| GlobEntry {
                        base: source.base.clone(),
                        pattern: pattern.into(),
                    })
                    .collect::<Vec<_>>()
            })
            .collect::<Vec<_>>();

        // Partition sources into sources that should be promoted to auto source detection and
        // sources that should be resolved as globs.
        let (auto_sources, glob_sources): (Vec<_>, Vec<_>) = sources.iter().partition(|source| {
            // If a glob ends with `/**/*`, then we just want to register the base path as a new
            // base. Essentially converting it to use auto source detection.
            if source.pattern.ends_with("**/*") {
                return true;
            }

            // Directories should be promoted to auto source detection
            if PathBuf::from(&source.base).join(&source.pattern).is_dir() {
                return true;
            }

            false
        });

        fn join_paths(a: &str, b: &str) -> PathBuf {
            let mut tmp = a.to_owned();
            let b = b.trim_end_matches("**/*").trim_end_matches('/');

            if b.starts_with('/') {
                return PathBuf::from(b);
            }

            // On Windows a path like C:/foo.txt is absolute but C:foo.txt is not
            // (the 2nd is relative to the CWD)
            if b.chars().nth(1) == Some(':') && b.chars().nth(2) == Some('/') {
                return PathBuf::from(b);
            }

            tmp += "/";
            tmp += b;

            PathBuf::from(&tmp)
        }

        for path in auto_sources.iter().filter_map(|source| {
            dunce::canonicalize(join_paths(&source.base, &source.pattern)).ok()
        }) {
            // Insert a glob for the base path, so we can see new files/folders in the directory itself.
            self.globs.push(GlobEntry {
                base: path.to_string_lossy().into(),
                pattern: "*".into(),
            });

            // Detect all files/folders in the directory
            let detect_sources = DetectSources::new(path);

            let (files, globs, dirs) = detect_sources.detect();
            self.files.extend(files);
            self.globs.extend(globs);
            self.dirs.extend(dirs);
        }

        // Turn `Vec<&GlobEntry>` in `Vec<GlobEntry>`
        let glob_sources: Vec<_> = glob_sources.into_iter().cloned().collect();
        let hoisted = hoist_static_glob_parts(&glob_sources);

        for source in &hoisted {
            // If the pattern is empty, then the base points to a specific file or folder already
            // if it doesn't contain any dynamic parts. In that case we can use the base as the
            // pattern.
            //
            // Otherwise we need to combine the base and the pattern, otherwise a pattern that
            // looks like `*.html`, will never match a path that looks like
            // `/my-project/project-a/index.html`, because it contains `/`.
            //
            // We can't prepend `**/`, because then `/my-project/project-a/nested/index.html` would
            // match as well.
            //
            // Instead we combine the base and the pattern as a single glob pattern.
            let mut full_pattern = source.base.clone().replace('\\', "/");

            if !source.pattern.is_empty() {
                full_pattern.push('/');
                full_pattern.push_str(&source.pattern);
            }

            let base = PathBuf::from(&source.base);
            for entry in resolve_paths(&base) {
                let Some(file_type) = entry.file_type() else {
                    continue;
                };

                if !file_type.is_file() {
                    continue;
                }

                let file_path = entry.into_path();

                let Some(file_path_str) = file_path.to_str() else {
                    continue;
                };

                let file_path_str = file_path_str.replace('\\', "/");

                if glob_match(&full_pattern, &file_path_str) {
                    self.files.push(file_path);
                }
            }
        }

        self.globs.extend(hoisted);

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
        let mut scanner = Scanner::new(None);

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
