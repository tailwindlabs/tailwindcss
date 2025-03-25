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

        let content_as_str = std::str::from_utf8(content).unwrap();
        for (_, [lang, body]) in TEMPLATE_REGEX
            .captures_iter(content_as_str)
            .map(|c| c.extract())
        {
            let replaced = pre_process_input(body.as_bytes(), lang);
            result = result.replace(body, replaced);
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
}
