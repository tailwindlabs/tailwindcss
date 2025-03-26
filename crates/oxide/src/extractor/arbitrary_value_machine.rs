use crate::cursor;
use crate::extractor::bracket_stack::BracketStack;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::string_machine::StringMachine;
use classification_macros::ClassifyBytes;

/// Extracts arbitrary values including the brackets.
///
/// E.g.:
///
/// ```text
/// bg-[#0088cc]
///    ^^^^^^^^^
///
/// bg-red-500/[20%]
///            ^^^^^
/// ```
#[derive(Debug, Default)]
pub struct ArbitraryValueMachine {
    /// Track brackets to ensure they are balanced
    bracket_stack: BracketStack,

    string_machine: StringMachine,
}

impl Machine for ArbitraryValueMachine {
    #[inline(always)]
    fn reset(&mut self) {
        self.bracket_stack.reset();
    }

    #[inline]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        // An arbitrary value must start with an open bracket
        if Class::OpenBracket != cursor.curr.into() {
            return MachineState::Idle;
        }

        let start_pos = cursor.pos;
        cursor.advance();

        let len = cursor.input.len();

        while cursor.pos < len {
            match cursor.curr.into() {
                Class::Escape => match cursor.next.into() {
                    // An escaped whitespace character is not allowed
                    //
                    // E.g.: `[color:var(--my-\ color)]`
                    //                         ^
                    Class::Whitespace => {
                        cursor.advance_twice();
                        return self.restart();
                    }

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
                    if start_pos + 1 != cursor.pos && self.bracket_stack.is_empty() =>
                {
                    return self.done(start_pos, cursor);
                }

                // Start of a string
                Class::Quote => match self.string_machine.next(cursor) {
                    MachineState::Idle => return self.restart(),
                    MachineState::Done(_) => cursor.advance(),
                },

                // Any kind of whitespace is not allowed
                Class::Whitespace => return self.restart(),

                // String interpolation-like syntax is not allowed. E.g.: `[${x}]`
                Class::Dollar if matches!(cursor.next.into(), Class::OpenCurly) => {
                    return self.restart()
                }

                // Everything else is valid
                _ => cursor.advance(),
            };
        }

        self.restart()
    }
}

#[derive(Clone, Copy, PartialEq, ClassifyBytes)]
enum Class {
    #[bytes(b'\\')]
    Escape,

    #[bytes(b'(')]
    OpenParen,

    #[bytes(b')')]
    CloseParen,

    #[bytes(b'[')]
    OpenBracket,

    #[bytes(b']')]
    CloseBracket,

    #[bytes(b'{')]
    OpenCurly,

    #[bytes(b'}')]
    CloseCurly,

    #[bytes(b'"', b'\'', b'`')]
    Quote,

    #[bytes(b' ', b'\t', b'\n', b'\r', b'\x0C')]
    Whitespace,

    #[bytes(b'$')]
    Dollar,

    #[fallback]
    Other,
}

#[cfg(test)]
mod tests {
    use super::ArbitraryValueMachine;
    use crate::extractor::machine::Machine;
    use pretty_assertions::assert_eq;

    #[test]
    #[ignore]
    fn test_arbitrary_value_machine_performance() {
        let input = r#"<div class="[color:red] [[data-foo]] [url('https://tailwindcss.com')] [url(https://tailwindcss.com)]"></div>"#.repeat(100);

        ArbitraryValueMachine::test_throughput(100_000, &input);
        ArbitraryValueMachine::test_duration_once(&input);

        todo!()
    }

    #[test]
    fn test_arbitrary_value_machine_extraction() {
        for (input, expected) in [
            // Simple variable
            ("[#0088cc]", vec!["[#0088cc]"]),
            // With parentheses
            (
                "[url(https://tailwindcss.com)]",
                vec!["[url(https://tailwindcss.com)]"],
            ),
            // With strings, where bracket balancing doesn't matter
            ("['[({])}']", vec!["['[({])}']"]),
            // With strings later in the input
            (
                "[url('https://tailwindcss.com?[{]}')]",
                vec!["[url('https://tailwindcss.com?[{]}')]"],
            ),
            // With nested brackets
            ("[[data-foo]]", vec!["[[data-foo]]"]),
            (
                "[&>[data-slot=icon]:last-child]",
                vec!["[&>[data-slot=icon]:last-child]"],
            ),
            // With data types
            ("[length:32rem]", vec!["[length:32rem]"]),
            // Spaces are not allowed
            ("[ #0088cc ]", vec![]),
            // Unbalanced brackets are not allowed
            ("[foo[bar]", vec![]),
            // Empty brackets are not allowed
            ("[]", vec![]),
        ] {
            assert_eq!(ArbitraryValueMachine::test_extract_all(input), expected);
        }
    }

    #[test]
    fn test_exceptions() {
        for (input, expected) in [
            // JS string interpolation
            ("[${x}]", vec![]),
            ("[url(${x})]", vec![]),
            // Allowed in strings
            ("[url('${x}')]", vec!["[url('${x}')]"]),
        ] {
            assert_eq!(ArbitraryValueMachine::test_extract_all(input), expected);
        }
    }
}
