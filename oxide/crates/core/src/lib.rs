use crate::parser::Extractor;
use fxhash::FxHashSet;
use rayon::prelude::*;
use std::path::PathBuf;
use tracing::event;

pub mod candidate;
pub mod glob;
pub mod location;
pub mod modifier;
pub mod parser;
pub mod utility;
pub mod variant;

fn init_tracing() {
    if matches!(std::env::var("DEBUG"), Ok(value) if value.eq("*") || value.eq("1") || value.eq("true") || value.contains("tailwind"))
    {
        tracing_subscriber::fmt()
            .with_max_level(tracing::Level::INFO)
            .with_span_events(tracing_subscriber::fmt::format::FmtSpan::ACTIVE)
            .compact()
            .init();
    }
}

#[derive(Debug, Clone)]
pub struct ChangedContent {
    pub file: Option<PathBuf>,
    pub content: Option<String>,
    pub extension: String,
}

pub fn parse_candidate_strings_from_files(changed_content: Vec<ChangedContent>) -> Vec<String> {
    init_tracing();
    parse_all_blobs(read_all_files(changed_content))
}

#[derive(Debug, Clone)]
pub struct Options {
    pub input: Vec<ChangedContent>,
    pub strategy: Strategy,
}

#[derive(Debug, Clone)]
pub struct Strategy {
    pub io: IOStrategy,
    pub parsing: ParsingStrategy,
}

#[derive(Debug, Clone)]
pub enum IOStrategy {
    Sequential,
    Parallel,
}

#[derive(Debug, Clone)]
pub enum ParsingStrategy {
    Sequential,
    Parallel,
}

pub fn parse_candidate_strings(options: Options) -> Vec<String> {
    init_tracing();
    let blobs = match options.strategy.io {
        IOStrategy::Sequential => read_all_files_sync(options.input),
        IOStrategy::Parallel => read_all_files(options.input),
    };

    match options.strategy.parsing {
        ParsingStrategy::Sequential => parse_all_blobs_sync(blobs),
        ParsingStrategy::Parallel => parse_all_blobs(blobs),
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
        .map(|c| match (c.file, c.content) {
            (Some(file), None) => std::fs::read(file).unwrap(),
            (None, Some(content)) => content.into_bytes(),
            _ => Default::default(),
        })
        .collect()
}

#[tracing::instrument(skip(changed_content))]
fn read_all_files_sync(changed_content: Vec<ChangedContent>) -> Vec<Vec<u8>> {
    event!(
        tracing::Level::INFO,
        "Reading {:?} file(s)",
        changed_content.len()
    );

    changed_content
        .into_iter()
        .map(|c| match (c.file, c.content) {
            (Some(file), None) => std::fs::read(file).unwrap(),
            (None, Some(content)) => content.into_bytes(),
            _ => Default::default(),
        })
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

#[tracing::instrument(skip(blobs))]
fn parse_all_blobs_sync(blobs: Vec<Vec<u8>>) -> Vec<String> {
    let input: Vec<_> = blobs.iter().map(|blob| &blob[..]).collect();
    let input = &input[..];

    let mut result: Vec<String> = input
        .iter()
        .map(|input| Extractor::unique(input, Default::default()))
        .fold(FxHashSet::default(), |mut a, b| {
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
