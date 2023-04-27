use napi::bindgen_prelude::ToNapiValue;
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

#[napi]
pub fn parse_candidate_strings_from_files(changed_content: Vec<ChangedContent>) -> Vec<String> {
  tailwindcss_core::parse_candidate_strings_from_files(
    changed_content.into_iter().map(Into::into).collect(),
  )
}

#[derive(Debug, Clone)]
#[napi(object)]
pub struct Options {
  pub input: Vec<ChangedContent>,
  pub strategy: Strategy,
}

impl From<Options> for tailwindcss_core::Options {
  fn from(options: Options) -> Self {
    tailwindcss_core::Options {
      input: options.input.into_iter().map(Into::into).collect(),
      strategy: options.strategy.into(),
    }
  }
}

#[derive(Debug, Clone)]
#[napi(object)]
pub struct Strategy {
  pub io: IOStrategy,
  pub parsing: ParsingStrategy,
}

impl From<Strategy> for tailwindcss_core::Strategy {
  fn from(strategy: Strategy) -> Self {
    tailwindcss_core::Strategy {
      io: strategy.io.into(),
      parsing: strategy.parsing.into(),
    }
  }
}

#[derive(Debug)]
#[napi]
pub enum IOStrategy {
  Sequential,
  Parallel,
}

impl From<IOStrategy> for tailwindcss_core::IOStrategy {
  fn from(io_strategy: IOStrategy) -> Self {
    match io_strategy {
      IOStrategy::Sequential => tailwindcss_core::IOStrategy::Sequential,
      IOStrategy::Parallel => tailwindcss_core::IOStrategy::Parallel,
    }
  }
}

#[derive(Debug)]
#[napi]
pub enum ParsingStrategy {
  Sequential,
  Parallel,
}

impl From<ParsingStrategy> for tailwindcss_core::ParsingStrategy {
  fn from(parsing_strategy: ParsingStrategy) -> Self {
    match parsing_strategy {
      ParsingStrategy::Sequential => tailwindcss_core::ParsingStrategy::Sequential,
      ParsingStrategy::Parallel => tailwindcss_core::ParsingStrategy::Parallel,
    }
  }
}

#[napi]
pub fn parse_candidate_strings(options: Options) -> Vec<String> {
  tailwindcss_core::parse_candidate_strings(options.into())
}
