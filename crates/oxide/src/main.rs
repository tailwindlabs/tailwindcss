use std::hint::black_box;
use tailwindcss_oxide::cursor::Cursor;
use tailwindcss_oxide::extractor::machine::{Machine, MachineState};
use tailwindcss_oxide::extractor::{Extracted, Extractor};
use tailwindcss_oxide::throughput::Throughput;

fn run_full_extractor(input: &[u8]) -> Vec<&[u8]> {
    Extractor::new(input)
        .extract()
        .into_iter()
        .map(|x| match x {
            Extracted::Candidate(bytes) => bytes,
            Extracted::CssVariable(bytes) => bytes,
        })
        .collect::<Vec<_>>()
}

fn _run_machine<T: Machine>(input: &[u8]) -> Vec<&[u8]> {
    let len = input.len();
    let mut machine = T::default();
    let mut cursor = Cursor::new(input);
    let mut result = Vec::with_capacity(25);

    while cursor.pos < len {
        if let MachineState::Done(span) = machine.next(&mut cursor) {
            result.push(span.slice(input));
        }

        cursor.advance();
    }

    result
}

fn run(input: &[u8]) -> Vec<&[u8]> {
    // _run_machine::<tailwindcss_oxide::extractor::arbitrary_property_machine::ArbitraryPropertyMachine>(input)
    // _run_machine::<tailwindcss_oxide::extractor::arbitrary_value_machine::ArbitraryValueMachine>(input)
    // _run_machine::<tailwindcss_oxide::extractor::arbitrary_variable_machine::ArbitraryVariableMachine>(input)
    // _run_machine::<tailwindcss_oxide::extractor::candidate_machine::CandidateMachine>(input)
    // _run_machine::<tailwindcss_oxide::extractor::css_variable_machine::CssVariableMachine>(input)
    // _run_machine::<tailwindcss_oxide::extractor::modifier_machine::ModifierMachine>(input)
    // _run_machine::<tailwindcss_oxide::extractor::named_utility_machine::NamedUtilityMachine>(input)
    // _run_machine::<tailwindcss_oxide::extractor::named_variant_machine::NamedVariantMachine>(input)
    // _run_machine::<tailwindcss_oxide::extractor::string_machine::StringMachine>(input)
    // _run_machine::<tailwindcss_oxide::extractor::utility_machine::UtilityMachine>(input)
    // _run_machine::<tailwindcss_oxide::extractor::variant_machine::VariantMachine>(input)

    run_full_extractor(input)
}

fn main() {
    let iterations = 10_000;
    let input = include_bytes!("./fixtures/example.html");

    let throughput = Throughput::compute(iterations, input.len(), || {
        _ = black_box(
            input
                .split(|x| *x == b'\n')
                .flat_map(run)
                .collect::<Vec<_>>(),
        );
    });

    eprintln!("Extractor: {:}", throughput);
}
