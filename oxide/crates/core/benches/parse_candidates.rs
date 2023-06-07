use criterion::{black_box, criterion_group, criterion_main, Criterion};
use tailwindcss_core::parser::Extractor;

pub fn criterion_benchmark(c: &mut Criterion) {
    fn parse(input: &[u8]) {
        // _ = Extractor::all(black_box(input), ExtractorOptions { preserve_spaces_in_arbitrary: false  });
        Extractor::unique(black_box(input), Default::default());
    }

    c.bench_function("parse_candidate_strings (simple)", |b| {
        b.iter(|| parse(b"underline"))
    });

    c.bench_function("parse_candidate_strings (with variant)", |b| {
        b.iter(|| parse(b"hover:underline"))
    });

    c.bench_function("parse_candidate_strings (with stacked variants)", |b| {
        b.iter(|| parse(b"focus:hover:underline"))
    });

    c.bench_function("parse_candidate_strings (with arbitrary values)", |b| {
        b.iter(|| parse(b"p-[20px]"))
    });

    c.bench_function(
        "parse_candidate_strings (with variant and arbitrary values)",
        |b| b.iter(|| parse(b"hover:p-[20px]")),
    );

    c.bench_function("parse_candidate_strings (real world)", |b| {
        b.iter(|| parse(include_bytes!("./fixtures/template-499.html")))
    });

    let mut group = c.benchmark_group("sample-size-example");
    group.sample_size(10);

    group.bench_function("parse_candidate_strings (fast space skipping)", |b| {
        let count = 10_000;
        let crazy1 = format!("{}underline", " ".repeat(count));
        let crazy2 = crazy1.repeat(count);
        let crazy3 = crazy2.as_bytes();

        b.iter(|| parse(black_box(crazy3)))
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
