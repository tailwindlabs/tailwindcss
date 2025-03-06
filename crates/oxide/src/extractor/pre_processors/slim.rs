use crate::cursor;
use crate::extractor::bracket_stack::BracketStack;
use crate::extractor::machine::Machine;
use crate::extractor::pre_processors::pre_processor::PreProcessor;
use crate::StringMachine;

#[derive(Debug, Default)]
pub struct Slim;

impl PreProcessor for Slim {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        let len = content.len();
        let mut result = content.to_vec();
        let mut cursor = cursor::Cursor::new(content);
        let mut string_machine = StringMachine;
        let mut bracket_stack = BracketStack::default();

        while cursor.pos < len {
            match cursor.curr {
                // Consume strings as-is
                b'\'' | b'"' => {
                    string_machine.next(&mut cursor);
                }

                // Replace dots with spaces
                b'.' if bracket_stack.is_empty() => {
                    result[cursor.pos] = b' ';
                }

                // Any `[` preceded by an alphanumeric value will not be part of a candidate.
                //
                // E.g.:
                //
                // ```
                //  .text-xl.text-red-600[
                //                       ^ not part of the `text-red-600` candidate
                //    data-foo="bar"
                //  ]
                //    | This line should be red
                // ```
                //
                // We know that `-[` is valid for an arbitrary value and that `:[` is valid as a
                // variant. However `[color:red]` is also valid, in this case `[` will be preceded
                // by nothing or a boundary character.
                // Instead of listing all boundary characters, let's list the characters we know
                // will be invalid instead.
                b'[' if bracket_stack.is_empty()
                    && matches!(cursor.prev, b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9') =>
                {
                    result[cursor.pos] = b' ';
                    bracket_stack.push(cursor.curr);
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
    use super::Slim;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;

    #[test]
    fn test_slim_pre_processor() {
        for (input, expected) in [
            // Convert dots to spaces
            ("div.flex.bg-red-500", "div flex bg-red-500"),
            (".flex.bg-red-500", " flex bg-red-500"),
            // Keep dots in strings
            (r#"div(class="px-2.5")"#, r#"div(class="px-2.5")"#),
            // Replace top-level `(a-z0-9)[` with `$1 `. E.g.: `.flex[x]` -> `.flex x]`
            (".text-xl.text-red-600[", " text-xl text-red-600 "),
            // But keep important brackets:
            (".text-[#0088cc]", " text-[#0088cc]"),
            // Arbitrary value and arbitrary modifier
            (
                ".text-[#0088cc].bg-[#0088cc]/[20%]",
                " text-[#0088cc] bg-[#0088cc]/[20%]",
            ),
            // Start of arbitrary property
            ("[color:red]", "[color:red]"),
            // Arbitrary container query
            ("@[320px]:flex", "@[320px]:flex"),
            // Nested brackets
            (
                "bg-[url(https://example.com/?q=[1,2])]",
                "bg-[url(https://example.com/?q=[1,2])]",
            ),
            // Nested brackets, with "invalid" syntax but valid due to nesting
            ("content-['50[]']", "content-['50[]']"),
        ] {
            Slim::test(input, expected);
        }
    }
}
