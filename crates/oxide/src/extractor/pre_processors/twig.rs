use crate::cursor;
use crate::extractor::pre_processors::pre_processor::PreProcessor;

#[derive(Debug, Default)]
pub struct Twig;

impl PreProcessor for Twig {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        let len = content.len();
        let mut result = content.to_vec();
        let mut cursor = cursor::Cursor::new(content);
        let mut bracket_stack = vec![];

        const ADD_CLASS: &[u8] = b"addClass";
        const REMOVE_CLASS: &[u8] = b"removeClass";

        while cursor.pos < len {
            match (!bracket_stack.is_empty(), cursor.curr()) {
                // addClass(
                //         ^
                (false, b'(')
                    if cursor.pos >= ADD_CLASS.len()
                        && matches!(
                            &content[cursor.pos - ADD_CLASS.len()..cursor.pos],
                            ADD_CLASS
                        ) =>
                {
                    bracket_stack.push(cursor.curr());
                    result[cursor.pos] = b' ';
                }

                // removeClass(
                //            ^
                (false, b'(')
                    if cursor.pos >= REMOVE_CLASS.len()
                        && matches!(
                            &content[cursor.pos - REMOVE_CLASS.len()..cursor.pos],
                            REMOVE_CLASS
                        ) =>
                {
                    bracket_stack.push(cursor.curr());
                    result[cursor.pos] = b' ';
                }

                (true, b'(') => {
                    bracket_stack.push(cursor.curr());
                }

                (true, b')') => {
                    bracket_stack.pop();

                    if bracket_stack.is_empty() {
                        result[cursor.pos] = b' ';
                    }
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
    use super::Twig;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;

    #[test]
    fn test_twig_pre_processor() {
        for (input, expected) in [
            (
                // Ensure we don't crash when we encounter an `(`
                "(p-(--value))",
                "(p-(--value))",
            ),
            (
                // addClass with single argument
                "addClass(p-(--value))",
                "addClass p-(--value) ",
            ),
            (
                // addClass with single argument
                "addClass(m-4 p-8 w-full)",
                "addClass m-4 p-8 w-full ",
            ),
            (
                // removeClass with single argument
                "removeClass(p-(--value))",
                "removeClass p-(--value) ",
            ),
            (
                // removeClass with single argument
                "removeClass(m-4 p-8 w-full)",
                "removeClass m-4 p-8 w-full ",
            ),
            (
                // Combined with single arguments
                "addClass(m-(--value))|removeClass(p-(--value))",
                "addClass m-(--value) |removeClass p-(--value) ",
            ),
        ] {
            Twig::test(input, expected);
        }
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/19458
    #[test]
    fn test_extraction_in_add_class_and_remove_class_works() {
        // Inside normal HTML
        let input = r#"
          <div data-loading="addClass(opacity-50)">
            <!-- -->
          </div>
        "#;

        let expected = r#"
          <div data-loading="addClass opacity-50 ">
            <!-- -->
          </div>
        "#;

        Twig::test(input, expected);
        Twig::test_extract_contains(input, vec!["opacity-50"]);

        // Inside a component
        let input = r#"
            <twig:d:Card
              {{ ...attributes.defaults({
                  as: "a",
                  class: "cursor-pointer bg-base-200 card-sm md:card-md lg:card-lg",
                  role: "button",
                  tabindex: "0",
                  "data-action": "live#$render",
                  "data-loading": "addAttribute(disabled)",
                  "data-poll": "delay(60000)|$render",
                  "data-loading": "addClass(border border-red-500 opacity-75)",
                 })
              }}
            >
        "#;

        let expected = r#"
            <twig:d:Card
              {{ ...attributes.defaults({
                  as: "a",
                  class: "cursor-pointer bg-base-200 card-sm md:card-md lg:card-lg",
                  role: "button",
                  tabindex: "0",
                  "data-action": "live#$render",
                  "data-loading": "addAttribute(disabled)",
                  "data-poll": "delay(60000)|$render",
                  "data-loading": "addClass border border-red-500 opacity-75 ",
                 })
              }}
            >
        "#;

        Twig::test(input, expected);
        Twig::test_extract_contains(
            input,
            vec![
                // class
                "cursor-pointer",
                "bg-base-200",
                "card-sm",
                "md:card-md",
                "lg:card-lg",
                // data-loading
                "border",
                "border-red-500",
                "opacity-75",
            ],
        );
    }
}
