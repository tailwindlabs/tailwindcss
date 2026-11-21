extern crate napi_build;

use std::{env, path::PathBuf, process::Command};

fn main() {
  if env::var("CARGO_CFG_TARGET_OS").as_deref() == Ok("wasi") {
    setup_wasi_rustc();
  }

  napi_build::setup();
}

/// `napi_build` links `crt1-reactor.o` and exports `_initialize` only if it finds the file at
/// `$RUSTC/../../lib/rustlib/<target>/lib/self-contained/crt1-reactor.o`. Otherwise it only prints
/// a warning, and the `.wasm` file hangs forever when it loads.
///
/// Cargo can give a bare `rustc` in `$RUSTC` (when it finds `rustc` in the `PATH`), so point it at
/// the `rustc` of the sysroot instead, and fail the build when the file does not exist.
fn setup_wasi_rustc() {
  let rustc = env::var("RUSTC").expect("RUSTC must be set by Cargo");
  let target = env::var("TARGET").expect("TARGET must be set by Cargo");

  let output = Command::new(&rustc)
    .args(["--print", "sysroot"])
    .output()
    .unwrap_or_else(|err| panic!("Could not run `{rustc} --print sysroot`: {err}"));
  if !output.status.success() {
    panic!(
      "`{rustc} --print sysroot` failed: {}",
      String::from_utf8_lossy(&output.stderr)
    );
  }
  let sysroot = PathBuf::from(String::from_utf8_lossy(&output.stdout).trim());

  let crt_reactor_path = sysroot
    .join("lib")
    .join("rustlib")
    .join(&target)
    .join("lib")
    .join("self-contained")
    .join("crt1-reactor.o");
  if !crt_reactor_path.exists() {
    panic!(
      "crt1-reactor.o not found at {}. Without it, the wasm module hangs when it loads. Run `rustup target add {target}`.",
      crt_reactor_path.display()
    );
  }

  env::set_var("RUSTC", sysroot.join("bin").join("rustc"));
}
