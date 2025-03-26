use crate::cursor;
use crate::extractor::arbitrary_value_machine::ArbitraryValueMachine;
use crate::extractor::arbitrary_variable_machine::ArbitraryVariableMachine;
use crate::extractor::machine::{Machine, MachineState};
use classification_macros::ClassifyBytes;

/// Extract modifiers from an input including the `/`.
///
/// E.g.:
///
/// ```text
/// bg-red-500/20
///           ^^^
///
/// bg-red-500/[20%]
///           ^^^^^^
///
/// bg-red-500/(--my-opacity)
///           ^^^^^^^^^^^^^^^
/// ```
#[derive(Debug, Default)]
pub struct ModifierMachine {
    arbitrary_value_machine: ArbitraryValueMachine,
    arbitrary_variable_machine: ArbitraryVariableMachine,
}

impl Machine for ModifierMachine {
    #[inline(always)]
    fn reset(&mut self) {}

    #[inline]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        // A modifier must start with a `/`, everything else is not a valid start of a modifier
        if Class::Slash != cursor.curr.into() {
            return MachineState::Idle;
        }

        let start_pos = cursor.pos;
        cursor.advance();

        match cursor.curr.into() {
            // Start of an arbitrary value:
            //
            // ```
            // bg-red-500/[20%]
            //            ^^^^^
            // ```
            Class::OpenBracket => match self.arbitrary_value_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Done(_) => self.done(start_pos, cursor),
            },

            // Start of an arbitrary variable:
            //
            // ```
            // bg-red-500/(--my-opacity)
            //            ^^^^^^^^^^^^^^
            // ```
            Class::OpenParen => match self.arbitrary_variable_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Done(_) => self.done(start_pos, cursor),
            },

            // Start of a named modifier:
            //
            // ```
            // bg-red-500/20
            //            ^^
            // ```
            Class::ValidStart => {
                let len = cursor.input.len();
                while cursor.pos < len {
                    match cursor.curr.into() {
                        Class::ValidStart | Class::ValidInside => {
                            match cursor.next.into() {
                                // Only valid characters are allowed, if followed by another valid character
                                Class::ValidStart | Class::ValidInside => cursor.advance(),

                                // Valid character, but at the end of the modifier, this ends the
                                // modifier
                                _ => return self.done(start_pos, cursor),
                            }
                        }

                        // Anything else is invalid, end of the modifier
                        _ => return self.restart(),
                    }
                }

                MachineState::Idle
            }

            // Anything else is not a valid start of a modifier
            _ => MachineState::Idle,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, ClassifyBytes)]
enum Class {
    #[bytes_range(b'a'..=b'z', b'A'..=b'Z', b'0'..=b'9')]
    ValidStart,

    #[bytes(b'-', b'_', b'.')]
    ValidInside,

    #[bytes(b'[')]
    OpenBracket,

    #[bytes(b'(')]
    OpenParen,

    #[bytes(b'/')]
    Slash,

    #[fallback]
    Other,
}

#[cfg(test)]
mod tests {
    use super::ModifierMachine;
    use crate::extractor::machine::Machine;
    use pretty_assertions::assert_eq;

    #[test]
    #[ignore]
    fn test_modifier_machine_performance() {
        let input = r#"<button class="group-hover/name:flex bg-red-500/20 text-black/[20%] border-white/(--my-opacity)">"#;

        ModifierMachine::test_throughput(1_000_000, input);
        ModifierMachine::test_duration_once(input);

        todo!()
    }

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
            assert_eq!(ModifierMachine::test_extract_all(input), expected);
        }
    }
}
