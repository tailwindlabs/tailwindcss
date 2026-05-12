use crate::cursor;
use crate::extractor::pre_processors::pre_processor::PreProcessor;

#[derive(Debug, Default)]
pub struct Markdown;

impl PreProcessor for Markdown {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        let len = content.len();
        let mut result = content.to_vec();
        let mut cursor = cursor::Cursor::new(content);
        let mut bracket_stack = vec![];

        let mut in_directive = false;

        while cursor.pos < len {
            match (in_directive, cursor.curr()) {
                (false, b'{') => {
                    result[cursor.pos] = b' ';
                    in_directive = true;
                }
                (true, b'(' | b'[' | b'{' | b'<') => {
                    bracket_stack.push(cursor.curr());
                }
                (true, b')' | b']' | b'}' | b'>') if !bracket_stack.is_empty() => {
                    bracket_stack.pop();
                }
                (true, b'}') => {
                    result[cursor.pos] = b' ';
                    in_directive = false;
                }
                (true, b'.') if bracket_stack.is_empty() => {
                    result[cursor.pos] = b' ';
                }
                _ => {}
            }

            cursor.advance();
        }

        result
    }
}

#[cfg(test)]
mod tests {
    use super::Markdown;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;

    #[test]
    fn test_markdown_pre_processor() {
        for (input, expected) in [
            // Convert dots to spaces inside markdown inline directives
            (
                ":span[Some Text]{.text-gray-500}",
                ":span[Some Text]  text-gray-500 ",
            ),
            (
                ":span[Some Text]{.text-gray-500.bg-red-500}",
                ":span[Some Text]  text-gray-500 bg-red-500 ",
            ),
            (
                ":span[Some Text]{#myId .my-class key=val key2='val 2'}",
                ":span[Some Text] #myId  my-class key=val key2='val 2' ",
            ),
        ] {
            Markdown::test(input, expected);
        }
    }

    #[test]
    fn test_nested_classes_keep_the_dots() {
        for (input, expected) in [
            (
                r#"{<div class="px-2.5"></div>}"#,
                r#" <div class="px-2.5"></div> "#,
            ),
            (r#"{content-['example.js']}"#, r#" content-['example.js'] "#),
        ] {
            Markdown::test(input, expected);
        }
    }
}
