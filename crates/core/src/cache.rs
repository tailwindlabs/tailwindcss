use std::{path::PathBuf, time::SystemTime};
use std::fs::{self};
use fxhash::{FxHashMap, FxHashSet};

/// A cache to manage the list of candidates and the last modified time of files
/// in the project. This is used to avoid recompiling files that haven't changed.
#[derive(Default)]
pub struct Cache {
    mtimes: FxHashMap<PathBuf, SystemTime>,
    candidates: FxHashSet<String>,
}

impl Cache {
    pub fn clear(&mut self) {
        self.mtimes.clear();
        self.candidates.clear();
    }

    pub fn add_candidates(&mut self, additional_candidates: Vec<String>) {
        self.candidates.extend(additional_candidates);
    }

    pub fn get_candidates(&self) -> Vec<String> {
        let mut result = vec![];
        result.extend(self.candidates.iter().cloned());
        result.sort();
        result
    }

    pub fn find_modified_files<'a>(&mut self, paths: &'a Vec<PathBuf>) -> Vec<&'a PathBuf> {
        // Get a list of the files that have been modified since the last time we checked
        let mut modified: Vec<&PathBuf> = vec![];

        for path in paths {
            let curr = fs::metadata(path)
                .and_then(|m| m.modified())
                .unwrap_or(SystemTime::now());

            let prev = self.mtimes.insert(path.clone(), curr);

            match prev {
                // Only add the file to the modified list if the mod time has changed
                Some(prev) if prev != curr => {
                    modified.push(path);
                },

                // If the file was already in the cache then we don't need to do anything
                Some(_) => (),

                // If the file didn't exist before then it's been modified
                None => modified.push(path),
            }
        }

        modified
    }
}
