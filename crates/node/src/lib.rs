#[macro_use]
extern crate napi_derive;

#[napi]
pub fn clear_cache() {
  tailwindcss_oxide::clear_cache();
}

#[derive(Debug, Clone)]
#[napi(object)]
pub struct ChangedContent {
  /// File path to the changed file
  pub file: Option<String>,

  /// Contents of the changed file
  pub content: Option<String>,

  /// File extension
  pub extension: String,
}

#[derive(Debug, Clone)]
#[napi(object)]
pub struct AutoContent {
  /// Base path to start scanning from
  pub base: String,
}

#[derive(Debug, Clone)]
#[napi(object)]
pub struct GlobEntry {
  /// Base path of the glob
  pub base: String,

  /// Glob pattern
  pub pattern: String,
}

impl From<ChangedContent> for tailwindcss_oxide::ChangedContent {
  fn from(changed_content: ChangedContent) -> Self {
    Self {
      file: changed_content.file.map(Into::into),
      content: changed_content.content,
    }
  }
}

impl From<GlobEntry> for tailwindcss_oxide::GlobEntry {
  fn from(glob: GlobEntry) -> Self {
    Self {
      base: glob.base,
      pattern: glob.pattern,
    }
  }
}

impl From<tailwindcss_oxide::GlobEntry> for GlobEntry {
  fn from(glob: tailwindcss_oxide::GlobEntry) -> Self {
    Self {
      base: glob.base,
      pattern: glob.pattern,
    }
  }
}

impl From<AutoContent> for tailwindcss_oxide::scanner::auto_content::AutoContent {
  fn from(auto_content: AutoContent) -> Self {
    Self::new(auto_content.base.into())
  }
}

// ---

#[derive(Debug, Clone)]
#[napi(object)]
pub struct ScannerOptions {
  /// Auto content configuration
  pub auto_content: Option<AutoContent>,

  /// Glob sources
  pub sources: Option<Vec<GlobEntry>>,
}

#[derive(Debug, Clone)]
#[napi]
pub struct Scanner {
  scanner: tailwindcss_oxide::Scanner,
}

#[napi]
impl Scanner {
  #[napi(constructor)]
  pub fn new(opts: ScannerOptions) -> Self {
    Self {
      scanner: tailwindcss_oxide::Scanner::new(
        opts.auto_content.map(Into::into),
        opts
          .sources
          .map(|x| x.into_iter().map(Into::into).collect()),
      ),
    }
  }

  #[napi]
  pub fn scan_files(&mut self, input: Vec<ChangedContent>) -> bool {
    let candidate_count_before = self.scanner.total_candidates();

    // Scan new content
    self
      .scanner
      .scan_content(input.into_iter().map(Into::into).collect());

    let candidate_count_after = self.scanner.total_candidates();

    // Return whether we scanned new candidates or not. We can do this because:
    // 1. It's a set, so we can't have duplicates
    // 2. We're only adding new candidates, not removing them
    candidate_count_before != candidate_count_after
  }

  #[napi]
  pub fn get_candidates(&self) -> Vec<String> {
    self.scanner.get_candidates()
  }

  #[napi]
  pub fn get_files(&self) -> Vec<String> {
    self.scanner.get_files()
  }

  #[napi]
  pub fn get_globs(&self) -> Vec<GlobEntry> {
    self
      .scanner
      .get_globs()
      .into_iter()
      .map(Into::into)
      .collect()
  }
}
