use crate::cursor;
use crate::extractor::bracket_stack::BracketStack;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::pre_processors::pre_processor::PreProcessor;
use crate::extractor::variant_machine::VariantMachine;

#[derive(Debug, Default)]
pub struct Haml;

impl PreProcessor for Haml {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        let len = content.len();
        let mut result = content.to_vec();
        let mut cursor = cursor::Cursor::new(content);
        let mut bracket_stack = BracketStack::default();

        while cursor.pos < len {
            match cursor.curr {
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

                // Replace following characters with spaces if they are not inside of brackets
                b'#' | b'=' if bracket_stack.is_empty() => {
                    result[cursor.pos] = b' ';
                }

                b'(' | b'[' | b'{' => {
                    // Replace first bracket with a space
                    if bracket_stack.is_empty() {
                        result[cursor.pos] = b' ';
                    }
                    bracket_stack.push(cursor.curr);
                }

                b')' | b']' | b'}' if !bracket_stack.is_empty() => {
                    bracket_stack.pop(cursor.curr);

                    // Replace closing bracket with a space
                    if bracket_stack.is_empty() {
                        result[cursor.pos] = b' ';
                    }
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
    use super::Haml;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;
    use pretty_assertions::assert_eq;

    #[test]
    fn test_haml_pre_processor() {
        for (input, expected) in [
            // Element with classes
            (
                "%body.flex.flex-col.items-center.justify-center",
                "%body flex flex-col items-center justify-center",
            ),
            // Plain element
            (
                ".text-slate-500.xl:text-gray-500",
                " text-slate-500 xl:text-gray-500",
            ),
            // Element with hash attributes
            (
                ".text-black.xl:text-red-500{ data: { tailwind: 'css' } }",
                " text-black xl:text-red-500  data: { tailwind: 'css' }  ",
            ),
            // Element with a boolean attribute
            (
                ".text-green-500.xl:text-blue-500(data-sidebar)",
                " text-green-500 xl:text-blue-500 data-sidebar ",
            ),
            // Element with interpreted content
            (
                ".text-yellow-500.xl:text-purple-500= 'Element with interpreted content'",
                " text-yellow-500 xl:text-purple-500  'Element with interpreted content'",
            ),
            // Element with a hash at the end and an extra class.
            (
                ".text-orange-500.xl:text-pink-500{ class: 'bg-slate-100' }",
                " text-orange-500 xl:text-pink-500  class: 'bg-slate-100'  ",
            ),
            // Object reference
            (
                ".text-teal-500.xl:text-indigo-500[@user, :greeting]",
                " text-teal-500 xl:text-indigo-500 @user, :greeting ",
            ),
            // Element with an ID
            (
                ".text-lime-500.xl:text-emerald-500#root",
                " text-lime-500 xl:text-emerald-500 root",
            ),
            // Dots in strings in HTML attributes stay as-is
            (r#"<div id="px-2.5"></div>"#, r#"<div id "px-2.5"></div>"#),
        ] {
            Haml::test(input, expected);
        }
    }

    #[test]
    fn test_strings_only_occur_when_nested() {
        let input = r#"
            %p.mt-2.text-xl
              The quote in the next word, can't be the start of a string

            %h3.mt-24.text-center.text-4xl.font-bold.italic
              The classes above should be extracted
        "#;

        Haml::test_extract_contains(
            input,
            vec![
                // First paragraph
                "mt-2",
                "text-xl",
                // second paragraph
                "mt-24",
                "text-center",
                "text-4xl",
                "font-bold",
                "italic",
            ],
        );
    }

    // https://github.com/tailwindlabs/tailwindcss/pull/17051#issuecomment-2711181352
    #[test]
    fn test_haml_full_file() {
        let processed = Haml.process(include_bytes!("./test-fixtures/haml/src-1.haml"));
        let actual = std::str::from_utf8(&processed).unwrap();
        let expected = include_str!("./test-fixtures/haml/dst-1.haml");

        assert_eq!(actual, expected);
    }

    #[test]
    fn test_arbitrary_code_followed_by_classes() {
        let input = r#"
            %p
              = i < 3
              .flex.items-center
        "#;
        Haml::test_extract_contains(input, vec!["flex", "items-center"]);
    }
}
