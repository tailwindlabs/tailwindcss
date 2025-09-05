use crate::cursor;
use crate::extractor::pre_processors::pre_processor::PreProcessor;
use bstr::ByteSlice;

#[derive(Debug, Default)]
pub struct Clojure;

/// This is meant to be a rough estimate of a valid ClojureScript keyword
///
/// This can be approximated by the following regex:
/// /::?[a-zA-Z0-9!#$%&*+./:<=>?_|-]+/
///
/// However, keywords are intended to be detected as utilities. Since the set
/// of valid characters in a utility (outside of arbitrary values) is smaller,
/// along with the fact that neither `[]` nor `()` are allowed in keywords we
/// can simplify this list quite a bit.
#[inline]
fn is_keyword_character(byte: u8) -> bool {
    (matches!(
        byte,
        b'!' | b'#' | b'%' | b'*' | b'+' | b'-' | b'.' | b'/' | b':' | b'_'
    ) | byte.is_ascii_alphanumeric())
}

impl PreProcessor for Clojure {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        let content = content
            .replace(":class", "      ")
            .replace(":className", "          ");
        let len = content.len();
        let mut result = content.to_vec();
        let mut cursor = cursor::Cursor::new(&content);

        while cursor.pos < len {
            match cursor.curr {
                // Consume strings as-is
                b'"' => {
                    result[cursor.pos] = b' ';
                    cursor.advance();

                    while cursor.pos < len {
                        match cursor.curr {
                            // Escaped character, skip ahead to the next character
                            b'\\' => cursor.advance_twice(),

                            // End of the string
                            b'"' => {
                                result[cursor.pos] = b' ';
                                break;
                            }

                            // Everything else is valid
                            _ => cursor.advance(),
                        };
                    }
                }

                // Discard line comments until the end of the line.
                // Comments start with `;;`
                b';' if matches!(cursor.next, b';') => {
                    while cursor.pos < len && cursor.curr != b'\n' {
                        result[cursor.pos] = b' ';
                        cursor.advance();
                    }
                }

                // Consume keyword until a terminating character is reached.
                b':' => {
                    result[cursor.pos] = b' ';
                    cursor.advance();

                    while cursor.pos < len {
                        match cursor.curr {
                            // A `.` surrounded by digits is a decimal number, so we don't want to replace it.
                            //
                            // E.g.:
                            // ```
                            // gap-1.5
                            //      ^
                            // ```
                            b'.' if cursor.prev.is_ascii_digit()
                                && cursor.next.is_ascii_digit() =>
                            {
                                // Keep the `.` as-is
                            }
                            // A `.` not surrounded by digits denotes the start of a new class name in a
                            // dot-delimited keyword.
                            //
                            // E.g.:
                            // ```
                            // flex.gap-1.5
                            //     ^
                            // ```
                            b'.' => {
                                result[cursor.pos] = b' ';
                            }
                            // End of keyword.
                            _ if !is_keyword_character(cursor.curr) => {
                                result[cursor.pos] = b' ';
                                break;
                            }

                            // Consume everything else.
                            _ => {}
                        };

                        cursor.advance();
                    }
                }

                // Handle quote with a list, e.g.: `'(…)`
                // and with a vector, e.g.: `'[…]`
                b'\'' if matches!(cursor.next, b'[' | b'(') => {
                    result[cursor.pos] = b' ';
                    cursor.advance();
                    result[cursor.pos] = b' ';
                    let end = match cursor.curr {
                        b'[' => b']',
                        b'(' => b')',
                        _ => unreachable!(),
                    };

                    // Consume until the closing `]`
                    while cursor.pos < len {
                        match cursor.curr {
                            x if x == end => {
                                result[cursor.pos] = b' ';
                                break;
                            }

                            // Consume strings as-is
                            b'"' => {
                                result[cursor.pos] = b' ';
                                cursor.advance();

                                while cursor.pos < len {
                                    match cursor.curr {
                                        // Escaped character, skip ahead to the next character
                                        b'\\' => cursor.advance_twice(),

                                        // End of the string
                                        b'"' => {
                                            result[cursor.pos] = b' ';
                                            break;
                                        }

                                        // Everything else is valid
                                        _ => cursor.advance(),
                                    };
                                }
                            }
                            _ => {}
                        };

                        cursor.advance();
                    }
                }

                // Handle quote with a keyword, e.g.: `'bg-white`
                b'\'' if !cursor.next.is_ascii_whitespace() => {
                    result[cursor.pos] = b' ';
                    cursor.advance();

                    while cursor.pos < len {
                        match cursor.curr {
                            // End of keyword.
                            _ if !is_keyword_character(cursor.curr) => {
                                result[cursor.pos] = b' ';
                                break;
                            }

                            // Consume everything else.
                            _ => {}
                        };

                        cursor.advance();
                    }
                }

                // Aggressively discard everything else, reducing false positives and preventing
                // characters surrounding keywords from producing false negatives.
                // E.g.:
                // ```
                // (when condition :bg-white)
                //                          ^
                // ```
                // A ')' is never a valid part of a keyword, but will nonetheless prevent 'bg-white'
                // from being extracted if not discarded.
                _ => {
                    result[cursor.pos] = b' ';
                }
            };

            cursor.advance();
        }

