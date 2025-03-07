use crate::cursor;
use crate::extractor::bracket_stack::BracketStack;
use crate::extractor::pre_processors::pre_processor::PreProcessor;

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

                // Replace following characters with spaces if they are not inside of brackets
                b'.' | b'#' | b'=' if bracket_stack.is_empty() => {
                    result[cursor.pos] = b' ';
                }

                b'(' | b'[' | b'{' => {
                    // Replace first bracket with a space
                    if bracket_stack.is_empty() {
                        result[cursor.pos] = b' ';
                    }
                    bracket_stack.push(cursor.curr);
                }

                b')' | b']' | b'}' => {
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
        ] {
            Haml::test(input, expected);
        }
    }
}
