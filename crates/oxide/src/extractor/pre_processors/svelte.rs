use crate::extractor::pre_processors::pre_processor::PreProcessor;
use bstr::ByteSlice;

#[derive(Debug, Default)]
pub struct Svelte;

impl PreProcessor for Svelte {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        content
            .replace(" class:", " class ")
            .replace("\tclass:", " class ")
            .replace("\nclass:", " class ")
    }
}

#[cfg(test)]
mod tests {
    use super::Svelte;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;

    #[test]
    fn test_svelte_pre_processor() {
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
            Svelte::test(input, expected);
        }
    }
}
