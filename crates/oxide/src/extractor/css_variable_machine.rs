use crate::cursor;
use crate::extractor::machine::{Machine, MachineState};

#[derive(Clone, Copy)]
enum Class {
    Dash,
    AllowedCharacter,
    Escape,
    Whitespace,
    End,
    Other,
}

const fn generate_table() -> [Class; 256] {
    let mut table = [Class::Other; 256];

    macro_rules! set {
        ($class:expr, $($byte:expr),+ $(,)?) => {
            $(table[$byte as usize] = $class;)+
        };
    }

    macro_rules! set_range {
        ($class:expr, $start:literal ..= $end:literal) => {
            let mut i = $start;
            while i <= $end {
                table[i as usize] = $class;
                i += 1;
            }
        };
    }

    set!(Class::Dash, b'-');
    set!(Class::Escape, b'\\');
    set!(Class::Whitespace, b' ', b'\t', b'\n', b'\r', b'\x0C');

    set!(Class::AllowedCharacter, b'_');
    set_range!(Class::AllowedCharacter, b'a'..=b'z');
    set_range!(Class::AllowedCharacter, b'A'..=b'Z');
    set_range!(Class::AllowedCharacter, b'0'..=b'9');

    set!(Class::End, 0x00);

    table
}

const CLASS_TABLE: [Class; 256] = generate_table();

#[derive(Debug, Default)]
pub(crate) struct CssVariableMachine {
    /// Start position of the CSS variable
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

    /// Parsing a CSS variable
    Parsing,
}

impl Machine for CssVariableMachine {
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
            State::Idle => match (class_curr, class_next) {
                // Start of a CSS variable
                (Class::Dash, Class::Dash) => {
                    self.start_pos = cursor.pos;
                    self.skip_until_pos = Some(cursor.pos + 2);
                    self.state = State::Parsing;
                    MachineState::Parsing
                }

                // Anything else is not a valid start of a CSS variable
                _ => MachineState::Idle,
            },

            State::Parsing => match (class_curr, class_next) {
                // https://drafts.csswg.org/css-syntax-3/#ident-token-diagram
                //
                // Valid character at the end of the input
                (Class::AllowedCharacter | Class::Dash, Class::End) => {
                    self.done(self.start_pos, cursor)
                }

                // Valid character followed by a valid character or an escape character
                //
                // E.g.: `--my-variable`
                //                ^^
                // E.g.: `--my-\#variable`
                //            ^^
                (
                    Class::AllowedCharacter | Class::Dash,
                    Class::AllowedCharacter | Class::Dash | Class::Escape,
                ) => MachineState::Parsing,

                // Valid character followed by an invalid character
                (Class::AllowedCharacter | Class::Dash, _) => self.done(self.start_pos, cursor),

                // An escaped whitespace character is not allowed
                //
                // In CSS it is allowed, but in the context of a class it's not because then we
                // would have spaces in the class. E.g.: `bg-(--my-\ color)`
                (Class::Escape, Class::Whitespace) => self.restart(),

                // An escaped character, skip ahead to the next character
                (Class::Escape, _) if !cursor.at_end => {
                    self.skip_until_pos = Some(cursor.pos + 2);
                    MachineState::Parsing
                }

                // Character is not valid anymore
                _ => self.restart(),
            },
        }
    }
}

#[cfg(test)]
mod tests {
    use super::CssVariableMachine;
    use crate::cursor::Cursor;
    use crate::extractor::machine::{Machine, MachineState};

    #[test]
    fn test_css_variable_performance() {
        let input = "var(--my-variable) --other-variable var(--more-variables-here)".repeat(100);

        CssVariableMachine::test_throughput(100_000, &input);
        CssVariableMachine::test_duration_once(&input);

        todo!()
    }

    #[test]
    fn test_css_variable_extraction() {
        for (input, expected) in [
            // Simple variable
            ("--foo", vec!["--foo"]),
            // With dashes
            ("--my-variable", vec!["--my-variable"]),
            // Inside `var(…)`
            ("var(--my-variable)", vec!["--my-variable"]),
            // Inside a string
            ("'--my-variable'", vec!["--my-variable"]),
            // Multiple variables
            (
                "calc(var(--first) + var(--second))",
                vec!["--first", "--second"],
            ),
            // Escaped character in the middle, skips the next character
            (r#"--spacing-1\/2"#, vec![r#"--spacing-1\/2"#]),
            // Escaped whitespace is not allowed
            (r#"--my-\ variable"#, vec![]),
        ] {
            let mut machine = CssVariableMachine::default();
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
