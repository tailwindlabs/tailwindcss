pub trait PreProcessor: Sized + Default {
    fn process(&self, content: &[u8]) -> Vec<u8>;

    #[cfg(test)]
    fn test(input: &str, expected: &str) {
        use pretty_assertions::assert_eq;

        let input = input.as_bytes();
        let expected = expected.as_bytes();

        let processor = Self::default();

        let actual = processor.process(input);

        // Convert to strings for better error messages.
        let input = String::from_utf8_lossy(input);
        let actual = String::from_utf8_lossy(&actual);
        let expected = String::from_utf8_lossy(expected);

        // The input and output should have the exact same length.
        assert_eq!(input.len(), actual.len());
        assert_eq!(actual.len(), expected.len());

        assert_eq!(actual, expected);
    }

    #[cfg(test)]
    fn test_extract_contains(input: &str, items: Vec<&str>) {
        use crate::extractor::{Extracted, Extractor};

        let input = input.as_bytes();

        let processor = Self::default();
        let transformed = processor.process(input);

        let extracted = Extractor::new(&transformed).extract();

        // Extract all candidates and css variables.
        let candidates = extracted
            .iter()
            .filter_map(|x| match x {
                Extracted::Candidate(bytes) => std::str::from_utf8(bytes).ok(),
                Extracted::CssVariable(bytes) => std::str::from_utf8(bytes).ok(),
            })
            .collect::<Vec<_>>();

        // Ensure all items are present in the candidates.
        let mut missing = vec![];
        for item in &items {
            if !candidates.contains(item) {
                missing.push(item);
            }
        }

        if !missing.is_empty() {
            dbg!(&candidates, &missing);
            panic!("Missing some items");
        }
    }
}
