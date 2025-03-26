use crate::cursor;
use crate::extractor::arbitrary_value_machine::ArbitraryValueMachine;
use crate::extractor::arbitrary_variable_machine::ArbitraryVariableMachine;
use crate::extractor::boundary::is_valid_after_boundary;
use crate::extractor::machine::{Machine, MachineState};
use classification_macros::ClassifyBytes;
use std::marker::PhantomData;

#[derive(Debug, Default)]
pub struct IdleState;

#[derive(Debug, Default)]
pub struct ParsingState;

/// Extracts named utilities from an input.
///
/// E.g.:
///
/// ```text
/// flex
/// ^^^^
///
/// bg-red-500
/// ^^^^^^^^^^
/// ```
#[derive(Debug, Default)]
pub struct NamedUtilityMachine<State = IdleState> {
    /// Start position of the utility
    start_pos: usize,

    arbitrary_variable_machine: ArbitraryVariableMachine,
    arbitrary_value_machine: ArbitraryValueMachine,

    _state: PhantomData<State>,
}

impl<State> NamedUtilityMachine<State> {
    #[inline(always)]
    fn transition<NextState>(&self) -> NamedUtilityMachine<NextState> {
        NamedUtilityMachine {
            start_pos: self.start_pos,
            arbitrary_variable_machine: Default::default(),
            arbitrary_value_machine: Default::default(),
            _state: PhantomData,
        }
    }
}

impl Machine for NamedUtilityMachine<IdleState> {
    #[inline(always)]
    fn reset(&mut self) {}

    #[inline]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match cursor.curr.into() {
            Class::AlphaLower => match cursor.next.into() {
                // Valid single character utility in between quotes
                //
                // E.g.: `<div class="a"></div>`
                //                    ^
                // E.g.: `<div class="a "></div>`
                //                    ^
                // E.g.: `<div class=" a"></div>`
                //                     ^
                Class::Whitespace | Class::Quote | Class::End => self.done(cursor.pos, cursor),

                // Valid start characters
                //
                // E.g.: `flex`
                //        ^
                _ => {
                    self.start_pos = cursor.pos;
                    cursor.advance();
                    self.transition::<ParsingState>().next(cursor)
                }
            },

            // Valid start characters
            //
            // E.g.: `@container`
            //        ^
            Class::At => {
                self.start_pos = cursor.pos;
                cursor.advance();
                self.transition::<ParsingState>().next(cursor)
            }

            // Valid start of a negative utility, if followed by another set of valid
            // characters. `@` as a second character is invalid.
            //
            // E.g.: `-mx-2.5`
            //        ^^
            Class::Dash => match cursor.next.into() {
                Class::AlphaLower => {
                    self.start_pos = cursor.pos;
                    cursor.advance();
                    self.transition::<ParsingState>().next(cursor)
                }

                // A dash should not be followed by anything else
                _ => MachineState::Idle,
            },

            // Everything else, is not a valid start of the utility.
            _ => MachineState::Idle,
        }
    }
}

impl Machine for NamedUtilityMachine<ParsingState> {
    #[inline(always)]
    fn reset(&mut self) {
        self.start_pos = 0;
    }

    #[inline]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        let len = cursor.input.len();

