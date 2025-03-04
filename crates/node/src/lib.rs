use std::ops::Deref;
use std::sync::{atomic::AtomicBool, Mutex};

use bun_native_plugin::{anyhow, bun, define_bun_plugin, Error, Result};
use fxhash::{FxHashMap, FxHashSet};
use napi::{
  bindgen_prelude::{Array, External},
  Env, Result as NapiResult,
};
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

/// State which contains the scanned candidates from the module graph.
///
/// This is turned into a Napi External so the JS plugin can hold it and
/// eventually request the candidates to be turned in to JS.
///
/// The state inside this struct must be threadsafe as it could be accessed from
/// the JS thread as well as the other bundler threads.
#[derive(Default)]
pub struct TailwindContextExternal {
  /// Candidates scanned from the module graph.
  module_graph_candidates: Mutex<FxHashMap<String, FxHashSet<String>>>,
  /// Atomic flag to indicate whether the state has been changed.
  dirty: AtomicBool,
}

define_bun_plugin!("tailwindcss");

/// Create the TailwindContextExternal and return it to JS wrapped in a Napi External.
#[no_mangle]
#[napi]
pub fn twctx_create() -> External<TailwindContextExternal> {
  let external = External::new(TailwindContextExternal {
    module_graph_candidates: Default::default(),
    dirty: AtomicBool::new(false),
  });

  external
}

#[napi(object)]
struct CandidatesEntry {
  pub id: String,
  pub candidates: Vec<String>,
}

/// Convert the scanned candidates into a JS array of objects so the JS code can
/// use it.
#[no_mangle]
#[napi]
pub fn twctx_to_js(env: Env, ctx: External<TailwindContextExternal>) -> NapiResult<Array> {
  let candidates = ctx.module_graph_candidates.lock().map_err(|_| {
    napi::Error::new(
      napi::Status::WouldDeadlock,
      "Failed to acquire lock on candidates: another thread panicked while holding the lock.",
    )
  })?;

  let len: u32 = candidates.len().try_into().map_err(|_| {
    napi::Error::new(
      napi::Status::InvalidArg,
      format!("Too many candidates: {}", candidates.len()),
    )
  })?;

  let mut arr = env.create_array(len)?;

  // TODO: Creating objects and copying/convertings strings is slow in NAPI.
  // We could use a more efficient approach:
  // 1. Flat array of de-duped candidate strings
  // 2. Flat array of int32 (or smaller) indices into the candidate array as well as lengths
  // 3. A flat array of ids
  //
  // However, it is unclear how much of a performance difference this makes as this array will
  // get turned into a set inside the corresponding JS code.
  for (i, (id, candidates)) in candidates.iter().enumerate() {
    let mut obj = env.create_object()?;
    obj.set("id", id)?;
    obj.set("candidates", candidates.iter().collect::<Vec<_>>())?;
    arr.set(i as u32, obj)?;
  }

  Ok(arr)
}

/// This function can be called from JS to check if the state has been changed and to
/// then call `twctx_to_js` to convert the candidates into JS values.
#[no_mangle]
#[napi]
pub fn twctx_is_dirty(_env: Env, ctx: External<TailwindContextExternal>) -> NapiResult<bool> {
  Ok(ctx.dirty.load(std::sync::atomic::Ordering::Acquire))
}

/// This is the main native bundler plugin function.
///
/// It is executed for every file that matches the regex (see the `.onBeforeParse` call in `@tailwindcss-bun/src/index.ts`).
///
/// This function is essentially given as input the source code to the file before it is parsed by Bun. It uses this to
/// scan it for potential candidates.
///
/// Care must be taken to ensure that this code is threadsafe as it could be executing concurrrently on multiple of Bun's bundler
/// threads.
#[bun]
pub fn tw_on_before_parse(handle: &mut OnBeforeParse) -> Result<()> {
  let source_code = handle.input_source_code()?;

  let mut scanner = tailwindcss_oxide::Scanner::new(None);

  let candidates = scanner.scan_content(vec![tailwindcss_oxide::ChangedContent {
    content: Some(source_code.to_string()),
    file: None,
  }]);

  // If we found candidates, update our state
  if !candidates.is_empty() {
    let tw_ctx: &TailwindContextExternal = unsafe {
      handle
        .external(External::inner_from_raw)
        .and_then(|tw| tw.ok_or(Error::Unknown))?
    };

    let mut graph_candidates = tw_ctx.module_graph_candidates.lock().map_err(|_| {
      anyhow::Error::msg(
        "Failed to acquire lock on candidates: another thread panicked while holding the lock",
      )
    })?;

    tw_ctx
      .dirty
      .store(true, std::sync::atomic::Ordering::Release);

    let path = handle.path()?;

    if let Some(graph_candidates) = graph_candidates.get_mut(path.deref()) {
      graph_candidates.extend(candidates.into_iter());
    } else {
      graph_candidates.insert(path.to_string(), candidates.into_iter().collect());
    }
  }

  let loader = handle.output_loader();
  handle.set_output_loader(loader);

  Ok(())
}
