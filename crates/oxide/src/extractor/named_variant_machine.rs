use crate::cursor;
use crate::extractor::arbitrary_value_machine::ArbitraryValueMachine;
use crate::extractor::arbitrary_variable_machine::ArbitraryVariableMachine;
use crate::extractor::machine::{Machine, MachineState};

use super::modifier_machine::ModifierMachine;

#[derive(Debug, Default)]
pub(crate) struct NamedVariantMachine {
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

    /// Parsing a functional variant with an arbitrary value
    ///
    /// E.g.: `data-[…]`.
    ParsingArbitraryValue,

    /// Parsing a functional variant with an arbitrary variable
    ///
    /// E.g.: `supports-(--my-color)`.
    ParsingArbitraryVariable,

    /// Parsing a modifier
    ///
    /// E.g.:
    ///
    /// ```
    /// group-hover/name:
    ///            ^^^^^
    /// ```
    ///
    ParsingModifier,

    /// Parsing the end of a variant
    ///
    /// E.g.:
    ///
    /// ```
    /// hover:
    ///      ^
    /// ```
    ParseEnd,
}

impl Machine for NamedVariantMachine {
    fn next(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        match self.state {
            State::Idle => match (cursor.curr, cursor.next) {
                // Valid single character variant, must be followed by a `:`
                //
                // E.g.: `<div class="x:flex"></div>`
                //                    ^^
                // E.g.: `*:`
                //        ^^
                (b'a'..=b'z' | b'*' | b'-' | b'_', b':') => self.parse_end(),

                // Valid start characters
                //
                // E.g.: `flex`
                //        ^
                // E.g.: `@container`
                //        ^
                (b'a'..=b'z' | b'0'..=b'9' | b'*' | b'-' | b'_' | b'@', _) => self.parse(cursor),

                // Everything else, is not a valid start of the variant.
                _ => MachineState::Idle,
            },

            State::Parsing => match (cursor.curr, cursor.next) {
                // Start of an arbitrary value
                (b'-', b'[') => self.parse_arbitrary_value(),

                // Start of an arbitrary variable
                (b'-', b'(') => self.parse_arbitrary_variable(),

                // Valid characters _if_ followed by another valid character. These characters are
                // only valid inside of the variant but not at the end of the variant.
                //
                // E.g.: `hover-`
                //            ^
                // E.g.: `hover-!`
                //            ^
                // E.g.: `hover-/`
                //            ^
                (
                    b'-' | b'_', //
                    b'-' | b'_' | b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9',
                ) => MachineState::Parsing,

                // Still valid characters
                (b'_' | b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9' | b'*', _) => MachineState::Parsing,

                // A `/` means we are at the end of the variant, but there might be a modifier
                //
                // E.g.:
                //
                // ```
                // group-hover/name:
                //            ^
                // ```
                (b'/', _) => {
                    self.modifier_machine.next(cursor);
                    self.parse_modifier()
                }

                // A `:` means we are at the end of the variant
                //
                // E.g.: `hover:`
                //             ^
                (b':', _) => self.done(self.start_pos, cursor),

                // Everything else is invalid
                _ => self.restart(),
            },

            State::ParsingArbitraryValue => match self.arbitrary_value_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Parsing => MachineState::Parsing,
                MachineState::Done(_) => match cursor.next {
                    b'/' => self.parse_modifier(),
                    b':' => self.parse_end(),
                    _ => self.restart(),
                },
            },

            State::ParsingArbitraryVariable => match self.arbitrary_variable_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Parsing => MachineState::Parsing,
                MachineState::Done(_) => match cursor.next {
                    b'/' => self.parse_modifier(),
                    b':' => self.parse_end(),
                    _ => self.restart(),
                },
            },

            State::ParsingModifier => match self.modifier_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Parsing => MachineState::Parsing,
                MachineState::Done(_) => match cursor.next {
                    // Modifier must be followed by a `:`
                    //
                    // E.g.: `group-hover/name:`
                    //                        ^
                    b':' => self.parse_end(),

                    // Everything else is invalid
                    _ => self.restart(),
                },
            },

            State::ParseEnd => match cursor.curr {
                // The end of a variant must be the `:`
                //
                // E.g.: `hover:`
                //             ^
                b':' => self.done(self.start_pos, cursor),

                // Everything else is invalid
                _ => self.restart(),
            },
        }
    }
}

impl NamedVariantMachine {
    #[inline(always)]
    fn parse(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        self.start_pos = cursor.pos;

        self.state = State::Parsing;
        MachineState::Parsing
    }

    #[inline(always)]
    fn parse_arbitrary_value(&mut self) -> MachineState {
        self.state = State::ParsingArbitraryValue;
        MachineState::Parsing
    }

    #[inline(always)]
    fn parse_arbitrary_variable(&mut self) -> MachineState {
        self.state = State::ParsingArbitraryVariable;
        MachineState::Parsing
    }

    #[inline(always)]
    fn parse_modifier(&mut self) -> MachineState {
        self.state = State::ParsingModifier;
        MachineState::Parsing
    }

    #[inline(always)]
    fn parse_end(&mut self) -> MachineState {
        self.state = State::ParseEnd;
        MachineState::Parsing
    }
}

#[cfg(test)]
mod tests {
    use super::NamedVariantMachine;
    use crate::cursor::Cursor;
    use crate::extractor::machine::{Machine, MachineState};

    #[test]
    fn test_named_variant_extraction() {
        for (input, expected) in [
            // Simple variant
            ("hover:", vec!["hover:"]),
            // Simple single-character utility
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

            //       // Exceptions:
            //       // Arbitrary variable must be valid
            //       (r"bg-(--my-color\)", vec![]),
            //       // We get `color`, because we don't check boundaries as part of this state machine.
            //       (r"bg-(--my#color)", vec!["color"]),
            //       // Single letter utility with uppercase letter is invalid
            //       ("A", vec![]),
            //       // Spaces do not count
            //       (" a", vec!["a"]),
            //       ("a ", vec!["a"]),
            //       (" a ", vec!["a"]),
            //       (" flex", vec!["flex"]),
            //       ("flex ", vec!["flex"]),
            //       (" flex ", vec!["flex"]),
            //       // A dot must be in-between numbers
            //       ("opacity-0.5", vec!["opacity-0.5"]),
            //       ("opacity-.5", vec![]),
            //       ("opacity-5.", vec![]),
            //       // A number must be preceded by a `-`, `.` or another number
            //       ("text-2xs", vec!["text-2xs"]),
            //       // "foo2" is invalid, but "bar" is not because we don't check boundary characters as
            //       // part of this state machine.
            //       ("foo2bar", vec!["bar"]),
            //       ("foo2-bar", vec!["-bar"]),
            //       // Random invalid utilities
            //       ("-$", vec![]),
            //       ("-_", vec![]),
            //       ("-foo-", vec![]),
            //       ("foo-=", vec![]),
            //       ("foo-#", vec![]),
            //       ("foo-!", vec![]),
            //       ("foo-/20", vec![]),
            //       ("-", vec![]),
            //       ("--", vec![]),
            //       ("---", vec![]),
        ] {
            let mut machine = NamedVariantMachine::default();
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
