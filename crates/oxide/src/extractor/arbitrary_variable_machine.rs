use classification_macros::ClassifyBytes;

use crate::cursor;
use crate::extractor::bracket_stack::BracketStack;
use crate::extractor::css_variable_machine::CssVariableMachine;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::string_machine::StringMachine;

/// Extracts arbitrary variables including the parens.
///
/// E.g.:
///
/// ```text
/// (--my-value)
/// ^^^^^^^^^^^^
///
/// bg-red-500/(--my-opacity)
///            ^^^^^^^^^^^^^^
/// ```
#[derive(Debug, Default)]
pub struct ArbitraryVariableMachine {
    /// Start position of the arbitrary variable
    start_pos: usize,

    /// Track brackets to ensure they are balanced
    bracket_stack: BracketStack,

    /// Current state of the machine
    state: State,

    string_machine: StringMachine,
    css_variable_machine: CssVariableMachine,
}

#[derive(Debug, Default)]
enum State {
    #[default]
    Idle,

    /// Currently parsing the inside of the arbitrary variable
    ///
    /// ```text
    /// (--my-opacity)
    ///  ^^^^^^^^^^^^
    /// ```
    Parsing,

    /// Currently parsing the fallback of the arbitrary variable
    ///
    /// ```text
    /// (--my-opacity,50%)
    ///              ^^^^
    /// ```
    ParsingFallback,
}

impl Machine for ArbitraryVariableMachine {
    #[inline(always)]
    fn reset(&mut self) {
        self.start_pos = 0;
        self.state = State::Idle;
        self.bracket_stack.reset();
    }

    #[inline]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        let class_curr = Class::TABLE[cursor.curr as usize];
        let len = cursor.input.len();

        match self.state {
            State::Idle => match class_curr {
                // Arbitrary variables start with `(` followed by a CSS variable
                //
                // E.g.: `(--my-variable)`
                //        ^^
                //
                Class::OpenParen => match Class::TABLE[cursor.next as usize] {
                    Class::Dash => {
                        self.start_pos = cursor.pos;
                        self.state = State::Parsing;
                        cursor.advance();
                        self.next(cursor)
                    }

                    _ => MachineState::Idle,
                },

                // Everything else, is not a valid start of the arbitrary variable. But the next
                // character might be a valid start for a new utility.
                _ => MachineState::Idle,
            },

            State::Parsing => match self.css_variable_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Done(_) => match Class::TABLE[cursor.next as usize] {
                    // A CSS variable followed by a `,` means that there is a fallback
                    //
                    // E.g.: `(--my-color,red)`
                    //                   ^
                    Class::Comma => {
                        self.state = State::ParsingFallback;
                        cursor.advance_twice(); // Skip the `,`
                        self.next(cursor)
                    }

                    // End of the CSS variable
                    //
                    // E.g.: `(--my-color)`
                    //                  ^
                    _ => {
                        cursor.advance();

                        match Class::TABLE[cursor.curr as usize] {
                            // End of an arbitrary variable, must be followed by `)`
                            Class::CloseParen => self.done(self.start_pos, cursor),

                            // Invalid arbitrary variable, not ending at `)`
                            _ => self.restart(),
                        }
                    }
                },
            },

