// See: - https://docs.ruby-lang.org/en/3.4/syntax/literals_rdoc.html#label-Percent+Literals
//      - https://docs.ruby-lang.org/en/3.4/syntax/literals_rdoc.html#label-25w+and+-25W-3A+String-Array+Literals
use crate::cursor;
use crate::extractor::bracket_stack;
use crate::extractor::pre_processors::pre_processor::PreProcessor;
use crate::scanner::pre_process_input;
use bstr::ByteVec;
use regex::{Regex, RegexBuilder};
use std::sync;

static TEMPLATE_START_REGEX: sync::LazyLock<Regex> = sync::LazyLock::new(|| {
    RegexBuilder::new(r#"\s*([a-z0-9_-]+)_template\s*<<[-~]?([A-Z]+)$"#)
        .multi_line(true)
        .build()
        .unwrap()
});

static TEMPLATE_END_REGEX: sync::LazyLock<Regex> = sync::LazyLock::new(|| {
    RegexBuilder::new(r#"^\s*([A-Z]+)"#)
        .multi_line(true)
        .build()
        .unwrap()
});

#[derive(Debug, Default)]
pub struct Ruby;

impl PreProcessor for Ruby {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        let len = content.len();
        let mut result = content.to_vec();
        let mut cursor = cursor::Cursor::new(content);
        let mut bracket_stack = bracket_stack::BracketStack::default();

        // Extract embedded template languages
        // https://viewcomponent.org/guide/templates.html#interpolations
        let content_as_str = std::str::from_utf8(content).unwrap();

        let starts = TEMPLATE_START_REGEX
            .captures_iter(content_as_str)
            .collect::<Vec<_>>();
        let ends = TEMPLATE_END_REGEX
            .captures_iter(content_as_str)
            .collect::<Vec<_>>();

        for start in starts.iter() {
            // The language for this block
            let lang = start.get(1).unwrap().as_str();

            // The HEREDOC delimiter
            let delimiter_start = start.get(2).unwrap().as_str();

            // Where the "body" starts for the HEREDOC block
            let body_start = start.get(0).unwrap().end();

            // Look through all of the ends to find a matching language
            for end in ends.iter() {
                // 1. This must appear after the start
                let body_end = end.get(0).unwrap().start();
                if body_end < body_start {
                    continue;
                }

                // The languages must match otherwise we haven't found the end
                let delimiter_end = end.get(1).unwrap().as_str();
                if delimiter_end != delimiter_start {
                    continue;
                }

                let body = &content_as_str[body_start..body_end];
                let replaced = pre_process_input(body.as_bytes(), &lang.to_ascii_lowercase());

                result.replace_range(body_start..body_end, replaced);
                break;
            }
        }

        // Ruby extraction
        while cursor.pos < len {
            // Looking for `%w` or `%W`
            if cursor.curr != b'%' && !matches!(cursor.next, b'w' | b'W') {
                cursor.advance();
                continue;
            }

            cursor.advance_twice();

            // Boundary character
            let boundary = match cursor.curr {
                b'[' => b']',
                b'(' => b')',
                b'{' => b'}',
                _ => {
                    cursor.advance();
                    continue;
                }
            };

            bracket_stack.reset();

            // Replace the current character with a space
            result[cursor.pos] = b' ';

            // Skip the boundary character
            cursor.advance();

            while cursor.pos < len {
                match cursor.curr {
                    // Skip escaped characters
                    b'\\' => {
                        // Use backslash to embed spaces in the strings.
                        if cursor.next == b' ' {
                            result[cursor.pos] = b' ';
                        }

                        cursor.advance();
                    }

                    // Start of a nested bracket
                    b'[' | b'(' | b'{' => {
                        bracket_stack.push(cursor.curr);
                    }

                    // End of a nested bracket
                    b']' | b')' | b'}' if !bracket_stack.is_empty() => {
                        if !bracket_stack.pop(cursor.curr) {
                            // Unbalanced
                            cursor.advance();
                        }
                    }

                    // End of the pattern, replace the boundary character with a space
                    _ if cursor.curr == boundary => {
                        result[cursor.pos] = b' ';
                        break;
                    }

                    // Everything else is valid
                    _ => {}
                }

                cursor.advance();
            }
        }

        result
    }
}

#[cfg(test)]
mod tests {
    use super::Ruby;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;

    #[test]
    fn test_ruby_pre_processor() {
        for (input, expected) in [
            // %w[…]
            ("%w[flex px-2.5]", "%w flex px-2.5 "),
            (
                "%w[flex data-[state=pending]:bg-[#0088cc] flex-col]",
                "%w flex data-[state=pending]:bg-[#0088cc] flex-col ",
            ),
            // %w{…}
            ("%w{flex px-2.5}", "%w flex px-2.5 "),
            (
                "%w{flex data-[state=pending]:bg-(--my-color) flex-col}",
                "%w flex data-[state=pending]:bg-(--my-color) flex-col ",
            ),
            // %w(…)
            ("%w(flex px-2.5)", "%w flex px-2.5 "),
            (
                "%w(flex data-[state=pending]:bg-(--my-color) flex-col)",
                "%w flex data-[state=pending]:bg-(--my-color) flex-col ",
            ),
            // Use backslash to embed spaces in the strings.
            (r#"%w[foo\ bar baz\ bat]"#, r#"%w foo  bar baz  bat "#),
            (r#"%W[foo\ bar baz\ bat]"#, r#"%W foo  bar baz  bat "#),
            // The nested delimiters evaluated to a flat array of strings
            // (not nested array).
            (r#"%w[foo[bar baz]qux]"#, r#"%w foo[bar baz]qux "#),
        ] {
            Ruby::test(input, expected);
        }
    }

    #[test]
    fn test_ruby_extraction() {
        for (input, expected) in [
            // %w[…]
            ("%w[flex px-2.5]", vec!["flex", "px-2.5"]),
            ("%w[px-2.5 flex]", vec!["flex", "px-2.5"]),
            ("%w[2xl:flex]", vec!["2xl:flex"]),
            (
                "%w[flex data-[state=pending]:bg-[#0088cc] flex-col]",
                vec!["flex", "data-[state=pending]:bg-[#0088cc]", "flex-col"],
            ),
            // %w{…}
            ("%w{flex px-2.5}", vec!["flex", "px-2.5"]),
            ("%w{px-2.5 flex}", vec!["flex", "px-2.5"]),
            ("%w{2xl:flex}", vec!["2xl:flex"]),
            (
                "%w{flex data-[state=pending]:bg-(--my-color) flex-col}",
                vec!["flex", "data-[state=pending]:bg-(--my-color)", "flex-col"],
            ),
            // %w(…)
            ("%w(flex px-2.5)", vec!["flex", "px-2.5"]),
            ("%w(px-2.5 flex)", vec!["flex", "px-2.5"]),
            ("%w(2xl:flex)", vec!["2xl:flex"]),
            (
                "%w(flex data-[state=pending]:bg-(--my-color) flex-col)",
                vec!["flex", "data-[state=pending]:bg-(--my-color)", "flex-col"],
            ),
        ] {
            Ruby::test_extract_contains(input, expected);
        }
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/17334
    #[test]
    fn test_embedded_slim_extraction() {
        let input = r#"
            class QweComponent < ApplicationComponent
              slim_template <<~SLIM
                button.rounded-full.bg-red-500
                  | Some text
                button.rounded-full(
                  class="flex"
                )
                  | Some text
              SLIM
            end
        "#;

        Ruby::test_extract_contains(input, vec!["rounded-full", "bg-red-500", "flex"]);

        // Embedded Svelte just to verify that we properly pick up the `{x}_template`
        let input = r#"
            class QweComponent < ApplicationComponent
              svelte_template <<~HTML
                  <div class:flex="true"></div>
              HTML
            end
        "#;

        Ruby::test_extract_contains(input, vec!["flex"]);

        // Together in the same file
        let input = r#"
            class QweComponent < ApplicationComponent
              slim_template <<~SLIM
                button.z-1.z-2
                  | Some text
              SLIM
            end

            class QweComponent < ApplicationComponent
              svelte_template <<~HTML
                <div class:z-3="true"></div>
              HTML
            end
        "#;
        Ruby::test_extract_contains(input, vec!["z-1", "z-2", "z-3"]);
    }
}
