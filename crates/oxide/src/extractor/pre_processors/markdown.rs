use crate::cursor;
use crate::extractor::pre_processors::pre_processor::PreProcessor;

#[derive(Debug, Default)]
pub struct Markdown;

impl PreProcessor for Markdown {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        let len = content.len();
        let mut result = content.to_vec();
        let mut cursor = cursor::Cursor::new(content);

        let mut in_directive = false;

        while cursor.pos < len {
            match (in_directive, cursor.curr) {
                (false, b'{') => {
                    result[cursor.pos] = b' ';
                    in_directive = true;
                }
                (true, b'}') => {
                    result[cursor.pos] = b' ';
                    in_directive = false;
                }
                (true, b'.') => {
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
}
