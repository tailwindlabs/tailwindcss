use crate::cursor;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::string_machine::StringMachine;
use crate::extractor::CssVariableMachine;

#[derive(Debug, Default)]
pub(crate) struct ArbitraryPropertyMachine {
    /// Start position of the arbitrary value
    start_pos: usize,

    /// Bracket stack to ensure properly balanced brackets
    bracket_stack: Vec<u8>,

    /// Ignore the characters until this specific position
    skip_until_pos: Option<usize>,

    /// Current state of the machine
    state: State,

    css_variable_machine: CssVariableMachine,
    string_machine: StringMachine,
}

#[derive(Debug, Default)]
enum State {
    #[default]
    Idle,

    /// Parsing the property, e.g.:
    ///
    /// ```
    /// [color:red]
    ///  ^^^^^
    /// ```
    ParsingProperty,

    /// Parsing the property (which is a CSS variable), e.g.:
    ///
    /// ```
    /// [--my-color:red]
    ///  ^^^^^^^^^^
    /// ```
    ParsingPropertyVariable,

    /// Parsing the value, e.g.:
    ///
    /// ```
    /// [color:red]
    ///        ^^^
    /// ```
    ParsingValue,

    /// Parsing a string, in this case the brackets don't need to be balanced when inside of a
    /// string.
    ParsingString,
}

impl Machine for ArbitraryPropertyMachine {
    fn next(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        // Skipping characters until a specific position
        match self.skip_until_pos {
            Some(skip_until) if cursor.pos < skip_until => return MachineState::Parsing,
            Some(_) => self.skip_until_pos = None,
            None => {}
        }

        match self.state {
            State::Idle => match cursor.curr {
                // Start of an arbitrary property
                b'[' => {
                    self.start_pos = cursor.pos;
                    self.parse_property()
                }

                // Anything else is not a valid start of an arbitrary value
                _ => MachineState::Idle,
            },

            State::ParsingProperty => match (cursor.curr, cursor.next) {
                // Start of a CSS variable
                (b'-', b'-') => self.parse_property_variable(cursor),

                // Only alphanumeric characters and dashes are allowed
                (b'a'..=b'z' | b'A'..=b'Z' | b'-', _) => MachineState::Parsing,

                // End of the property name, but there must be at least a single character
                (b':', _) if cursor.pos > self.start_pos + 1 => self.parse_value(),

                // Anything else is not a valid property character
                _ => self.restart(),
            },

            State::ParsingPropertyVariable => match self.css_variable_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Parsing => MachineState::Parsing,
                MachineState::Done(_) => match cursor.next {
                    // End of the CSS variable, must be followed by a `:`
                    //
                    // E.g.: `[--my-color:red]`
                    //                   ^
                    b':' => {
                        self.skip_until_pos = Some(cursor.pos + 2);
                        self.parse_value()
                    }

                    // Invalid arbitrary property
                    _ => self.restart(),
                },
            },

            State::ParsingValue => match cursor.curr {
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

                // End of an arbitrary value
                // 1. All brackets must be balanced
                // 2. There must be at least a single character inside the brackets
                b']' if self.bracket_stack.is_empty() && self.start_pos + 1 != cursor.pos => {
                    self.done(self.start_pos, cursor)
                }

                // Start of a string
                b'"' | b'\'' | b'`' => self.parse_string(cursor),

                // Another `:` inside of an arbitrary property is only valid inside of a string or
                // inside of brackets. Everywhere else, it's invalid.
                //
                // E.g.: `[color:red:blue]`
                //                  ^ Not valid
                // E.g.: `[background:url(https://example.com)]`
                //                             ^ Valid
                // E.g.: `[content:'a:b:c:']`
                //                   ^ ^ ^ Valid
                b':' if self.bracket_stack.is_empty() => self.restart(),

                // Any kind of whitespace is not allowed
                x if x.is_ascii_whitespace() => self.restart(),

                // Everything else is valid
                _ => MachineState::Parsing,
            },

            State::ParsingString => match self.string_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Parsing => MachineState::Parsing,
                MachineState::Done(_) => self.parse_value(),
            },
        }
    }
}

impl ArbitraryPropertyMachine {
    #[inline(always)]
    fn parse_string(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        self.string_machine.next(cursor);
        self.state = State::ParsingString;
        MachineState::Parsing
    }

    #[inline(always)]
    fn parse_property(&mut self) -> MachineState {
        self.state = State::ParsingProperty;
        MachineState::Parsing
    }

    #[inline(always)]
    fn parse_property_variable(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        self.css_variable_machine.next(cursor);
        self.state = State::ParsingPropertyVariable;
        MachineState::Parsing
    }

    #[inline(always)]
    fn parse_value(&mut self) -> MachineState {
        self.state = State::ParsingValue;
        MachineState::Parsing
    }
}

#[cfg(test)]
mod tests {
    use super::ArbitraryPropertyMachine;
    use crate::cursor::Cursor;
    use crate::extractor::machine::{Machine, MachineState};

    #[test]
    fn test_arbitrary_property_extraction() {
        for (input, expected) in [
            // Simple arbitrary property
            ("[color:red]", vec!["[color:red]"]),
            // Name with dashes
            ("[background-color:red]", vec!["[background-color:red]"]),
            // Name with leading `-` is valid
            ("[-webkit-value:red]", vec!["[-webkit-value:red]"]),
            // Setting a CSS Variable
            ("[--my-color:red]", vec!["[--my-color:red]"]),
            // Value with nested brackets
            (
                "[background:url(https://example.com)]",
                vec!["[background:url(https://example.com)]"],
            ),
            // Value containing strings
            (
                "[background:url('https://example.com')]",
                vec!["[background:url('https://example.com')]"],
            ),
            // --------------------------------------------------------

            // Invalid CSS Variable
            ("[--my#color:red]", vec![]),
            // Spaces are not allowed
            ("[color: red]", vec![]),
            // Multiple colons are not allowed
            ("[color:red:blue]", vec![]),
            // Only alphanumeric characters are allowed in the property name
            ("[background_color:red]", vec![]),
            // A color is required
            ("[red]", vec![]),
            // The property cannot be empty
            ("[:red]", vec![]),
            // Empty brackets are not allowed
            ("[]", vec![]),
            // Missing colon in more complex example
            (r#"[CssClass("gap-y-4")]"#, vec![]),
            // Brackets must be balanced
            ("[background:url(https://example.com]", vec![]),
        ] {
            let mut machine = ArbitraryPropertyMachine::default();
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
