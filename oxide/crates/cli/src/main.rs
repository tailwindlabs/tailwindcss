use clap::{Args, Parser, Subcommand};
use rayon::prelude::*;
use std::fmt::Debug;
use std::fs::{self, File};
use std::io::{self, BufRead};
use std::path::{Path, PathBuf};
use std::time::Instant;
use tailwindcss_core::glob;
use tailwindcss_core::parser::Extractor;

use tailwindcss_core::candidate::Candidate;

/// Tailwind CLI
#[derive(Parser, Debug)]
struct Cli {
    /// The current working directory
    #[arg(long, default_value = ".")]
    pwd: PathBuf,

    /// Path to a custom config file
    #[arg(short, long, default_value = "tailwind.config.js")]
    config: String,

    /// Build
    #[command(flatten)]
    build: Build,

    /// The subcommand to run
    #[command(subcommand)]
    subcommand: Option<Commands>,
}

#[derive(Args, Debug)]
#[command()]
#[group()]
struct Build {
    /// Input file
    #[arg(short, long)]
    input: Option<String>,

    /// Output file
    #[arg(short, long)]
    output: Option<String>,

    /// Watch for changes and rebuild as needed
    #[arg(short, long)]
    watch: bool,

    /// Use polling instead of filesystem events when watching
    #[arg(short, long)]
    poll: bool,

    /// Content paths to use for removing unused classes
    #[arg(long, default_value = "**/*.html")]
    content: Vec<String>,

    /// Load custom PostCSS configuration
    #[arg(long)]
    postcss: bool,

    /// Minify the output
    #[arg(short, long)]
    minify: bool,

    /// Disable autoprefixer
    #[arg(long)]
    no_autoprefixer: bool,
}

#[derive(Subcommand, Debug)]
enum Commands {
    /// Initialize your Tailwind project
    Init {
        /// Initialize a full `tailwind.config.js` file
        #[clap(short, long)]
        full: bool,

        /// Initialize a `postcss.config.js` file
        #[clap(short, long)]
        postcss: bool,
    },
}

// The output is wrapped in a Result to allow matching on errors
// Returns an Iterator to the Reader of the lines of the file.
fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where
    P: AsRef<Path>,
{
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}

fn main() -> Result<(), std::io::Error> {
    let mut args = Cli::parse();
    args.pwd = fs::canonicalize(&args.pwd)?;

    let now = Instant::now();

    let patterns = args.build.content;

    let content_paths = glob::fast_glob(&args.pwd, &patterns)?;
    let total_paths = glob::fast_glob(&args.pwd, &patterns)?.count();

    let candidates = content_paths.par_bridge().flat_map(|path| {
        read_lines(path)
            .unwrap()
            .map_while(Result::ok)
            .par_bridge()
            .flat_map_iter(|line| {
                Extractor::unique(line.as_bytes(), Default::default())
                    .into_iter()
                    .map(|candidate| Candidate::new(String::from_utf8(candidate.to_vec()).unwrap()))
                    .collect::<Vec<_>>()
            })
    });

    println!("Total files: {}", total_paths);
    println!("Total candidates: {}", candidates.count());
    println!("Took: {:?}", now.elapsed());

    Ok(())
}

#[cfg(test)]
mod tests {

    #[test]
    fn it_works() {
        // ...
    }
}
