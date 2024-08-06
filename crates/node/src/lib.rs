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
#[napi]
pub struct ScanResult {
  pub globs: Vec<GlobEntry>,
  pub files: Vec<String>,
  pub candidates: Vec<String>,
}

#[napi]
impl ScanResult {
  #[napi]
  pub fn scan_files(&self, input: Vec<ChangedContent>) -> Vec<String> {
    tailwindcss_oxide::scan_files_with_globs(
      input.into_iter().map(Into::into).collect(),
      self.globs.clone().into_iter().map(Into::into).collect(),
    )
  }
}

#[derive(Debug, Clone)]
#[napi(object)]
pub struct GlobEntry {
  pub base: String,
  pub glob: String,
}

impl From<GlobEntry> for tailwindcss_oxide::GlobEntry {
  fn from(globs: GlobEntry) -> Self {
    tailwindcss_oxide::GlobEntry {
      base: globs.base,
      glob: globs.glob,
    }
  }
}

impl From<tailwindcss_oxide::GlobEntry> for GlobEntry {
  fn from(globs: tailwindcss_oxide::GlobEntry) -> Self {
    GlobEntry {
      base: globs.base,
      glob: globs.glob,
    }
  }
}

#[derive(Debug, Clone)]
#[napi(object)]
pub struct ScanOptions {
  /// Base path to start scanning from
  pub base: String,
  /// Glob sources
  pub sources: Option<Vec<GlobEntry>>,
}

#[napi]
pub fn clear_cache() {
  tailwindcss_oxide::clear_cache();
}

#[napi]
pub fn scan_dir(args: ScanOptions) -> ScanResult {
  let result = tailwindcss_oxide::scan_dir(tailwindcss_oxide::ScanOptions {
    base: args.base,
    sources: args
      .sources
      .unwrap_or_default()
      .into_iter()
      .map(Into::into)
      .collect(),
  });

  ScanResult {
    files: result.files,
    candidates: result.candidates,
    globs: result.globs.into_iter().map(Into::into).collect(),
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
