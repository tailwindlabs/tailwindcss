use crate::cursor;
use crate::extractor::bracket_stack::BracketStack;
use crate::extractor::pre_processors::pre_processor::PreProcessor;

#[derive(Debug, Default)]
pub struct Elixir;

impl PreProcessor for Elixir {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        let mut cursor = cursor::Cursor::new(content);
        let mut result = content.to_vec();
        let mut bracket_stack = BracketStack::default();

        while cursor.pos < content.len() {
            // Look for a sigil marker
            if cursor.curr != b'~' {
                cursor.advance();
                continue;
            }

            // Scan charlists, strings, and wordlists
            if !matches!(cursor.next, b'c' | b'C' | b's' | b'S' | b'w' | b'W') {
                cursor.advance();
                continue;
            }

            cursor.advance_twice();

            // Match the opening for a sigil
            if !matches!(cursor.curr, b'(' | b'[' | b'{') {
                continue;
            }

            // Replace the opening bracket with a space
            result[cursor.pos] = b' ';

            // Scan until we find a balanced closing one and replace it too
            bracket_stack.push(cursor.curr);

            while cursor.pos < content.len() {
                cursor.advance();

                match cursor.curr {
                    // Escaped character, skip ahead to the next character
                    b'\\' => cursor.advance_twice(),
                    b'(' | b'[' | b'{' => {
                        bracket_stack.push(cursor.curr);
                    }
                    b')' | b']' | b'}' if !bracket_stack.is_empty() => {
                        bracket_stack.pop(cursor.curr);

                        if bracket_stack.is_empty() {
                            // Replace the closing bracket with a space
                            result[cursor.pos] = b' ';
                            break;
                        }
                    }
                    _ => {}
                }
            }
        }

        result
    }
}

#[cfg(test)]
mod tests {
    use super::Elixir;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;

    #[test]
    fn test_elixir_pre_processor() {
        for (input, expected) in [
            // Simple sigils
            ("~W(flex underline)", "~W flex underline "),
            ("~W[flex underline]", "~W flex underline "),
            ("~W{flex underline}", "~W flex underline "),
            // Sigils with nested brackets
            (
                "~W(text-(--my-color) bg-(--my-color))",
                "~W text-(--my-color) bg-(--my-color) ",
            ),
            ("~W[text-[red] bg-[red]]", "~W text-[red] bg-[red] "),
            // Word sigils with modifiers
            ("~W(flex underline)a", "~W flex underline a"),
            ("~W(flex underline)c", "~W flex underline c"),
            ("~W(flex underline)s", "~W flex underline s"),
            // Other sigil types
            ("~w(flex underline)", "~w flex underline "),
            ("~c(flex underline)", "~c flex underline "),
            ("~C(flex underline)", "~C flex underline "),
            ("~s(flex underline)", "~s flex underline "),
            ("~S(flex underline)", "~S flex underline "),
        ] {
            Elixir::test(input, expected);
        }
    }

    #[test]
    fn test_extract_candidates() {
        let input = r#"
          ~W(c1 c2)
          ~W[c3 c4]
          ~W{c5 c6}
          ~W(text-(--c7) bg-(--c8))
          ~W[text-[c9] bg-[c10]]
          ~W(c13 c14)a
          ~W(c15 c16)c
          ~W(c17 c18)s
          ~w(c19 c20)
          ~c(c21 c22)
          ~C(c23 c24)
          ~s(c25 c26)
          ~S(c27 c28)
          ~W"c29 c30"
          ~W'c31 c32'
        "#;

        Elixir::test_extract_contains(
            input,
            vec![
                "c1",
                "c2",
                "c3",
                "c4",
                "c5",
                "c6",
                "text-(--c7)",
                "bg-(--c8)",
                "c13",
                "c14",
                "c15",
                "c16",
                "c17",
                "c18",
                "c19",
                "c20",
                "c21",
                "c22",
                "c23",
                "c24",
                "c25",
                "c26",
                "c27",
                "c28",
                "c29",
                "c30",
                "c31",
                "c32",
            ],
        );
    }
}
