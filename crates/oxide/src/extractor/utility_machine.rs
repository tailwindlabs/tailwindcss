use crate::cursor;
use crate::extractor::arbitrary_property_machine::ArbitraryPropertyMachine;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::modifier_machine::ModifierMachine;
use crate::extractor::named_utility_machine::NamedUtilityMachine;
use classification_macros::ClassifyBytes;

#[derive(Debug, Default)]
pub struct UtilityMachine {
    /// Start position of the utility
    start_pos: usize,

    /// Whether the legacy important marker `!` was used
    legacy_important: bool,

    arbitrary_property_machine: ArbitraryPropertyMachine,
    named_utility_machine: NamedUtilityMachine,
    modifier_machine: ModifierMachine,
}

impl Machine for UtilityMachine {
    #[inline(always)]
    fn reset(&mut self) {
        self.start_pos = 0;
        self.legacy_important = false;
    }

    #[inline]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match cursor.curr.into() {
            // LEGACY: Important marker
            Class::Exclamation => {
                self.legacy_important = true;

                match cursor.next.into() {
                    // Start of an arbitrary property
                    //
                    // E.g.: `![color:red]`
                    //        ^
                    Class::OpenBracket => {
                        self.start_pos = cursor.pos;
                        cursor.advance();
                        self.parse_arbitrary_property(cursor)
                    }

                    // Start of a named utility
                    //
                    // E.g.: `!flex`
                    //        ^
                    _ => {
                        self.start_pos = cursor.pos;
                        cursor.advance();
                        self.parse_named_utility(cursor)
                    }
                }
            }

            // Start of an arbitrary property
            //
            // E.g.: `[color:red]`
            //        ^
            Class::OpenBracket => {
                self.start_pos = cursor.pos;
                self.parse_arbitrary_property(cursor)
            }

            // Everything else might be a named utility. Delegate to the named utility machine
            // to determine if it's a named utility or not.
            _ => {
                self.start_pos = cursor.pos;
                self.parse_named_utility(cursor)
            }
        }
    }
}

impl UtilityMachine {
    fn parse_arbitrary_property(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match self.arbitrary_property_machine.next(cursor) {
            MachineState::Idle => self.restart(),
            MachineState::Done(_) => match cursor.next.into() {
                // End of arbitrary property, but there is a potential modifier.
                //
                // E.g.: `[color:#0088cc]/`
                //                       ^
                Class::Slash => {
                    cursor.advance();
                    self.parse_modifier(cursor)
                }

                // End of arbitrary property, but there is an `!`.
                //
                // E.g.: `[color:#0088cc]!`
                //                       ^
                Class::Exclamation => {
                    cursor.advance();
                    self.parse_important(cursor)
                }

                // End of arbitrary property
                //
                // E.g.: `[color:#0088cc]`
                //                      ^
                _ => self.done(self.start_pos, cursor),
            },
        }
    }

    fn parse_named_utility(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match self.named_utility_machine.next(cursor) {
            MachineState::Idle => self.restart(),
            MachineState::Done(_) => match cursor.next.into() {
                // End of a named utility, but there is a potential modifier.
                //
                // E.g.: `bg-red-500/`
                //                  ^
                Class::Slash => {
                    cursor.advance();
                    self.parse_modifier(cursor)
                }

                // End of named utility, but there is an `!`.
                //
                // E.g.: `bg-red-500!`
                //                  ^
                Class::Exclamation => {
                    cursor.advance();
                    self.parse_important(cursor)
                }

                // End of a named utility
                //
                // E.g.: `bg-red-500`
                //                 ^
                _ => self.done(self.start_pos, cursor),
            },
        }
    }

    fn parse_modifier(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match self.modifier_machine.next(cursor) {
            MachineState::Idle => self.restart(),
            MachineState::Done(_) => match cursor.next.into() {
                // A modifier followed by a modifier is invalid
                Class::Slash => self.restart(),

                // A modifier followed by the important marker `!`
                Class::Exclamation => {
                    cursor.advance();
                    self.parse_important(cursor)
                }

                // Everything else is valid
                _ => self.done(self.start_pos, cursor),
            },
        }
    }

    fn parse_important(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        // Only the `!` is valid if we didn't start with `!`
        //
        // E.g.:
        //
        // ```
        // !bg-red-500!
        //            ^ invalid because of the first `!`
        // ```
        if self.legacy_important {
            return self.restart();
        }

        self.done(self.start_pos, cursor)
    }
}

#[derive(Debug, Clone, Copy, ClassifyBytes)]
enum Class {
    #[bytes(b'!')]
    Exclamation,

    #[bytes(b'[')]
    OpenBracket,

    #[bytes(b'/')]
    Slash,

    #[fallback]
    Other,
}

#[cfg(test)]
mod tests {
    use super::UtilityMachine;
    use crate::extractor::machine::Machine;
    use pretty_assertions::assert_eq;

    #[test]
    #[ignore]
    fn test_utility_machine_performance() {
        let input = r#"<button type="button" class="absolute -top-1 -left-1.5 flex items-center justify-center p-1.5 text-gray-400">"#.repeat(100);

        UtilityMachine::test_throughput(100_000, &input);
        UtilityMachine::test_duration_once(&input);

        todo!()
    }

    #[test]
    fn test_utility_extraction() {
        for (input, expected) in [
            // Simple utility
            ("flex", vec!["flex"]),
            // Simple utility with special character(s)
            ("@container", vec!["@container"]),
            // Single character utility
            ("a", vec!["a"]),
            // Important utilities
            ("!flex", vec!["!flex"]),
            ("flex!", vec!["flex!"]),
            ("flex! block", vec!["flex!", "block"]),
            // With dashes
            ("items-center", vec!["items-center"]),
            ("items--center", vec!["items--center"]),
            // Inside a string
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
            // Arbitrary value with bracket notation
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
            // --------------------------------------------------------

            // Exceptions:
            ("bg-red-500/20/20", vec![]),
            ("bg-[#0088cc]/20/20", vec![]),
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

                let mut actual = UtilityMachine::test_extract_all(&input);
                actual.sort();

                if actual != expected {
                    dbg!(&input);
                }
                assert_eq!(actual, expected);
            }
        }
    }
}
