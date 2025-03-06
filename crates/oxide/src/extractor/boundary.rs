use crate::extractor::Span;

/// A candidate must be preceded or followed by any of these characters
/// E.g.: `<div class="flex">`
///                   ^ Valid for `flex`
///        ^ Invalid for `div`
#[inline(always)]
fn is_valid_common_boundary(c: &u8) -> bool {
    matches!(
        c,
        b'\t' | b'\n' | b'\x0C' | b'\r' | b' ' | b'"' | b'\'' | b'`' | b'\0'
    )
}

/// A candidate must be preceded by any of these characters.
#[inline(always)]
pub fn is_valid_before_boundary(c: &u8) -> bool {
    is_valid_common_boundary(c) || matches!(c, b'.' | b'}')
}

/// A candidate must be followed by any of these characters.
///
/// E.g.: `[class.foo]`             Angular
/// E.g.: `<div class:flex="bool">` Svelte
///                       ^
#[inline(always)]
pub fn is_valid_after_boundary(c: &u8) -> bool {
    is_valid_common_boundary(c) || matches!(c, b'}' | b']' | b'=' | b'{')
}

#[inline(always)]
pub fn has_valid_boundaries(span: &Span, input: &[u8]) -> bool {
    let before = {
        if span.start == 0 {
            b'\0'
        } else {
            input[span.start - 1]
        }
    };

    let after = {
        if span.end >= input.len() - 1 {
            b'\0'
        } else {
            input[span.end + 1]
        }
    };

    // Ensure the span has valid boundary characters before and after
    is_valid_before_boundary(&before) && is_valid_after_boundary(&after)
}
