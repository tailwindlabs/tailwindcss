use crate::cursor;
use crate::extractor::boundary::{has_valid_boundaries, is_valid_before_boundary};
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::utility_machine::UtilityMachine;
use crate::extractor::variant_machine::VariantMachine;
use crate::extractor::Span;

/// Extract full candidates including variants and utilities.
#[derive(Debug, Default)]
pub struct CandidateMachine {
    /// Start position of the candidate
    start_pos: usize,

    /// End position of the last variant (if any)
    last_variant_end_pos: Option<usize>,

    utility_machine: UtilityMachine,
    variant_machine: VariantMachine,
}

impl Machine for CandidateMachine {
    #[inline(always)]
    fn reset(&mut self) {
        self.start_pos = 0;
        self.last_variant_end_pos = None;
    }

    #[inline]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        let len = cursor.input.len();

        while cursor.pos < len {
            // Skip ahead for known characters that will never be part of a candidate. No need to
            // run any sub-machines.
            if cursor.curr.is_ascii_whitespace() {
                self.reset();
                cursor.advance();
                continue;
            }

            // Candidates don't start with these characters, so we can skip ahead.
            if matches!(cursor.curr, b':' | b'"' | b'\'' | b'`') {
                self.reset();
                cursor.advance();
                continue;
            }

            // Jump ahead if the character is known to be an invalid boundary and we should start
            // at the next boundary even though "valid" candidates can exist.
            //
            // E.g.: `<div class="">`
            //         ^^^            Valid candidate
            //        ^               But this character makes it invalid
            //             ^          Therefore we jump here
            //
            // E.g.: `Some Class`
            //        ^    ^       Invalid, we can jump ahead to the next boundary
            //
            if matches!(cursor.curr, b'<' | b'A'..=b'Z') {
                if let Some(offset) = cursor.input[cursor.pos..]
                    .iter()
                    .position(|&c| is_valid_before_boundary(&c))
                {
                    self.reset();
                    cursor.advance_by(offset + 1);
                } else {
                    return self.restart();
                }

                continue;
            }

            let mut variant_cursor = cursor.clone();
            let variant_machine_state = self.variant_machine.next(&mut variant_cursor);

            let mut utility_cursor = cursor.clone();
            let utility_machine_state = self.utility_machine.next(&mut utility_cursor);

            match (variant_machine_state, utility_machine_state) {
                // No variant, but the utility machine completed
                (MachineState::Idle, MachineState::Done(utility_span)) => {
                    cursor.move_to(utility_cursor.pos + 1);

                    let span = match self.last_variant_end_pos {
                        Some(end_pos) => {
                            // Verify that the utility is touching the last variant
                            if end_pos + 1 != utility_span.start {
                                return self.restart();
                            }

                            Span::new(self.start_pos, utility_span.end)
                        }
                        None => utility_span,
                    };

                    // Ensure the span has valid boundary characters before and after
                    if !has_valid_boundaries(&span, cursor.input) {
                        return self.restart();
                    }

                    return self.done_span(span);
                }

                // Both variant and utility machines are done
                // E.g.: `hover:flex`
                //        ^^^^^^      Variant
                //        ^^^^^       Utility
                //
                (MachineState::Done(variant_span), MachineState::Done(utility_span)) => {
                    cursor.move_to(variant_cursor.pos + 1);

                    if let Some(end_pos) = self.last_variant_end_pos {
                        // Verify variant is touching the last variant
                        if end_pos + 1 != variant_span.start {
                            return self.restart();
                        }
                    } else {
                        // We know that there is no variant before this one.
                        //
                        // Edge case: JavaScript keys should be considered utilities if they are
                        // not preceded by another variant, and followed by any kind of whitespace
                        // or the end of the line.
                        //
                        // E.g.: `{ underline: true }`
                        //          ^^^^^^^^^^        Variant
                        //          ^^^^^^^^^         Utility (followed by `: `)
                        let after = cursor.input.get(utility_span.end + 2).unwrap_or(&b'\0');
                        if after.is_ascii_whitespace() || *after == b'\0' {
                            cursor.move_to(utility_cursor.pos + 2);
                            return self.done_span(utility_span);
                        }

                        self.start_pos = variant_span.start;
                    }

                    self.last_variant_end_pos = Some(variant_cursor.pos);
                }

                // Variant is done, utility is invalid
                (MachineState::Done(variant_span), MachineState::Idle) => {
                    cursor.move_to(variant_cursor.pos + 1);

                    if let Some(end_pos) = self.last_variant_end_pos {
                        if end_pos + 1 > variant_span.start {
                            self.reset();
                            return MachineState::Idle;
                        }
                    } else {
                        self.start_pos = variant_span.start;
                    }

                    self.last_variant_end_pos = Some(variant_cursor.pos);
                }

                (MachineState::Idle, MachineState::Idle) => {
                    // Skip main cursor to the next character after both machines. We already know
                    // there is no candidate here.
                    if variant_cursor.pos > cursor.pos || utility_cursor.pos > cursor.pos {
                        cursor.move_to(variant_cursor.pos.max(utility_cursor.pos));
                    }

                    self.reset();
                    cursor.advance();
                }
            }
        }

        MachineState::Idle
    }
}

impl CandidateMachine {
    #[inline(always)]
    fn done_span(&mut self, span: Span) -> MachineState {
        self.reset();
        MachineState::Done(span)
    }
}

