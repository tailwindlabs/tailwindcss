use crate::extractor::pre_processors::pre_processor::PreProcessor;
use crate::scanner::pre_process_input;
use bstr::ByteSlice;
use regex::Regex;
use std::sync;

static TEMPLATE_REGEX: sync::LazyLock<Regex> = sync::LazyLock::new(|| {
    Regex::new(
        r#"(?x)
            <template\s+
            # Consume quoted values whole so embedded lang attributes are ignored.
            (?:(?:[^>"']|"[^"]*"|'[^']*')*\s+)?
            lang\s*=\s*(?:"([^"]*)"|'([^']*)')
            # A closing angle bracket inside a quoted value does not end the tag.
            (?:[^>"']|"[^"]*"|'[^']*')*>
            ([\s\S]*)</template>
        "#,
    )
    .unwrap()
});

#[derive(Debug, Default)]
pub struct Vue;

impl PreProcessor for Vue {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        let mut result = content.to_vec();

        // Only process template tags if content is valid UTF-8
        if let Ok(content_as_str) = std::str::from_utf8(content) {
            for captures in TEMPLATE_REGEX.captures_iter(content_as_str) {
                let lang = captures
                    .get(1)
                    .or_else(|| captures.get(2))
                    .expect("template lang capture should exist")
                    .as_str();
                let body = captures
                    .get(3)
                    .expect("template body capture should exist")
                    .as_str();
                let replaced = pre_process_input(body.as_bytes().to_vec(), lang);
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
    fn test_vue_template_pug_with_attributes_and_whitespace() {
        for input in [
            r#"
                <template data-test="true" lang="pug">
                .bg-neutral-900.text-red-500 This is a test.
                </template>
            "#,
            r#"
                <template
                    lang = 'pug'
                    data-test="true"
                >
                .bg-neutral-900.text-red-500 This is a test.
                </template>
            "#,
        ] {
            Vue::test_extract_contains(input, vec!["bg-neutral-900", "text-red-500"]);
        }
    }

    #[test]
    fn test_vue_template_does_not_treat_data_lang_as_lang() {
        let input = r#"
            <template data-lang="pug">
            .bg-neutral-900.text-red-500 This is a test.
            </template>
        "#;

        Vue::test(input, input);
    }

    #[test]
    fn test_vue_template_does_not_treat_quoted_values_as_lang() {
        for attributes in [
            r#"data-config=" lang='pug'""#,
            r#"data-config=' lang="pug"'"#,
            r#"lang="html" data-config=" lang='pug'""#,
            r#"data-config=' lang="pug"' lang="html""#,
        ] {
            let input = format!(r#"<template {attributes}><div class="foo.bar"></div></template>"#);

            Vue::test(&input, &input);
        }
    }

    #[test]
    fn test_vue_template_pug_with_quoted_attribute_values() {
        for attributes in [
            r#"data-config=" lang='html'" lang="pug""#,
            r#"lang='pug' data-config=' lang="html"'"#,
            r#"data-config="a > b.c" lang='pug'"#,
            r#"lang="pug" data-config='a > b.c'"#,
            r#"functional data-test=true lang="pug""#,
        ] {
            let input = format!("<template {attributes}>.flex.items-center</template>");
            let expected = format!("<template {attributes}> flex items-center</template>");

            Vue::test(&input, &expected);
            Vue::test_extract_contains(&input, vec!["flex", "items-center"]);
        }
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
