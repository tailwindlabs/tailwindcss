use utf16::IndexConverter;

#[macro_use]
extern crate napi_derive;

mod utf16;

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

// ---

#[derive(Debug, Clone)]
#[napi(object)]
pub struct ScannerOptions {
  /// Glob sources
  pub sources: Option<Vec<GlobEntry>>,
}

#[derive(Debug, Clone)]
#[napi]
pub struct Scanner {
  scanner: tailwindcss_oxide::Scanner,
}

#[derive(Debug, Clone)]
#[napi(object)]
pub struct CandidateWithPosition {
  /// The candidate string
  pub candidate: String,

  /// The position of the candidate inside the content file
  pub position: i64,
}

#[napi]
impl Scanner {
  #[napi(constructor)]
  pub fn new(opts: ScannerOptions) -> Self {
    Self {
      scanner: tailwindcss_oxide::Scanner::new(
        opts
          .sources
          .map(|x| x.into_iter().map(Into::into).collect()),
      ),
    }
  }

  #[napi]
  pub fn scan(&mut self) -> Vec<String> {
    self.scanner.scan()
  }

  #[napi]
  pub fn scan_files(&mut self, input: Vec<ChangedContent>) -> Vec<String> {
    self
      .scanner
      .scan_content(input.into_iter().map(Into::into).collect())
  }

  #[napi]
  pub fn get_candidates_with_positions(
    &mut self,
    input: ChangedContent,
  ) -> Vec<CandidateWithPosition> {
    let content = input.content.unwrap_or_else(|| {
      std::fs::read_to_string(input.file.unwrap()).expect("Failed to read file")
    });

    let input = ChangedContent {
      file: None,
      content: Some(content.clone()),
      extension: input.extension,
    };

    let mut utf16_idx = IndexConverter::new(&content[..]);

    self
      .scanner
      .get_candidates_with_positions(input.into())
      .into_iter()
      .map(|(candidate, position)| CandidateWithPosition {
        candidate,
        position: utf16_idx.get(position),
      })
      .collect()
  }

  #[napi(getter)]
  pub fn files(&mut self) -> Vec<String> {
    self.scanner.get_files()
  }

  #[napi(getter)]
  pub fn globs(&mut self) -> Vec<GlobEntry> {
    self
      .scanner
      .get_globs()
      .into_iter()
      .map(Into::into)
      .collect()
  }
}
