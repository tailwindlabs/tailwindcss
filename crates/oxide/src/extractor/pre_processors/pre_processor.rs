pub trait PreProcessor: Sized + Default {
    fn process(&self, content: &[u8]) -> Vec<u8>;

    #[cfg(test)]
    fn test(input: &str, expected: &str) {
        use pretty_assertions::assert_eq;

        let input = input.as_bytes();
        let expected = expected.as_bytes();

        let processor = Self::default();

        let actual = processor.process(input);

        // Convert to strings for better error messages.
        let input = String::from_utf8_lossy(input);
        let actual = String::from_utf8_lossy(&actual);
        let expected = String::from_utf8_lossy(expected);

        // The input and output should have the exact same length.
        assert_eq!(input.len(), actual.len());
        assert_eq!(actual.len(), expected.len());

        assert_eq!(actual, expected);
    }

    #[cfg(test)]
    fn test_extract_contains(input: &str, items: Vec<&str>) {
        use crate::extractor::{Extracted, Extractor};

        let input = input.as_bytes();

        let processor = Self::default();
        let transformed = processor.process(input);

        let extracted = Extractor::new(&transformed).extract();

        // Extract all candidates and css variables.
        let candidates = extracted
            .iter()
            .filter_map(|x| match x {
                Extracted::Candidate(bytes) => std::str::from_utf8(bytes).ok(),
                Extracted::CssVariable(bytes) => std::str::from_utf8(bytes).ok(),
            })
            .collect::<Vec<_>>();

        // Ensure all items are present in the candidates.
        let mut missing = vec![];
        for item in &items {
            if !candidates.contains(item) {
                missing.push(item);
            }
        }

        if !missing.is_empty() {
            dbg!(&candidates, &missing);
            panic!("Missing some items");
        }
    }

    #[cfg(test)]
    fn extract_annotated(input: &[u8]) -> String {
        use crate::extractor::{Extracted, Extractor};
        use std::collections::BTreeMap;
        use unicode_width::UnicodeWidthStr;

        let processor = Self::default();
        let transformed = processor.process(input);

        let extracted = Extractor::new(&transformed).extract();

        // Extract only candidate positions
        let byte_ranges = extracted
            .iter()
            .filter_map(|x| match x {
                Extracted::Candidate(bytes) => {
                    let start = bytes.as_ptr() as usize - transformed.as_ptr() as usize;
                    let end = start + bytes.len();
                    Some((start, end))
                }
                _ => None,
            })
            .collect::<Vec<_>>();

        // Convert byte ranges to (line, start_col, end_col)
        let mut annotations = byte_ranges
            .into_iter()
            .map(|(start, end)| {
                let (line, start_col) = byte_offset_to_line_and_column(input, start);
                let (_, end_col) = byte_offset_to_line_and_column(input, end);
                (line, start_col, end_col)
            })
            .collect::<Vec<_>>();

        // Sort for safe insertion
        annotations.sort_by(|a, b| b.0.cmp(&a.0).then(b.1.cmp(&a.1)));

        // Convert input to lines
        let mut lines = std::str::from_utf8(input)
            .expect("Input must be valid UTF-8")
            .lines()
            .map(|line| line.to_string())
            .collect::<Vec<_>>();

        // Group annotations per line
        let mut grouped = BTreeMap::<usize, Vec<(usize, usize)>>::new();
        for (line, start_char, end_char) in annotations {
            grouped
                .entry(line)
                .or_default()
                .push((start_char, end_char));
        }

        // Inject annotation lines
        for (line_idx, spans) in grouped.into_iter().rev() {
            let display_line = &lines[line_idx];
            let width = UnicodeWidthStr::width(display_line.as_str());
            let mut annotation = vec![' '; width];

            for (start, end) in spans {
                for i in start..end.min(annotation.len()) {
                    annotation[i] = '^';
                }
            }

            let annotation_line: String = annotation
                .into_iter()
                .collect::<String>()
                .trim_end()
                .to_owned();
            lines.insert(line_idx + 1, annotation_line);
        }

        lines.join("\n").trim_end().to_string() + "\n"
    }
}

#[cfg(test)]
fn byte_offset_to_line_and_column(input: &[u8], offset: usize) -> (usize, usize) {
    use unicode_width::UnicodeWidthStr;

    let mut line_start = 0;
    let mut line = 0;

    for (i, &b) in input.iter().enumerate() {
        if i >= offset {
            break;
        }
        if b == b'\n' {
            line += 1;
            line_start = i + 1;
        }
    }

    let slice = &input[line_start..offset];
    let column = std::str::from_utf8(slice).expect("Valid UTF-8");
    let column = UnicodeWidthStr::width(column);

    (line, column)
}
