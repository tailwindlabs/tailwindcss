use std::fs::OpenOptions;
use std::io::{self, Write};
use std::path::Path;
use std::sync::{self, Arc, Mutex};
use tracing_subscriber::fmt::writer::BoxMakeWriter;

pub static SHOULD_TRACE: sync::LazyLock<bool> = sync::LazyLock::new(
    || matches!(std::env::var("DEBUG"), Ok(value) if value.eq("*") || (value.contains("tailwindcss:oxide") && !value.contains("-tailwindcss:oxide"))),
);

fn dim(input: &str) -> String {
    format!("\u{001b}[2m{input}\u{001b}[22m")
}

fn blue(input: &str) -> String {
    format!("\u{001b}[34m{input}\u{001b}[39m")
}

fn highlight(input: &str) -> String {
    format!("{}{}{}", dim(&blue("`")), blue(input), dim(&blue("`")))
}

struct MutexWriter(Arc<Mutex<std::fs::File>>);

impl Write for MutexWriter {
    fn write(&mut self, buf: &[u8]) -> io::Result<usize> {
        self.0.lock().unwrap().write(buf)
    }

    fn flush(&mut self) -> io::Result<()> {
        self.0.lock().unwrap().flush()
    }
}

pub fn init_tracing() {
    if !*SHOULD_TRACE {
        return;
    }

    let file_path = format!("tailwindcss-{}.log", std::process::id());
    let file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&file_path)
        .unwrap_or_else(|_| panic!("Failed to open {file_path}"));

    let file_path = Path::new(&file_path);
    let absolute_file_path = dunce::canonicalize(file_path)
        .unwrap_or_else(|_| panic!("Failed to canonicalize {file_path:?}"));
    eprintln!(
        "{} Writing debug info to: {}\n",
        dim("[DEBUG]"),
        highlight(absolute_file_path.as_path().to_str().unwrap())
    );

    let file = Arc::new(Mutex::new(file));

    let writer: BoxMakeWriter = BoxMakeWriter::new({
        let file = file.clone();
        move || Box::new(MutexWriter(file.clone())) as Box<dyn Write + Send>
    });

    _ = tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_span_events(tracing_subscriber::fmt::format::FmtSpan::ACTIVE)
        .with_writer(writer)
        .with_ansi(false)
        .compact()
        .try_init();
}
