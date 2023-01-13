use std::path::PathBuf;

#[derive(Debug)]
pub struct Location {
    pub file: PathBuf,
    pub start: (usize, usize),
    pub end: (usize, usize),
}
