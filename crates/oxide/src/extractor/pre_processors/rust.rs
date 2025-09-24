use crate::extractor::bracket_stack;
use crate::extractor::cursor;
use crate::extractor::machine::Machine;
use crate::extractor::pre_processors::pre_processor::PreProcessor;
use crate::extractor::variant_machine::VariantMachine;
use crate::extractor::MachineState;
use bstr::ByteSlice;

#[derive(Debug, Default)]
pub struct Rust;

impl PreProcessor for Rust {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        // Leptos support: https://github.com/tailwindlabs/tailwindcss/pull/18093
        let replaced_content = content
            .replace(" class:", " class ")
            .replace("\tclass:", " class ")
            .replace("\nclass:", " class ");

        if replaced_content.contains_str(b"html!") {
            self.process_maud_templates(&replaced_content)
        } else {
            replaced_content
        }
    }
}

impl Rust {
    fn process_maud_templates(&self, replaced_content: &[u8]) -> Vec<u8> {
        let len = replaced_content.len();
        let mut result = replaced_content.to_vec();
        let mut cursor = cursor::Cursor::new(replaced_content);
        let mut bracket_stack = bracket_stack::BracketStack::default();

        while cursor.pos < len {
            match cursor.curr {
                // Escaped character, skip ahead to the next character
                b'\\' => {
                    cursor.advance_twice();
                    continue;
                }

                // Consume strings as-is
                b'"' => {
                    result[cursor.pos] = b' ';
                    cursor.advance();

                    while cursor.pos < len {
                        match cursor.curr {
                            // Escaped character, skip ahead to the next character
                            b'\\' => cursor.advance_twice(),

                            // End of the string
                            b'"' => {
                                result[cursor.pos] = b' ';
                                break;
                            }

                            // Everything else is valid
                            _ => cursor.advance(),
                        };
                    }
                }

                // Only replace `.` with a space if it's not surrounded by numbers. E.g.:
                //
                // ```diff
                // - .flex.items-center
                // +  flex items-center
                // ```
                //
                // But with numbers, it's allowed:
                //
                // ```diff
                // - px-2.5
                // + px-2.5
                // ```
                b'.' => {
                    // Don't replace dots with spaces when inside of any type of brackets, because
                    // this could be part of arbitrary values. E.g.: `bg-[url(https://example.com)]`
                    //                                                                       ^
                    if !bracket_stack.is_empty() {
                        cursor.advance();
                        continue;
                    }

                    // If the dot is surrounded by digits, we want to keep it. E.g.: `px-2.5`
                    // EXCEPT if it's followed by a valid variant that happens to start with a
                    // digit.
                    // E.g.: `bg-red-500.2xl:flex`
                    //                 ^^^
                    if cursor.prev.is_ascii_digit() && cursor.next.is_ascii_digit() {
                        let mut next_cursor = cursor.clone();
                        next_cursor.advance();

                        let mut variant_machine = VariantMachine::default();
                        if let MachineState::Done(_) = variant_machine.next(&mut next_cursor) {
                            result[cursor.pos] = b' ';
                        }
                    } else {
                        result[cursor.pos] = b' ';
                    }
                }

                b'[' => {
                    bracket_stack.push(cursor.curr);
                }

                b']' if !bracket_stack.is_empty() => {
                    bracket_stack.pop(cursor.curr);
                }

                // Consume everything else
                _ => {}
            };

            cursor.advance();
        }

        result
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

    // https://github.com/tailwindlabs/tailwindcss/issues/18984
    #[test]
    fn test_maud_template_extraction() {
        let input = r#"
            use maud::{html, Markup};

            pub fn main() -> Markup {
                html! {
                    header.px-8.py-4.text-black {
                        "Hello, world!"
                    }
                }
            }
        "#;

        Rust::test_extract_contains(input, vec!["px-8", "py-4", "text-black"]);

        // https://maud.lambda.xyz/elements-attributes.html#classes-and-ids-foo-bar
        let input = r#"
            html! {
                input #cannon .big.scary.bright-red type="button" value="Launch Party Cannon";
            }
        "#;
        Rust::test_extract_contains(input, vec!["big", "scary", "bright-red"]);

        let input = r#"
            html! {
                div."bg-[#0088cc]" { "Quotes for backticks" }
            }
        "#;
        Rust::test_extract_contains(input, vec!["bg-[#0088cc]"]);

        let input = r#"
            html! {
                #main {
                    "Main content!"
                    .tip { "Storing food in a refrigerator can make it 20% cooler." }
                }
            }
        "#;
        Rust::test_extract_contains(input, vec!["tip"]);

        let input = r#"
            html! {
                div."bg-[url(https://example.com)]" { "Arbitrary values" }
            }
        "#;
        Rust::test_extract_contains(input, vec!["bg-[url(https://example.com)]"]);

        let input = r#"
            html! {
                div.px-4.text-black {
                    "Some text, with unbalanced brackets ]["
                }
                div.px-8.text-white {
                    "Some more text, with unbalanced brackets ]["
                }
            }
        "#;
        Rust::test_extract_contains(input, vec!["px-4", "text-black", "px-8", "text-white"]);

        let input = r#"html! { \x.px-4.text-black {  } }"#;
        Rust::test(input, r#"html! { \x px-4 text-black {  } }"#);
    }
}
