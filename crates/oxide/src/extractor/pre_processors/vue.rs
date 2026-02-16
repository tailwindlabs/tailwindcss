use crate::extractor::pre_processors::pre_processor::PreProcessor;
use crate::scanner::pre_process_input;
use bstr::ByteSlice;
use regex::Regex;
use std::sync;

static TEMPLATE_REGEX: sync::LazyLock<Regex> = sync::LazyLock::new(|| {
    Regex::new(r#"<template lang=['"]([^"']*)['"]>([\s\S]*)<\/template>"#).unwrap()
});

#[derive(Debug, Default)]
pub struct Vue;

impl PreProcessor for Vue {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        let mut result = content.to_vec();

        // Only process template tags if content is valid UTF-8
        if let Ok(content_as_str) = std::str::from_utf8(content) {
            for (_, [lang, body]) in TEMPLATE_REGEX
                .captures_iter(content_as_str)
                .map(|c| c.extract())
            {
                let replaced = pre_process_input(body.as_bytes(), lang);
                result = result.replace(body, replaced);
            }
        }

        result
    }
}

#[cfg(test)]
mod tests {
    use super::Vue;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;

    #[test]
    fn test_vue_template_pug() {
        let input = r#"
            <template lang="pug">
            .bg-neutral-900.text-red-500 This is a test.
            </template>
        "#;

        Vue::test_extract_contains(input, vec!["bg-neutral-900", "text-red-500"]);
    }

    #[test]
    fn test_invalid_utf8_does_not_panic() {
        // Invalid UTF-8 sequence: 0x80 is a continuation byte without a leading byte
        let invalid_utf8: &[u8] = &[0x80, 0x81, 0x82];

        let processor = Vue::default();

        // Should not panic, just return the input unchanged
        let result = processor.process(invalid_utf8);
        assert_eq!(result, invalid_utf8);
    }
}
