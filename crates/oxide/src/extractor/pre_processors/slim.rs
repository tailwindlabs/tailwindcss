use crate::cursor;
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

        while cursor.pos < len {
            match cursor.curr {
                // Consume strings as-is
                b'\'' | b'"' => {
                    string_machine.next(&mut cursor);
                }

                // Replace dots with spaces
                b'.' => {
                    result[cursor.pos] = b' ';
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
        ] {
            Slim::test(input, expected);
        }
    }
}