            State::ParsingFallback => {
                while cursor.pos < len {
                    match Class::TABLE[cursor.curr as usize] {
                        Class::Escape => match Class::TABLE[cursor.next as usize] {
                            // An escaped whitespace character is not allowed
                            //
                            // E.g.: `(--my-\ color)`
                            //              ^^
                            Class::Whitespace => return self.restart(),

                            // An escaped character, skip the next character, resume after
                            //
                            // E.g.: `(--my-\#color)`
                            //              ^^
                            _ => cursor.advance_twice(),
                        },

                        Class::OpenParen | Class::OpenBracket | Class::OpenCurly => {
                            if !self.bracket_stack.push(cursor.curr) {
                                return self.restart();
                            }
                            cursor.advance();
                        }

                        Class::CloseParen | Class::CloseBracket | Class::CloseCurly
                            if !self.bracket_stack.is_empty() =>
                        {
                            if !self.bracket_stack.pop(cursor.curr) {
                                return self.restart();
                            }
                            cursor.advance();
                        }

                        // End of an arbitrary variable
                        Class::CloseParen => return self.done(self.start_pos, cursor),

                        // Start of a string
                        Class::Quote => match self.string_machine.next(cursor) {
                            MachineState::Idle => return self.restart(),
                            MachineState::Done(_) => {
                                self.state = State::ParsingFallback;
                                cursor.advance();
                                return self.next(cursor);
                            }
                        },

                        // A `:` inside of a fallback value is only valid inside of brackets or inside of a
                        // string. Everywhere else, it's invalid.
                        //
                        // E.g.: `(--foo,bar:baz)`
                        //                  ^ Not valid
                        //
                        // E.g.: `(--url,url(https://example.com))`
                        //                        ^ Valid
                        //
                        // E.g.: `(--my-content:'a:b:c:')`
                        //                        ^ ^ ^ Valid
                        Class::Colon if self.bracket_stack.is_empty() => return self.restart(),

                        // Any kind of whitespace is not allowed
                        Class::Whitespace => return self.restart(),

                        // Everything else is valid
                        _ => cursor.advance(),
                    };
                }

                self.restart()
            }
        }
    }
}

#[derive(Clone, Copy, PartialEq, ClassifyBytes)]
enum Class {
    #[bytes_range(b'a'..=b'z')]
    AlphaLower,

    #[bytes_range(b'A'..=b'Z')]
    AlphaUpper,

    #[bytes(b'@')]
    At,

    #[bytes(b':')]
    Colon,

    #[bytes(b',')]
    Comma,

    #[bytes(b'-')]
    Dash,

    #[bytes(b'.')]
    Dot,

    #[bytes(b'\\')]
    Escape,

    #[bytes(b'\0')]
    End,

    #[bytes_range(b'0'..=b'9')]
    Number,

    #[bytes(b'[')]
    OpenBracket,

    #[bytes(b']')]
    CloseBracket,

    #[bytes(b'(')]
    OpenParen,

    #[bytes(b')')]
    CloseParen,

    #[bytes(b'{')]
    OpenCurly,

    #[bytes(b'}')]
    CloseCurly,

    #[bytes(b'"', b'\'', b'`')]
    Quote,

    #[bytes(b'_')]
    Underscore,

    #[bytes(b' ', b'\t', b'\n', b'\r', b'\x0C')]
    Whitespace,

    #[fallback]
    Other,
}

#[cfg(test)]
mod tests {
    use super::ArbitraryVariableMachine;
    use crate::extractor::machine::Machine;

    #[test]
    #[ignore]
    fn test_arbitrary_variable_machine_performance() {
        let input = r#"<div class="(--foo) (--my-color,red,blue) (--my-img,url('https://example.com?q=(][)'))"></div>"#.repeat(100);

        ArbitraryVariableMachine::test_throughput(100_000, &input);
        ArbitraryVariableMachine::test_duration_once(&input);

        todo!()
    }

    #[test]
    fn test_arbitrary_variable_extraction() {
        for (input, expected) in [
            // Simple utility
            ("(--foo)", vec!["(--foo)"]),
            // With dashes
            ("(--my-color)", vec!["(--my-color)"]),
            // With a fallback
            ("(--my-color,red,blue)", vec!["(--my-color,red,blue)"]),
            // With a fallback containing a string with unbalanced brackets
            (
                "(--my-img,url('https://example.com?q=(][)'))",
                vec!["(--my-img,url('https://example.com?q=(][)'))"],
            ),
            // --------------------------------------------------------

            // Exceptions:
            // Arbitrary variable must start with a CSS variable
            (r"(bar)", vec![]),
            // Arbitrary variables must be valid CSS variables
            (r"(--my-\ color)", vec![]),
            (r"(--my#color)", vec![]),
            // Fallbacks cannot have spaces
            (r"(--my-color, red)", vec![]),
            // Fallbacks cannot have escaped spaces
            (r"(--my-color,\ red)", vec![]),
            // Variables must have at least one character after the `--`
            (r"(--)", vec![]),
            (r"(--,red)", vec![]),
            (r"(-)", vec![]),
            (r"(-my-color)", vec![]),
        ] {
            assert_eq!(ArbitraryVariableMachine::test_extract_all(input), expected);
        }
    }
}
