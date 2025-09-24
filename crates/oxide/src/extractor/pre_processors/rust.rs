use crate::extractor::pre_processors::pre_processor::PreProcessor;
use bstr::ByteSlice;

#[derive(Debug, Default)]
pub struct Rust;

impl PreProcessor for Rust {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        // Leptos support: https://github.com/tailwindlabs/tailwindcss/pull/18093
        content
            .replace(" class:", " class ")
            .replace("\tclass:", " class ")
            .replace("\nclass:", " class ")
    }
}

#[cfg(test)]
mod tests {
    use super::Rust;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;

    #[test]
    fn test_leptos_extraction() {
        for (input, expected) in [
            // Spaces
            (
                "<div class:flex class:px-2.5={condition()}>",
                "<div class flex class px-2.5={condition()}>",
            ),
            // Tabs
            (
                "<div\tclass:flex class:px-2.5={condition()}>",
                "<div class flex class px-2.5={condition()}>",
            ),
            // Newlines
            (
                "<div\nclass:flex class:px-2.5={condition()}>",
                "<div class flex class px-2.5={condition()}>",
            ),
        ] {
            Rust::test(input, expected);
        }
    }
}
