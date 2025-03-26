use crate::cursor;
use crate::extractor::bracket_stack::BracketStack;
use crate::extractor::css_variable_machine::CssVariableMachine;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::string_machine::StringMachine;
use classification_macros::ClassifyBytes;
use std::marker::PhantomData;

#[derive(Debug, Default)]
pub struct IdleState;

/// Currently parsing the inside of the arbitrary variable
///
/// ```text
/// (--my-opacity)
///  ^^^^^^^^^^^^
/// ```
#[derive(Debug, Default)]
pub struct ParsingState;

/// Currently parsing the data type of the arbitrary variable
///
/// ```text
/// (length:--my-opacity)
///  ^^^^^^^
/// ```
#[derive(Debug, Default)]
pub struct ParsingDataTypeState;

/// Currently parsing the fallback of the arbitrary variable
///
/// ```text
/// (--my-opacity,50%)
///              ^^^^
/// ```
#[derive(Debug, Default)]
pub struct ParsingFallbackState;

/// Extracts arbitrary variables including the parens.
///
/// E.g.:
///
/// ```text
/// (--my-value)
/// ^^^^^^^^^^^^
///
/// bg-red-500/(--my-opacity)
///            ^^^^^^^^^^^^^^
/// ```
#[derive(Debug, Default)]
pub struct ArbitraryVariableMachine<State = IdleState> {
    /// Start position of the arbitrary variable
    start_pos: usize,

    /// Track brackets to ensure they are balanced
    bracket_stack: BracketStack,

    string_machine: StringMachine,
    css_variable_machine: CssVariableMachine,

    _state: PhantomData<State>,
}

impl<State> ArbitraryVariableMachine<State> {
    #[inline(always)]
    fn transition<NextState>(&self) -> ArbitraryVariableMachine<NextState> {
        ArbitraryVariableMachine {
            start_pos: self.start_pos,
            bracket_stack: Default::default(),
            string_machine: Default::default(),
            css_variable_machine: Default::default(),
            _state: PhantomData,
        }
    }
}

impl Machine for ArbitraryVariableMachine<IdleState> {
    #[inline(always)]
    fn reset(&mut self) {}

    #[inline(always)]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match cursor.curr.into() {
            // Arbitrary variables start with `(` followed by a CSS variable
            //
            // E.g.: `(--my-variable)`
            //        ^^
            //
            Class::OpenParen => match cursor.next.into() {
                Class::Dash => {
                    self.start_pos = cursor.pos;
                    cursor.advance();
                    self.transition::<ParsingState>().next(cursor)
                }

                Class::AlphaLower => {
                    self.start_pos = cursor.pos;
                    cursor.advance();
                    self.transition::<ParsingDataTypeState>().next(cursor)
                }

                _ => MachineState::Idle,
            },

            // Everything else, is not a valid start of the arbitrary variable. But the next
            // character might be a valid start for a new utility.
            _ => MachineState::Idle,
        }
    }
}

impl Machine for ArbitraryVariableMachine<ParsingState> {
    #[inline(always)]
    fn reset(&mut self) {}

    #[inline(always)]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match self.css_variable_machine.next(cursor) {
            MachineState::Idle => self.restart(),
            MachineState::Done(_) => match cursor.next.into() {
                // A CSS variable followed by a `,` means that there is a fallback
                //
                // E.g.: `(--my-color,red)`
                //                   ^
                Class::Comma => {
                    cursor.advance_twice(); // Skip the `,`
                    self.transition::<ParsingFallbackState>().next(cursor)
                }

                // End of the CSS variable
                //
                // E.g.: `(--my-color)`
                //                  ^
                _ => {
                    cursor.advance();

                    match cursor.curr.into() {
                        // End of an arbitrary variable, must be followed by `)`
                        Class::CloseParen => self.done(self.start_pos, cursor),

                        // Invalid arbitrary variable, not ending at `)`
                        _ => self.restart(),
                    }
                }
            },
        }
    }
}

impl Machine for ArbitraryVariableMachine<ParsingDataTypeState> {
    #[inline(always)]
    fn reset(&mut self) {}

    #[inline(always)]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        let len = cursor.input.len();

        while cursor.pos < len {
            match cursor.curr.into() {
                // Valid data type characters
                //
                // E.g.: `(length:--my-length)`
                //         ^
                Class::AlphaLower | Class::Dash => {
                    cursor.advance();
                }

                // End of the data type
                //
                // E.g.: `(length:--my-length)`
                //               ^
                Class::Colon => match cursor.next.into() {
                    Class::Dash => {
                        cursor.advance();
                        return self.transition::<ParsingState>().next(cursor);
                    }

                    _ => return self.restart(),
                },

                // Anything else is not a valid character
                _ => return self.restart(),
            };
        }
        self.restart()
    }
}

impl Machine for ArbitraryVariableMachine<ParsingFallbackState> {
    #[inline(always)]
    fn reset(&mut self) {
        self.bracket_stack.reset();
    }

