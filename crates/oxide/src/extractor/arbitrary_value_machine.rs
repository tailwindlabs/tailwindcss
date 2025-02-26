use crate::cursor;
use crate::extractor::bracket_stack::BracketStack;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::string_machine::StringMachine;

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
    /// Start position of the arbitrary value
    start_pos: usize,

    /// Track brackets to ensure they are balanced
    bracket_stack: BracketStack,

    /// Current state of the machine
    state: State,

    string_machine: StringMachine,
}

#[derive(Debug, Default)]
enum State {
    #[default]
    Idle,

    /// Parsing an arbitrary value
    Parsing,
}

impl Machine for ArbitraryValueMachine {
    #[inline(always)]
    fn reset(&mut self) {
        self.start_pos = 0;
        self.state = State::Idle;
        self.bracket_stack.reset();
    }

    #[inline]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        let len = cursor.input.len();

        match self.state {
            State::Idle => match CLASS_TABLE[cursor.curr as usize] {
                // Start of an arbitrary value
                Class::OpenBracket => {
                    self.start_pos = cursor.pos;
                    self.state = State::Parsing;
                    cursor.advance();
                    self.next(cursor)
                }

                // Anything else is not a valid start of an arbitrary value
                _ => MachineState::Idle,
            },

            State::Parsing => {
                while cursor.pos < len {
                    match CLASS_TABLE[cursor.curr as usize] {
                        Class::Escape => match CLASS_TABLE[cursor.next as usize] {
                            // An escaped whitespace character is not allowed
                            //
                            // E.g.: `[color:var(--my-\ color)]`
                            //                         ^
                            Class::Whitespace => {
                                cursor.advance_by(2);
                                return self.restart();
                            }

                            // An escaped character, skip the next character, resume after
                            //
                            // E.g.: `[color:var(--my-\#color)]`
                            //                        ^
                            _ => cursor.advance_by(2),
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
                            if self.start_pos + 1 != cursor.pos
                                && self.bracket_stack.is_empty() =>
                        {
                            return self.done(self.start_pos, cursor);
                        }

                        // Start of a string
                        Class::Quote => match self.string_machine.next(cursor) {
                            MachineState::Idle => return self.restart(),
                            MachineState::Done(_) => cursor.advance(),
                        },

                        // Any kind of whitespace is not allowed
                        Class::Whitespace => return self.restart(),

                        // Everything else is valid
                        _ => cursor.advance(),
                    };
                }

                MachineState::Idle
            }
        }
    }
}

#[derive(Clone, Copy)]
enum Class {
    /// `\`
    Escape,

    /// `(`
    OpenParen,

    /// `)`
    CloseParen,

    /// `[`
    OpenBracket,

    /// `]`
    CloseBracket,

    /// `{`
    OpenCurly,

    /// `}`
    CloseCurly,

    /// ', ", or `
    Quote,

    /// Whitespace
    Whitespace,

    Other,
}

const CLASS_TABLE: [Class; 256] = {
    let mut table = [Class::Other; 256];

    macro_rules! set {
        ($class:expr, $($byte:expr),+ $(,)?) => {
            $(table[$byte as usize] = $class;)+
        };
    }

    set!(Class::Escape, b'\\');

    set!(Class::OpenParen, b'(');
    set!(Class::CloseParen, b')');

    set!(Class::OpenBracket, b'[');
    set!(Class::CloseBracket, b']');

    set!(Class::OpenCurly, b'{');
    set!(Class::CloseCurly, b'}');

    set!(Class::Quote, b'"', b'\'', b'`');

    set!(Class::Whitespace, b' ', b'\t', b'\n', b'\r', b'\x0C');

    table
};

#[cfg(test)]
mod tests {
    use super::ArbitraryValueMachine;
    use crate::extractor::machine::Machine;

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
}
