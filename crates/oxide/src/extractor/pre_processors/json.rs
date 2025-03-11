use crate::cursor;
use crate::extractor::pre_processors::pre_processor::PreProcessor;

#[derive(Debug, Default)]
pub struct Json;

impl PreProcessor for Json {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        let len = content.len();
        let mut result = content.to_vec();
        let mut cursor = cursor::Cursor::new(content);

        while cursor.pos < len {
            match cursor.curr {
                // Consume strings as-is
                b'"' => {
                    cursor.advance();

                    while cursor.pos < len {
                        match cursor.curr {
                            // Escaped character, skip ahead to the next character
                            b'\\' => cursor.advance_twice(),

                            // End of the string
                            b'"' => break,

                            // Everything else is valid
                            _ => cursor.advance(),
                        };
                    }
                }

                // Replace brackets and curlies with spaces
                b'[' | b'{' | b']' | b'}' => {
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
    use super::Json;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;

    #[test]
    fn test_json_pre_processor() {
        let (input, expected) = (
            r#"[1,[2,[3,4,["flex flex-1 content-['hello_world']"]]], {"flex": true}]"#,
            r#" 1, 2, 3,4, "flex flex-1 content-['hello_world']"   ,  "flex": true  "#,
        );

        Json::test(input, expected);
    }
}
