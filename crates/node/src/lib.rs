use napi::bindgen_prelude::{FromNapiValue, ToNapiValue};
use std::path::PathBuf;

#[macro_use]
extern crate napi_derive;

#[derive(Debug, Clone)]
#[napi(object)]
pub struct ChangedContent {
  pub file: Option<String>,
  pub content: Option<String>,
  pub extension: String,
}

impl From<ChangedContent> for tailwindcss_oxide::ChangedContent {
  fn from(changed_content: ChangedContent) -> Self {
    tailwindcss_oxide::ChangedContent {
      file: changed_content.file.map(PathBuf::from),
      content: changed_content.content,
    }
  }
}

#[derive(Debug, Clone)]
#[napi(object)]
pub struct ScanResult {
  pub globs: Vec<GlobEntry>,
  pub files: Vec<String>,
  pub candidates: Vec<String>,
}

#[derive(Debug, Clone)]
#[napi(object)]
pub struct GlobEntry {
  pub base: String,
  pub glob: String,
}

#[derive(Debug, Clone)]
#[napi(object)]
pub struct ScanOptions {
  /// Base path to start scanning from
  pub base: String,
  /// Glob content paths
  pub content_paths: Option<Vec<String>>,
  /// Whether to include globs in the output
  pub output_globs: Option<bool>,
  /// Whether to include files in the output
  pub output_files: Option<bool>,
}

#[napi]
pub fn clear_cache() {
  tailwindcss_oxide::clear_cache();
}

#[napi]
pub fn scan_dir(args: ScanOptions) -> ScanResult {
  let result = tailwindcss_oxide::scan_dir(tailwindcss_oxide::ScanOptions {
    base: args.base,
    content_paths: args.content_paths.unwrap_or_default(),
    output_globs: args.output_globs.unwrap_or_default(),
    output_files: args.output_globs.unwrap_or_default(),
  });

  ScanResult {
    files: result.files,
    candidates: result.candidates,
    globs: result
      .globs
      .into_iter()
      .map(|g| GlobEntry {
        base: g.base,
        glob: g.glob,
      })
      .collect(),
  }
}

#[derive(Debug)]
#[napi]
pub enum IO {
  Sequential = 0b0001,
  Parallel = 0b0010,
}

#[derive(Debug)]
#[napi]
pub enum Parsing {
  Sequential = 0b0100,
  Parallel = 0b1000,
}

#[napi]
pub fn scan_files(input: Vec<ChangedContent>, strategy: u8) -> Vec<String> {
  tailwindcss_oxide::scan_files(input.into_iter().map(Into::into).collect(), strategy)
}
