use crate::cursor;
use crate::extractor::arbitrary_value_machine::ArbitraryValueMachine;
use crate::extractor::arbitrary_variable_machine::ArbitraryVariableMachine;
use crate::extractor::machine::{Machine, MachineState};

/// Extracts named utilities from an input.
///
/// E.g.:
///
/// ```text
/// flex
/// ^^^^
///
/// bg-red-500
/// ^^^^^^^^^^
/// ```
#[derive(Debug, Default)]
pub struct NamedUtilityMachine {
    /// Start position of the utility
    start_pos: usize,

    /// Current state of the machine
    state: State,

    arbitrary_variable_machine: ArbitraryVariableMachine,
    arbitrary_value_machine: ArbitraryValueMachine,
}

#[derive(Debug, Default)]
enum State {
    #[default]
    Idle,

    /// Parsing a utility
    Parsing,
}

impl Machine for NamedUtilityMachine {
    #[inline(always)]
    fn reset(&mut self) {
        self.start_pos = 0;
        self.state = State::Idle;
    }

    #[inline]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        let len = cursor.input.len();

        match self.state {
            State::Idle => match CLASS_TABLE[cursor.curr as usize] {
                Class::AlphaLower => match CLASS_TABLE[cursor.next as usize] {
                    // Valid single character utility in between quotes
                    //
                    // E.g.: `<div class="a"></div>`
                    //                    ^
                    // E.g.: `<div class="a "></div>`
                    //                    ^
                    // E.g.: `<div class=" a"></div>`
                    //                     ^
                    Class::Whitespace | Class::Quote | Class::End => self.done(cursor.pos, cursor),

                    // Valid start characters
                    //
                    // E.g.: `flex`
                    //        ^
                    _ => {
                        self.start_pos = cursor.pos;
                        self.state = State::Parsing;
                        cursor.advance();
                        self.next(cursor)
                    }
                },

                // Valid start characters
                //
                // E.g.: `@container`
                //        ^
                Class::At => {
                    self.start_pos = cursor.pos;
                    self.state = State::Parsing;
                    cursor.advance();
                    self.next(cursor)
                }

                // Valid start of a negative utility, if followed by another set of valid
                // characters. `@` as a second character is invalid.
                //
                // E.g.: `-mx-2.5`
                //        ^^
                Class::Dash => match CLASS_TABLE[cursor.next as usize] {
                    Class::AlphaLower => {
                        self.start_pos = cursor.pos;
                        self.state = State::Parsing;
                        cursor.advance();
                        self.next(cursor)
                    }

                    // A dash should not be followed by anything else
                    _ => MachineState::Idle,
                },

                // Everything else, is not a valid start of the utility.
                _ => MachineState::Idle,
            },

            State::Parsing => {
                while cursor.pos < len {
                    match CLASS_TABLE[cursor.curr as usize] {
                        // Followed by a boundary character, we are at the end of the utility.
                        //
                        // E.g.: `'flex'`
                        //             ^
                        // E.g.: `<div class="flex items-center">`
                        //                        ^
                        // E.g.: `[flex]` (Angular syntax)
                        //             ^
                        // E.g.: `[class.flex.items-center]` (Angular syntax)
                        //                   ^
                        // E.g.: `:div="{ flex: true }"` (JavaScript object syntax)
                        //                    ^
                        Class::AlphaLower | Class::AlphaUpper => {
                            match CLASS_TABLE[cursor.next as usize] {
                                Class::Quote
                                | Class::Whitespace
                                | Class::CloseBracket
                                | Class::Dot
                                | Class::Colon
                                | Class::End
                                | Class::Slash
                                | Class::Exclamation => return self.done(self.start_pos, cursor),

                                // Still valid characters
                                _ => cursor.advance(),
                            }
                        }

                        Class::Dash => match CLASS_TABLE[cursor.next as usize] {
                            // Start of an arbitrary value
                            //
                            // E.g.: `bg-[#0088cc]`
                            //          ^^
                            Class::OpenBracket => {
                                cursor.advance();
                                return match self.arbitrary_value_machine.next(cursor) {
                                    MachineState::Idle => self.restart(),
                                    MachineState::Done(_) => self.done(self.start_pos, cursor),
                                };
                            }

                            // Start of an arbitrary variable
                            //
                            // E.g.: `bg-(--my-color)`
                            //          ^^
                            Class::OpenParen => {
                                cursor.advance();
                                return match self.arbitrary_variable_machine.next(cursor) {
                                    MachineState::Idle => self.restart(),
                                    MachineState::Done(_) => self.done(self.start_pos, cursor),
                                };
                            }

                            // A dash is a valid character if it is followed by another valid
                            // character.
                            //
                            // E.g.: `flex-`
                            //            ^    Invalid
                            // E.g.: `flex-!`
                            //            ^    Invalid
                            // E.g.: `flex-/`
                            //            ^    Invalid
                            // E.g.: `flex-2`
                            //            ^    Valid
                            Class::AlphaLower | Class::AlphaUpper | Class::Number => {
                                cursor.advance();
                            }

                            // Everything else is invalid
                            _ => return self.restart(),
                        },

                        Class::Underscore => match CLASS_TABLE[cursor.next as usize] {
                            // Valid characters _if_ followed by another valid character. These characters are
                            // only valid inside of the utility but not at the end of the utility.
                            //
                            // E.g.: `custom_`
                            //              ^    Invalid
                            // E.g.: `custom_!`
                            //              ^    Invalid
                            // E.g.: `custom_/`
                            //              ^    Invalid
                            // E.g.: `custom_2`
                            //              ^    Valid
                            //
                            Class::AlphaLower
                            | Class::AlphaUpper
                            | Class::Number
                            | Class::Underscore => {
                                cursor.advance();
                            }

                            // Followed by a boundary character, we are at the end of the utility.
                            //
                            // E.g.: `'flex'`
                            //             ^
                            // E.g.: `<div class="flex items-center">`
                            //                        ^
                            // E.g.: `[flex]` (Angular syntax)
                            //             ^
                            // E.g.: `[class.flex.items-center]` (Angular syntax)
                            //                   ^
                            // E.g.: `:div="{ flex: true }"` (JavaScript object syntax)
                            //                    ^
                            Class::Quote
                            | Class::Whitespace
                            | Class::CloseBracket
                            | Class::Dot
                            | Class::Colon
                            | Class::End
                            | Class::Slash
                            | Class::Exclamation => return self.done(self.start_pos, cursor),

                            // Everything else is invalid
                            _ => return self.restart(),
                        },

                        // A dot must be surrounded by numbers
                        //
                        // E.g.: `px-2.5`
                        //           ^^^
                        Class::Dot => {
                            if !matches!(CLASS_TABLE[cursor.prev as usize], Class::Number) {
                                return self.restart();
                            }

                            if !matches!(CLASS_TABLE[cursor.next as usize], Class::Number) {
                                return self.restart();
                            }

                            cursor.advance();
                        }

                        // A number must be preceded by a `-`, `.` or another alphanumeric
                        // character, and can be followed by a `.` or an alphanumeric character.
                        //
                        // E.g.: `text-2xs`
                        //            ^^
                        //       `p-2.5`
                        //           ^^
                        //       `bg-red-500`
                        //                ^^
                        // It can also be followed by a %, but that will be considered the end of
                        // the candidate.
                        //
                        // E.g.: `from-15%`
                        //               ^
                        //
                        Class::Number => {
                            if !matches!(
                                CLASS_TABLE[cursor.prev as usize],
                                Class::Dash | Class::Dot | Class::Number | Class::AlphaLower
                            ) {
                                return self.restart();
                            }

                            if !matches!(
                                CLASS_TABLE[cursor.next as usize],
                                Class::Dot
                                    | Class::Number
                                    | Class::AlphaLower
                                    | Class::AlphaUpper
                                    | Class::Percent
                            ) {
                                return self.done(self.start_pos, cursor);
                            }

                            cursor.advance();
                        }

                        // A percent sign must be preceded by a number.
                        //
                        // E.g.:
                        //
                        // ```
                        // from-15%
                        //       ^^
                        // ```
                        Class::Percent => {
                            if !matches!(CLASS_TABLE[cursor.prev as usize], Class::Number) {
                                return self.restart();
                            }

                            return self.done(self.start_pos, cursor);
                        }

                        // Everything else is invalid
                        _ => return self.restart(),
                    };
                }

                self.restart()
            }
        }
    }
}