        while cursor.pos < len {
            match cursor.curr.into() {
                // Followed by a boundary character, we are at the end of the utility.
                //
                // E.g.: `'flex'`
                //             ^
                // E.g.: `<div class="flex items-center">`
                //                        ^
                // E.g.: `[flex]` (Angular syntax)
                //             ^
                // E.g.: `[class.flex.items-center]` (Angular syntax)
                //                   ^
                // E.g.: `:div="{ flex: true }"` (JavaScript object syntax)
                //                    ^
                Class::AlphaLower | Class::AlphaUpper => {
                    if is_valid_after_boundary(&cursor.next) || {
                        // Or any of these characters
                        //
                        // - `:`, because of JS object keys
                        // - `/`, because of modifiers
                        // - `!`, because of important
                        matches!(
                            cursor.next.into(),
                            Class::Colon | Class::Slash | Class::Exclamation
                        )
                    } {
                        return self.done(self.start_pos, cursor);
                    }

                    // Still valid characters
                    cursor.advance()
                }

                Class::Dash => match cursor.next.into() {
                    // Start of an arbitrary value
                    //
                    // E.g.: `bg-[#0088cc]`
                    //          ^^
                    Class::OpenBracket => {
                        cursor.advance();
                        return match self.arbitrary_value_machine.next(cursor) {
                            MachineState::Idle => self.restart(),
                            MachineState::Done(_) => self.done(self.start_pos, cursor),
                        };
                    }

                    // Start of an arbitrary variable
                    //
                    // E.g.: `bg-(--my-color)`
                    //          ^^
                    Class::OpenParen => {
                        cursor.advance();
                        return match self.arbitrary_variable_machine.next(cursor) {
                            MachineState::Idle => self.restart(),
                            MachineState::Done(_) => self.done(self.start_pos, cursor),
                        };
                    }

                    // A dash is a valid character if it is followed by another valid
                    // character.
                    //
                    // E.g.: `flex-`
                    //            ^    Invalid
                    // E.g.: `flex-!`
                    //            ^    Invalid
                    // E.g.: `flex-/`
                    //            ^    Invalid
                    // E.g.: `flex-2`
                    //            ^    Valid
                    // E.g.: `foo--bar`
                    //            ^    Valid
                    Class::AlphaLower | Class::AlphaUpper | Class::Number | Class::Dash => {
                        cursor.advance();
                    }

                    // Everything else is invalid
                    _ => return self.restart(),
                },

                Class::Underscore => match cursor.next.into() {
                    // Valid characters _if_ followed by another valid character. These characters are
                    // only valid inside of the utility but not at the end of the utility.
                    //
                    // E.g.: `custom_`
                    //              ^    Invalid
                    // E.g.: `custom_!`
                    //              ^    Invalid
                    // E.g.: `custom_/`
                    //              ^    Invalid
                    // E.g.: `custom_2`
                    //              ^    Valid
                    //
                    Class::AlphaLower | Class::AlphaUpper | Class::Number | Class::Underscore => {
                        cursor.advance();
                    }

                    // Followed by a boundary character, we are at the end of the utility.
                    //
                    // E.g.: `'flex'`
                    //             ^
                    // E.g.: `<div class="flex items-center">`
                    //                        ^
                    // E.g.: `[flex]` (Angular syntax)
                    //             ^
                    // E.g.: `[class.flex.items-center]` (Angular syntax)
                    //                   ^
                    // E.g.: `:div="{ flex: true }"` (JavaScript object syntax)
                    //                    ^
                    _ if is_valid_after_boundary(&cursor.next) || {
                        // Or any of these characters
                        //
                        // - `:`, because of JS object keys
                        // - `/`, because of modifiers
                        // - `!`, because of important
                        matches!(
                            cursor.next.into(),
                            Class::Colon | Class::Slash | Class::Exclamation
                        )
                    } =>
                    {
                        return self.done(self.start_pos, cursor)
                    }

                    // Everything else is invalid
                    _ => return self.restart(),
                },

                // A dot must be surrounded by numbers
                //
                // E.g.: `px-2.5`
                //           ^^^
                Class::Dot => {
                    if !matches!(cursor.prev.into(), Class::Number) {
                        return self.restart();
                    }

                    if !matches!(cursor.next.into(), Class::Number) {
                        return self.restart();
                    }

                    cursor.advance();
                }

                // A number must be preceded by a `-`, `.` or another alphanumeric
                // character, and can be followed by a `.` or an alphanumeric character or
                // dash or underscore.
                //
                // E.g.: `text-2xs`
                //            ^^
                //       `p-2.5`
                //           ^^
                //       `bg-red-500`
                //                ^^
                // It can also be followed by a %, but that will be considered the end of
                // the candidate.
                //
                // E.g.: `from-15%`
                //               ^
                //
                Class::Number => {
                    if !matches!(
                        cursor.prev.into(),
                        Class::Dash | Class::Dot | Class::Number | Class::AlphaLower
                    ) {
                        return self.restart();
                    }

                    if !matches!(
                        cursor.next.into(),
                        Class::Dot
                            | Class::Number
                            | Class::AlphaLower
                            | Class::AlphaUpper
                            | Class::Percent
                            | Class::Underscore
                            | Class::Dash
                    ) {
                        return self.done(self.start_pos, cursor);
                    }

                    cursor.advance();
                }

                // A percent sign must be preceded by a number.
                //
                // E.g.:
                //
                // ```
                // from-15%
                //       ^^
                // ```
                Class::Percent => {
                    if !matches!(cursor.prev.into(), Class::Number) {
                        return self.restart();
                    }

                    return self.done(self.start_pos, cursor);
                }

                // Everything else is invalid
                _ => return self.restart(),
            };
        }

        self.restart()
    }
}

#[derive(Clone, Copy, ClassifyBytes)]
enum Class {
    #[bytes_range(b'a'..=b'z')]
    AlphaLower,

    #[bytes_range(b'A'..=b'Z')]
    AlphaUpper,

    #[bytes(b'@')]
    At,

    #[bytes(b':')]
    Colon,

    #[bytes(b'-')]
    Dash,

    #[bytes(b'.')]
    Dot,

    #[bytes(b'\0')]
    End,

    #[bytes(b'!')]
    Exclamation,

    #[bytes_range(b'0'..=b'9')]
    Number,

    #[bytes(b'[')]
    OpenBracket,

    #[bytes(b']')]
    CloseBracket,

    #[bytes(b'(')]
    OpenParen,

    #[bytes(b'%')]
    Percent,

    #[bytes(b'"', b'\'', b'`')]
    Quote,

    #[bytes(b'/')]
    Slash,

    #[bytes(b'_')]
    Underscore,

