use crate::cursor;
use crate::extractor::arbitrary_value_machine::ArbitraryValueMachine;
use crate::extractor::arbitrary_variable_machine::ArbitraryVariableMachine;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::modifier_machine::ModifierMachine;

/// Extract named variants from an input including the `:`.
///
/// E.g.:
///
/// ```text
/// hover:flex
/// ^^^^^^
///
/// data-[state=pending]:flex
/// ^^^^^^^^^^^^^^^^^^^^^
///
/// supports-(--my-variable):flex
/// ^^^^^^^^^^^^^^^^^^^^^^^^^
/// ```
#[derive(Debug, Default)]
pub struct NamedVariantMachine {
    /// Start position of the variant
    start_pos: usize,

    /// Current state of the machine
    state: State,

    arbitrary_variable_machine: ArbitraryVariableMachine,
    arbitrary_value_machine: ArbitraryValueMachine,
    modifier_machine: ModifierMachine,
}

#[derive(Debug, Default)]
enum State {
    #[default]
    Idle,

    /// Parsing a variant
    Parsing,

    /// Parsing a modifier
    ///
    /// E.g.:
    ///
    /// ```text
    /// group-hover/name:
    ///            ^^^^^
    /// ```
    ///
    ParsingModifier,

    /// Parsing the end of a variant
    ///
    /// E.g.:
    ///
    /// ```text
    /// hover:
    ///      ^
    /// ```
    ParseEnd,
}

impl Machine for NamedVariantMachine {
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
                Class::AlphaLower | Class::Star => match CLASS_TABLE[cursor.next as usize] {
                    // Valid single character variant, must be followed by a `:`
                    //
                    // E.g.: `<div class="x:flex"></div>`
                    //                    ^^
                    // E.g.: `*:`
                    //        ^^
                    Class::Colon => {
                        self.state = State::ParseEnd;
                        cursor.advance();
                        self.next(cursor)
                    }

                    // Valid start characters
                    //
                    // E.g.: `hover:`
                    //        ^
                    // E.g.: `*:`
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
                // E.g.: `2xl:`
                //        ^
                // E.g.: `@md:`
                //        ^
                Class::Number | Class::At => {
                    self.start_pos = cursor.pos;
                    self.state = State::Parsing;
                    cursor.advance();
                    self.next(cursor)
                }

                // Everything else, is not a valid start of the variant.
                _ => MachineState::Idle,
            },

            State::Parsing => {
                while cursor.pos < len {
                    match CLASS_TABLE[cursor.curr as usize] {
                        Class::Dash => match CLASS_TABLE[cursor.next as usize] {
                            // Start of an arbitrary value
                            //
                            // E.g.: `data-[state=pending]:`.
                            //            ^^
                            Class::OpenBracket => {
                                cursor.advance();

                                return match self.arbitrary_value_machine.next(cursor) {
                                    MachineState::Idle => self.restart(),
                                    MachineState::Done(_) => self.parse_arbitrary_end(cursor),
                                };
                            }

                            // Start of an arbitrary variable
                            //
                            // E.g.: `supports-(--my-color):`.
                            //                ^^
                            Class::OpenParen => {
                                cursor.advance();
                                return match self.arbitrary_variable_machine.next(cursor) {
                                    MachineState::Idle => self.restart(),
                                    MachineState::Done(_) => self.parse_arbitrary_end(cursor),
                                };
                            }

                            // Valid characters _if_ followed by another valid character. These characters are
                            // only valid inside of the variant but not at the end of the variant.
                            //
                            // E.g.: `hover-`
                            //            ^
                            // E.g.: `hover-!`
                            //            ^
                            // E.g.: `hover-/`
                            //            ^
                            Class::Dash
                            | Class::Underscore
                            | Class::AlphaLower
                            | Class::AlphaUpper
                            | Class::Number => cursor.advance(),

                            // Everything else is invalid
                            _ => return self.restart(),
                        },

                        Class::Underscore => match CLASS_TABLE[cursor.next as usize] {
                            // Valid characters _if_ followed by another valid character. These characters are
                            // only valid inside of the variant but not at the end of the variant.
                            //
                            // E.g.: `hover-`
                            //            ^
                            // E.g.: `hover-!`
                            //            ^
                            // E.g.: `hover-/`
                            //            ^
                            Class::Dash
                            | Class::Underscore
                            | Class::AlphaLower
                            | Class::AlphaUpper
                            | Class::Number => cursor.advance(),

                            // Everything else is invalid
                            _ => return self.restart(),
                        },

                        // Still valid characters
                        Class::AlphaLower | Class::AlphaUpper | Class::Number | Class::Star => {
                            cursor.advance();
                        }

                        // A `/` means we are at the end of the variant, but there might be a modifier
                        //
                        // E.g.:
                        //
                        // ```
                        // group-hover/name:
                        //            ^
                        // ```
                        Class::Slash => {
                            self.state = State::ParsingModifier;
                            return self.next(cursor);
                        }

                        // A `:` means we are at the end of the variant
                        //
                        // E.g.: `hover:`
                        //             ^
                        Class::Colon => return self.done(self.start_pos, cursor),

                        // Everything else is invalid
                        _ => return self.restart(),
                    };
                }

                self.restart()
            }