#[derive(Clone, Copy)]
enum Class {
    /// `'a'..='z'`
    AlphaLower,

    /// `'A'..='Z'`
    AlphaUpper,

    /// `@`
    At,

    // `:`
    Colon,

    /// `-`
    Dash,

    /// `:`
    Dot,

    /// `0x00`
    End,

    /// `!`
    Exclamation,

    /// `'0'..='9'`
    Number,

    /// `[`
    OpenBracket,

    /// `]`
    CloseBracket,

    /// `(`
    OpenParen,

    /// `%`
    Percent,

    /// ', ", or `
    Quote,

    /// `/`
    Slash,

    /// _
    Underscore,

    /// Whitespace characters: ' ', '\t', '\n', '\r', '\x0C'
    Whitespace,

    /// Anything else
    Other,
}

const CLASS_TABLE: [Class; 256] = {
    let mut table = [Class::Other; 256];

    macro_rules! set {
        ($class:expr, $($byte:expr),+ $(,)?) => {
            $(table[$byte as usize] = $class;)+
        };
    }

    macro_rules! set_range {
        ($class:expr, $start:literal ..= $end:literal) => {
            let mut i = $start;
            while i <= $end {
                table[i as usize] = $class;
                i += 1;
            }
        };
    }

    set!(Class::At, b'@');
    set!(Class::Underscore, b'_');
    set!(Class::Dash, b'-');
    set!(Class::Whitespace, b' ', b'\t', b'\n', b'\r', b'\x0C');

    set!(Class::OpenBracket, b'[');
    set!(Class::CloseBracket, b']');

    set!(Class::OpenParen, b'(');

    set!(Class::Dot, b'.');
    set!(Class::Colon, b':');

    set!(Class::Percent, b'%');

    set!(Class::Quote, b'"', b'\'', b'`');

    set!(Class::Exclamation, b'!');
    set!(Class::Slash, b'/');

    set_range!(Class::AlphaLower, b'a'..=b'z');
    set_range!(Class::AlphaUpper, b'A'..=b'Z');
    set_range!(Class::Number, b'0'..=b'9');

    set!(Class::End, 0x00);

    table
};

