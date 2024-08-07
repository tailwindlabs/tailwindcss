use std::collections::HashSet;

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
      file: changed_content.file.map(Into::into),
      content: changed_content.content,
    }
  }
}

#[derive(Debug, Clone)]
#[napi]
pub struct ScanResult {
  // Private information necessary for incremental rebuilds. Note: these fields are not exposed
  // to JS
  base: Option<String>,
  sources: Vec<tailwindcss_oxide::GlobEntry>,

  // Public API:
  pub globs: Vec<GlobEntry>,
  pub files: Vec<String>,
  pub candidates: Vec<String>,
}

#[napi]
impl ScanResult {
  #[napi]
  pub fn scan_files(&self, input: Vec<ChangedContent>) -> Vec<String> {
    let result = tailwindcss_oxide::scan_dir(tailwindcss_oxide::ScanOptions {
      base: self.base.clone(),
      sources: self.sources.clone(),
    });

    let mut unique_candidates: HashSet<String> = HashSet::from_iter(result.candidates);
    let candidates_from_files: HashSet<String> = HashSet::from_iter(tailwindcss_oxide::scan_files(
      input.into_iter().map(Into::into).collect(),
    ));

    unique_candidates.extend(candidates_from_files);
    unique_candidates.into_iter().map(Into::into).collect()
  }
}

#[derive(Debug, Clone)]
#[napi(object)]
pub struct GlobEntry {
  pub base: String,
  pub pattern: String,
}

impl From<GlobEntry> for tailwindcss_oxide::GlobEntry {
  fn from(glob: GlobEntry) -> Self {
    tailwindcss_oxide::GlobEntry {
      base: glob.base,
      pattern: glob.pattern,
    }
  }
}

impl From<tailwindcss_oxide::GlobEntry> for GlobEntry {
  fn from(glob: tailwindcss_oxide::GlobEntry) -> Self {
    GlobEntry {
      base: glob.base,
      pattern: glob.pattern,
    }
  }
}

#[derive(Debug, Clone)]
#[napi(object)]
pub struct ScanOptions {
  /// Base path to start scanning from
  pub base: Option<String>,
  /// Glob sources
  pub sources: Option<Vec<GlobEntry>>,
}

#[napi]
pub fn clear_cache() {
  tailwindcss_oxide::clear_cache();
}

#[napi]
pub fn scan_dir(args: ScanOptions) -> ScanResult {
  let sources = args
    .sources
    .unwrap_or_default()
    .into_iter()
    .map(Into::into)
    .collect::<Vec<_>>();

  let result = tailwindcss_oxide::scan_dir(tailwindcss_oxide::ScanOptions {
    base: args.base.clone(),
    sources: sources.clone(),
  });

  ScanResult {
    // Private
    base: args.base,
    sources,

    // Public
    files: result.files,
    candidates: result.candidates,
    globs: result.globs.into_iter().map(Into::into).collect(),
  }
}
