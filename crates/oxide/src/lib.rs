use crate::parser::Extractor;
use crate::scanner::detect_sources::DetectSources;
use bstr::ByteSlice;
use fxhash::{FxHashMap, FxHashSet};
use glob::fast_glob;
use glob::get_fast_patterns;
use rayon::prelude::*;
use std::fs;
use std::path::PathBuf;
use std::sync;
use std::time::SystemTime;
use tracing::event;

pub mod cursor;
pub mod fast_skip;
pub mod glob;
pub mod parser;
pub mod scanner;

static SHOULD_TRACE: sync::LazyLock<bool> = sync::LazyLock::new(
    || matches!(std::env::var("DEBUG"), Ok(value) if value.eq("*") || value.eq("1") || value.eq("true") || value.contains("tailwind")),
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
pub struct ChangedContent {
    pub file: Option<PathBuf>,
    pub content: Option<String>,
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

#[derive(Debug, Clone)]
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

        let mut candidates: Vec<String> = self.candidates.clone().into_iter().collect();

        candidates.sort();

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
        let extractor = Extractor::with_positions(&content[..], Default::default());

        let candidates: Vec<(String, usize)> = extractor
            .into_iter()
            .map(|(s, i)| {
                // SAFETY: When we parsed the candidates, we already guaranteed that the byte slices
                // are valid, therefore we don't have to re-check here when we want to convert it back
                // to a string.
                unsafe { (String::from_utf8_unchecked(s.to_vec()), i) }
            })
            .collect();
        candidates
    }

    #[tracing::instrument(skip_all)]
    pub fn get_files(&mut self) -> Vec<String> {
        self.prepare();

        self.files
            .iter()
            .map(|x| x.to_string_lossy().into())
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

        for path in &self.files {
            let current_time = fs::metadata(path)
                .and_then(|m| m.modified())
                .unwrap_or(SystemTime::now());

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
                changed_content.push(ChangedContent {
                    file: Some(path.clone()),
                    content: None,
                });
            }
        }

        if !changed_content.is_empty() {
            let candidates = parse_all_blobs(read_all_files(changed_content));
            self.candidates.extend(candidates);
        }
    }

    // Ensures that all files/globs are resolved and the scanner is ready to scan
    // content for candidates.
    fn prepare(&mut self) {
        if self.ready {
            return;
        }

        self.scan_sources();

        self.ready = true;
    }

    #[tracing::instrument(skip_all)]
    fn scan_sources(&mut self) {
        let Some(sources) = &self.sources else {
            return;
        };

        if sources.is_empty() {
            return;
        }

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

        // Turn `Vec<&GlobEntry>` in `Vec<GlobEntry>`
        let glob_sources: Vec<_> = glob_sources.into_iter().cloned().collect();

        for path in auto_sources
            .iter()
            .map(|source| PathBuf::from(&source.base).join(source.pattern.trim_end_matches("**/*")))
        {
            let detect_sources = DetectSources::new(path);

            let (files, globs) = detect_sources.detect();
            self.files.extend(files);
            self.globs.extend(globs);
        }

        let resolved_files: Vec<_> = match fast_glob(&glob_sources) {
            Ok(matches) => matches
                .filter_map(|x| dunce::canonicalize(&x).ok())
                .collect(),
            Err(err) => {
                event!(tracing::Level::ERROR, "Failed to resolve glob: {:?}", err);
                vec![]
            }
        };

        self.files.extend(resolved_files);
        self.globs.extend(glob_sources);

        // Re-optimize the globs to reduce the number of patterns we have to scan.
        self.globs = get_fast_patterns(&self.globs)
            .into_iter()
            .filter_map(|(root, globs)| {
                let root = match dunce::canonicalize(root) {
                    Ok(root) => root,
                    Err(error) => {
                        event!(
                            tracing::Level::ERROR,
                            "Failed to canonicalize base path {:?}",
                            error
                        );
                        return None;
                    }
                };

                Some((root, globs))
            })
            .flat_map(|(root, globs)| {
                let base = root.display().to_string();

                globs.into_iter().map(move |glob| GlobEntry {
                    base: base.clone(),
                    pattern: glob,
                })
            })
            .collect::<Vec<GlobEntry>>();
    }
}

fn read_changed_content(c: ChangedContent) -> Option<Vec<u8>> {
    if let Some(content) = c.content {
        return Some(content.into_bytes());
    }

    let Some(file) = c.file else {
        return Default::default();
    };

    let Ok(content) = std::fs::read(&file).map_err(|e| {
        event!(tracing::Level::ERROR, "Failed to read file: {:?}", e);
        e
    }) else {
        return Default::default();
    };

    let Some(extension) = file.extension().map(|x| x.to_str()) else {
        return Some(content);
    };

    match extension {
        Some("svelte") => Some(content.replace(" class:", " ")),
        _ => Some(content),
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
    let input: Vec<_> = blobs.iter().map(|blob| &blob[..]).collect();
    let input = &input[..];

    let mut result: Vec<String> = input
        .par_iter()
        .map(|input| Extractor::unique(input, Default::default()))
        .reduce(Default::default, |mut a, b| {
            a.extend(b);
            a
        })
        .into_iter()
        .map(|s| {
            // SAFETY: When we parsed the candidates, we already guaranteed that the byte slices
            // are valid, therefore we don't have to re-check here when we want to convert it back
            // to a string.
            unsafe { String::from_utf8_unchecked(s.to_vec()) }
        })
        .collect();
    result.sort();
    result
}
