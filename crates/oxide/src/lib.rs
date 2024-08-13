use crate::parser::Extractor;
use crate::scanner::auto_content::{resolve_files, resolve_globs};
use bstr::ByteSlice;
use cache::Cache;
use glob::fast_glob;
use glob::get_fast_patterns;
use lazy_static::lazy_static;
use rayon::prelude::*;
use std::path::Path;
use std::path::PathBuf;
use std::sync::Mutex;
use tracing::event;

pub mod cache;
pub mod cursor;
pub mod fast_skip;
pub mod glob;
pub mod parser;
pub mod scanner;

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

pub fn clear_cache() {
    let mut cache = GLOBAL_CACHE.lock().unwrap();
    cache.clear();
}

pub fn scan_dir(opts: ScanOptions) -> ScanResult {
    init_tracing();

    let (mut files, mut globs) = match opts.base {
        Some(base) => {
            // Only enable auto content detection when `base` is provided.
            let base = Path::new(&base);
            let (files, dirs) = resolve_files(base);
            let globs = resolve_globs(base, dirs);

            (files, globs)
        }
        None => (vec![], vec![]),
    };

    // If we have additional sources, then we have to resolve them as well.
    if !opts.sources.is_empty() {
        let resolved_files: Vec<_> = match fast_glob(&opts.sources) {
            Ok(matches) => matches
                .filter_map(|x| dunce::canonicalize(&x).ok())
                .collect(),
            Err(err) => {
                event!(tracing::Level::ERROR, "Failed to resolve glob: {:?}", err);
                vec![]
            }
        };

        files.extend(resolved_files);

        let optimized_incoming_globs = get_fast_patterns(&opts.sources)
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

        globs.extend(optimized_incoming_globs);
    }

    let mut cache = GLOBAL_CACHE.lock().unwrap();

    let modified_files = cache.find_modified_files(&files);

    let files = files.iter().map(|x| x.display().to_string()).collect();

    if !modified_files.is_empty() {
        let content: Vec<_> = modified_files
            .into_iter()
            .map(|file| ChangedContent {
                file: Some(file.clone()),
                content: None,
            })
            .collect();

        let candidates = scan_files(content);
        cache.add_candidates(candidates);
    }

    ScanResult {
        candidates: cache.get_candidates(),
        files,
        globs,
    }
}

lazy_static! {
    static ref SHOULD_TRACE: bool = {
        matches!(std::env::var("DEBUG"), Ok(value) if value.eq("*") || value.eq("1") || value.eq("true") || value.contains("tailwind"))
    };

    /// Track file modification times and cache candidates. This cache lives for the lifetime of
    /// the process and simply adds candidates when files are modified. Since candidates aren't
    /// removed, incremental builds may contain extra candidates.
    static ref GLOBAL_CACHE: Mutex<Cache> = {
        Mutex::new(Cache::default())
    };
}

#[tracing::instrument(skip(input))]
pub fn scan_files(input: Vec<ChangedContent>) -> Vec<String> {
    parse_all_blobs(read_all_files(input))
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

#[tracing::instrument(skip(changed_content))]
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

#[tracing::instrument(skip(blobs))]
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