            State::ParsingModifier => match self.modifier_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Done(_) => match CLASS_TABLE[cursor.next as usize] {
                    // Modifier must be followed by a `:`
                    //
                    // E.g.: `group-hover/name:`
                    //                        ^
                    Class::Colon => {
                        self.state = State::ParseEnd;
                        cursor.advance();
                        self.next(cursor)
                    }

                    // Everything else is invalid
                    _ => self.restart(),
                },
            },

            State::ParseEnd => match CLASS_TABLE[cursor.curr as usize] {
                // The end of a variant must be the `:`
                //
                // E.g.: `hover:`
                //             ^
                Class::Colon => self.done(self.start_pos, cursor),

                // Everything else is invalid
                _ => self.restart(),
            },
        }
    }
}

impl NamedVariantMachine {
    #[inline(always)]
    fn parse_arbitrary_end(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match CLASS_TABLE[cursor.next as usize] {
            Class::Slash => {
                self.state = State::ParsingModifier;
                cursor.advance();
                self.next(cursor)
            }
            Class::Colon => {
                self.state = State::ParseEnd;
                cursor.advance();
                self.next(cursor)
            }
            _ => self.restart(),
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

    /// `'0'..='9'`
    Number,

    /// `[`
    OpenBracket,

    /// `]`
    CloseBracket,

    /// `(`
    OpenParen,

    /// ', ", or `
    Quote,

    /// `*`
    Star,

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

    set!(Class::Quote, b'"', b'\'', b'`');

    set!(Class::Star, b'*');
    set!(Class::Slash, b'/');

    set_range!(Class::AlphaLower, b'a'..=b'z');
    set_range!(Class::AlphaUpper, b'A'..=b'Z');
    set_range!(Class::Number, b'0'..=b'9');

    set!(Class::End, 0x00);

    table
};

#[cfg(test)]
mod tests {
    use super::NamedVariantMachine;
    use crate::extractor::{machine::Machine, variant_machine::VariantMachine};

    #[test]
    #[ignore]
    fn test_named_variant_machine_performance() {
        let input = r#"<button class="hover:focus:flex data-[state=pending]:flex supports-(--my-variable):flex group-hover/named:not-has-peer-data-disabled:flex">"#;

        VariantMachine::test_throughput(1_000_000, input);
        VariantMachine::test_duration_once(input);

        todo!()
    }

    #[test]
    fn test_named_variant_extraction() {
        for (input, expected) in [
            // Simple variant
            ("hover:", vec!["hover:"]),
            // Simple single-character variant
            ("a:", vec!["a:"]),
            ("a/foo:", vec!["a/foo:"]),
            //
            ("group-hover:flex", vec!["group-hover:"]),
            ("group-hover/name:flex", vec!["group-hover/name:"]),
            (
                "group-[data-state=pending]/name:flex",
                vec!["group-[data-state=pending]/name:"],
            ),
            ("supports-(--foo)/name:flex", vec!["supports-(--foo)/name:"]),
            // --------------------------------------------------------

            // Exceptions:
            // Arbitrary variable must be valid
            (r"supports-(--my-color\):", vec![]),
            (r"supports-(--my#color)", vec![]),
            // Single letter variant with uppercase letter is invalid
            ("A:", vec![]),
        ] {
            let actual = NamedVariantMachine::test_extract_all(input);
            if actual != expected {
                dbg!(&input, &actual, &expected);
            }
            assert_eq!(actual, expected);
        }
    }
}