    #[bytes(b' ', b'\t', b'\n', b'\r', b'\x0C')]
    Whitespace,

    #[fallback]
    Other,
}

#[cfg(test)]
mod tests {
    use super::{IdleState, NamedUtilityMachine};
    use crate::extractor::machine::Machine;
    use pretty_assertions::assert_eq;

    #[test]
    #[ignore]
    fn test_named_utility_machine_performance() {
        let input = r#"<button class="flex items-center px-2.5 -inset-x-2 bg-[#0088cc] text-(--my-color)">"#;

        NamedUtilityMachine::<IdleState>::test_throughput(1_000_000, input);
        NamedUtilityMachine::<IdleState>::test_duration_once(input);

        todo!()
    }

    #[test]
    fn test_named_utility_extraction() {
        for (input, expected) in [
            // Simple utility
            ("flex", vec!["flex"]),
            // Simple utility with special character(s)
            ("@container", vec!["@container"]),
            // Simple single-character utility
            ("a", vec!["a"]),
            // With dashes
            ("items-center", vec!["items-center"]),
            // With double dashes
            ("items--center", vec!["items--center"]),
            // With numbers
            ("px-5", vec!["px-5"]),
            ("px-2.5", vec!["px-2.5"]),
            // With number followed by dash or underscore
            ("text-title1-strong", vec!["text-title1-strong"]),
            ("text-title1_strong", vec!["text-title1_strong"]),
            // With trailing % sign
            ("from-15%", vec!["from-15%"]),
            // Arbitrary value with bracket notation
            ("bg-[#0088cc]", vec!["bg-[#0088cc]"]),
            // Arbitrary variable
            ("bg-(--my-color)", vec!["bg-(--my-color)"]),
            // Arbitrary variable with fallback
            ("bg-(--my-color,red,blue)", vec!["bg-(--my-color,red,blue)"]),
            // --------------------------------------------------------

            // Exceptions:
            // Arbitrary variable must be valid
            (r"bg-(--my-color\)", vec![]),
            (r"bg-(--my#color)", vec![]),
            // Single letter utility with uppercase letter is invalid
            ("A", vec![]),
            // A dot must be in-between numbers
            ("opacity-0.5", vec!["opacity-0.5"]),
            ("opacity-.5", vec![]),
            ("opacity-5.", vec![]),
            // A number must be preceded by a `-`, `.` or another number
            ("text-2xs", vec!["text-2xs"]),
            // Random invalid utilities
            ("-$", vec![]),
            ("-_", vec![]),
            ("-foo-", vec![]),
            ("foo-=", vec![]),
            ("foo-#", vec![]),
            ("foo-!", vec![]),
            ("foo-/20", vec![]),
            ("-", vec![]),
            ("--", vec![]),
            ("---", vec![]),
        ] {
            for (wrapper, additional) in [
                // No wrapper
                ("{}", vec![]),
                // With leading spaces
                (" {}", vec![]),
                // With trailing spaces
                ("{} ", vec![]),
                // Surrounded by spaces
                (" {} ", vec![]),
                // Inside a string
                ("'{}'", vec![]),
                // Inside a function call
                ("fn('{}')", vec![]),
                // Inside nested function calls
                ("fn1(fn2('{}'))", vec!["fn1", "fn2"]),
                // --------------------------
                //
                // HTML
                // Inside a class (on its own)
                (r#"<div class="{}"></div>"#, vec!["div", "class"]),
                // Inside a class (first)
                (r#"<div class="{} foo"></div>"#, vec!["div", "class", "foo"]),
                // Inside a class (second)
                (r#"<div class="foo {}"></div>"#, vec!["div", "class", "foo"]),
                // Inside a class (surrounded)
                (
                    r#"<div class="foo {} bar"></div>"#,
                    vec!["div", "class", "foo", "bar"],
                ),
                // --------------------------
                //
                // JavaScript
                // Inside a variable
                (r#"let classes = '{}';"#, vec!["let", "classes"]),
                // Inside an object (key)
                (
                    r#"let classes = { '{}': true };"#,
                    vec!["let", "classes", "true"],
                ),
                // Inside an object (no spaces, key)
                (r#"let classes = {'{}':true};"#, vec!["let", "classes"]),
                // Inside an object (value)
                (
                    r#"let classes = { primary: '{}' };"#,
                    vec!["let", "classes", "primary"],
                ),
                // Inside an object (no spaces, value)
                (
                    r#"let classes = {primary:'{}'};"#,
                    vec!["let", "classes", "primary"],
                ),
                // Inside an array
                (r#"let classes = ['{}'];"#, vec!["let", "classes"]),
            ] {
                let input = wrapper.replace("{}", input);

                let mut expected = expected.clone();
                expected.extend(additional);
                expected.sort();

                let mut actual = NamedUtilityMachine::<IdleState>::test_extract_all(&input);
                actual.sort();

                if actual != expected {
                    dbg!(&input);
                }
                assert_eq!(actual, expected);
            }
        }
    }
}
