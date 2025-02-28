use crate::cursor;
use crate::extractor::bracket_stack::BracketStack;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::string_machine::StringMachine;
use crate::extractor::CssVariableMachine;
use classification_macros::ClassifyBytes;

/// Extracts arbitrary properties from the input, including the brackets.
///
/// E.g.:
///
/// ```text
/// [color:red]
/// ^^^^^^^^^^^
///
/// [--my-color:red]
/// ^^^^^^^^^^^^^^^^
/// ```
#[derive(Debug, Default)]
pub struct ArbitraryPropertyMachine {
    /// Start position of the arbitrary value
    start_pos: usize,

    /// Track brackets to ensure they are balanced
    bracket_stack: BracketStack,

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
    /// ```text
    /// [color:red]
    ///  ^^^^^
    ///
    /// [--my-color:red]
    ///  ^^^^^^^^^^
    /// ```
    ParsingProperty,

    /// Parsing the value, e.g.:
    ///
    /// ```text
    /// [color:red]
    ///        ^^^
    /// ```
    ParsingValue,
}

impl Machine for ArbitraryPropertyMachine {
    #[inline(always)]
    fn reset(&mut self) {
        self.start_pos = 0;
        self.state = State::Idle;
        self.bracket_stack.reset();
    }

    #[inline]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        let len = cursor.input.len();

