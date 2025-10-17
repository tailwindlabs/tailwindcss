use std::io;
use std::path::{Path, PathBuf};

/// https://github.com/oxc-project/oxc-resolver/blob/42a1e3eb50e9a1365c422c41d51f287fe5fb8244/src/file_system.rs#L93-L122
pub fn canonicalize<P: AsRef<Path>>(path: P) -> io::Result<PathBuf> {
    #[cfg(not(target_os = "wasi"))]
    {
        dunce::canonicalize(path)
    }
    #[cfg(target_os = "wasi")]
    {
        canonicalize_wasi(path)
    }
}

#[cfg(target_os = "wasi")]
fn canonicalize_wasi<P: AsRef<Path>>(path: P) -> io::Result<PathBuf> {
  use std::fs;
  let path = path.as_ref();
  let meta = fs::symlink_metadata(path)?;
  if meta.file_type().is_symlink() {
      let link = fs::read_link(path)?;
      let mut path_buf = path.to_path_buf();
      path_buf.pop();
      for segment in link.iter() {
          match segment.to_str() {
              Some("..") => {
                  path_buf.pop();
              }
              Some(".") | None => {}
              Some(seg) => {
                  // Need to trim the extra \0 introduces by rust std rust-lang/rust#123727
                  path_buf.push(seg.trim_end_matches('\0'));
              }
          }
      }
      Ok(path_buf)
  } else {
      Ok(path.to_path_buf())
  }
}