    #[inline(always)]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        let len = cursor.input.len();
        while cursor.pos < len {
            match cursor.curr.into() {
                Class::Escape => match cursor.next.into() {
                    // An escaped whitespace character is not allowed
                    //
                    // E.g.: `(--my-\ color)`
                    //              ^^
                    Class::Whitespace => return self.restart(),

                    // An escaped character, skip the next character, resume after
                    //
                    // E.g.: `(--my-\#color)`
                    //              ^^
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

                // End of an arbitrary variable
                Class::CloseParen => return self.done(self.start_pos, cursor),

                // Start of a string
                Class::Quote => match self.string_machine.next(cursor) {
                    MachineState::Idle => return self.restart(),
                    MachineState::Done(_) => cursor.advance(),
                },

                // A `:` inside of a fallback value is only valid inside of brackets or inside of a
                // string. Everywhere else, it's invalid.
                //
                // E.g.: `(--foo,bar:baz)`
                //                  ^ Not valid
                //
                // E.g.: `(--url,url(https://example.com))`
                //                        ^ Valid
                //
                // E.g.: `(--my-content:'a:b:c:')`
                //                        ^ ^ ^ Valid
                Class::Colon if self.bracket_stack.is_empty() => return self.restart(),

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
    #[bytes_range(b'a'..=b'z')]
    AlphaLower,

    #[bytes_range(b'A'..=b'Z')]
    AlphaUpper,

    #[bytes(b'@')]
    At,

    #[bytes(b':')]
    Colon,

    #[bytes(b',')]
    Comma,

    #[bytes(b'-')]
    Dash,

    #[bytes(b'.')]
    Dot,

    #[bytes(b'$')]
    Dollar,

    #[bytes(b'\\')]
    Escape,

    #[bytes(b'\0')]
    End,

    #[bytes_range(b'0'..=b'9')]
    Number,

    #[bytes(b'[')]
    OpenBracket,

    #[bytes(b']')]
    CloseBracket,

    #[bytes(b'(')]
    OpenParen,

    #[bytes(b')')]
    CloseParen,

    #[bytes(b'{')]
    OpenCurly,

    #[bytes(b'}')]
    CloseCurly,

    #[bytes(b'"', b'\'', b'`')]
    Quote,

    #[bytes(b'_')]
    Underscore,

    #[bytes(b' ', b'\t', b'\n', b'\r', b'\x0C')]
    Whitespace,

    #[fallback]
    Other,
}

#[cfg(test)]
mod tests {
    use super::ArbitraryVariableMachine;
    use crate::extractor::{arbitrary_variable_machine::IdleState, machine::Machine};
    use pretty_assertions::assert_eq;

    #[test]
    #[ignore]
    fn test_arbitrary_variable_machine_performance() {
        let input = r#"<div class="(--foo) (--my-color,red,blue) (--my-img,url('https://example.com?q=(][)'))"></div>"#.repeat(100);

        ArbitraryVariableMachine::<IdleState>::test_throughput(100_000, &input);
        ArbitraryVariableMachine::<IdleState>::test_duration_once(&input);

        todo!()
    }

    #[test]
    fn test_arbitrary_variable_extraction() {
        for (input, expected) in [
            // Simple utility
            ("(--foo)", vec!["(--foo)"]),
            // With dashes
            ("(--my-color)", vec!["(--my-color)"]),
            // With a fallback
            ("(--my-color,red,blue)", vec!["(--my-color,red,blue)"]),
            // With a fallback containing a string with unbalanced brackets
            (
                "(--my-img,url('https://example.com?q=(][)'))",
                vec!["(--my-img,url('https://example.com?q=(][)'))"],
            ),
            // With a type hint
            ("(length:--my-length)", vec!["(length:--my-length)"]),
            // --------------------------------------------------------

            // Exceptions:
            // Arbitrary variable must start with a CSS variable
            (r"(bar)", vec![]),
            // Arbitrary variables must be valid CSS variables
            (r"(--my-\ color)", vec![]),
            (r"(--my#color)", vec![]),
            // Fallbacks cannot have spaces
            (r"(--my-color, red)", vec![]),
            // Fallbacks cannot have escaped spaces
            (r"(--my-color,\ red)", vec![]),
            // Variables must have at least one character after the `--`
            (r"(--)", vec![]),
            (r"(--,red)", vec![]),
            (r"(-)", vec![]),
            (r"(-my-color)", vec![]),
        ] {
            assert_eq!(
                ArbitraryVariableMachine::<IdleState>::test_extract_all(input),
                expected
            );
        }
    }

    #[test]
    fn test_exceptions() {
        for (input, expected) in [
            // JS string interpolation
            // As part of the variable
            ("(--my-${var})", vec![]),
            // As the fallback
            ("(--my-variable,${var})", vec![]),
            // As the fallback in strings
            (
                "(--my-variable,url('${var}'))",
                vec!["(--my-variable,url('${var}'))"],
            ),
        ] {
            assert_eq!(
                ArbitraryVariableMachine::<IdleState>::test_extract_all(input),
                expected
            );
        }
    }
}