        match self.state {
            State::Idle => match cursor.curr.classify() {
                // Start of an arbitrary property
                Class::OpenBracket => {
                    self.start_pos = cursor.pos;
                    self.state = State::ParsingProperty;
                    cursor.advance();
                    self.next(cursor)
                }

                // Anything else is not a valid start of an arbitrary value
                _ => MachineState::Idle,
            },

            State::ParsingProperty => {
                while cursor.pos < len {
                    match cursor.curr.classify() {
                        Class::Dash => match cursor.next.classify() {
                            // Start of a CSS variable
                            //
                            // E.g.: `[--my-color:red]`
                            //         ^^
                            Class::Dash => return self.parse_property_variable(cursor),

                            // Dashes are allowed in the property name
                            //
                            // E.g.: `[background-color:red]`
                            //                   ^
                            _ => cursor.advance(),
                        },

                        // Alpha characters are allowed in the property name
                        //
                        // E.g.: `[color:red]`
                        //         ^^^^^
                        Class::Alpha => cursor.advance(),

                        // End of the property name, but there must be at least a single character
                        Class::Colon if cursor.pos > self.start_pos + 1 => {
                            self.state = State::ParsingValue;
                            cursor.advance();
                            return self.next(cursor);
                        }

                        // Anything else is not a valid property character
                        _ => return self.restart(),
                    }
                }

                self.restart()
            }

            State::ParsingValue => {
                while cursor.pos < len {
                    match cursor.curr.classify() {
                        Class::Escape => match cursor.next.classify() {
                            // An escaped whitespace character is not allowed
                            //
                            // E.g.: `[color:var(--my-\ color)]`
                            //                         ^
                            Class::Whitespace => return self.restart(),

                            // An escaped character, skip the next character, resume after
                            //
                            // E.g.: `[color:var(--my-\#color)]`
                            //                        ^
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

                        // End of an arbitrary value
                        //
                        // 1. All brackets must be balanced
                        // 2. There must be at least a single character inside the brackets
                        Class::CloseBracket
                            if self.start_pos + 1 != cursor.pos
                                && self.bracket_stack.is_empty() =>
                        {
                            return self.done(self.start_pos, cursor)
                        }

                        // Start of a string
                        Class::Quote => return self.parse_string(cursor),

                        // Another `:` inside of an arbitrary property is only valid inside of a string or
                        // inside of brackets. Everywhere else, it's invalid.
                        //
                        // E.g.: `[color:red:blue]`
                        //                  ^ Not valid
                        // E.g.: `[background:url(https://example.com)]`
                        //                             ^ Valid
                        // E.g.: `[content:'a:b:c:']`
                        //                   ^ ^ ^ Valid
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

impl ArbitraryPropertyMachine {
    fn parse_property_variable(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match self.css_variable_machine.next(cursor) {
            MachineState::Idle => self.restart(),
            MachineState::Done(_) => match cursor.next.classify() {
                // End of the CSS variable, must be followed by a `:`
                //
                // E.g.: `[--my-color:red]`
                //                   ^
                Class::Colon => {
                    self.state = State::ParsingValue;
                    cursor.advance_twice();
                    self.next(cursor)
                }

                // Invalid arbitrary property
                _ => self.restart(),
            },
        }
    }

    fn parse_string(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match self.string_machine.next(cursor) {
            MachineState::Idle => self.restart(),
            MachineState::Done(_) => {
                cursor.advance();
                self.next(cursor)
            }
        }
    }
}

#[derive(Clone, Copy, ClassifyBytes)]
enum Class {
    #[bytes(b'(')]
    OpenParen,

    #[bytes(b'[')]
    OpenBracket,

    #[bytes(b'{')]
    OpenCurly,

    #[bytes(b')')]
    CloseParen,

    #[bytes(b']')]
    CloseBracket,

    #[bytes(b'}')]
    CloseCurly,

    #[bytes(b'\\')]
    Escape,

    #[bytes(b'"', b'\'', b'`')]
    Quote,

    #[bytes(b'-')]
    Dash,

    #[bytes_range(b'a'..=b'z', b'A'..=b'Z')]
    Alpha,

    #[bytes(b':')]
    Colon,

    #[bytes(b' ', b'\t', b'\n', b'\r', b'\x0C')]
    Whitespace,

    #[bytes(b'\0')]
    End,

    #[fallback]
    Other,
}

#[cfg(test)]
mod tests {
    use super::ArbitraryPropertyMachine;
    use crate::extractor::machine::Machine;

    #[test]
    #[ignore]
    fn test_arbitrary_property_machine_performance() {
        let input = r#"<button class="[color:red] [background-color:red] [--my-color:red] [background:url('https://example.com')]">"#.repeat(10);

        ArbitraryPropertyMachine::test_throughput(1_000_000, &input);
        ArbitraryPropertyMachine::test_duration_once(&input);

        todo!()
    }

    #[test]
    fn test_arbitrary_property_machine_extraction() {
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
            // Many brackets (>= 8) must be balanced
            (
                "[background:url(https://example.com?q={[{[([{[[2]]}])]}]})]",
                vec!["[background:url(https://example.com?q={[{[([{[[2]]}])]}]})]"],
            ),
        ] {
            for wrapper in [
                // No wrapper
                "{}",
                // With leading spaces
                " {}",
                // With trailing spaces
                "{} ",
                // Surrounded by spaces
                " {} ",
                // Inside a string
                "'{}'",
                // Inside a function call
                "fn({})",
                // Inside nested function calls
                "fn1(fn2({}))",
                // --------------------------
                //
                // HTML
                // Inside a class (on its own)
                r#"<div class="{}"></div>"#,
                // Inside a class (first)
                r#"<div class="{} foo"></div>"#,
                // Inside a class (second)
                r#"<div class="foo {}"></div>"#,
                // Inside a class (surrounded)
                r#"<div class="foo {} bar"></div>"#,
                // --------------------------
                //
                // JavaScript
                // Inside a variable
                r#"let classes = '{}';"#,
                // Inside an object (key)
                r#"let classes = { '{}': true };"#,
                // Inside an object (no spaces, key)
                r#"let classes = {'{}':true};"#,
                // Inside an object (value)
                r#"let classes = { primary: '{}' };"#,
                // Inside an object (no spaces, value)
                r#"let classes = {primary:'{}'};"#,
            ] {
                let input = wrapper.replace("{}", input);
                let actual = ArbitraryPropertyMachine::test_extract_all(&input);

                if actual != expected {
                    dbg!(&input, &actual, &expected);
                }
                assert_eq!(actual, expected);
            }
        }
    }
}
