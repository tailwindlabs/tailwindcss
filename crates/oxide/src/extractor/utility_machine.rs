use crate::cursor;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::modifier_machine::ModifierMachine;
use crate::extractor::named_utility_machine::NamedUtilityMachine;

use super::arbitrary_property_machine::ArbitraryPropertyMachine;

#[derive(Debug, Default)]
pub(crate) struct UtilityMachine {
    /// Start position of the utility
    start_pos: usize,

    /// Current state of the machine
    state: State,

    arbitrary_property_machine: ArbitraryPropertyMachine,
    named_utility_machine: NamedUtilityMachine,
    modifier_machine: ModifierMachine,
}

#[derive(Debug, Default)]
enum State {
    #[default]
    Idle,

    /// Parsing a named utility
    ///
    /// E.g.: `p-2.5`
    ParsingNamedUtility,

    /// Parsing an arbitrary property utility
    ///
    /// E.g.: `[color:red]`
    ParsingArbitraryProperty,

    /// Parsing a modifier
    ///
    /// E.g.:
    /// ```
    /// bg-red-500/20
    ///           ^^^
    /// ```
    ///
    ParsingModifier,

    /// Parsing the important marker `!`
    ParsingImportant,
}

impl Machine for UtilityMachine {
    fn next(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        match self.state {
            State::Idle => match (cursor.curr, cursor.next) {
                // LEGACY: Important marker followed by the start of an arbitrary property.
                //
                // E.g.: `![color:red]`
                //        ^
                (b'!', b'[') => self.parse_arbitrary_property(cursor),

                // Start of an arbitrary property
                //
                // E.g.: `[color:red]`
                //        ^
                (b'[', _) => {
                    self.arbitrary_property_machine.next(cursor);
                    self.parse_arbitrary_property(cursor)
                }

                // Valid single character utility
                //
                // Must be followed by a space or the end of the input
                (b'a'..=b'z', x) if x.is_ascii_whitespace() || cursor.at_end => {
                    self.parse_named(cursor)
                }

                // LEGACY: Important marker followed by valid start characters for a named utility
                //
                // E.g.: `!bg-red-500`
                //        ^
                (b'!', b'a'..=b'z' | b'@') => self.parse_named(cursor),

                // Valid start characters for a named utility
                //
                // E.g.: `bg-red-500`
                //        ^
                (b'-' | b'a'..=b'z', _) => self.parse_named(cursor),

                // Everything else, is not a valid start of a utility.
                _ => MachineState::Idle,
            },

            State::ParsingNamedUtility => match self.named_utility_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Parsing => MachineState::Parsing,
                MachineState::Done(_) => match cursor.next {
                    // End of a named utility, but there is a potential modifier.
                    //
                    // E.g.: `bg-red-500/`
                    //                  ^
                    b'/' => self.parse_modifier(),

                    // End of named utility, but there is an `!`.
                    //
                    // E.g.: `bg-red-500!`
                    //                  ^
                    b'!' => self.parse_important(),

                    // End of a named utility
                    //
                    // E.g.: `bg-red-500`
                    //                 ^
                    _ => self.done(self.start_pos, cursor),
                },
            },

            State::ParsingArbitraryProperty => match self.arbitrary_property_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Parsing => MachineState::Parsing,
                MachineState::Done(_) => match cursor.next {
                    // End of arbitrary property, but there is a potential modifier.
                    //
                    // E.g.: `[color:#0088cc]/`
                    //                       ^
                    b'/' => self.parse_modifier(),

                    // End of arbitrary property, but there is an `!`.
                    //
                    // E.g.: `[color:#0088cc]!`
                    //                       ^
                    b'!' => self.parse_important(),

                    // End of arbitrary property
                    //
                    // E.g.: `[color:#0088cc]`
                    //                      ^
                    _ => self.done(self.start_pos, cursor),
                },
            },

            State::ParsingModifier => match self.modifier_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Parsing => MachineState::Parsing,
                MachineState::Done(_) => match cursor.next {
                    // A modifier followed by a modifier is invalid
                    b'/' => self.restart(),

                    // A modifier followed by the important marker `!`
                    b'!' => self.parse_important(),

                    // Everything else is valid
                    _ => self.done(self.start_pos, cursor),
                },
            },

            State::ParsingImportant => match cursor.curr {
                // Only the `!` is valid if we didn't start with `!`
                //
                // E.g.:
                // ```
                // !bg-red-500!
                //            ^ invalid because of the first `!`
                // ```
                b'!' if cursor.input[self.start_pos] != b'!' => self.done(self.start_pos, cursor),

                // Everything else is invalid
                _ => self.restart(),
            },
        }
    }
}

