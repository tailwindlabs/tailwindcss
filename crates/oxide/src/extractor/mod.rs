use crate::cursor;
use crate::extractor::machine::Span;
use candidate_machine::CandidateMachine;
use css_variable_machine::CssVariableMachine;
use machine::{Machine, MachineState};
use std::fmt;

pub mod arbitrary_property_machine;
pub mod arbitrary_value_machine;
pub mod arbitrary_variable_machine;
mod boundary;
pub mod bracket_stack;
pub mod candidate_machine;
pub mod css_variable_machine;
pub mod machine;
pub mod modifier_machine;
pub mod named_utility_machine;
pub mod named_variant_machine;
pub mod pre_processors;
pub mod string_machine;
pub mod utility_machine;
pub mod variant_machine;

#[derive(Debug)]
pub enum Extracted<'a> {
    /// Extracted a valid looking candidate
    ///
    /// E.g.: `flex`
    ///
    Candidate(&'a [u8]),

    /// Extracted a valid looking CSS variable
    ///
    /// E.g.: `--my-variable`
    ///
    CssVariable(&'a [u8]),
}

impl fmt::Display for Extracted<'_> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Extracted::Candidate(candidate) => {
                write!(f, "Candidate({})", std::str::from_utf8(candidate).unwrap())
            }
            Extracted::CssVariable(candidate) => {
                write!(
                    f,
                    "CssVariable({})",
                    std::str::from_utf8(candidate).unwrap()
                )
            }
        }
    }
}

#[derive(Debug)]
pub struct Extractor<'a> {
    cursor: cursor::Cursor<'a>,

    css_variable_machine: CssVariableMachine,
    candidate_machine: CandidateMachine,
}

impl<'a> Extractor<'a> {
    pub fn new(input: &'a [u8]) -> Self {
        Self {
            cursor: cursor::Cursor::new(input),

            css_variable_machine: Default::default(),
            candidate_machine: Default::default(),
        }
    }

    pub fn extract(&mut self) -> Vec<Extracted<'a>> {
        // Candidates found by inner candidate machines. If the outer machine finds a solution, we
        // can discard the inner machines. Otherwise, we can keep the candidates from the inner
        // machines.
        let mut in_flight_spans: Vec<Span> = Vec::with_capacity(15);

        // All the extracted values
        let mut extracted = Vec::with_capacity(100);

        let len = self.cursor.input.len();

        // CSS Variable extractor
        {
            let cursor = &mut self.cursor.clone();
            while cursor.pos < len {
                if cursor.curr.is_ascii_whitespace() {
                    cursor.advance();
                    continue;
                }

                if let MachineState::Done(span) = self.css_variable_machine.next(cursor) {
                    extracted.push(Extracted::CssVariable(span.slice(self.cursor.input)));
                }

                cursor.advance();
            }
        }

        // Candidate extractor
        {
            let cursor = &mut self.cursor.clone();

            while cursor.pos < len {
                if cursor.curr.is_ascii_whitespace() {
                    cursor.advance();
                    continue;
                }

                let before = cursor.pos;
                match self.candidate_machine.next(cursor) {
                    MachineState::Done(span) => {
                        in_flight_spans.push(span);
                        extract_sub_candidates(before..span.start, cursor, &mut in_flight_spans);
                    }
                    MachineState::Idle => {
                        extract_sub_candidates(
                            before..cursor.pos.min(cursor.input.len()),
                            cursor,
                            &mut in_flight_spans,
                        );
                    }
                }

                cursor.advance();
            }

            // Commit the remaining in-flight spans as extracted candidates
            if !in_flight_spans.is_empty() {
                extracted.extend(
                    drop_covered_spans(in_flight_spans)
                        .iter()
                        .map(|span| Extracted::Candidate(span.slice(self.cursor.input))),
                );
            }
        }

        extracted
    }
}

