use classification_macros::ClassifyBytes;

use crate::extractor::Span;

#[inline(always)]
pub fn is_valid_before_boundary(c: &u8) -> bool {
    matches!(c.into(), Class::Common | Class::Before)
}

#[inline(always)]
pub fn is_valid_after_boundary(c: &u8) -> bool {
    matches!(c.into(), Class::Common | Class::After)
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

#[derive(Debug, Clone, Copy, ClassifyBytes)]
enum Class {
    // Whitespace, e.g.:
    //
    // ```
    // <div class="flex flex-col items-center"></div>
    //                 ^        ^
    // ```
    #[bytes(b'\t', b'\n', b'\x0C', b'\r', b' ')]
    // Quotes, e.g.:
    //
    // ```
    // <div class="flex">
    //            ^    ^
    // ```
    #[bytes(b'"', b'\'', b'`')]
    // Twig like templating languages, e.g.:
    //
    // ```
    // <div class="{% if true %}flex{% else %}block{% endif %}">
    //                         ^
    // ```
    #[bytes(b'}')]
    // End of the input, e.g.:
    //
    // ```
    // flex
    //     ^
    // ```
    #[bytes(b'\0')]
    Common,

    // Angular like attributes, e.g.:
    //
    // ````
    // [class.foo]
    //       ^
    // ```
    #[bytes(b'.')]
    Before,

    // Clojure and Angular like languages, e.g.:
    // ```
    // [:div.p-2]
    //          ^
    // [class.foo]
    //           ^
    // ```
    #[bytes(b']')]
    // Twig like templating languages, e.g.:
    //
    // ```
    // <div class="{% if true %}flex{% else %}block{% endif %}">
    //                              ^
    // ```
    #[bytes(b'{')]
    // Svelte like attributes, e.g.:
    //
    // ```
    // <div class:flex="bool"></div>
    //                ^
    // ```
    #[bytes(b'=')]
    After,

    #[fallback]
    Other,
}
