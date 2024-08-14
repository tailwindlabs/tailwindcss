use crate::parser::Extractor;
use crate::scanner::auto_content::AutoContent;
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
    /// Auto content configuration
    auto_content: Option<AutoContent>,

    /// Glob sources
    sources: Option<Vec<GlobEntry>>,

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
    pub fn new(auto_content: Option<AutoContent>, sources: Option<Vec<GlobEntry>>) -> Self {
        Self {
            auto_content,
            sources,
            ..Default::default()
        }
    }

    pub fn scan(&mut self) -> Vec<String> {
        init_tracing();

        self.scan_auto_content();
        self.scan_sources();

        self.compute_candidates();

        let mut candidates: Vec<String> = self.candidates.clone().into_iter().collect();

        candidates.sort();

        candidates
    }

    #[tracing::instrument(skip_all)]
    pub fn get_files(&self) -> Vec<String> {
        self.files
            .iter()
            .map(|x| x.to_string_lossy().into())
            .collect()
    }

    #[tracing::instrument(skip_all)]
    pub fn get_globs(&self) -> Vec<GlobEntry> {
        self.globs.clone()
    }

    #[tracing::instrument(skip_all)]
    fn scan_auto_content(&mut self) {
        if let Some(auto_content) = &self.auto_content {
            let (files, globs) = auto_content.scan();
            self.files.extend(files);
            self.globs.extend(globs);
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

        let resolved_files: Vec<_> = match fast_glob(sources) {
            Ok(matches) => matches
                .filter_map(|x| dunce::canonicalize(&x).ok())
                .collect(),
            Err(err) => {
                event!(tracing::Level::ERROR, "Failed to resolve glob: {:?}", err);
                vec![]
            }
        };

        self.files.extend(resolved_files);
        self.globs.extend(sources.clone());

        // Re-optimize the globs to reduce the number of patterns we have to scan.
        self.globs = get_fast_patterns(&self.globs)
            .iter()
            .flat_map(|(root, globs)| {
                globs.iter().filter_map(|glob| {
                    let root = match dunce::canonicalize(root.clone()) {
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

                    let base = root.display().to_string();
                    let glob = glob.to_string();
                    Some(GlobEntry {
                        base,
                        pattern: glob,
                    })
                })
            })
            .collect::<Vec<GlobEntry>>();
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