#[cfg(test)]
mod tests {
    use super::CandidateMachine;
    use crate::extractor::machine::Machine;
    use pretty_assertions::assert_eq;

    #[test]
    #[ignore]
    fn test_candidate_machine_performance() {
        let n = 10_000;
        let input = include_str!("../fixtures/example.html");
        // let input = &r#"<button type="button" class="absolute -top-1 -left-1.5 flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">"#.repeat(100);

        CandidateMachine::test_throughput(n, input);
        CandidateMachine::test_duration_once(input);
        CandidateMachine::test_duration_n(n, input);

        todo!()
    }

    #[test]
    fn test_candidate_extraction() {
        for (input, expected) in [
            // Simple utility
            ("flex", vec!["flex"]),
            // Simple utility with special character(s)
            ("@container", vec!["@container"]),
            // Single character utility
            ("a", vec!["a"]),
            // Simple utility with dashes
            ("items-center", vec!["items-center"]),
            // Simple utility with numbers
            ("px-2.5", vec!["px-2.5"]),
            // Simple variant with simple utility
            ("hover:flex", vec!["hover:flex"]),
            // Arbitrary properties
            ("[color:red]", vec!["[color:red]"]),
            ("![color:red]", vec!["![color:red]"]),
            ("[color:red]!", vec!["[color:red]!"]),
            ("[color:red]/20", vec!["[color:red]/20"]),
            ("![color:red]/20", vec!["![color:red]/20"]),
            ("[color:red]/20!", vec!["[color:red]/20!"]),
            // With multiple variants
            ("hover:focus:flex", vec!["hover:focus:flex"]),
            // Exceptions:
            //
            // Keys inside of a JS object could be a variant-less candidate. Vue example.
            ("{ underline: true }", vec!["underline", "true"]),
            // With complex variants
            (
                "[&>[data-slot=icon]:last-child]:right-2.5",
                vec!["[&>[data-slot=icon]:last-child]:right-2.5"],
            ),
            // With multiple (complex) variants
            (
                "[&>[data-slot=icon]:last-child]:sm:right-2.5",
                vec!["[&>[data-slot=icon]:last-child]:sm:right-2.5"],
            ),
            (
                "sm:[&>[data-slot=icon]:last-child]:right-2.5",
                vec!["sm:[&>[data-slot=icon]:last-child]:right-2.5"],
            ),
            // Exceptions regarding boundaries
            //
            // `flex!` is valid, but since it's followed by a non-boundary character it's invalid.
            // `block` is therefore also invalid because it didn't start after a boundary.
            ("flex!block", vec![]),
        ] {
            for (wrapper, additional) in [
                // No wrapper
                ("{}", vec![]),
                // With leading spaces
                (" {}", vec![]),
                ("  {}", vec![]),
                ("   {}", vec![]),
                // With trailing spaces
                ("{} ", vec![]),
                ("{}  ", vec![]),
                ("{}   ", vec![]),
                // Surrounded by spaces
                (" {} ", vec![]),
                // Inside a string
                ("'{}'", vec![]),
                // Inside a function call
                ("fn('{}')", vec![]),
                // Inside nested function calls
                ("fn1(fn2('{}'))", vec![]),
                // --------------------------
                //
                // HTML
                // Inside a class (on its own)
                (r#"<div class="{}"></div>"#, vec!["class"]),
                // Inside a class (first)
                (r#"<div class="{} foo"></div>"#, vec!["class", "foo"]),
                // Inside a class (second)
                (r#"<div class="foo {}"></div>"#, vec!["class", "foo"]),
                // Inside a class (surrounded)
                (
                    r#"<div class="foo {} bar"></div>"#,
                    vec!["class", "foo", "bar"],
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
                (r#"let classes = {primary:'{}'};"#, vec!["let", "classes"]),
            ] {
                let input = wrapper.replace("{}", input);

                let mut expected = expected.clone();
                expected.extend(additional);
                expected.sort();

                let mut actual = CandidateMachine::test_extract_all(&input);
                actual.sort();

                if actual != expected {
                    dbg!(&input);
                }

                assert_eq!(actual, expected);
            }
        }
    }

    #[test]
    fn do_not_consider_svg_path_commands() {
        for input in [
            r#"<path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>"#,
            r#"<path d="0h2m-2"/>"#,
        ] {
            assert_eq!(
                CandidateMachine::test_extract_all(input),
                Vec::<&str>::new()
            );
        }
    }

    #[test]
    fn test_js_interpolation() {
        for (input, expected) in [
            // Utilities
            // Arbitrary value
            ("bg-[${color}]", vec![]),
            // Arbitrary property
            ("[color:${value}]", vec![]),
            ("[${key}:value]", vec![]),
            ("[${key}:${value}]", vec![]),
            // Arbitrary property for CSS variables
            ("[--color:${value}]", vec![]),
            ("[--color-${name}:value]", vec![]),
            // Arbitrary variable
            ("bg-(--my-${name})", vec![]),
            ("bg-(--my-variable,${fallback})", vec![]),
            (
                "bg-(--my-image,url('https://example.com?q=${value}'))",
                vec!["bg-(--my-image,url('https://example.com?q=${value}'))"],
            ),
            // Variants
            ("data-[state=${state}]:flex", vec![]),
            ("support-(--my-${value}):flex", vec![]),
            ("support-(--my-variable,${fallback}):flex", vec![]),
            ("[@media(width>=${value})]:flex", vec![]),
        ] {
            assert_eq!(CandidateMachine::test_extract_all(input), expected);
        }
    }
}
