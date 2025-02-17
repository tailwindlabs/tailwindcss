use crate::cursor;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::utility_machine::UtilityMachine;
use crate::extractor::variant_machine::VariantMachine;
use crate::extractor::Span;

#[derive(Debug, Default)]
pub(crate) struct CandidateMachine {
    /// Start position of the candidate
    start_pos: usize,

    /// End position of the last variant
    last_variant_end_pos: Option<usize>,

    /// Current state of the machine
    state: State,

    utility_machine: UtilityMachine,
    variant_machine: VariantMachine,
}

#[derive(Debug, Default)]
enum State {
    #[default]
    Idle,

    /// Parsing a candidate
    Parsing,

    /// Wait until we're at a valid boundary for new candidates.
    ResumeAtBoundary,
}

impl Machine for CandidateMachine {
    fn next(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState {
        match self.state {
            State::Idle => match (cursor.curr, cursor.next) {
                // Candidates don't start with `--`, skip ahead
                //
                // E.g.: `--my-color`
                //        ^^
                (b'-', b'-') => self.resume_at_boundary(),

                // Candidates don't start with `<`, skip ahead
                //
                // E.g.: `<div`
                //        ^
                (b'<', _) => self.resume_at_boundary(),

                // Candidates don't start with `/`, skip ahead
                //
                // E.g.: `</div`
                //         ^
                (b'/', _) => self.resume_at_boundary(),

                // Anything else is probably valid
                _ => {
                    let variant_machine_state = self.variant_machine.next(cursor);
                    let utility_machine_state = self.utility_machine.next(cursor);

                    match (variant_machine_state, utility_machine_state) {
                        // Completed with a single character utility
                        (_, MachineState::Done(span)) => self.done(span.start, cursor),

                        // At least one machine is parsing
                        (MachineState::Parsing, _) | (_, MachineState::Parsing) => {
                            self.start_parsing(cursor.pos)
                        }

                        // None of the machines are parsing
                        _ => MachineState::Idle,
                    }
                }
            },

            State::Parsing => {
                let variant_machine_state = self.variant_machine.next(cursor);
                let utility_machine_state = self.utility_machine.next(cursor);

                match (variant_machine_state, utility_machine_state) {
                    // Both machines are idle, continue at the next valid candidate boundary
                    (MachineState::Idle, MachineState::Idle) => self.restart(),

                    // Both machines are still parsing, keep parsing
                    (MachineState::Parsing, MachineState::Parsing) => MachineState::Parsing,

                    // Variant machine is done, track the current variant and re-start both
                    // machines to track the next variant (or utility).
                    //
                    // Utilities never end in `:`, variants _have_ to end in `:`. The state of the
                    // utility machine should not matter in this case.
                    (MachineState::Done(span), _) => {
                        // If a variant is followed by another variant, they must be touching.
                        if let Some(end_pos) = self.last_variant_end_pos {
                            if end_pos + 1 > span.start {
                                return self.resume_at_boundary();
                            }
                        }

                        self.last_variant_end_pos = Some(cursor.pos);
                        self.variant_machine.reset();
                        self.utility_machine.reset();
                        MachineState::Parsing
                    }

                    // Utility machine is done, but if the next character is a `:`, then it's
                    // probably a variant instead. Restart the utility machine. If it's not a
                    // variant, then the utility will be invalid anyway because it's not followed
                    // by `:`.
                    (MachineState::Parsing, MachineState::Done(_)) if cursor.next == b':' => {
                        // There is an edge case where a utility followed by a `:` could be a valid
                        // candidate _if_ there are no variants known so far.
                        //
                        // This can happen in JavaScript objects for example, E.g.:
                        //
                        // ```
                        // { underline: true }
                        //   ^^^^^^^^^
                        // ```
                        //
                        // Unfortunately this means that we have to peek ahead again to see if
                        // there is any whitespace.

                        match (self.last_variant_end_pos, cursor.input.get(cursor.pos + 2)) {
                            (None, Some(x)) if x.is_ascii_whitespace() => {
                                self.done(self.start_pos, cursor)
                            }
                            _ => {
                                self.utility_machine.reset();
                                MachineState::Parsing
                            }
                        }
                    }

                    (MachineState::Parsing, MachineState::Done(span)) => {
                        // MachineState::Parsing
                        // TODO: Ensure the variant is parsing but incomplete
                        //
                        match self.last_variant_end_pos {
                            // There's a variant, but the variant and utility are not touching.
                            Some(end_pos) if end_pos + 1 > span.start => {
                                self.done(span.start, cursor)
                            }

                            // There's a variant, and the variant and utility are touching.
                            Some(_) => self.done(self.start_pos, cursor),

                            // There's no variant, and the utility is done.
                            None => self.done(span.start, cursor),
                        }
                    }

                    // Variant machine is done (but it's guaranteed to not be a variant), as long
                    // as the utility machine is still parsing, we're good.
                    (MachineState::Idle, MachineState::Parsing) => MachineState::Parsing,

                    // Variant machine is still parsing, but the utility machine is done (and
                    // guaranteed to not be a utility). Keep parsing the variant.
                    (MachineState::Parsing, MachineState::Idle) => MachineState::Parsing,

                    // Utility machine is done, and it's not going to be a variant. Candidate
                    // cannot be followed by any of these characters:
                    //
                    // E.g.:
                    //
                    // ```
                    // flex/
                    //     ^
                    // flex!!
                    //      ^
                    // flex=
                    //     ^
                    //  …
                    // ```
                    (_, MachineState::Done(_))
                        if matches!(
                            cursor.next,
                            b'/' | b'!' | b'=' | b'#' | b'-' | b'[' | b'(' | b':'
                        ) =>
                    {
                        self.resume_at_boundary()
                    }

                    // Utility machine is done, and it's not going to be a variant. Candidate is
                    // guaranteed to not be followed by disallowed characters:
                    (MachineState::Idle, MachineState::Done(span)) => {
                        match self.last_variant_end_pos {
                            // There's a variant, but the variant and utility are not touching.
                            // Ignore the variant and complete with the utility only.
                            Some(end_pos) if end_pos + 1 > span.start => {
                                self.done(span.start, cursor)
                            }

                            // There's a variant, and the variant and utility are touching.
                            Some(_) => self.done(self.start_pos, cursor),

                            // There's no variant, and the utility is done.
                            None => self.done(span.start, cursor),
                        }
                    }
                }
            }

            State::ResumeAtBoundary => {
                // Only interested in new candidates if we're at a valid boundary for new
                // candidates.
                //
                // E.g.: `foo bar`
                //           ^
                // E.g.: `class=flex`
                //             ^
                if self.is_boundary_character(cursor.curr) {
                    self.reset();
                }

                MachineState::Idle
            }
        }
    }

    #[inline(always)]
    fn done(&mut self, start: usize, cursor: &cursor::Cursor<'_>) -> MachineState {
        self.resume_at_boundary();
        MachineState::Done(Span::new(start, cursor.pos))
    }
}

impl CandidateMachine {
    #[inline(always)]
    fn start_parsing(&mut self, start_pos: usize) -> MachineState {
        self.start_pos = start_pos;
        self.state = State::Parsing;
        MachineState::Parsing
    }

