use crate::utility::Utility;
use crate::variant::Variant;

#[derive(Debug)]
pub struct Candidate {
    pub raw: String,

    pub utility: Utility,
    pub variants: Vec<Variant>,
}

impl Candidate {
    pub fn new(raw: String) -> Candidate {
        // TODO: make nice
        let mut in_arbitrary = false;
        let mut parts = raw
            .split(|x| {
                if x == '[' || x == ']' {
                    in_arbitrary = !in_arbitrary;
                    false
                } else {
                    x == ':' && !in_arbitrary
                }
            })
            .collect::<Vec<_>>();

        let utility = match parts.pop() {
            Some(raw_utility) => Utility::new(raw_utility),
            None => unreachable!(),
        };

        let variants = parts.into_iter().map(Variant::new).collect::<Vec<_>>();

        Self {
            raw,
            utility,
            variants,
        }
    }
}
