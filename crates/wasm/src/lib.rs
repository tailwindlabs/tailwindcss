use utf16::IndexConverter;
use wasm_bindgen::prelude::*;
use console_log::init_with_level;
use log::Level;

mod utf16;

#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    // Initialize the logger
    init_with_level(Level::Debug).expect("error initializing logger");
    Ok(())
}

#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct ChangedContent {
    /// File path to the changed file
    file: Option<String>,

    /// Contents of the changed file
    content: Option<String>,
}

#[wasm_bindgen]
impl ChangedContent {
    #[wasm_bindgen(constructor)]
    pub fn new(file: Option<String>, content: Option<String>) -> ChangedContent {
        ChangedContent { file, content }
    }

    #[wasm_bindgen(getter)]
    pub fn file(&self) -> Option<String> {
        self.file.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn content(&self) -> Option<String> {
        self.content.clone()
    }

    #[wasm_bindgen(setter)]
    pub fn set_file(&mut self, file: Option<String>) {
        self.file = file;
    }

    #[wasm_bindgen(setter)]
    pub fn set_content(&mut self, content: Option<String>) {
        self.content = content;
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct GlobEntry {
    /// Base path of the glob
    base: String,

    /// Glob pattern
    pattern: String,
}

#[wasm_bindgen]
impl GlobEntry {
    #[wasm_bindgen(constructor)]
    pub fn new(base: String, pattern: String) -> GlobEntry {
        GlobEntry { base, pattern }
    }

    #[wasm_bindgen(getter)]
    pub fn base(&self) -> String {
        self.base.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn pattern(&self) -> String {
        self.pattern.clone()
    }

    #[wasm_bindgen(setter)]
    pub fn set_base(&mut self, base: String) {
        self.base = base;
    }

    #[wasm_bindgen(setter)]
    pub fn set_pattern(&mut self, pattern: String) {
        self.pattern = pattern;
    }
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

#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct ScannerOptions {
    /// Glob sources
    sources: Option<Vec<GlobEntry>>,
}

#[wasm_bindgen]
impl ScannerOptions {
    #[wasm_bindgen(constructor)]
    pub fn new(sources: Option<Vec<GlobEntry>>) -> ScannerOptions {
        ScannerOptions { sources }
    }

    #[wasm_bindgen(getter)]
    pub fn sources(&self) -> Option<Vec<GlobEntry>> {
        self.sources.clone()
    }

    #[wasm_bindgen(setter)]
    pub fn set_sources(&mut self, sources: Option<Vec<GlobEntry>>) {
        self.sources = sources;
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct Scanner {
    scanner: tailwindcss_oxide::Scanner,
}

#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct CandidateWithPosition {
    /// The candidate string
    candidate: String,

    /// The position of the candidate inside the content file
    position: i64,
}

#[wasm_bindgen]
impl CandidateWithPosition {
    #[wasm_bindgen(constructor)]
    pub fn new(candidate: String, position: i64) -> CandidateWithPosition {
        CandidateWithPosition {
            candidate,
            position,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn candidate(&self) -> String {
        self.candidate.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn position(&self) -> i64 {
        self.position
    }

    #[wasm_bindgen(setter)]
    pub fn set_candidate(&mut self, candidate: String) {
        self.candidate = candidate;
    }

    #[wasm_bindgen(setter)]
    pub fn set_position(&mut self, position: i64) {
        self.position = position;
    }
}

#[wasm_bindgen]
impl Scanner {
    #[wasm_bindgen(constructor)]
    pub fn new(opts: ScannerOptions) -> Scanner {
        Scanner {
            scanner: tailwindcss_oxide::Scanner::new(
                opts.sources
                    .map(|x| x.into_iter().map(Into::into).collect()),
            ),
        }
    }

    #[wasm_bindgen]
    pub fn scan(&mut self) -> Vec<JsValue> {
        self.scanner.scan().into_iter().map(JsValue::from).collect()
    }

    #[wasm_bindgen(js_name = scanFiles)]
    pub fn scan_files(&mut self, input: Vec<ChangedContent>) -> Vec<JsValue> {
        log::info!("Scanning files: {:?}", input);
        self.scanner
            .scan_content(input.into_iter().map(Into::into).collect())
            .into_iter()
            .map(JsValue::from)
            .collect()
    }

    #[wasm_bindgen(js_name = getCandidatesWithPositions)]
    pub fn get_candidates_with_positions(&mut self, input: ChangedContent) -> Vec<JsValue> {
        let content = input.content.unwrap_or_else(|| {
            std::fs::read_to_string(input.file.unwrap()).expect("Failed to read file")
        });

        let input = ChangedContent {
            file: None,
            content: Some(content.clone()),
        };

        let mut utf16_idx = IndexConverter::new(&content[..]);

        self.scanner
            .get_candidates_with_positions(input.into())
            .into_iter()
            .map(|(candidate, position)| {
                JsValue::from(CandidateWithPosition {
                    candidate,
                    position: utf16_idx.get(position),
                })
            })
            .collect()
    }

    #[wasm_bindgen(getter)]
    pub fn files(&mut self) -> Vec<JsValue> {
        self.scanner
            .get_files()
            .into_iter()
            .map(JsValue::from)
            .collect()
    }

    #[wasm_bindgen(getter)]
    pub fn globs(&mut self) -> Vec<JsValue> {
        self.scanner
            .get_globs()
            .into_iter()
            .map(|glob| JsValue::from(GlobEntry::from(glob)))
            .collect()
    }
}
