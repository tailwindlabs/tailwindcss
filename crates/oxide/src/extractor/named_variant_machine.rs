use crate::cursor;
use crate::extractor::arbitrary_value_machine::ArbitraryValueMachine;
use crate::extractor::arbitrary_variable_machine::ArbitraryVariableMachine;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::modifier_machine::ModifierMachine;
use classification_macros::ClassifyBytes;
use std::marker::PhantomData;

#[derive(Debug, Default)]
pub struct IdleState;

/// Parsing a variant
#[derive(Debug, Default)]
pub struct ParsingState;

/// Parsing a modifier
///
/// E.g.:
///
/// ```text
/// group-hover/name:
///            ^^^^^
/// ```
///
#[derive(Debug, Default)]
pub struct ParsingModifierState;

/// Parsing the end of a variant
///
/// E.g.:
///
/// ```text
/// hover:
///      ^
/// ```
#[derive(Debug, Default)]
pub struct ParsingEndState;

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
pub struct NamedVariantMachine<State = IdleState> {
    /// Start position of the variant
    start_pos: usize,

    arbitrary_variable_machine: ArbitraryVariableMachine,
    arbitrary_value_machine: ArbitraryValueMachine,
    modifier_machine: ModifierMachine,

    _state: PhantomData<State>,
}

impl<State> NamedVariantMachine<State> {
    #[inline(always)]
    fn transition<NextState>(&self) -> NamedVariantMachine<NextState> {
        NamedVariantMachine {
            start_pos: self.start_pos,
            arbitrary_variable_machine: Default::default(),
            arbitrary_value_machine: Default::default(),
            modifier_machine: Default::default(),
            _state: PhantomData,
        }
    }
}

impl Machine for NamedVariantMachine<IdleState> {
    #[inline(always)]
    fn reset(&mut self) {}

    #[inline(always)]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match cursor.curr.into() {
            Class::AlphaLower | Class::Star => match cursor.next.into() {
                // Valid single character variant, must be followed by a `:`
                //
                // E.g.: `<div class="x:flex"></div>`
                //                    ^^
                // E.g.: `*:`
                //        ^^
                Class::Colon => {
                    cursor.advance();
                    self.transition::<ParsingEndState>().next(cursor)
                }

                // Valid start characters
                //
                // E.g.: `hover:`
                //        ^
                // E.g.: `**:`
                //        ^
                _ => {
                    self.start_pos = cursor.pos;
                    cursor.advance();
                    self.transition::<ParsingState>().next(cursor)
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
                cursor.advance();
                self.transition::<ParsingState>().next(cursor)
            }

            // Everything else, is not a valid start of the variant.
            _ => MachineState::Idle,
        }
    }
}

impl Machine for NamedVariantMachine<ParsingState> {
    #[inline(always)]
    fn reset(&mut self) {}

    #[inline(always)]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        let len = cursor.input.len();

        while cursor.pos < len {
            match cursor.curr.into() {
                Class::Dash => match cursor.next.into() {
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
                    //             ^   Invalid
                    // E.g.: `hover-!`
                    //             ^   Invalid
                    // E.g.: `hover-/`
                    //             ^   Invalid
                    // E.g.: `flex-1`
                    //            ^    Valid
                    Class::Dash
                    | Class::Underscore
                    | Class::AlphaLower
                    | Class::AlphaUpper
                    | Class::Number => cursor.advance(),

                    // Everything else is invalid
                    _ => return self.restart(),
                },

                // Start of an arbitrary value
                //
                // E.g.: `@[state=pending]:`.
                //         ^
                Class::OpenBracket => {
                    return match self.arbitrary_value_machine.next(cursor) {
                        MachineState::Idle => self.restart(),
                        MachineState::Done(_) => self.parse_arbitrary_end(cursor),
                    };
                }

                Class::Underscore => match cursor.next.into() {
                    // Valid characters _if_ followed by another valid character. These characters are
                    // only valid inside of the variant but not at the end of the variant.
                    //
                    // E.g.: `hover_`
                    //             ^     Invalid
                    // E.g.: `hover_!`
                    //             ^     Invalid
                    // E.g.: `hover_/`
                    //             ^     Invalid
                    // E.g.: `custom_1`
                    //              ^    Valid
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
                    cursor.advance()
                }

                // A `/` means we are at the end of the variant, but there might be a modifier
                //
                // E.g.:
                //
                // ```
                // group-hover/name:
                //            ^
                // ```
                Class::Slash => return self.transition::<ParsingModifierState>().next(cursor),

                // A `:` means we are at the end of the variant
                //
                // E.g.: `hover:`
                //             ^
                Class::Colon => return self.done(self.start_pos, cursor),

                // A dot must be surrounded by numbers
                //
                // E.g.: `2.5xl:flex`
                //        ^^^
                Class::Dot => {
                    if !matches!(cursor.prev.into(), Class::Number) {
                        return self.restart();
                    }

                    if !matches!(cursor.next.into(), Class::Number) {
                        return self.restart();
                    }

                    cursor.advance();
                }

                // Everything else is invalid
                _ => return self.restart(),
            };
        }

