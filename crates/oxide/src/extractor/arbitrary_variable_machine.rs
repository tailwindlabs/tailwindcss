use crate::cursor;
use crate::extractor::css_variable_machine::CssVariableMachine;
use crate::extractor::machine::{Machine, MachineState};

use super::string_machine::StringMachine;

#[derive(Debug, Default)]
pub(crate) struct ArbitraryVariableMachine {
    /// Start position of the arbitrary variable
    start_pos: usize,

    /// Bracket stack to ensure properly balanced brackets
    bracket_stack: Vec<u8>,

    /// Ignore the characters until this specific position
    skip_until_pos: Option<usize>,

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
    /// ```
    /// (--my-opacity)
    ///  ^^^^^^^^^^^^
    /// ```
    Parsing,

    /// Currently parsing the fallback of the arbitrary variable
    ///
    /// ```
    /// (--my-opacity,50%)
    ///              ^^^^
    /// ```
    ParsingFallback,

    /// Currently parsing a string in the fallback of the arbitrary variable. In this case the
    /// brackets don't need to be balanced when inside of a string.
    ParsingString,

    /// Currently parsing the end of the arbitrary variable
    ///
    /// ```
    /// (--my-opacity)
    ///              ^
    /// ```
    ParsingEnd,
}

impl Machine for ArbitraryVariableMachine {
    fn next(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        // Skipping characters until a specific position
        match self.skip_until_pos {
            Some(skip_until) if cursor.pos < skip_until => return MachineState::Parsing,
            Some(_) => self.skip_until_pos = None,
            None => {}
        }

        match self.state {
            State::Idle => match (cursor.curr, cursor.next) {
                // Arbitrary variables start with `(` followed by a CSS variable
                //
                // E.g.: `(--my-variable)`
                //        ^^
                //
                (b'(', b'-') => {
                    self.start_pos = cursor.pos;
                    self.parse()
                }

                // Everything else, is not a valid start of the arbitrary variable. But the next
                // character might be a valid start for a new utility.
                _ => MachineState::Idle,
            },

            State::Parsing => match self.css_variable_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Parsing => MachineState::Parsing,
                MachineState::Done(_) => match cursor.next {
                    // A CSS variable followed by a `,` means that there is a fallback
                    //
                    // E.g.: `(--my-color,red)`
                    //                   ^
                    b',' => self.parse_fallback(),

                    // End of the CSS variable
                    //
                    // E.g.: `(--my-color)`
                    //                  ^
                    _ => self.parse_end(),
                },
            },

            State::ParsingFallback => match cursor.curr {
                // An escaped character, skip ahead to the next character
                b'\\' if !cursor.at_end => {
                    self.skip_until_pos = Some(cursor.pos + 2);
                    MachineState::Parsing
                }

                // An escaped whitespace character is not allowed
                b'\\' if cursor.next.is_ascii_whitespace() => self.restart(),

                b'(' => {
                    self.bracket_stack.push(b')');
                    MachineState::Parsing
                }

                b'[' => {
                    self.bracket_stack.push(b']');
                    MachineState::Parsing
                }

                b'{' => {
                    self.bracket_stack.push(b'}');
                    MachineState::Parsing
                }

                b')' | b']' | b'}' if !self.bracket_stack.is_empty() => {
                    if let Some(&expected) = self.bracket_stack.last() {
                        if cursor.curr == expected {
                            self.bracket_stack.pop();
                        } else {
                            return self.restart();
                        }
                    }

                    MachineState::Parsing
                }

                // End of an arbitrary variable
                b')' => self.done(self.start_pos, cursor),

                // Start of a string
                b'"' | b'\'' | b'`' => self.parse_string(cursor),

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
                b':' if self.bracket_stack.is_empty() => self.restart(),

                // Any kind of whitespace is not allowed
                x if x.is_ascii_whitespace() => self.restart(),

                // Everything else is valid
                _ => MachineState::Parsing,
            },

            State::ParsingString => match self.string_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Parsing => MachineState::Parsing,
                MachineState::Done(_) => self.parse_fallback(),
            },

            State::ParsingEnd => match cursor.curr {
                // End of an arbitrary variable, must be followed by `)`
                b')' => self.done(self.start_pos, cursor),

                // Invalid arbitrary variable, not ending at `)`
                _ => self.restart(),
            },
        }
    }
}

impl ArbitraryVariableMachine {
    #[inline(always)]
    fn parse(&mut self) -> MachineState {
        self.state = State::Parsing;
        MachineState::Parsing
    }

    #[inline(always)]
    fn parse_fallback(&mut self) -> MachineState {
        self.state = State::ParsingFallback;
        MachineState::Parsing
    }

    #[inline(always)]
    fn parse_string(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        self.string_machine.next(cursor);
        self.state = State::ParsingString;
        MachineState::Parsing
    }

    #[inline(always)]
    fn parse_end(&mut self) -> MachineState {
        self.state = State::ParsingEnd;
        MachineState::Parsing
    }
}

#[cfg(test)]
mod tests {
    use super::ArbitraryVariableMachine;
    use crate::cursor::Cursor;
    use crate::extractor::machine::{Machine, MachineState};

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
            (r"(--my#color)", vec![]),
        ] {
            let mut machine = ArbitraryVariableMachine::default();
            let mut cursor = Cursor::new(input.as_bytes());

            let mut actual: Vec<&str> = vec![];

            for i in 0..input.len() {
                cursor.move_to(i);

                if let MachineState::Done(span) = machine.next(&cursor) {
                    actual.push(unsafe { std::str::from_utf8_unchecked(span.slice(cursor.input)) });
                }
            }

            assert_eq!(actual, expected);
        }
    }
}
