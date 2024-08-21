use fxhash::FxHashSet;

/// A cache to manage the list of candidates in the project.
#[derive(Default)]
pub struct Cache {
    candidates: FxHashSet<String>,
}

impl Cache {
    pub fn clear(&mut self) {
        self.candidates.clear();
    }

    pub fn contains_candidate(&self, candidate: &str) -> bool {
        self.candidates.contains(candidate)
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
}