    #[inline(always)]
    fn resume_at_boundary(&mut self) -> MachineState {
        self.reset();
        self.state = State::ResumeAtBoundary;
        MachineState::Idle
    }

    #[inline(always)]
    fn is_boundary_character(&self, c: u8) -> bool {
        c.is_ascii_whitespace() || matches!(c, b'"' | b'\'' | b'`' | b'=')
    }
}

#[cfg(test)]
mod tests {
    use super::CandidateMachine;
    use crate::cursor::Cursor;
    use crate::extractor::machine::{Machine, MachineState};

    #[test]
    fn test_candidate_extraction() {
        for (input, expected) in [
            ////       // Simple utility
            ////       ("flex", vec!["flex"]),
            ////       // Single character utility
            ////       ("a", vec!["a"]),
            ////       // Simple utility with dashes
            ////       ("items-center", vec!["items-center"]),
            ////       // Simple utility with numbers
            ////       ("px-2.5", vec!["px-2.5"]),
            ////       // Simple variant with simple utility
            ////       ("hover:flex", vec!["hover:flex"]),
            ////       // Arbitrary properties
            ////       ("[color:red]", vec!["[color:red]"]),
            ////       ("![color:red]", vec!["![color:red]"]),
            ////       ("[color:red]!", vec!["[color:red]!"]),
            ////       ("[color:red]/20", vec!["[color:red]/20"]),
            ////       ("![color:red]/20", vec!["![color:red]/20"]),
            ////       ("[color:red]/20!", vec!["[color:red]/20!"]),
            ////       // With multiple variants
            ////       ("hover:focus:flex", vec!["hover:focus:flex"]),
            ////       // With complex variants
            ////       (
            ////           "[&>[data-slot=icon]:last-child]:right-2.5",
            ////           vec![
            ////               "icon",
            ////               "last-child",
            ////               "[&>[data-slot=icon]:last-child]:right-2.5",
            ////           ],
            ////       ),
            ////       // With multiple (complex) variants
            ////       (
            ////           "[&>[data-slot=icon]:last-child]:sm:right-2.5",
            ////           vec![
            ////               "icon",
            ////               "last-child",
            ////               "[&>[data-slot=icon]:last-child]:sm:right-2.5",
            ////           ],
            ////       ),
            (
                "sm:[&>[data-slot=icon]:last-child]:right-2.5",
                vec![
                    "icon",
                    "last-child",
                    "sm:[&>[data-slot=icon]:last-child]:right-2.5",
                ],
            ),
        ] {
            let mut machine = CandidateMachine::default();
            let mut cursor = Cursor::new(input.as_bytes());

            let mut actual: Vec<&str> = vec![];

            dbg!(&input);

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
