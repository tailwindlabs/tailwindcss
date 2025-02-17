use crate::cursor;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::string_machine::StringMachine;

#[derive(Clone, Copy)]
enum Class {
    Escape,

    OpenParen,
    CloseParen,

    OpenBracket,
    CloseBracket,

    OpenCurly,
    CloseCurly,

    Quote,

    Whitespace,
    Other,
}

const fn generate_table() -> [Class; 256] {
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
}

const CLASS_TABLE: [Class; 256] = generate_table();

#[derive(Debug, Default)]
pub(crate) struct ArbitraryValueMachine {
    /// Start position of the arbitrary value
    start_pos: usize,

    /// Bracket stack to ensure properly balanced brackets
    bracket_stack: Vec<u8>,

    /// Ignore the characters until this specific position
    skip_until_pos: Option<usize>,

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

    /// Parsing a string, in this case the brackets don't need to be balanced when inside of a
    /// string.
    ParsingString,
}

impl Machine for ArbitraryValueMachine {
    fn next(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        // Skipping characters until a specific position
        match self.skip_until_pos {
            Some(skip_until) if cursor.pos < skip_until => return MachineState::Parsing,
            Some(_) => self.skip_until_pos = None,
            None => {}
        }

        let class_curr = CLASS_TABLE[cursor.curr as usize];
        let class_next = CLASS_TABLE[cursor.next as usize];

        match self.state {
            State::Idle => match class_curr {
                // Start of an arbitrary value
                Class::OpenBracket => {
                    self.start_pos = cursor.pos;
                    self.parse()
                }

                // Anything else is not a valid start of an arbitrary value
                _ => MachineState::Idle,
            },

            State::Parsing => match (class_curr, class_next) {
                // An escaped character, skip ahead to the next character
                (Class::Escape, _) if !cursor.at_end => {
                    self.skip_until_pos = Some(cursor.pos + 2);
                    MachineState::Parsing
                }

                // An escaped whitespace character is not allowed
                (Class::Escape, Class::Whitespace) => self.restart(),

                (Class::OpenParen, _) => {
                    self.bracket_stack.push(b')');
                    MachineState::Parsing
                }

                (Class::OpenBracket, _) => {
                    self.bracket_stack.push(b']');
                    MachineState::Parsing
                }

                (Class::OpenCurly, _) => {
                    self.bracket_stack.push(b'}');
                    MachineState::Parsing
                }

                (Class::CloseParen | Class::CloseBracket | Class::CloseCurly, _)
                    if !self.bracket_stack.is_empty() =>
                {
                    if let Some(&expected) = self.bracket_stack.last() {
                        if cursor.curr == expected {
                            self.bracket_stack.pop();
                        } else {
                            return self.restart();
                        }
                    }

                    MachineState::Parsing
                }

                // End of an arbitrary value
                //
                // 1. All brackets must be balanced
                // 2. There must be at least a single character inside the brackets
                (Class::CloseBracket, _)
                    if self.bracket_stack.is_empty() && self.start_pos + 1 != cursor.pos =>
                {
                    self.done(self.start_pos, cursor)
                }

                // Start of a string
                (Class::Quote, _) => self.parse_string(cursor),

                // Any kind of whitespace is not allowed
                (Class::Whitespace, _) => self.restart(),

                // Everything else is valid
                _ => MachineState::Parsing,
            },

            State::ParsingString => match self.string_machine.next(cursor) {
                MachineState::Idle => self.restart(),
                MachineState::Parsing => MachineState::Parsing,
                MachineState::Done(_) => self.parse(),
            },
        }
    }
}

impl ArbitraryValueMachine {
    #[inline(always)]
    fn parse(&mut self) -> MachineState {
        self.state = State::Parsing;
        MachineState::Parsing
    }

    #[inline(always)]
    fn parse_string(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        self.string_machine.next(cursor);
        self.state = State::ParsingString;
        MachineState::Parsing
    }
}

#[cfg(test)]
mod tests {
    use super::ArbitraryValueMachine;
    use crate::cursor::Cursor;
    use crate::extractor::machine::{Machine, MachineState};

    #[test]
    fn test_arbitrary_value_performance() {
        let input = r#"<div class="[color:red] [[data-foo]] [url('https://tailwindcss.com')] [url(https://tailwindcss.com)]"></div>"#.repeat(100);

        ArbitraryValueMachine::test_throughput(100_000, &input);
        ArbitraryValueMachine::test_duration_once(&input);

        todo!()
    }

    #[test]
    fn test_arbitrary_value_extraction() {
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
            let mut machine = ArbitraryValueMachine::default();
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