        self.restart()
    }
}

impl NamedVariantMachine<ParsingState> {
    #[inline(always)]
    fn parse_arbitrary_end(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match cursor.next.into() {
            Class::Slash => {
                cursor.advance();
                self.transition::<ParsingModifierState>().next(cursor)
            }
            Class::Colon => {
                cursor.advance();
                self.transition::<ParsingEndState>().next(cursor)
            }
            _ => self.restart(),
        }
    }
}

impl Machine for NamedVariantMachine<ParsingModifierState> {
    #[inline(always)]
    fn reset(&mut self) {}

    #[inline(always)]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match self.modifier_machine.next(cursor) {
            MachineState::Idle => self.restart(),
            MachineState::Done(_) => match cursor.next.into() {
                // Modifier must be followed by a `:`
                //
                // E.g.: `group-hover/name:`
                //                        ^
                Class::Colon => {
                    cursor.advance();
                    self.transition::<ParsingEndState>().next(cursor)
                }

                // Everything else is invalid
                _ => self.restart(),
            },
        }
    }
}

impl Machine for NamedVariantMachine<ParsingEndState> {
    #[inline(always)]
    fn reset(&mut self) {}

    #[inline(always)]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match cursor.curr.into() {
            // The end of a variant must be the `:`
            //
            // E.g.: `hover:`
            //             ^
            Class::Colon => self.done(self.start_pos, cursor),

            // Everything else is invalid
            _ => self.restart(),
        }
    }
}

#[derive(Clone, Copy, ClassifyBytes)]
enum Class {
    #[bytes_range(b'a'..=b'z')]
    AlphaLower,

    #[bytes_range(b'A'..=b'Z')]
    AlphaUpper,

    #[bytes(b'@')]
    At,

    #[bytes(b':')]
    Colon,

    #[bytes(b'-')]
    Dash,

    #[bytes(b'.')]
    Dot,

    #[bytes_range(b'0'..=b'9')]
    Number,

    #[bytes(b'[')]
    OpenBracket,

    #[bytes(b'(')]
    OpenParen,

    #[bytes(b'*')]
    Star,

    #[bytes(b'/')]
    Slash,

    #[bytes(b'_')]
    Underscore,

    #[fallback]
    Other,
}

#[cfg(test)]
mod tests {
    use super::{IdleState, NamedVariantMachine};
    use crate::extractor::machine::Machine;
    use pretty_assertions::assert_eq;

    #[test]
    #[ignore]
    fn test_named_variant_machine_performance() {
        let input = r#"<button class="hover:focus:flex data-[state=pending]:flex supports-(--my-variable):flex group-hover/named:not-has-peer-data-disabled:flex">"#;

        NamedVariantMachine::<IdleState>::test_throughput(1_000_000, input);
        NamedVariantMachine::<IdleState>::test_duration_once(input);

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
            // Odd media queries
            ("1.5xl:flex", vec!["1.5xl:"]),
            // Container queries
            ("@md:flex", vec!["@md:"]),
            ("@max-md:flex", vec!["@max-md:"]),
            ("@-[36rem]:flex", vec!["@-[36rem]:"]),
            ("@[36rem]:flex", vec!["@[36rem]:"]),
            // --------------------------------------------------------

            // Exceptions:
            // Arbitrary variable must be valid
            (r"supports-(--my-color\):", vec![]),
            (r"supports-(--my#color)", vec![]),
            // Single letter variant with uppercase letter is invalid
            ("A:", vec![]),
        ] {
            let actual = NamedVariantMachine::<IdleState>::test_extract_all(input);
            if actual != expected {
                dbg!(&input);
            }
            assert_eq!(actual, expected);
        }
    }
}
