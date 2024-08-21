use crate::parser::Extractor;
use crate::scanner::detect_sources::DetectSources;
use bstr::ByteSlice;
use fxhash::FxHashMap;
use glob::fast_glob;
use glob::get_fast_patterns;
use rayon::prelude::*;
use std::fs;
use std::path::PathBuf;
use std::sync;
use std::time::SystemTime;
use tracing::event;

pub mod cache;
pub mod cursor;
pub mod fast_skip;
pub mod glob;
pub mod parser;
pub mod scanner;

static SHOULD_TRACE: sync::LazyLock<bool> = sync::LazyLock::new(
    || matches!(std::env::var("DEBUG"), Ok(value) if value.eq("*") || value.eq("1") || value.eq("true") || value.contains("tailwind")),
);

static GLOBAL_CACHE: sync::LazyLock<sync::Mutex<cache::Cache>> =
    sync::LazyLock::new(|| sync::Mutex::new(cache::Cache::default()));

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
pub struct GlobEntry {
    pub base: String,
    pub pattern: String,
}

#[derive(Debug, Clone, Default)]
pub struct Scanner {
    /// Auto content configuration
    detect_sources: Option<DetectSources>,

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
}

impl Scanner {
    pub fn new(detect_sources: Option<DetectSources>, sources: Option<Vec<GlobEntry>>) -> Self {
        Self {
            detect_sources,
            sources,
            ..Default::default()
        }
    }

    pub fn scan(&mut self) -> Vec<String> {
        init_tracing();
        self.prepare();

        self.compute_candidates();

        GLOBAL_CACHE.lock().unwrap().get_candidates()
    }

    #[tracing::instrument(skip_all)]
    pub fn scan_content(&mut self, changed_content: Vec<ChangedContent>) -> Vec<String> {
        self.prepare();
        let candidates = parse_all_blobs(read_all_files(changed_content));

        let mut new_candidates = vec![];
        let mut cache = GLOBAL_CACHE.lock().unwrap();
        for candidate in candidates {
            if cache.contains_candidate(&candidate) {
                continue;
            }
            cache.add_candidates(vec![candidate.clone()]);
            new_candidates.push(candidate);
        }

        new_candidates
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
            GLOBAL_CACHE.lock().unwrap().add_candidates(candidates);
        }
    }

    // Ensures that all files/globs are resolved and the scanner is ready to scan
    // content for candidates.
    fn prepare(&mut self) {
        if self.ready {
            return;
        }

        self.detect_sources();
        self.scan_sources();

        self.ready = true;
    }

    #[tracing::instrument(skip_all)]
    fn detect_sources(&mut self) {
        if let Some(detect_sources) = &self.detect_sources {
            let (files, globs) = detect_sources.detect();
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

pub fn clear_cache() {
    let mut cache = GLOBAL_CACHE.lock().unwrap();
    cache.clear();
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
