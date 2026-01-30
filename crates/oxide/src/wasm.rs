use wasm_bindgen::prelude::*;
use crate::{ChangedContent, Scanner};

// Set panic hook for better error messages
#[wasm_bindgen(start)]
pub fn wasm_init() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct WasmChangedContent {
    content: Option<String>,
    extension: String,
}

#[wasm_bindgen]
impl WasmChangedContent {
    #[wasm_bindgen(constructor)]
    pub fn new(content: Option<String>, extension: String) -> WasmChangedContent {
        WasmChangedContent { content, extension }
    }

    #[wasm_bindgen(getter)]
    pub fn content(&self) -> Option<String> {
        self.content.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn extension(&self) -> String {
        self.extension.clone()
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct WasmCandidateWithPosition {
    candidate: String,
    position: usize,
}

#[wasm_bindgen]
impl WasmCandidateWithPosition {
    #[wasm_bindgen(getter)]
    pub fn candidate(&self) -> String {
        self.candidate.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn position(&self) -> usize {
        self.position
    }
}

impl From<WasmChangedContent> for ChangedContent {
    fn from(wasm_content: WasmChangedContent) -> Self {
        match wasm_content.content {
            Some(content) => ChangedContent::Content(content, wasm_content.extension),
            None => panic!("File-based content not supported in browser WASM"),
        }
    }
}

#[wasm_bindgen]
pub struct WasmScanner {
    scanner: Scanner,
}

#[wasm_bindgen]
impl WasmScanner {
    #[wasm_bindgen(constructor)]
    pub fn new() -> WasmScanner {
        WasmScanner {
            scanner: Scanner::new(vec![]),
        }
    }

    #[wasm_bindgen(js_name = getCandidatesWithPositions)]
    pub fn get_candidates_with_positions(
        &mut self,
        content: WasmChangedContent,
    ) -> Vec<WasmCandidateWithPosition> {
        let changed_content: ChangedContent = content.into();
        self.scanner
            .get_candidates_with_positions(changed_content)
            .into_iter()
            .map(|(candidate, position)| WasmCandidateWithPosition { candidate, position })
            .collect()
    }
}