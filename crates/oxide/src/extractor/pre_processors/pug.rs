use crate::cursor;
use crate::extractor::bracket_stack::BracketStack;
use crate::extractor::pre_processors::pre_processor::PreProcessor;

#[derive(Debug, Default)]
pub struct Pug;

impl PreProcessor for Pug {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        let len = content.len();
        let mut result = content.to_vec();
        let mut cursor = cursor::Cursor::new(content);
        let mut bracket_stack = BracketStack::default();

        while cursor.pos < len {
            match cursor.curr {
                // Consume strings as-is
                b'\'' | b'"' => {
                    let len = cursor.input.len();
                    let end_char = cursor.curr;

                    cursor.advance();

                    while cursor.pos < len {
                        match cursor.curr {
                            // Escaped character, skip ahead to the next character
                            b'\\' => cursor.advance_twice(),

                            // End of the string
                            b'\'' | b'"' if cursor.curr == end_char => break,

                            // Everything else is valid
                            _ => cursor.advance(),
                        };
                    }
                }

                // Replace dots with spaces
                b'.' if bracket_stack.is_empty() => {
                    result[cursor.pos] = b' ';
                }

                b'(' | b'[' | b'{' => {
                    bracket_stack.push(cursor.curr);
                }

                b')' | b']' | b'}' if !bracket_stack.is_empty() => {
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
    use super::Pug;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;

    #[test]
    fn test_pug_pre_processor() {
        for (input, expected) in [
            // Convert dots to spaces
            ("div.flex.bg-red-500", "div flex bg-red-500"),
            (".flex.bg-red-500", " flex bg-red-500"),
            // Keep dots in strings
            (r#"div(class="px-2.5")"#, r#"div(class="px-2.5")"#),
            // Nested brackets
            (
                "bg-[url(https://example.com/?q=[1,2])]",
                "bg-[url(https://example.com/?q=[1,2])]",
            ),
        ] {
            Pug::test(input, expected);
        }
    }
}
