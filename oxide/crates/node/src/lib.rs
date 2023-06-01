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

impl From<ChangedContent> for tailwindcss_core::ChangedContent {
  fn from(changed_content: ChangedContent) -> Self {
    tailwindcss_core::ChangedContent {
      file: changed_content.file.map(PathBuf::from),
      content: changed_content.content,
      extension: changed_content.extension,
    }
  }
}

#[derive(Debug, Clone)]
#[napi(object)]
pub struct ContentPathInfo {
  pub base: String,
}

#[napi]
pub fn resolve_content_paths(args: ContentPathInfo) -> Vec<String> {
  tailwindcss_core::resolve_content_paths(tailwindcss_core::ContentPathInfo { base: args.base })
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
pub fn parse_candidate_strings(input: Vec<ChangedContent>, strategy: u8) -> Vec<String> {
  tailwindcss_core::parse_candidate_strings(input.into_iter().map(Into::into).collect(), strategy)
}
