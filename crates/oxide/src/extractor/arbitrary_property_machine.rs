use crate::cursor;
use crate::extractor::bracket_stack::BracketStack;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::string_machine::StringMachine;
use crate::extractor::CssVariableMachine;
use classification_macros::ClassifyBytes;
use std::marker::PhantomData;

#[derive(Debug, Default)]
pub struct IdleState;

/// Parsing the property, e.g.:
///
/// ```text
/// [color:red]
///  ^^^^^
///
/// [--my-color:red]
///  ^^^^^^^^^^
/// ```
#[derive(Debug, Default)]
pub struct ParsingPropertyState;

/// Parsing the value, e.g.:
///
/// ```text
/// [color:red]
///        ^^^
/// ```
#[derive(Debug, Default)]
pub struct ParsingValueState;

/// Extracts arbitrary properties from the input, including the brackets.
///
/// E.g.:
///
/// ```text
/// [color:red]
/// ^^^^^^^^^^^
///
/// [--my-color:red]
/// ^^^^^^^^^^^^^^^^
/// ```
#[derive(Debug, Default)]
pub struct ArbitraryPropertyMachine<State = IdleState> {
    /// Start position of the arbitrary value
    start_pos: usize,

    /// Track brackets to ensure they are balanced
    bracket_stack: BracketStack,

    css_variable_machine: CssVariableMachine,
    string_machine: StringMachine,

    _state: PhantomData<State>,
}

impl<State> ArbitraryPropertyMachine<State> {
    #[inline(always)]
    fn transition<NextState>(&self) -> ArbitraryPropertyMachine<NextState> {
        ArbitraryPropertyMachine {
            start_pos: self.start_pos,
            bracket_stack: Default::default(),
            css_variable_machine: Default::default(),
            string_machine: Default::default(),
            _state: PhantomData,
        }
    }
}

impl Machine for ArbitraryPropertyMachine<IdleState> {
    #[inline(always)]
    fn reset(&mut self) {}

    #[inline]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match cursor.curr.into() {
            // Start of an arbitrary property
            Class::OpenBracket => {
                self.start_pos = cursor.pos;
                cursor.advance();
                self.transition::<ParsingPropertyState>().next(cursor)
            }

            // Anything else is not a valid start of an arbitrary value
            _ => MachineState::Idle,
        }
    }
}

impl Machine for ArbitraryPropertyMachine<ParsingPropertyState> {
    #[inline(always)]
    fn reset(&mut self) {}

    #[inline]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        let len = cursor.input.len();

        while cursor.pos < len {
            match cursor.curr.into() {
                Class::Dash => match cursor.next.into() {
                    // Start of a CSS variable
                    //
                    // E.g.: `[--my-color:red]`
                    //         ^^
                    Class::Dash => return self.parse_property_variable(cursor),

                    // Dashes are allowed in the property name
                    //
                    // E.g.: `[background-color:red]`
                    //                   ^
                    _ => cursor.advance(),
                },

                // Alpha characters are allowed in the property name
                //
                // E.g.: `[color:red]`
                //         ^^^^^
                Class::AlphaLower => cursor.advance(),

                // End of the property name, but there must be at least a single character
                Class::Colon if cursor.pos > self.start_pos + 1 => {
                    cursor.advance();
                    return self.transition::<ParsingValueState>().next(cursor);
                }

                // Anything else is not a valid property character
                _ => return self.restart(),
            }
        }

        self.restart()
    }
}

impl ArbitraryPropertyMachine<ParsingPropertyState> {
    fn parse_property_variable(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match self.css_variable_machine.next(cursor) {
            MachineState::Idle => self.restart(),
            MachineState::Done(_) => match cursor.next.into() {
                // End of the CSS variable, must be followed by a `:`
                //
                // E.g.: `[--my-color:red]`
                //                   ^
                Class::Colon => {
                    cursor.advance_twice();
                    self.transition::<ParsingValueState>().next(cursor)
                }

                // Invalid arbitrary property
                _ => self.restart(),
            },
        }
    }
}

impl Machine for ArbitraryPropertyMachine<ParsingValueState> {
    #[inline(always)]
    fn reset(&mut self) {
        self.bracket_stack.reset();
    }

