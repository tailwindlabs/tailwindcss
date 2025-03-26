use crate::cursor;
use crate::extractor::arbitrary_value_machine::ArbitraryValueMachine;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::named_variant_machine::NamedVariantMachine;
use classification_macros::ClassifyBytes;

#[derive(Debug, Default)]
pub struct VariantMachine {
    arbitrary_value_machine: ArbitraryValueMachine,
    named_variant_machine: NamedVariantMachine,
}

impl Machine for VariantMachine {
    #[inline(always)]
    fn reset(&mut self) {}

    #[inline]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        match cursor.curr.into() {
            // Start of an arbitrary variant
            //
            // E.g.: `[&:hover]:`
            //        ^
            Class::OpenBracket => {
                let start_pos = cursor.pos;
                match self.arbitrary_value_machine.next(cursor) {
                    MachineState::Idle => self.restart(),
                    MachineState::Done(_) => self.parse_arbitrary_end(start_pos, cursor),
                }
            }

            // Start of a named variant
            _ => {
                let start_pos = cursor.pos;
                match self.named_variant_machine.next(cursor) {
                    MachineState::Idle => self.restart(),
                    MachineState::Done(_) => self.done(start_pos, cursor),
                }
            }
        }
    }
}

impl VariantMachine {
    #[inline(always)]
    fn parse_arbitrary_end(
        &mut self,
        start_pos: usize,
        cursor: &mut cursor::Cursor<'_>,
    ) -> MachineState {
        match cursor.next.into() {
            // End of an arbitrary value, must be followed by a `:`
            //
            // E.g.: `[&:hover]:`
            //                 ^
            Class::Colon => {
                cursor.advance();
                self.done(start_pos, cursor)
            }

            // Everything else is invalid
            _ => self.restart(),
        }
    }
}

#[derive(Debug, Clone, Copy, ClassifyBytes)]
enum Class {
    #[bytes(b'[')]
    OpenBracket,

    #[bytes(b':')]
    Colon,

    #[fallback]
    Other,
}

#[cfg(test)]
mod tests {
    use super::VariantMachine;
    use crate::extractor::machine::Machine;
    use pretty_assertions::assert_eq;

    #[test]
    #[ignore]
    fn test_variant_machine_performance() {
        let input = r#"<button class="hover:focus:flex data-[state=pending]:[&.in-progress]:flex supports-(--my-variable):flex group-hover/named:not-has-peer-data-disabled:flex">"#;

        VariantMachine::test_throughput(100_000, input);
        VariantMachine::test_duration_once(input);

        todo!()
    }

    #[test]
    fn test_variant_extraction() {
        for (input, expected) in [
            // Simple variant
            ("hover:flex", vec!["hover:"]),
            // Single character variant
            ("a:flex", vec!["a:"]),
            ("*:flex", vec!["*:"]),
            // With special characters
            ("**:flex", vec!["**:"]),
            // With dashes
            ("data-disabled:flex", vec!["data-disabled:"]),
            // Multiple variants
            ("hover:focus:flex", vec!["hover:", "focus:"]),
            // Arbitrary variant
            ("[&:hover:focus]:flex", vec!["[&:hover:focus]:"]),
            // Arbitrary variant with nested brackets
            (
                "[&>[data-slot=icon]:last-child]:",
                vec!["[&>[data-slot=icon]:last-child]:"],
            ),
            (
                "sm:[&>[data-slot=icon]:last-child]:",
                vec!["sm:", "[&>[data-slot=icon]:last-child]:"],
            ),
            (
                "[:is(italic):is(underline)]:",
                vec!["[:is(italic):is(underline)]:"],
            ),
            // Modifiers
            ("group-hover/foo:flex", vec!["group-hover/foo:"]),
            ("group-hover/[.parent]:flex", vec!["group-hover/[.parent]:"]),
            // Arbitrary variant with bracket notation
            ("data-[state=pending]:flex", vec!["data-[state=pending]:"]),
            // Arbitrary variant with CSS property shorthand
            ("supports-(--my-color):flex", vec!["supports-(--my-color):"]),
            // -------------------------------------------------------------

            // Exceptions
            // Empty arbitrary variant is not allowed
            ("[]:flex", vec![]),
            // Named variant must be followed by `:`
            ("hover", vec![]),
            // Modifier cannot be followed by another modifier. However, we don't check boundary
            // characters in this state machine so we will get `bar:`.
            ("group-hover/foo/bar:flex", vec!["bar:"]),
        ] {
            assert_eq!(VariantMachine::test_extract_all(input), expected);
        }
    }
}