impl UtilityMachine {
    #[inline(always)]
    fn parse_arbitrary_property(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        self.start_pos = cursor.pos;
        self.state = State::ParsingArbitraryProperty;
        MachineState::Parsing
    }

    #[inline(always)]
    fn parse_named(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        self.start_pos = cursor.pos;
        self.state = State::ParsingNamedUtility;

        self.named_utility_machine.next(cursor)
    }

    #[inline(always)]
    fn parse_modifier(&mut self) -> MachineState {
        self.state = State::ParsingModifier;
        MachineState::Parsing
    }

    #[inline(always)]
    fn parse_important(&mut self) -> MachineState {
        self.state = State::ParsingImportant;
        MachineState::Parsing
    }
}

#[cfg(test)]
mod tests {
    use super::UtilityMachine;
    use crate::cursor::Cursor;
    use crate::extractor::machine::{Machine, MachineState};

    #[test]
    fn test_utility_extraction() {
        for (input, expected) in [
            // Simple utility
            ("flex", vec!["flex"]),
            // Single character utility
            ("a", vec!["a"]),
            // Important utilities
            ("!flex", vec!["!flex"]),
            ("flex!", vec!["flex!"]),
            ("flex! block", vec!["flex!", "block"]),
            // With dashes
            ("items-center", vec!["items-center"]),
            // // Inside a string
            ("'flex'", vec!["flex"]),
            // Multiple utilities
            ("flex items-center", vec!["flex", "items-center"]),
            // Arbitrary property
            ("[color:red]", vec!["[color:red]"]),
            ("![color:red]", vec!["![color:red]"]),
            ("[color:red]!", vec!["[color:red]!"]),
            ("[color:red]/20", vec!["[color:red]/20"]),
            ("![color:red]/20", vec!["![color:red]/20"]),
            ("[color:red]/20!", vec!["[color:red]/20!"]),
            // Modifiers
            ("bg-red-500/20", vec!["bg-red-500/20"]),
            ("bg-red-500/[20%]", vec!["bg-red-500/[20%]"]),
            (
                "bg-red-500/(--my-opacity)",
                vec!["bg-red-500/(--my-opacity)"],
            ),
            // Modifiers with important (legacy)
            ("!bg-red-500/20", vec!["!bg-red-500/20"]),
            ("!bg-red-500/[20%]", vec!["!bg-red-500/[20%]"]),
            (
                "!bg-red-500/(--my-opacity)",
                vec!["!bg-red-500/(--my-opacity)"],
            ),
            // Modifiers with important
            ("bg-red-500/20!", vec!["bg-red-500/20!"]),
            ("bg-red-500/[20%]!", vec!["bg-red-500/[20%]!"]),
            (
                "bg-red-500/(--my-opacity)!",
                vec!["bg-red-500/(--my-opacity)!"],
            ),
            // // Arbitrary value with bracket notation
            ("bg-[#0088cc]", vec!["bg-[#0088cc]"]),
            // Arbitrary value with arbitrary property shorthand modifier
            (
                "bg-[#0088cc]/(--my-opacity)",
                vec!["bg-[#0088cc]/(--my-opacity)"],
            ),
            // Arbitrary value with CSS property shorthand
            ("bg-(--my-color)", vec!["bg-(--my-color)"]),
            // Multiple utilities including arbitrary property shorthand
            (
                "bg-(--my-color) flex px-(--my-padding)",
                vec!["bg-(--my-color)", "flex", "px-(--my-padding)"],
            ),
            // Within HTML
            (
                "<div class='flex items-center justify-center'></div>",
                vec![
                    "div",
                    "class",
                    "flex",
                    "items-center",
                    "justify-center",
                    "div",
                ],
            ),
            // --------------------------------------------------------

            // Exceptions:
            ("bg-red-500/20/20", vec![]),
        ] {
            let mut machine = UtilityMachine::default();
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
