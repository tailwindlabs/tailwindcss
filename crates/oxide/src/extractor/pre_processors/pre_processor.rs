pub trait PreProcessor: Sized + Default {
    fn process(&self, content: &[u8]) -> Vec<u8>;

    #[cfg(test)]
    fn test(input: &str, expected: &str) {
        let input = input.as_bytes();
        let expected = expected.as_bytes();

        let processor = Self::default();

        let actual = processor.process(input);

        // Convert to strings for better error messages.
        let input = String::from_utf8_lossy(input);
        let actual = String::from_utf8_lossy(&actual);
        let expected = String::from_utf8_lossy(expected);

        if actual != expected {
            dbg!((&input, &actual, &expected));
        }

        // The input and output should have the exact same length.
        assert_eq!(input.len(), actual.len());
        assert_eq!(actual.len(), expected.len());

        assert_eq!(actual, expected);
    }
}
