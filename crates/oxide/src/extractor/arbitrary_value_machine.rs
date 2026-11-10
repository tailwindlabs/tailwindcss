use crate::cursor;
use crate::extractor::bracket_stack::BracketStack;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::string_machine::StringMachine;
use classification_macros::ClassifyBytes;

/// Extracts arbitrary values including the brackets.
///
/// E.g.:
///
/// ```text
/// bg-[#0088cc]
///    ^^^^^^^^^
///
/// bg-red-500/[20%]
///            ^^^^^
/// ```
#[derive(Debug, Default)]
pub struct ArbitraryValueMachine {
    /// Track brackets to ensure they are balanced
    bracket_stack: BracketStack,

    string_machine: StringMachine,
}

impl Machine for ArbitraryValueMachine {
    #[inline(always)]
    fn reset(&mut self) {
        self.bracket_stack.reset();
    }

    #[inline]
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState {
        self.parse(cursor, None)
    }
}

impl ArbitraryValueMachine {
    /// Same as `next`, but stops early where an arbitrary value that started at an earlier `[`
    /// stopped, and remembers where this one stops in `memo`.
    #[inline]
    pub fn next_with_memo(
        &mut self,
        cursor: &mut cursor::Cursor<'_>,
        memo: &mut ArbitraryValueMemo,
    ) -> MachineState {
        let state = self.parse(cursor, Some(memo));
        memo.finish(cursor.pos, matches!(state, MachineState::Done(_)));
        state
    }

    #[inline(always)]
    fn parse(
        &mut self,
        cursor: &mut cursor::Cursor<'_>,
        mut memo: Option<&mut ArbitraryValueMemo>,
    ) -> MachineState {
        // An arbitrary value must start with an open bracket
        if Class::OpenBracket != cursor.curr().into() {
            return MachineState::Idle;
        }

        let start_pos = cursor.pos;
        cursor.advance();

        let len = cursor.input.len();

        while cursor.pos < len {
            // Without open brackets, the rest of the arbitrary value doesn't depend on where it
            // started. So if an earlier arbitrary value was here without open brackets, this one
            // stops at the same position.
            //
            // Near the start, the work is cheap to repeat, so we don't use the memo there. This
            // way, most lines don't need one.
            if let Some(memo) = memo.as_deref_mut() {
                if cursor.pos > start_pos + MEMO_MIN_DISTANCE && self.bracket_stack.is_empty() {
                    if let Some((end, found)) = memo.visit(cursor.pos) {
                        cursor.pos = end;
                        return if found {
                            self.done(start_pos, cursor)
                        } else {
                            self.restart()
                        };
                    }
                }
            }

            match cursor.curr().into() {
                Class::Escape => match cursor.next().into() {
                    // An escaped whitespace character is not allowed
                    //
                    // E.g.: `[color:var(--my-\ color)]`
                    //                         ^
                    Class::Whitespace => {
                        cursor.advance_twice();
                        return self.restart();
                    }

                    // An escaped character, skip the next character, resume after
                    //
                    // E.g.: `[color:var(--my-\#color)]`
                    //                        ^
                    _ => cursor.advance_twice(),
                },

                Class::OpenParen | Class::OpenBracket | Class::OpenCurly => {
                    if !self.bracket_stack.push(cursor.curr()) {
                        return self.restart();
                    }
                    cursor.advance();
                }

                Class::CloseParen | Class::CloseBracket | Class::CloseCurly
                    if !self.bracket_stack.is_empty() =>
                {
                    if !self.bracket_stack.pop(cursor.curr()) {
                        return self.restart();
                    }
                    cursor.advance();
                }

                // End of an arbitrary value
                //
                // 1. All brackets must be balanced
                // 2. There must be at least a single character inside the brackets
                Class::CloseBracket
                    if start_pos + 1 != cursor.pos && self.bracket_stack.is_empty() =>
                {
                    return self.done(start_pos, cursor);
                }

                // Start of a string
                Class::Quote => match self.string_machine.next(cursor) {
                    MachineState::Idle => return self.restart(),
                    MachineState::Done(_) => cursor.advance(),
                },

                // Any kind of whitespace is not allowed
                Class::Whitespace => return self.restart(),

                // String interpolation-like syntax is not allowed. E.g.: `[${x}]`
                Class::Dollar if matches!(cursor.next().into(), Class::OpenCurly) => {
                    return self.restart()
                }

                // Everything else is valid
                _ => cursor.advance(),
            };
        }

        self.restart()
    }
}

/// Distance from the start of an arbitrary value, after which it uses the memo.
///
/// This must be at least 1, because only right after the start, a `]` doesn't end the arbitrary
/// value. E.g.: `[]`
const MEMO_MIN_DISTANCE: usize = 64;

/// Remembers where arbitrary values stopped, for a machine that parses many of them in the same
/// input. This is not reset, because it only depends on the input.
///
/// Otherwise, a long line with many `[` that don't close takes quadratic time, because each
/// arbitrary value scans to the end of the line.
///
/// E.g.: `[]"a"[]"a"[]"a"…`
///        ^^^^^^^^^^^^^^^^ The first `]` doesn't close the arbitrary value, because it can't be
///                         empty. So the arbitrary value continues to the end of the line.
///             ^^^^^^^^^^^ The same is true for this one. After the second `]`, it has no open
///                         brackets, like the first one. So it stops at the same position.
#[derive(Debug, Default)]
pub struct ArbitraryValueMemo {
    /// Most lines don't need a memo, so we only allocate it when we need it. This also keeps the
    /// machines that own a memo small.
    inner: Option<Box<ArbitraryValueMemoInner>>,
}