// Extract sub-candidates from a given range.
//
// E.g.: `[ClassPrefix('gap-y-4')]` will not be a valid candidate or variant. In that case we want
//       to extract candidates from inside the `[…]`.
//
// ```
// [ClassPrefix('gap-y-4')]
//  ^ Try again here
// ```
#[inline(always)]
fn extract_sub_candidates(
    range: std::ops::Range<usize>,
    cursor: &cursor::Cursor<'_>,
    in_flight_spans: &mut Vec<Span>,
) {
    let end = range.end;
    for i in range {
        if cursor.input[i] == b'[' {
            let mut cursor = cursor.clone();
            cursor.move_to(i + 1);

            let mut machine = CandidateMachine::default();

            while cursor.pos < end {
                if let MachineState::Done(span) = machine.next(&mut cursor) {
                    in_flight_spans.push(span);
                }

                cursor.advance();
            }
        }
    }
}

fn drop_covered_spans(mut spans: Vec<Span>) -> Vec<Span> {
    if spans.len() <= 1 {
        return spans;
    }

    spans.sort_by(|a, b| a.start.cmp(&b.start).then(b.end.cmp(&a.end)));

    let mut result = Vec::with_capacity(spans.len());
    let mut max_end = None;

    for span in spans {
        if max_end.is_none_or(|end| span.end > end) {
            result.push(span);
            max_end = Some(span.end);
        }
    }

    result
}

#[cfg(test)]
mod tests {
    use super::{Extracted, Extractor};
    use crate::throughput::Throughput;
    use std::hint::black_box;

    fn pre_process_input(input: &str, extension: &str) -> String {
        let input = crate::pre_process_input(input.as_bytes(), extension);
        String::from_utf8(input).unwrap()
    }

    fn extract_sorted_candidates(input: &str) -> Vec<&str> {
        let mut machine = Extractor::new(input.as_bytes());
        let mut actual = machine
            .extract()
            .iter()
            .filter_map(|x| match x {
                Extracted::Candidate(candidate) => std::str::from_utf8(candidate).ok(),
                Extracted::CssVariable(_) => None,
            })
            .collect::<Vec<_>>();
        actual.sort();
        actual
    }

    fn extract_sorted_css_variables(input: &str) -> Vec<&str> {
        let mut machine = Extractor::new(input.as_bytes());
        let mut actual = machine
            .extract()
            .iter()
            .filter_map(|x| match x {
                Extracted::Candidate(_) => None,
                Extracted::CssVariable(bytes) => std::str::from_utf8(bytes).ok(),
            })
            .collect::<Vec<_>>();
        actual.sort();
        actual
    }

    fn assert_extract_sorted_candidates(input: &str, expected: Vec<&str>) {
        let mut actual = extract_sorted_candidates(input);
        actual.sort();
        actual.dedup();

        let mut expected = expected;
        expected.sort();
        expected.dedup();

        if actual != expected {
            dbg!(&input, &actual, &expected);
        }
        assert_eq!(actual, expected);
    }

    fn assert_extract_candidates_contains(input: &str, expected: Vec<&str>) {
        let actual = extract_sorted_candidates(input);

        let mut missing = vec![];
        for item in &expected {
            if !actual.contains(item) {
                missing.push(item);
            }
        }

        if !missing.is_empty() {
            dbg!(&actual, &missing);
            panic!("Missing some items");
        }
    }

    fn assert_extract_sorted_css_variables(input: &str, expected: Vec<&str>) {
        let actual = extract_sorted_css_variables(input);

        let mut expected = expected;
        expected.sort();

        if actual != expected {
            dbg!(&input, &actual, &expected);
        }
        assert_eq!(actual, expected);
    }

    #[test]
    #[ignore]
    fn test_extract_performance() {
        if true {
            let iterations = 50_000;

            let input = include_bytes!("../fixtures/example.html");

            let throughput = Throughput::compute(iterations, input.len(), || {
                let mut extractor = Extractor::new(input);
                _ = black_box(extractor.extract());
            });
            eprintln!("Extractor throughput: {:}", throughput);

            let mut extractor = Extractor::new(input);
            let start = std::time::Instant::now();
            _ = black_box(extractor.extract().len());
            let end = start.elapsed();
            eprintln!("Extractor took: {:?}", end);

            todo!();
        }
    }