#[cfg(test)]
mod tests {
    use super::NamedUtilityMachine;
    use crate::extractor::machine::Machine;

    #[test]
    #[ignore]
    fn test_named_utility_machine_performance() {
        let input = r#"<button class="flex items-center px-2.5 -inset-x-2 bg-[#0088cc] text-(--my-color)">"#;

        NamedUtilityMachine::test_throughput(1_000_000, input);
        NamedUtilityMachine::test_duration_once(input);

        todo!()
    }

    #[test]
    fn test_named_utility_extraction() {
        for (input, expected) in [
            // Simple utility
            ("flex", vec!["flex"]),
            // Simple utility with special character(s)
            ("@container", vec!["@container"]),
            // Simple single-character utility
            ("a", vec!["a"]),
            // With dashes
            ("items-center", vec!["items-center"]),
            // With numbers
            ("px-5", vec!["px-5"]),
            ("px-2.5", vec!["px-2.5"]),
            // With trailing % sign
            ("from-15%", vec!["from-15%"]),
            // Arbitrary value with bracket notation
            ("bg-[#0088cc]", vec!["bg-[#0088cc]"]),
            // Arbitrary variable
            ("bg-(--my-color)", vec!["bg-(--my-color)"]),
            // Arbitrary variable with fallback
            ("bg-(--my-color,red,blue)", vec!["bg-(--my-color,red,blue)"]),
            // --------------------------------------------------------

            // Exceptions:
            // Arbitrary variable must be valid
            (r"bg-(--my-color\)", vec![]),
            (r"bg-(--my#color)", vec![]),
            // Single letter utility with uppercase letter is invalid
            ("A", vec![]),
            // A dot must be in-between numbers
            ("opacity-0.5", vec!["opacity-0.5"]),
            ("opacity-.5", vec![]),
            ("opacity-5.", vec![]),
            // A number must be preceded by a `-`, `.` or another number
            ("text-2xs", vec!["text-2xs"]),
            // Random invalid utilities
            ("-$", vec![]),
            ("-_", vec![]),
            ("-foo-", vec![]),
            ("foo-=", vec![]),
            ("foo-#", vec![]),
            ("foo-!", vec![]),
            ("foo-/20", vec![]),
            ("-", vec![]),
            ("--", vec![]),
            ("---", vec![]),
        ] {
            for (wrapper, additional) in [
                // No wrapper
                ("{}", vec![]),
                // With leading spaces
                (" {}", vec![]),
                // With trailing spaces
                ("{} ", vec![]),
                // Surrounded by spaces
                (" {} ", vec![]),
                // Inside a string
                ("'{}'", vec![]),
                // Inside a function call
                ("fn('{}')", vec![]),
                // Inside nested function calls
                ("fn1(fn2('{}'))", vec!["fn1", "fn2"]),
                // --------------------------
                //
                // HTML
                // Inside a class (on its own)
                (r#"<div class="{}"></div>"#, vec!["div"]),
                // Inside a class (first)
                (r#"<div class="{} foo"></div>"#, vec!["div", "foo"]),
                // Inside a class (second)
                (r#"<div class="foo {}"></div>"#, vec!["div", "foo"]),
                // Inside a class (surrounded)
                (
                    r#"<div class="foo {} bar"></div>"#,
                    vec!["div", "foo", "bar"],
                ),
                // --------------------------
                //
                // JavaScript
                // Inside a variable
                (r#"let classes = '{}';"#, vec!["let", "classes"]),
                // Inside an object (key)
                (
                    r#"let classes = { '{}': true };"#,
                    vec!["let", "classes", "true"],
                ),
                // Inside an object (no spaces, key)
                (r#"let classes = {'{}':true};"#, vec!["let", "classes"]),
                // Inside an object (value)
                (
                    r#"let classes = { primary: '{}' };"#,
                    vec!["let", "classes", "primary"],
                ),
                // Inside an object (no spaces, value)
                (
                    r#"let classes = {primary:'{}'};"#,
                    vec!["let", "classes", "primary"],
                ),
                // Inside an array
                (r#"let classes = ['{}'];"#, vec!["let", "classes"]),
            ] {
                let input = wrapper.replace("{}", input);

                let mut expected = expected.clone();
                expected.extend(additional);
                expected.sort();

                let mut actual = NamedUtilityMachine::test_extract_all(&input);
                actual.sort();

                if actual != expected {
                    dbg!(&input, &expected, &actual);
                }
                assert_eq!(actual, expected);
            }
        }
    }
}
