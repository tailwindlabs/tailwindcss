use crate::cursor;
use crate::extractor::arbitrary_value_machine::ArbitraryValueMachine;
use crate::extractor::machine::{Machine, MachineState};

use super::arbitrary_variable_machine::ArbitraryVariableMachine;

#[derive(Debug, Default)]
pub(crate) struct ModifierMachine {
    /// Start position of the modifier
    start_pos: usize,

    /// Current state of the machine
    state: State,

    arbitrary_value_machine: ArbitraryValueMachine,
    arbitrary_variable_machine: ArbitraryVariableMachine,
}

#[derive(Debug, Default)]
enum State {
    #[default]
    Idle,

    /// Parsing a named modifier, e.g.:
    ///
    /// ```
    /// bg-red-500/20
    ///           ^^^
    /// ```
    ParsingNamed,

    /// Parsing an arbitrary value, e.g.:
    ///
    /// ```
    /// bg-red-500/[20%]
    ///           ^^^^^^
    /// ```
    ParsingArbitraryValue,

    /// Parsing an arbitrary variable, e.g.:
    ///
    /// ```
    /// bg-red-500/(--my-opacity)
    ///           ^^^^^^^^^^^^^^^
    /// ```
    ParsingArbitraryVariable,
}

impl Machine for ModifierMachine {
    fn next(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        match self.state {
            State::Idle => match (cursor.curr, cursor.next) {
                // Start of an arbitrary value
                (b'/', b'[') => self.parse_arbitrary_value(cursor),

                // Start of an arbitrary variable
                (b'/', b'(') => self.parse_arbitrary_variable(cursor),

                // Start of a named modifier
                (b'/', b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9') => self.parse_named(cursor),

                // Anything else is not a valid start of a modifier
                _ => MachineState::Idle,
            },

            State::ParsingNamed => match (cursor.curr, cursor.next) {
                // Only valid characters are allowed, if followed by another valid character
                (
                    b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9' | b'-' | b'_' | b'.',
                    b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9' | b'-' | b'_' | b'.',
                ) => MachineState::Parsing,

                // Valid character, but at the end of the modifier
                (b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9' | b'-' | b'_' | b'.', _) => {
                    self.done(self.start_pos, cursor)
                }

                // Anything else is invalid, end of the modifier
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

impl ModifierMachine {
    #[inline(always)]
    fn parse_arbitrary_value(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        self.start_pos = cursor.pos;
        self.state = State::ParsingArbitraryValue;
        MachineState::Parsing
    }

    #[inline(always)]
    fn parse_arbitrary_variable(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        self.start_pos = cursor.pos;
        self.state = State::ParsingArbitraryVariable;
        MachineState::Parsing
    }

    #[inline(always)]
    fn parse_named(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        self.start_pos = cursor.pos;
        self.state = State::ParsingNamed;
        MachineState::Parsing
    }
}

#[cfg(test)]
mod tests {
    use super::ModifierMachine;
    use crate::cursor::Cursor;
    use crate::extractor::machine::{Machine, MachineState};

    #[test]
    fn test_modifier_extraction() {
        for (input, expected) in [
            // Simple modifier
            ("foo/bar", vec!["/bar"]),
            ("foo/bar-baz", vec!["/bar-baz"]),
            // Simple modifier with numbers
            ("foo/20", vec!["/20"]),
            // Simple modifier with numbers
            ("foo/20", vec!["/20"]),
            // Arbitrary value
            ("foo/[20]", vec!["/[20]"]),
            // Arbitrary value with CSS variable shorthand
            ("foo/(--x)", vec!["/(--x)"]),
            ("foo/(--foo-bar)", vec!["/(--foo-bar)"]),
            // --------------------------------------------------------

            // Empty arbitrary value is not allowed
            ("foo/[]", vec![]),
            // Empty arbitrary value shorthand is not allowed
            ("foo/()", vec![]),
            // A CSS variable must start with `--` and must have at least a single character
            ("foo/(-)", vec![]),
            ("foo/(--)", vec![]),
            // Arbitrary value shorthand should be a valid CSS variable
            ("foo/(--my#color)", vec![]),
        ] {
            let mut machine = ModifierMachine::default();
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