    #[test]
    fn test_candidates_extraction() {
        for (input, expected) in [
            // Simple utility
            ("flex", vec!["flex"]),
            // Single character utility
            ("a", vec!["a"]),
            // Simple variant with simple utility
            ("hover:flex", vec!["hover:flex"]),
            // Multiple utilities
            ("flex block", vec!["flex", "block"]),
            // Simple utility with dashes
            ("items-center", vec!["items-center"]),
            ("items--center", vec!["items--center"]),
            // Simple utility with numbers
            ("px-2.5", vec!["px-2.5"]),
            // Arbitrary properties
            ("[color:red]", vec!["[color:red]"]),
            ("![color:red]", vec!["![color:red]"]),
            ("[color:red]!", vec!["[color:red]!"]),
            ("[color:red]/20", vec!["[color:red]/20"]),
            ("![color:red]/20", vec!["![color:red]/20"]),
            ("[color:red]/20!", vec!["[color:red]/20!"]),
            // In HTML
            (
                r#"<div class="flex items-center px-2.5 bg-[#0088cc] text-(--my-color)"></div>"#,
                vec![
                    "class",
                    "flex",
                    "items-center",
                    "px-2.5",
                    "bg-[#0088cc]",
                    "text-(--my-color)",
                ],
            ),
            // In an array, looks like an arbitrary property (because it starts with `[`).
            (r#"["flex"]"#, vec!["flex"]),
            (r#"["p-2.5"]"#, vec!["p-2.5"]),
            (r#"["flex","p-2.5"]"#, vec!["flex", "p-2.5"]),
            (r#"["flex", "p-2.5"]"#, vec!["flex", "p-2.5"]),
            // Overlapping candidates, outer candidate should win
            (
                r#"[CssClass("[&:hover]:flex",'italic')]"#,
                vec!["[&:hover]:flex", "italic"],
            ),
            (
                r#"["flex",["italic",["underline"]]]"#,
                vec!["flex", "italic", "underline"],
            ),
            (r#"[:is(italic):is(underline)]"#, vec![]),
            (
                r#"[:is(italic):is(underline)]:flex"#,
                vec!["[:is(italic):is(underline)]:flex"],
            ),
            // Clojure syntax. See: https://github.com/tailwindlabs/tailwindcss/issues/16189#issuecomment-2642438176
            (r#"[:div {:class ["p-2"]}"#, vec!["p-2"]),
            (
                r#"[:div {:class ["p-2" "text-green"]}"#,
                vec!["p-2", "text-green"],
            ),
            (r#"[:div {:class ["p-2""#, vec!["p-2"]),
            (r#"               "text-green"]}"#, vec!["text-green"]),
            (r#"[:div.p-2]"#, vec!["p-2"]),
            // Longer example with mixed types of variants and utilities
            (
                "[&>[data-slot=icon]:last-child]:right-2.5",
                vec!["[&>[data-slot=icon]:last-child]:right-2.5"],
            ),
            (
                "sm:[&>[data-slot=icon]:last-child]:right-2.5",
                vec!["sm:[&>[data-slot=icon]:last-child]:right-2.5"],
            ),
            // --------------------------------------------------------

            // Exceptions:
            //
            // Keys inside of a JS object could be a variant-less candidate. Vue example.
            ("{ underline: true }", vec!["underline", "true"]),
            (
                r#"            <CheckIcon className={clsx('h-4 w-4', { invisible: index !== 0 })} />"#,
                vec!["className", "h-4", "w-4", "invisible", "index"],
            ),
            // You can have variants but in a string. Vue example.
            (
                "{ 'hover:underline': true }",
                vec!["hover:underline", "true"],
            ),
            // Important marker on both sides is invalid
            ("!flex!", vec![]),
            // Important marker before a modifier is invalid
            ("bg-red-500!/20", vec![]),
            // HTML start of a tag
            ("<div", vec![]),
            // HTML end of a tag
            ("</div>", vec![]),
            // HTML element on its own
            ("<div></div>", vec![]),
            // Modifier followed by a modifier is invalid
            ("bg-red-500/20/20", vec![]),
            ("bg-red-500/20/[20%]", vec![]),
            ("bg-red-500/20/(--my-opacity)", vec![]),
            ("bg-red-500/[20%]/20", vec![]),
            ("bg-red-500/[20%]/[20%]", vec![]),
            ("bg-red-500/[20%]/(--my-opacity)", vec![]),
            ("bg-red-500/(--my-opacity)/20", vec![]),
            ("bg-red-500/(--my-opacity)/[20%]", vec![]),
            ("bg-red-500/(--my-opacity)/(--my-opacity)", vec![]),
            // Arbitrary value followed by an arbitrary value is invalid
            ("bg-[red]-[blue]", vec![]),
            ("bg-[red][blue]", vec![]),
            // Arbitrary value followed by an arbitrary variable is invalid
            ("bg-[red]-(--my-color)", vec![]),
            ("bg-[red](--my-color)", vec![]),
            // Important looking utility cannot be followed by another utility
            ("flex!block", vec![]),
            // Invalid variants make the whole candidate invalid
            ("[foo]/bar:flex", vec![]),
            // Utilities cannot start with `_`
            ("_blank", vec![]),
            ("hover:_blank", vec![]),
            ("hover:focus:_blank", vec![]),
        ] {
            assert_extract_sorted_candidates(input, expected);
        }
    }

    #[test]
    fn test_extractor_extract_candidates() {
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
                // Inside an array
                (r#"let classes = ['{}'];"#, vec!["let", "classes"]),
            ] {
                let input = &wrapper.replace("{}", input);
                let mut expected = expected.clone();
                expected.extend(additional);

                assert_extract_sorted_candidates(input, expected);
            }
        }
    }

    #[test]
    fn test_ruby_syntax() {
        for (input, expected) in [
            (r#"%w[flex]"#, vec!["flex"]),
            (r#"%w[flex items-center]"#, vec!["flex", "items-center"]),
            (r#"%w[[color:red]]"#, vec!["[color:red]"]),
            // See: https://github.com/tailwindlabs/tailwindcss/issues/13778
            (
                r#"def call = tag.span "Foo", class: %w[rounded-full h-0.75 w-0.75]"#,
                vec![
                    "def",
                    "call",
                    "span",
                    "class",
                    "rounded-full",
                    "h-0.75",
                    "w-0.75",
                ],
            ),
            (
                r#"def call = tag.span "Foo", class: %w[rounded-full w-0.75 h-0.75]"#,
                vec![
                    "def",
                    "call",
                    "span",
                    "class",
                    "rounded-full",
                    "h-0.75",
                    "w-0.75",
                ],
            ),
            (
                r#"def call = tag.span "Foo", class: %w[w-0.75 h-0.75 rounded-full]"#,
                vec![
                    "def",
                    "call",
                    "span",
                    "class",
                    "rounded-full",
                    "h-0.75",
                    "w-0.75",
                ],
            ),
            // Other similar syntaxes
            (r#"%w[flex]"#, vec!["flex"]),
            (r#"%w(flex)"#, vec!["flex"]),
        ] {
            assert_extract_sorted_candidates(&pre_process_input(input, "rb"), expected);
        }
    }

    // Pug syntax, see: https://github.com/tailwindlabs/tailwindcss/issues/14005
    #[test]
    fn test_pug_syntax() {
        for (input, expected) in [
            // Class literal
            (
                ".bg-green-300.2xl:bg-red-500",
                vec!["bg-green-300", "2xl:bg-red-500"],
            ),
            (
                ".2xl:bg-red-500.bg-green-300",
                vec!["bg-green-300", "2xl:bg-red-500"],
            ),
            (".xl:col-span-2.xl:pr-8", vec!["xl:col-span-2", "xl:pr-8"]),
            (
                "div.2xl:bg-red-500.bg-green-300",
                vec!["div", "bg-green-300", "2xl:bg-red-500"],
            ),
            // Quoted attribute
            (
                r#"input(type="checkbox" class="px-2.5")"#,
                vec!["checkbox", "class", "px-2.5"],
            ),
        ] {
            assert_extract_sorted_candidates(&pre_process_input(input, "pug"), expected);
        }
    }

    // Slim syntax, see: https://github.com/tailwindlabs/tailwindcss/issues/16790
    #[test]
    fn test_slim_syntax() {
        for (input, expected) in [
            // Class literal
            (
                ".bg-blue-100.2xl:bg-red-100",
                vec!["bg-blue-100", "2xl:bg-red-100"],
            ),
            (
                ".2xl:bg-red-100.bg-blue-100",
                vec!["bg-blue-100", "2xl:bg-red-100"],
            ),
            // Quoted attribute
            (r#"div class="px-2.5""#, vec!["div", "class", "px-2.5"]),
        ] {
            assert_extract_sorted_candidates(&pre_process_input(input, "slim"), expected);
        }
    }

    // C# syntax, see: https://github.com/tailwindlabs/tailwindcss/issues/16189#issue-2826350984
    #[test]
    fn test_csharp_syntax() {
        for (input, expected) in [
            // Not a valid arbitrary value or variant
            // Extract inner candidates: `gap-y-4`
            (r#"[CssClass("gap-y-4")]"#, vec!["gap-y-4"]),
            (r#"[CssClass("hover:gap-y-4")]"#, vec!["hover:gap-y-4"]),
            // Valid arbitrary variant + utility, extract full candidate without inner candidates
            (
                r#"[CssClass("gap-y-4")]:flex"#,
                vec![r#"[CssClass("gap-y-4")]:flex"#],
            ),
        ] {
            assert_extract_sorted_candidates(input, expected);
        }
    }

    // Clojure syntax, see: https://github.com/tailwindlabs/tailwindcss/issues/16189#issuecomment-2642438176
    #[test]
    fn test_clojure_syntax() {
        for (input, expected) in [
            (r#"[:div {:class ["p-2"]}"#, vec!["p-2"]),
            (
                r#"[:div {:class ["p-2" "text-green"]}"#,
                vec!["p-2", "text-green"],
            ),
            (r#"[:div {:class ["p-2""#, vec!["p-2"]),
            (r#"               "text-green"]}"#, vec!["text-green"]),
            (r#"[:div.p-2]"#, vec!["p-2"]),
        ] {
            assert_extract_sorted_candidates(input, expected);
        }
    }

    // Gleam syntax, see: https://github.com/tailwindlabs/tailwindcss/issues/15632#issuecomment-2617431021
    #[test]
    fn test_gleam_syntax() {
        for (input, expected) in [
            (r#"html.div([attribute.class("py-10")], [])"#, vec!["py-10"]),
            (
                r#"html.div([attribute.class("hover:py-10")], [])"#,
                vec!["hover:py-10"],
            ),
        ] {
            assert_extract_sorted_candidates(input, expected);
        }
    }

    #[test]
    fn test_overlapping_candidates() {
        for (input, expected) in [
            // Not a valid arbitrary property
            // Not a valid arbitrary variant
            // Extract inner candidates
            (
                r#"[CssClass("[&:hover]:flex",'italic')]"#,
                vec!["[&:hover]:flex", "italic"],
            ),
            // Not a valid arbitrary property or variant, array syntax
            // Extract inner candidates
            (
                r#"["flex",["italic",["underline"]]]"#,
                vec!["flex", "italic", "underline"],
            ),
            // Not a valid arbitrary variant (not followed by a candidate)
            // Inner classes `is`, `italic` and `underline` are not valid in this context
            (r#"[:is(italic):is(underline)]"#, vec![]),
            // Valid arbitrary variant, nothing inside should be extracted
            (
                r#"[:is(italic):is(underline)]:flex"#,
                vec!["[:is(italic):is(underline)]:flex"],
            ),
        ] {
            assert_extract_sorted_candidates(input, expected);
        }
    }

    #[test]
    fn test_js_syntax() {
        for (input, expected) in [
            // String
            (
                r#"let classes = 'flex items-center';"#,
                vec!["let", "classes", "flex", "items-center"],
            ),
            // Array
            (
                r#"let classes = ['flex', 'items-center'];"#,
                vec!["let", "classes", "flex", "items-center"],
            ),
            // Minified array
            (
                r#"let classes = ['flex','items-center'];"#,
                vec!["let", "classes", "flex", "items-center"],
            ),
            // Function call
            (
                r#"let classes = something('flex');"#,
                vec!["let", "classes", "flex"],
            ),
            // Function call in array
            (
                r#"let classes = [wrapper('flex')]"#,
                vec!["let", "classes", "flex"],
            ),
        ] {
            assert_extract_sorted_candidates(input, expected);
        }
    }

    // See: https://github.com/tailwindlabs/tailwindcss/issues/16750
    #[test]
    fn test_js_tuple_syntax() {
        for (input, expected) in [
            // Split
            (
                r#"["h-[calc(100vh-(var(--spacing)*8)-(var(--spacing)*14))]",\n  true],"#,
                vec![
                    "h-[calc(100vh-(var(--spacing)*8)-(var(--spacing)*14))]",
                    "true",
                ],
            ),
            // Same line
            (
                r#"["h-[calc(100vh-(var(--spacing)*8)-(var(--spacing)*14))]", true],"#,
                vec![
                    "h-[calc(100vh-(var(--spacing)*8)-(var(--spacing)*14))]",
                    "true",
                ],
            ),
            // Split with space in front
            (
                r#"[ "h-[calc(100vh-(var(--spacing)*8)-(var(--spacing)*14))]",\n  true],"#,
                vec![
                    "h-[calc(100vh-(var(--spacing)*8)-(var(--spacing)*14))]",
                    "true",
                ],
            ),
        ] {
            assert_extract_sorted_candidates(input, expected);
        }
    }

    // See: https://github.com/tailwindlabs/tailwindcss/issues/16801
    #[test]
    fn test_angular_binding_syntax() {
        for (input, expected) in [
            (
                r#"'[ngClass]': `{"variant": variant(), "no-variant": !variant() }`"#,
                vec!["variant", "no-variant"],
            ),
            (
                r#"'[class]': '"bg-gradient-to-b px-6 py-3 rounded-3xl from-5%"',"#,
                vec!["bg-gradient-to-b", "px-6", "py-3", "rounded-3xl", "from-5%"],
            ),
            (
                r#"'[class.from-secondary-light]': `variant() === 'secondary'`,"#,
                vec!["from-secondary-light", "secondary"],
            ),
            (
                r#"'[class.to-secondary]': `variant() === 'secondary'`,"#,
                vec!["to-secondary", "secondary"],
            ),
            (
                r#"'[class.from-5%]': `variant() === 'secondary'`,"#,
                vec!["from-5%", "secondary"],
            ),
            (
                r#"'[class.from-1%]': `variant() === 'primary'`,"#,
                vec!["from-1%", "primary"],
            ),
            (
                r#"'[class.from-light-blue]': `variant() === 'primary'`,"#,
                vec!["from-light-blue", "primary"],
            ),
            (
                r#"'[class.to-primary]': `variant() === 'primary'`,"#,
                vec!["to-primary", "primary"],
            ),
        ] {
            assert_extract_sorted_candidates(input, expected);
        }
    }

    #[test]
    fn test_angular_binding_attribute_syntax() {
        for (input, expected) in [
            // Simple class
            (
                r#"<div [class.underline]="bool"></div>"#,
                vec!["underline", "bool"],
            ),
            // With additional dots
            (
                r#"<div [class.px-2.5]="bool"></div>"#,
                vec!["px-2.5", "bool"],
            ),
            // With additional square brackets
            (
                r#"<div [class.bg-[#0088cc]]="bool"></div>"#,
                vec!["bg-[#0088cc]", "bool"],
            ),
        ] {
            assert_extract_sorted_candidates(input, expected);
        }
    }

    #[test]
    fn test_svelte_shorthand_syntax() {
        assert_extract_sorted_candidates(
            &pre_process_input(r#"<div class:px-4='condition'></div>"#, "svelte"),
            vec!["class", "px-4", "condition"],
        );
        assert_extract_sorted_candidates(
            &pre_process_input(r#"<div class:flex='condition'></div>"#, "svelte"),
            vec!["class", "flex", "condition"],
        );
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/16999
    #[test]
    fn test_twig_syntax() {
        assert_extract_candidates_contains(
            r#"<div class="flex items-center mx-4{% if session.isValid %}{% else %} h-4{% endif %}"></div>"#,
            vec!["flex", "items-center", "mx-4", "h-4"],
        );

        // With touching both `}` and `{`
        assert_extract_candidates_contains(
            r#"<div class="{% if true %}flex{% else %}block{% endif %}">"#,
            vec!["flex", "block"],
        );
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/17050
    #[test]
    fn test_haml_syntax() {
        for (input, expected) in [
            // Element with classes
            (
                "%body.flex.flex-col.items-center.justify-center",
                vec!["flex", "flex-col", "items-center", "justify-center"],
            ),
            // Plain element
            (
                ".text-slate-500.xl:text-gray-500",
                vec!["text-slate-500", "xl:text-gray-500"],
            ),
            // Element with hash attributes
            (
                ".text-black.xl:text-red-500{ data: { tailwind: 'css' } }",
                vec!["text-black", "xl:text-red-500"],
            ),
            // Element with a boolean attribute
            (
                ".text-green-500.xl:text-blue-500(data-sidebar)",
                vec!["text-green-500", "xl:text-blue-500"],
            ),
            // Element with interpreted content
            (
                ".text-yellow-500.xl:text-purple-500= 'Element with interpreted content'",
                vec!["text-yellow-500", "xl:text-purple-500"],
            ),
            // Element with a hash at the end and an extra class.
            (
                ".text-orange-500.xl:text-pink-500{ class: 'bg-slate-100' }",
                vec!["text-orange-500", "xl:text-pink-500", "bg-slate-100"],
            ),
            // Object reference
            (
                ".text-teal-500.xl:text-indigo-500[@user, :greeting]",
                vec!["text-teal-500", "xl:text-indigo-500"],
            ),
            // Element with an ID
            (
                ".text-lime-500.xl:text-emerald-500#root",
                vec!["text-lime-500", "xl:text-emerald-500"],
            ),
        ] {
            assert_extract_candidates_contains(&pre_process_input(input, "haml"), expected);
        }
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/16982
    #[test]
    fn test_arbitrary_container_queries_syntax() {
        assert_extract_sorted_candidates(
            r#"<div class="@md:flex @max-md:flex @-[36rem]:flex @[36rem]:flex"></div>"#,
            vec![
                "class",
                "@md:flex",
                "@max-md:flex",
                "@-[36rem]:flex",
                "@[36rem]:flex",
            ],
        );
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/17023
    #[test]
    fn test_js_embedded_in_php_syntax() {
        // Escaped single quotes
        let input = r#"
            @php
            if ($sidebarIsStashable) {
                $attributes = $attributes->merge([
                    'x-init' => '$el.classList.add(\'-translate-x-full\'); $el.classList.add(\'transition-transform\')',
                ]);
            }
            @endphp
        "#;
        assert_extract_candidates_contains(
            input,
            vec!["-translate-x-full", "transition-transform"],
        );

        // Double quotes
        let input = r#"
            @php
            if ($sidebarIsStashable) {
                $attributes = $attributes->merge([
                    'x-init' => "\$el.classList.add('-translate-x-full'); \$el.classList.add('transition-transform')",
                ]);
            }
            @endphp
        "#;
        assert_extract_candidates_contains(
            input,
            vec!["-translate-x-full", "transition-transform"],
        );
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/16978
    #[test]
    fn test_classes_containing_number_followed_by_dash_or_underscore() {
        assert_extract_sorted_candidates(
            r#"<div class="text-Title1_Strong"></div>"#,
            vec!["class", "text-Title1_Strong"],
        );
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/16983
    #[test]
    fn test_arbitrary_variable_with_data_type() {
        assert_extract_sorted_candidates(
            r#"<div class="bg-(length:--my-length) bg-[color:var(--my-color)]"></div>"#,
            vec![
                "class",
                "bg-(length:--my-length)",
                "bg-[color:var(--my-color)]",
            ],
        );
    }

    #[test]
    fn test_extract_css_variables() {
        for (input, expected) in [
            // Simple variable
            ("--foo", vec!["--foo"]),
            ("--my-variable", vec!["--my-variable"]),
            // Multiple variables
            (
                "calc(var(--first) + var(--second))",
                vec!["--first", "--second"],
            ),
            // Escaped character in the middle, skips the next character
            (r#"--spacing-1\/2"#, vec![r#"--spacing-1\/2"#]),
            // Escaped whitespace is not allowed
            (r#"--my-\ variable"#, vec![]),
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
                // Inside an arbitrary property
                r#"<div class="[{}:red]"></div>"#,
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
                // Inside an array
                r#"let classes = ['{}'];"#,
            ] {
                let input = wrapper.replace("{}", input);

                assert_extract_sorted_css_variables(&input, expected.clone());
            }
        }
    }
}
