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

#[derive(Debug, Clone)]
#[napi(object)]
pub struct SourceEntry {
  /// Base path of the glob
  pub base: String,

  /// Glob pattern
  pub pattern: String,

  /// Negated flag
  pub negated: bool,
}

impl From<ChangedContent> for tailwindcss_oxide::ChangedContent {
  fn from(changed_content: ChangedContent) -> Self {
    if let Some(file) = changed_content.file {
      return tailwindcss_oxide::ChangedContent::File(file.into(), changed_content.extension);
    }

    if let Some(contents) = changed_content.content {
      return tailwindcss_oxide::ChangedContent::Content(contents, changed_content.extension);
    }

    unreachable!()
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

impl From<SourceEntry> for tailwindcss_oxide::PublicSourceEntry {
  fn from(source: SourceEntry) -> Self {
    Self {
      base: source.base,
      pattern: source.pattern,
      negated: source.negated,
    }
  }
}

// ---

#[derive(Debug, Clone)]
#[napi(object)]
pub struct ScannerOptions {
  /// Glob sources
  pub sources: Option<Vec<SourceEntry>>,
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
      scanner: tailwindcss_oxide::Scanner::new(match opts.sources {
        Some(sources) => sources.into_iter().map(Into::into).collect(),
        None => vec![],
      }),
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

  #[napi(getter)]
  pub fn normalized_sources(&mut self) -> Vec<GlobEntry> {
    self
      .scanner
      .get_normalized_sources()
      .into_iter()
      .map(Into::into)
      .collect()
  }
}
