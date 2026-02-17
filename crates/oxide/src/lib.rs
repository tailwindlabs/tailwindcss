pub mod cursor;
pub mod extractor;
pub mod fast_skip;
pub mod glob;
pub mod paths;
pub mod scanner;
pub mod throughput;

pub use glob::GlobEntry;
pub use scanner::sources::PublicSourceEntry;
pub use scanner::ChangedContent;
pub use scanner::Scanner;

// WASM bindings
#[cfg(all(target_arch = "wasm32", target_os = "unknown"))]
pub mod wasm;

#[cfg(all(target_arch = "wasm32", target_os = "unknown"))]
pub use wasm::*;
