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

    let root = Path::new(".tailwindcss");
    let logs_dir = root.join("logs");
    if let Err(err) = std::fs::create_dir_all(&logs_dir) {
        eprintln!(
            "{} Failed to create {}, skipping debug logs ({err})",
            dim("[DEBUG]"),
            highlight(&logs_dir.display().to_string())
        );
        return;
    }

    // Ensure everything inside `.tailwindcss/` is ignored by git. The file is only created if it
    // doesn't exist yet, an existing `.gitignore` is left untouched.
    if let Ok(mut file) = std::fs::File::create_new(root.join(".gitignore")) {
        _ = file.write_all(b"*\n");
    }

    let file_path = logs_dir.join(format!("tailwindcss-{}.log", std::process::id()));
    let file = match OpenOptions::new()
        .create(true)
        .append(true)
        .open(&file_path)
    {
        Ok(file) => file,
        Err(err) => {
            eprintln!(
                "{} Failed to create {}, skipping debug logs ({err})",
                dim("[DEBUG]"),
                highlight(&file_path.display().to_string())
            );
            return;
        }
    };

    let absolute_file_path = dunce::canonicalize(&file_path).unwrap_or_else(|_| file_path.clone());
    eprintln!(
        "{} Writing debug info to: {}\n",
        dim("[DEBUG]"),
        highlight(&absolute_file_path.display().to_string())
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
