use super::arbitrary_value_machine::ArbitraryValueMachine;
use crate::cursor;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::named_variant_machine::NamedVariantMachine;

#[derive(Debug, Default)]
pub(crate) struct VariantMachine {
    /// Start position of the variant
    start_pos: usize,

    /// Current state of the machine
    state: State,

    arbitrary_value_machine: ArbitraryValueMachine,
    named_variant_machine: NamedVariantMachine,
}

#[derive(Debug, Default)]
enum State {
    #[default]
    Idle,

    /// Parsing a named variant
    ///
    /// E.g.:
    ///
    /// ```
    /// hover:
    /// ^^^^^
    /// ```
    ParsingNamedVariant,

    /// Parsing an arbitrary variant
    ///
    /// E.g.:
    ///
    /// ```
    /// [&:hover]:
    /// ^^^^^^^^^
    /// ```
    ParsingArbitraryVariant,

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

impl Machine for VariantMachine {
    fn next(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        match self.state {
            State::Idle => match (cursor.curr, cursor.next) {
                // Start of an arbitrary variant
                //
                // E.g.: `[&:hover]:`
                //        ^
                (b'[', _) => self.parse_arbitrary_variant(cursor),

                // Start of a named variant
                _ => match self.parse_named_variant(cursor) {
                    MachineState::Idle => self.restart(),
                    MachineState::Parsing => MachineState::Parsing,
                    variant @ MachineState::Done(_) => variant,
                },
            },

            State::ParsingNamedVariant => match self.named_variant_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Parsing => MachineState::Parsing,
                MachineState::Done(_) => self.done(self.start_pos, cursor),
            },

            State::ParsingArbitraryVariant => match self.arbitrary_value_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Parsing => MachineState::Parsing,
                MachineState::Done(_) => match cursor.next {
                    // End of an arbitrary variant, must be followed by a `:`
                    //
                    // E.g.: `[&:hover]:`
                    //                 ^
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

impl VariantMachine {
    #[inline(always)]
    fn parse_arbitrary_variant(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        self.start_pos = cursor.pos;
        self.arbitrary_value_machine.next(cursor);
        self.state = State::ParsingArbitraryVariant;
        MachineState::Parsing
    }

    #[inline(always)]
    fn parse_named_variant(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        self.start_pos = cursor.pos;
        self.state = State::ParsingNamedVariant;
        self.named_variant_machine.next(cursor)
    }

    #[inline(always)]
    fn parse_end(&mut self) -> MachineState {
        self.state = State::ParseEnd;
        MachineState::Parsing
    }
}

#[cfg(test)]
mod tests {
    use super::VariantMachine;
    use crate::cursor::Cursor;
    use crate::extractor::machine::{Machine, MachineState};

    #[test]
    fn test_variant_extraction() {
        for (input, expected) in [
            // Simple variant
            ("hover:flex", vec!["hover:"]),
            // Single character variant
            ("a:flex", vec!["a:"]),
            ("*:flex", vec!["*:"]),
            // With special characters
            ("**:flex", vec!["**:"]),
            // With dashes
            ("data-disabled:flex", vec!["data-disabled:"]),
            // Multiple variants
            ("hover:focus:flex", vec!["hover:", "focus:"]),
            // Arbitrary variant
            ("[&:hover]:flex", vec!["[&:hover]:"]),
            // Arbitrary variant with nested brackets
            (
                "[&>[data-slot=icon]:last-child]:",
                vec!["[&>[data-slot=icon]:last-child]:"],
            ),
            (
                "sm:[&>[data-slot=icon]:last-child]:",
                vec!["sm:", "[&>[data-slot=icon]:last-child]:"],
            ),
            // Modifiers
            ("group-hover/foo:flex", vec!["group-hover/foo:"]),
            ("group-hover/[.parent]:flex", vec!["group-hover/[.parent]:"]),
            // Arbitrary variant with bracket notation
            ("data-[state=pending]:flex", vec!["data-[state=pending]:"]),
            // Arbitrary variant with CSS property shorthand
            ("supports-(--my-color):flex", vec!["supports-(--my-color):"]),
            // -------------------------------------------------------------

            // Exceptions
            // Empty arbitrary variant is not allowed
            ("[]:flex", vec![]),
            // Named variant must be followed by `:`
            ("hover", vec![]),
            // Modifier cannot be followed by another modifier. However, we don't check boundary
            // characters in this state machine so we will get `bar:`.
            ("group-hover/foo/bar:flex", vec!["bar:"]),
        ] {
            let mut machine = VariantMachine::default();
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