        result
    }
}

#[cfg(test)]
mod tests {
    use super::Clojure;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;

    #[test]
    fn test_clojure_pre_processor() {
        for (input, expected) in [
            (":div.flex-1.flex-2", " div flex-1 flex-2"),
            (
                ":.flex-3.flex-4 ;defaults to div",
                "  flex-3 flex-4                 ",
            ),
            ("{:class :flex-5.flex-6", "         flex-5 flex-6"),
            (r#"{:class "flex-7 flex-8"}"#, r#"         flex-7 flex-8  "#),
            (
                r#"{:class  ["flex-9" :flex-10]}"#,
                r#"           flex-9   flex-10  "#,
            ),
            (
                r#"(dom/div {:class "flex-11 flex-12"})"#,
                r#"                  flex-11 flex-12   "#,
            ),
            ("(dom/div :.flex-13.flex-14", "           flex-13 flex-14"),
            (
                r#"[:div#hello.bg-white.pr-1.5 {:class ["grid grid-cols-[auto,1fr] grid-rows-2"]}]"#,
                r#"  div#hello bg-white pr-1.5           grid grid-cols-[auto,1fr] grid-rows-2    "#,
            ),
        ] {
            Clojure::test(input, expected);
        }
    }

    #[test]
    fn test_extract_candidates() {
        // https://github.com/luckasRanarison/tailwind-tools.nvim/issues/68#issuecomment-2660951258
        let input = r#"
            :div.c1.c2
            :.c3.c4 ;defaults to div
            {:class :c5.c6
            {:class "c7 c8"}
            {:class  ["c9" :c10]}
            (dom/div {:class "c11 c12"})
            (dom/div :.c13.c14
            {:className :c15.c16
            {:className "c17 c18"}
            {:className  ["c19" :c20]}
            (dom/div {:className "c21 c22"})
        "#;

        Clojure::test_extract_contains(
            input,
            vec![
                "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12", "c13",
                "c14", "c15", "c16", "c17", "c18", "c19", "c20", "c21", "c22",
            ],
        );

        // Similar structure but using real classes
        let input = r#"
            :div.flex-1.flex-2
            :.flex-3.flex-4 ;defaults to div
            {:class :flex-5.flex-6
            {:class "flex-7 flex-8"}
            {:class  ["flex-9" :flex-10]}
            (dom/div {:class "flex-11 flex-12"})
            (dom/div :.flex-13.flex-14
            {:className :flex-15.flex-16
            {:className "flex-17 flex-18"}
            {:className  ["flex-19" :flex-20]}
            (dom/div {:className "flex-21 flex-22"})
        "#;

        Clojure::test_extract_contains(
            input,
            vec![
                "flex-1", "flex-2", "flex-3", "flex-4", "flex-5", "flex-6", "flex-7", "flex-8",
                "flex-9", "flex-10", "flex-11", "flex-12", "flex-13", "flex-14", "flex-15",
                "flex-16", "flex-17", "flex-18", "flex-19", "flex-20", "flex-21", "flex-22",
            ],
        );
    }

    #[test]
    fn test_special_characters_are_valid_in_strings() {
        // In this case the `:` and `.` should not be replaced by ` ` because they are inside a
        // string.
        let input = r#"
            (dom/div {:class "hover:flex px-1.5"})
        "#;

        Clojure::test_extract_contains(input, vec!["hover:flex", "px-1.5"]);
    }

    #[test]
    fn test_ignore_comments_with_invalid_strings() {
        let input = r#"
            ;; This is an unclosed string: "
            (dom/div {:class "hover:flex px-1.5"})
        "#;

        Clojure::test_extract_contains(input, vec!["hover:flex", "px-1.5"]);
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/17760
    #[test]
    fn test_extraction_of_classes_with_dots() {
        let input = r#"
            ($ :div {:class [:flex :gap-1.5 :p-1]} …)
        "#;

        Clojure::test_extract_contains(input, vec!["flex", "gap-1.5", "p-1"]);
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/18336
    #[test]
    fn test_extraction_of_pseudoclasses_from_keywords() {
        let input = r#"
            ($ :div {:class [:flex :first:lg:pr-6 :first:2xl:pl-6 :group-hover/2:2xs:pt-6]} …)

            :.hover:bg-white

            [:div#hello.bg-white.pr-1.5]
        "#;

        Clojure::test_extract_contains(
            input,
            vec![
                "flex",
                "first:lg:pr-6",
                "first:2xl:pl-6",
                "group-hover/2:2xs:pt-6",
                "hover:bg-white",
                "bg-white",
                "pr-1.5",
            ],
        );
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/18344
    #[test]
    fn test_noninterference_of_parens_on_keywords() {
        let input = r#"
            (get props :y-padding :py-5)
            ($ :div {:class [:flex.pr-1.5 (if condition :bg-white :bg-black)]})
        "#;

        Clojure::test_extract_contains(
            input,
            vec!["py-5", "flex", "pr-1.5", "bg-white", "bg-black"],
        );
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/18882
    #[test]
    fn test_extract_from_symbol_list() {
        let input = r#"
            [:div {:class '[z-1 z-2
                            z-3 z-4]}]
        "#;
        Clojure::test_extract_contains(input, vec!["z-1", "z-2", "z-3", "z-4"]);

        // https://github.com/tailwindlabs/tailwindcss/pull/18345#issuecomment-3253403847
        let input = r#"
            (def hl-class-names '[ring ring-blue-500])

            [:div
             {:class (cond-> '[input w-full]
                       textarea? (conj 'textarea)
                       (seq errors) (concat '[border-red-500 bg-red-100])
                       highlight? (concat hl-class-names))}]
        "#;
        Clojure::test_extract_contains(
            input,
            vec![
                "ring",
                "ring-blue-500",
                "input",
                "w-full",
                "textarea",
                "border-red-500",
                "bg-red-100",
            ],
        );

        let input = r#"
          [:div
            {:class '[h-100 lg:h-200 max-w-32 mx-auto py-60
                      flex flex-col justify-end items-center
                      lg:flex-row lg:justify-between
                      bg-cover bg-center bg-no-repeat rounded-3xl overflow-hidden
                      font-semibold text-gray-900]}]
        "#;
        Clojure::test_extract_contains(
            input,
            vec![
                "h-100",
                "lg:h-200",
                "max-w-32",
                "mx-auto",
                "py-60",
                "flex",
                "flex-col",
                "justify-end",
                "items-center",
                "lg:flex-row",
                "lg:justify-between",
                "bg-cover",
                "bg-center",
                "bg-no-repeat",
                "rounded-3xl",
                "overflow-hidden",
                "font-semibold",
                "text-gray-900",
            ],
        );

        // `/` is invalid and requires explicit quoting
        let input = r#"
            '[p-32 "text-black/50"]
        "#;
        Clojure::test_extract_contains(input, vec!["p-32", "text-black/50"]);

        // `[…]` is invalid and requires explicit quoting
        let input = r#"
            (print '[ring ring-blue-500 "bg-[#0088cc]"])
        "#;
        Clojure::test_extract_contains(input, vec!["ring", "ring-blue-500", "bg-[#0088cc]"]);

        // `'(…)` looks similar to `[…]` but uses parentheses instead of brackets
        let input = r#"
            (print '(ring ring-blue-500 "bg-[#0088cc]"))
        "#;
        Clojure::test_extract_contains(input, vec!["ring", "ring-blue-500", "bg-[#0088cc]"]);
    }
}