    #[inline]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        let len = cursor.input.len();
        let start_of_value_pos = cursor.pos;
        while cursor.pos < len {
            match cursor.curr.into() {
                Class::Escape => match cursor.next.into() {
                    // An escaped whitespace character is not allowed
                    //
                    // E.g.: `[color:var(--my-\ color)]`
                    //                         ^
                    Class::Whitespace => return self.restart(),

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
                    if self.start_pos + 1 != cursor.pos && self.bracket_stack.is_empty() =>
                {
                    return self.done(self.start_pos, cursor)
                }

                // Start of a string
                Class::Quote => return self.parse_string(cursor),

                // Another `:` inside of an arbitrary property is only valid inside of a string or
                // inside of brackets. Everywhere else, it's invalid.
                //
                // E.g.: `[color:red:blue]`
                //                  ^ Not valid
                // E.g.: `[background:url(https://example.com)]`
                //                             ^ Valid
                // E.g.: `[content:'a:b:c:']`
                //                   ^ ^ ^ Valid
                Class::Colon if self.bracket_stack.is_empty() => return self.restart(),

                // Any kind of whitespace is not allowed
                Class::Whitespace => return self.restart(),

                // URLs are not allowed
                Class::Slash if start_of_value_pos == cursor.pos => return self.restart(),

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

impl ArbitraryPropertyMachine<ParsingValueState> {
    fn parse_string(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match self.string_machine.next(cursor) {
            MachineState::Idle => self.restart(),
            MachineState::Done(_) => {
                cursor.advance();
                self.next(cursor)
            }
        }
    }
}

#[derive(Clone, Copy, ClassifyBytes)]
enum Class {
    #[bytes(b'(')]
    OpenParen,

    #[bytes(b'[')]
    OpenBracket,

    #[bytes(b'{')]
    OpenCurly,

    #[bytes(b')')]
    CloseParen,

    #[bytes(b']')]
    CloseBracket,

    #[bytes(b'}')]
    CloseCurly,

    #[bytes(b'\\')]
    Escape,

    #[bytes(b'"', b'\'', b'`')]
    Quote,

    #[bytes(b'-')]
    Dash,

    #[bytes(b'$')]
    Dollar,

    #[bytes_range(b'a'..=b'z')]
    AlphaLower,

    #[bytes(b':')]
    Colon,

    #[bytes(b'/')]
    Slash,

    #[bytes(b' ', b'\t', b'\n', b'\r', b'\x0C')]
    Whitespace,

    #[bytes(b'\0')]
    End,

    #[fallback]
    Other,
}

#[cfg(test)]
mod tests {
    use super::{ArbitraryPropertyMachine, IdleState};
    use crate::extractor::machine::Machine;
    use pretty_assertions::assert_eq;

    #[test]
    #[ignore]
    fn test_arbitrary_property_machine_performance() {
        let input = r#"<button class="[color:red] [background-color:red] [--my-color:red] [background:url('https://example.com')]">"#.repeat(10);

        ArbitraryPropertyMachine::<IdleState>::test_throughput(1_000_000, &input);
        ArbitraryPropertyMachine::<IdleState>::test_duration_once(&input);

        todo!()
    }

    #[test]
    fn test_arbitrary_property_machine_extraction() {
        for (input, expected) in [
            // Simple arbitrary property
            ("[color:red]", vec!["[color:red]"]),
            // Name with dashes
            ("[background-color:red]", vec!["[background-color:red]"]),
            // Name with leading `-` is valid
            ("[-webkit-value:red]", vec!["[-webkit-value:red]"]),
            // Setting a CSS Variable
            ("[--my-color:red]", vec!["[--my-color:red]"]),
            // Value with nested brackets
            (
                "[background:url(https://example.com)]",
                vec!["[background:url(https://example.com)]"],
            ),
            // Value containing strings
            (
                "[background:url('https://example.com')]",
                vec!["[background:url('https://example.com')]"],
            ),
            // --------------------------------------------------------

            // Invalid CSS Variable
            ("[--my#color:red]", vec![]),
            // Spaces are not allowed
            ("[color: red]", vec![]),
            // Multiple colons are not allowed
            ("[color:red:blue]", vec![]),
            // Only alphanumeric characters are allowed in the property name
            ("[background_color:red]", vec![]),
            // A color is required
            ("[red]", vec![]),
            // The property cannot be empty
            ("[:red]", vec![]),
            // Empty brackets are not allowed
            ("[]", vec![]),
            // URLs
            ("[http://example.com]", vec![]),
            ("[https://example.com]", vec![]),
            // Missing colon in more complex example
            (r#"[CssClass("gap-y-4")]"#, vec![]),
            // Brackets must be balanced
            ("[background:url(https://example.com]", vec![]),
            // Many brackets (>= 8) must be balanced
            (
                "[background:url(https://example.com?q={[{[([{[[2]]}])]}]})]",
                vec!["[background:url(https://example.com?q={[{[([{[[2]]}])]}]})]"],
            ),
        ] {
            for wrapper in [
                // No wrapper
                "{}",
                // With leading spaces
                " {}",
                // With trailing spaces
                "{} ",
                // Surrounded by spaces
                " {} ",
                // Inside a string
                "'{}'",
                // Inside a function call
                "fn({})",
                // Inside nested function calls
                "fn1(fn2({}))",
                // --------------------------
                //
                // HTML
                // Inside a class (on its own)
                r#"<div class="{}"></div>"#,
                // Inside a class (first)
                r#"<div class="{} foo"></div>"#,
                // Inside a class (second)
                r#"<div class="foo {}"></div>"#,
                // Inside a class (surrounded)
                r#"<div class="foo {} bar"></div>"#,
                // --------------------------
                //
                // JavaScript
                // Inside a variable
                r#"let classes = '{}';"#,
                // Inside an object (key)
                r#"let classes = { '{}': true };"#,
                // Inside an object (no spaces, key)
                r#"let classes = {'{}':true};"#,
                // Inside an object (value)
                r#"let classes = { primary: '{}' };"#,
                // Inside an object (no spaces, value)
                r#"let classes = {primary:'{}'};"#,
            ] {
                let input = wrapper.replace("{}", input);
                let actual = ArbitraryPropertyMachine::<IdleState>::test_extract_all(&input);

                if actual != expected {
                    dbg!(&input);
                }
                assert_eq!(actual, expected);
            }
        }
    }

    #[test]
    fn test_exceptions() {
        for (input, expected) in [
            // JS string interpolation
            // In key
            ("[${x}:value]", vec![]),
            // As part of the key
            ("[background-${property}:value]", vec![]),
            // In value
            ("[key:${x}]", vec![]),
            // As part of the value
            ("[key:value-${x}]", vec![]),
            // Allowed in strings
            ("[--img:url('${x}')]", vec!["[--img:url('${x}')]"]),
        ] {
            assert_eq!(
                ArbitraryPropertyMachine::<IdleState>::test_extract_all(input),
                expected
            );
        }
    }
}
