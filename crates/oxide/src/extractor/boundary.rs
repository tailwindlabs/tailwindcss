use classification_macros::ClassifyBytes;

use crate::extractor::Span;

#[inline(always)]
pub fn is_valid_before_boundary(c: &u8) -> bool {
    // `]` is also a valid before-boundary so that candidates immediately
    // following `[% ... %]` template tags (Template Toolkit, Text::Xslate,
    // ExpressionEngine, etc.) are extracted. Symmetric with `]` already being
    // a valid after-boundary for `[class.foo]`-style attributes.
    //
    // The classification macro generates one class per byte; `]` lives in
    // `After` (for `[class.foo]`), so we special-case it here rather than
    // losing the After-class semantics by listing it in `Before` as well.
    // https://github.com/tailwindlabs/tailwindcss/issues/20233
    matches!(c.into(), Class::Common | Class::Before) || *c == b']'
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

    if !is_valid_before_boundary(&before) {
        return false;
    }

    // A `[` immediately after a candidate is valid only when the candidate
    // itself does not already contain an arbitrary value `[...]`. This
    // preserves the "one arbitrary value per utility" semantics that
    // `bg-[red][blue]` should not extract.
    //
    // Without this carve-out, `bg-white/40[% end %]` would fail the after-
    // boundary check (`[` not in Common/Before/After) and the user's classes
    // wouldn't be extracted. With it, plain utilities terminate cleanly at
    // `[` (e.g. `bg-white[` after a template tag), but a utility that already
    // contains `[...]` rejects a directly-following `[` (which would start
    // a second arbitrary value).
    // https://github.com/tailwindlabs/tailwindcss/issues/20233
    if after == b'[' && span.slice(input).contains(&b'[') {
        return false;
    }

    is_valid_after_boundary(&after)
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
    // Twig-like templating languages, e.g.:
    //
    // ```
    // <div class="{% if true %}flex{% else %}block{% endif %}">
    //                         ^
    // ```
    #[bytes(b'}')]
    // XML-like languages where classes are inside the tag, e.g.:
    // ```
    // <f:case value="0">from-blue-900 to-cyan-200</f:case>
    //                  ^
    // ```
    #[bytes(b'>')]
    Before,

    // Clojure and Angular like languages, e.g.:
    // ```
    // [:div.p-2]
    //          ^
    // [class.foo]
    //           ^
    // ```
    #[bytes(b']')]
    // Open bracket that starts an arbitrary property `[name:value]` or that
    // follows a candidate directly (e.g. after a `[% end %]` template tag).
    // Listed here so `is_valid_after_boundary(b'[')` returns true in the
    // common case. The carve-out in `has_valid_boundaries` rejects `[` as
    // an after-boundary when the span itself already contains `[` (so
    // `bg-[red][blue]` still extracts nothing).
    // https://github.com/tailwindlabs/tailwindcss/issues/20233
    #[bytes(b'[')]
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
    // Escaped character when embedding one language in another via strings, e.g.:
    //
    // ```
    // $attributes->merge([
    //   'x-init' => '$el.classList.add(\'-translate-x-full\'); $el.classList.add(\'transition-transform\')',
    //                                                     ^                                            ^
    // ]);
    // ```
    //
    // In this case there is some JavaScript embedded in an string in PHP and some of the quotes
    // need to be escaped.
    #[bytes(b'\\')]
    // XML-like languages where classes are inside the tag, e.g.:
    // ```
    // <f:case value="0">from-blue-900 to-cyan-200</f:case>
    //                                            ^
    // ```
    #[bytes(b'<')]
    After,

    #[fallback]
    Other,
}