#[derive(Debug, Default)]
struct ArbitraryValueMemoInner {
    /// For each position, `0` if no arbitrary value was there without open brackets, or `1 +`
    /// the index in `stops` of the first one that was.
    visits: Vec<u32>,

    /// Where each arbitrary value stopped, and whether it is valid.
    stops: Vec<(usize, bool)>,

    /// The value in `visits` for the current arbitrary value, once it has one.
    current: Option<u32>,
}

impl ArbitraryValueMemo {
    /// Returns where the current arbitrary value stops, if an earlier one was at `pos` without
    /// open brackets. Otherwise, remembers that the current one was.
    #[inline]
    fn visit(&mut self, pos: usize) -> Option<(usize, bool)> {
        let memo = self.inner.get_or_insert_with(Default::default);

        if let Some(&id) = memo.visits.get(pos) {
            if id > 0 {
                return Some(memo.stops[id as usize - 1]);
            }
        }

        let id = match memo.current {
            Some(id) => id,
            None => {
                // The memo is only an optimization, so we can skip it for absurdly long lines
                let Ok(id) = u32::try_from(memo.stops.len() + 1) else {
                    return None;
                };

                memo.stops.push((0, false));
                memo.current = Some(id);
                id
            }
        };

        if pos >= memo.visits.len() {
            memo.visits.resize(pos + 1, 0);
        }
        memo.visits[pos] = id;

        None
    }

    /// Remembers where the current arbitrary value stopped.
    #[inline]
    fn finish(&mut self, pos: usize, found: bool) {
        if let Some(memo) = self.inner.as_deref_mut() {
            if let Some(id) = memo.current.take() {
                memo.stops[id as usize - 1] = (pos, found);
            }
        }
    }
}

#[derive(Clone, Copy, PartialEq, ClassifyBytes)]
enum Class {
    #[bytes(b'\\')]
    Escape,

    #[bytes(b'(')]
    OpenParen,

    #[bytes(b')')]
    CloseParen,

    #[bytes(b'[')]
    OpenBracket,

    #[bytes(b']')]
    CloseBracket,

    #[bytes(b'{')]
    OpenCurly,

    #[bytes(b'}')]
    CloseCurly,

    #[bytes(b'"', b'\'', b'`')]
    Quote,

    #[bytes(b' ', b'\t', b'\n', b'\r', b'\x0C')]
    Whitespace,

    #[bytes(b'$')]
    Dollar,

    #[fallback]
    Other,
}

#[cfg(test)]
mod tests {
    use super::{ArbitraryValueMachine, ArbitraryValueMemo};
    use crate::cursor;
    use crate::extractor::machine::Machine;
    use pretty_assertions::assert_eq;

    #[test]
    #[ignore]
    fn test_arbitrary_value_machine_performance() {
        let input = r#"<div class="[color:red] [[data-foo]] [url('https://tailwindcss.com')] [url(https://tailwindcss.com)]"></div>"#.repeat(100);

        ArbitraryValueMachine::test_throughput(100_000, &input);
        ArbitraryValueMachine::test_duration_once(&input);

        todo!()
    }

    #[test]
    fn test_arbitrary_value_machine_extraction() {
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
            // With data types
            ("[length:32rem]", vec!["[length:32rem]"]),
            // Spaces are not allowed
            ("[ #0088cc ]", vec![]),
            // Unbalanced brackets are not allowed
            ("[foo[bar]", vec![]),
            // Empty brackets are not allowed
            ("[]", vec![]),
        ] {
            assert_eq!(ArbitraryValueMachine::test_extract_all(input), expected);
        }
    }

    #[test]
    fn test_exceptions() {
        for (input, expected) in [
            // JS string interpolation
            ("[${x}]", vec![]),
            ("[url(${x})]", vec![]),
            // Allowed in strings
            ("[url('${x}')]", vec!["[url('${x}')]"]),
        ] {
            assert_eq!(ArbitraryValueMachine::test_extract_all(input), expected);
        }
    }

    #[test]
    fn test_arbitrary_value_machine_memo() {
        for input in [
            // Arbitrary values that don't end, because the first one is empty
            r#"[]"a""#.repeat(50),
            "[]a".repeat(50),
            // Arbitrary values that don't end, because of escaped characters
            r"[\".repeat(50),
            // Arbitrary values that end at the end of the line
            format!("{}]", r#"[]"a""#.repeat(50)),
            format!("{}]", "[]a".repeat(50)),
            // An escaped `[` right before a `]`
            format!(r"[{}\[]a]", "a".repeat(70)),
        ] {
            let mut memo = ArbitraryValueMemo::default();

            for start in 0..input.len() {
                let mut cursor = cursor::Cursor::new(input.as_bytes());
                cursor.move_to(start);
                let mut expected_cursor = cursor.clone();

                let actual =
                    ArbitraryValueMachine::default().next_with_memo(&mut cursor, &mut memo);
                let expected = ArbitraryValueMachine::default().next(&mut expected_cursor);

                assert_eq!(
                    (format!("{actual:?}"), cursor.pos),
                    (format!("{expected:?}"), expected_cursor.pos),
                    "From position {start} of {input:?}",
                );
            }
        }
    }
}
