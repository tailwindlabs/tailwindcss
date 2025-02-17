use crate::cursor;
use crate::extractor::arbitrary_value_machine::ArbitraryValueMachine;
use crate::extractor::arbitrary_variable_machine::ArbitraryVariableMachine;
use crate::extractor::machine::{Machine, MachineState};

#[derive(Debug, Default)]
pub(crate) struct NamedUtilityMachine {
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

    /// Parsing a functional utility with an arbitrary value
    ///
    /// E.g.: `text-[…]`.
    ParsingArbitraryValue,

    /// Parsing a functional utility with an arbitrary variable
    ///
    /// E.g.: `text-(--my-color)`.
    ParsingArbitraryVariable,
}

impl Machine for NamedUtilityMachine {
    fn next(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        match self.state {
            State::Idle => match (cursor.curr, cursor.next) {
                // Valid single character utility
                //
                // Must be followed by a space or the end of the input
                //
                // E.g.: `<div class="a b c"></div>`
                //                      ^
                // E.g.: `a`
                //        ^
                (b'a'..=b'z', x) if x.is_ascii_whitespace() || cursor.at_end => {
                    self.done(cursor.pos, cursor)
                }

                // Valid start characters
                //
                // E.g.: `flex`
                //        ^
                // E.g.: `@container`
                //        ^
                (b'a'..=b'z' | b'@', _) => self.parse(cursor),

                // Valid start of a negative utility, if followed by another set of valid
                // characters. `@` as a second character is invalid.
                //
                // E.g.: `-mx-2.5`
                //        ^^
                (b'-', b'a'..=b'z' | b'A'..=b'Z') => self.parse(cursor),

                // Everything else, is not a valid start of the utility. But the next character
                // might be a valid start for a new utility.
                _ => MachineState::Idle,
            },

            State::Parsing => match (cursor.prev, cursor.curr, cursor.next) {
                // Start of an arbitrary value
                (_, b'-', b'[') => self.parse_arbitrary_value(),

                // Start of an arbitrary variable
                (_, b'-', b'(') => self.parse_arbitrary_variable(),

                // Valid characters _if_ followed by another valid character. These characters are
                // only valid inside of the utility but not at the end of the utility.
                //
                // E.g.: `flex-`
                //            ^
                // E.g.: `flex-!`
                //            ^
                // E.g.: `flex-/`
                //            ^
                (_, b'-' | b'_', b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9') => MachineState::Parsing,

                // A dot must be surrounded by numbers
                //
                // E.g.: `px-2.5`
                //           ^^^
                (b'0'..=b'9', b'.', b'0'..=b'9') => MachineState::Parsing,

                // A number must be preceded by a `-`, `.` or another number, and can be followed
                // by a `.` or an alphanumeric character.
                //
                // E.g.: `text-2xs`
                //            ^^
                //       `p-2.5`
                //           ^^
                //       `bg-red-500`
                //                ^^
                (
                    b'-' | b'.' | b'0'..=b'9',                      // Previous
                    b'0'..=b'9',                                    // Current
                    b'.' | b'0'..=b'9' | b'a'..=b'z' | b'A'..=b'Z', // Next
                ) => MachineState::Parsing,

                // A number must be preceded by a `-`, `.` or another number, a number followed by
                // something else, means that we are at the end of the utility
                //
                // E.g.: `p-2.5 `
                //             ^
                (b'-' | b'.' | b'0'..=b'9', b'0'..=b'9', _) => self.done(self.start_pos, cursor),

                // Valid characters inside of a utility, but we are at the end
                //
                // E.g.: `flex`
                //           ^
                (_, b'a'..=b'z' | b'A'..=b'Z', 0x00) => self.done(self.start_pos, cursor),

                // Followed by a character that is not going to be valid
                //
                // E.g.: `flex#`
                //            ^
                (_, b'_' | b'a'..=b'z' | b'A'..=b'Z', next) if !matches!(next, b'-' | b'_' | b'.' | b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9') => {
                    self.done(self.start_pos, cursor)
                }

                // Still valid characters
                (_, b'_' | b'a'..=b'z' | b'A'..=b'Z', _) => MachineState::Parsing,

                // Everything else is invalid
                _ => self.restart(),
            },

            State::ParsingArbitraryValue => match self.arbitrary_value_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Parsing => MachineState::Parsing,
                MachineState::Done(_) => self.done(self.start_pos, cursor),
            },

            State::ParsingArbitraryVariable => match self.arbitrary_variable_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Parsing => MachineState::Parsing,
                MachineState::Done(_) => self.done(self.start_pos, cursor),
            },
        }
    }
}

impl NamedUtilityMachine {
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
}

#[cfg(test)]
mod tests {
    use super::NamedUtilityMachine;
    use crate::cursor::Cursor;
    use crate::extractor::machine::{Machine, MachineState};

    #[test]
    fn test_named_utility_extraction() {
        for (input, expected) in [
            // Simple utility
            ("flex", vec!["flex"]),
            // Simple single-character utility
            ("a", vec!["a"]),
            // With dashes
            ("items-center", vec!["items-center"]),
            // With numbers
            ("px-5", vec!["px-5"]),
            ("px-2.5", vec!["px-2.5"]),
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
            // We get `color`, because we don't check boundaries as part of this state machine.
            (r"bg-(--my#color)", vec!["color"]),
            // Single letter utility with uppercase letter is invalid
            ("A", vec![]),
            // Spaces do not count
            (" a", vec!["a"]),
            ("a ", vec!["a"]),
            (" a ", vec!["a"]),
            (" flex", vec!["flex"]),
            ("flex ", vec!["flex"]),
            (" flex ", vec!["flex"]),
            // A dot must be in-between numbers
            ("opacity-0.5", vec!["opacity-0.5"]),
            ("opacity-.5", vec![]),
            ("opacity-5.", vec![]),
            // A number must be preceded by a `-`, `.` or another number
            ("text-2xs", vec!["text-2xs"]),
            // "foo2" is invalid, but "bar" is not because we don't check boundary characters as
            // part of this state machine.
            ("foo2bar", vec!["bar"]),
            ("foo2-bar", vec!["-bar"]),
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
            let mut machine = NamedUtilityMachine::default();
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
