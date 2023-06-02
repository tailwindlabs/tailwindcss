use criterion::{criterion_group, criterion_main, Criterion};
use std::path::PathBuf;
use tailwindcss_core::{parse_candidate_strings, ChangedContent, Parsing, IO};

pub fn criterion_benchmark(c: &mut Criterion) {
    // current_dir will be set to ./crates/core
    let fixtures_path = std::env::current_dir()
        .unwrap()
        .join("benches")
        .join("fixtures");

    let mut all_files: Vec<(u64, PathBuf)> = std::fs::read_dir(fixtures_path)
        .unwrap()
        .filter_map(Result::ok)
        .map(|dir_entry| dir_entry.path())
        .filter(|path| path.is_file())
        .filter(|path| match path.extension() {
            Some(ext) => ext == "html",
            _ => false,
        })
        .map(|path| (path.metadata().unwrap().len(), path))
        .collect();

    // Let's sort them first so that we are working with the same files in the same order every
    // time.
    all_files.sort_by(|a, b| a.0.cmp(&b.0));

    // Let's work with the first middle X items (so that we can skip outliers and work with more
    // interesting files)
    let amount = 300;
    let mut files: Vec<_> = all_files
        .iter()
        .skip((all_files.len() - amount) / 2) // Skip the first X, so that we can use the middle
        // {amount} files.
        .take(amount)
        .map(|(_, path)| path)
        .collect();

    // Two (or more) files can technically have the exact same size, but the order is random, so
    // now that we are scoped to the middle X files, let's sort these alphabetically to guarantee
    // the same order in our benchmarks.
    files.sort_by(|a, b| a.file_name().cmp(&b.file_name()));

    let changed_content: Vec<ChangedContent> = files
        .into_iter()
        .map(|file| ChangedContent {
            file: Some(file.to_path_buf()),
            content: None,
            extension: "html".to_string(),
        })
        .collect();

    c.bench_function("parse_candidate_strings", |b| {
        b.iter(|| {
            parse_candidate_strings(
                changed_content.clone(),
                Parsing::Parallel as u8 | IO::Parallel as u8,
            )
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
