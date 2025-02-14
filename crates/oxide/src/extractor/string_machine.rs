use crate::cursor;
use crate::extractor::machine::{Machine, MachineState};

#[derive(Clone, Copy)]
enum Class {
    Quote,
    Escape,
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

    set!(Class::Quote, b'"', b'\'', b'`');
    set!(Class::Escape, b'\\');
    set!(Class::Whitespace, b' ', b'\t', b'\n', b'\r', b'\x0C');

    table
}

const CLASS_TABLE: [Class; 256] = generate_table();

#[derive(Debug, Default)]
pub(crate) struct StringMachine {
    /// Start position of the string
    start_pos: usize,

    /// Ignore the characters until this specific position
    skip_until_pos: Option<usize>,

    /// Current state of the machine
    state: State,
}

#[derive(Debug, Default)]
enum State {
    #[default]
    Idle,

    /// Parsing a string
    Parsing(u8),
}

impl Machine for StringMachine {
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
                // Start of a string
                Class::Quote => {
                    self.start_pos = cursor.pos;
                    self.state = State::Parsing(cursor.curr);
                    MachineState::Parsing
                }

                // Anything else is not a valid start of a string
                _ => MachineState::Idle,
            },

            State::Parsing(end) => match (class_curr, class_next) {
                // An escaped whitespace character is not allowed
                (Class::Escape, Class::Whitespace) => self.restart(),

                // An escaped character, skip ahead to the next character
                (Class::Escape, _) if !cursor.at_end => {
                    self.skip_until_pos = Some(cursor.pos + 2);
                    MachineState::Parsing
                }

                // End of the string
                (Class::Quote, _) if cursor.curr == end => self.done(self.start_pos, cursor),

                // Any kind of whitespace is not allowed
                (Class::Whitespace, _) => self.restart(),

                // Everything else is valid
                _ => MachineState::Parsing,
            },
        }
    }
}

#[cfg(test)]
mod tests {
    use super::StringMachine;
    use crate::cursor::Cursor;
    use crate::extractor::machine::{Machine, MachineState};

    #[test]
    fn test_string_value_performance() {
        let input = "There will be a 'string' in this input ".repeat(100);

        StringMachine::test_throughput(100_000, &input);
        StringMachine::test_duration_once(&input);

        todo!()
    }

    #[test]
    fn test_string_value_extraction() {
        for (input, expected) in [
            // Simple string
            ("'foo'", vec!["'foo'"]),
            // String as part of a candidate
            ("content-['hello_world']", vec!["'hello_world'"]),
            // With nested quotes
            (r#"'"`hello`"'"#, vec![r#"'"`hello`"'"#]),
            // Spaces are not allowed
            ("' hello world '", vec![]),
        ] {
            let mut machine = StringMachine::default();
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
