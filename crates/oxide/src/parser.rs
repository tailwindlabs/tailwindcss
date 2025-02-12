use crate::{cursor::Cursor, fast_skip::fast_skip};
use bstr::ByteSlice;
use fxhash::FxHashSet;
use tracing::trace;

#[derive(Debug, PartialEq, Eq, Clone)]
pub enum ParseAction<'a> {
    Consume,
    Skip,
    RestartAt(usize),

    SingleCandidate(&'a [u8]),
    MultipleCandidates(Vec<&'a [u8]>),
    Done,
}

#[derive(Debug, PartialEq, Eq, Clone)]
pub enum Bracketing<'a> {
    Included(&'a [u8]),
    Wrapped(&'a [u8]),
    None,
}

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub struct SplitCandidate<'a> {
    variant: &'a [u8],
    utility: &'a [u8],
}

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum ValidationResult {
    Invalid,
    Valid,
    Restart,
}

#[derive(Default)]
pub struct ExtractorOptions {
    pub preserve_spaces_in_arbitrary: bool,
}

#[derive(Debug, PartialEq, Eq, Clone)]
enum Arbitrary {
    /// Not inside any arbitrary value
    None,

    /// In arbitrary value mode with square brackets
    ///
    /// E.g.: `bg-[…]`
    ///           ^
    Brackets { start_idx: usize },

    /// In arbitrary value mode with parens
    ///
    /// E.g.: `bg-(…)`
    ///           ^
    Parens { start_idx: usize },
}

pub struct Extractor<'a> {
    opts: ExtractorOptions,

    input: &'a [u8],
    cursor: Cursor<'a>,

    idx_start: usize,
    idx_end: usize,
    idx_last: usize,

    arbitrary: Arbitrary,

    in_candidate: bool,
    in_escape: bool,

    discard_next: bool,

    quote_stack: Vec<u8>,
    bracket_stack: Vec<u8>,
}

impl<'a> Extractor<'a> {
    pub fn all(input: &'a [u8], opts: ExtractorOptions) -> Vec<&'a [u8]> {
        Self::new(input, opts).flatten().collect()
    }

    pub fn unique(input: &'a [u8], opts: ExtractorOptions) -> FxHashSet<&'a [u8]> {
        let mut candidates: FxHashSet<&[u8]> = Default::default();
        candidates.reserve(100);
        candidates.extend(Self::new(input, opts).flatten());
        candidates
    }

    pub fn unique_ord(input: &'a [u8], opts: ExtractorOptions) -> Vec<&'a [u8]> {
        // This is an inefficient way to get an ordered, unique
        // list as a Vec but it is only meant for testing.
        let mut candidates = Self::all(input, opts);
        let mut unique_list = FxHashSet::default();
        unique_list.reserve(candidates.len());
        candidates.retain(|c| unique_list.insert(*c));

        candidates
    }

    pub fn with_positions(input: &'a [u8], opts: ExtractorOptions) -> Vec<(&'a [u8], usize)> {
        let mut result = Vec::new();
        let extractor = Self::new(input, opts).flatten();
        for item in extractor {
            // Since the items are slices of the input buffer, we can calculate the start index
            // by doing some pointer arithmetics.
            let start_index = item.as_ptr() as usize - input.as_ptr() as usize;
            result.push((item, start_index));
        }
        result
    }
}

impl<'a> Extractor<'a> {
    pub fn new(input: &'a [u8], opts: ExtractorOptions) -> Self {
        Self {
            opts,
            input,
            cursor: Cursor::new(input),

            idx_start: 0,
            idx_end: 0,

            arbitrary: Arbitrary::None,
            in_candidate: false,
            in_escape: false,

            discard_next: false,

            idx_last: input.len(),
            quote_stack: Vec::with_capacity(8),
            bracket_stack: Vec::with_capacity(8),
        }
    }
}

/// Helpers
impl<'a> Extractor<'a> {
    #[inline(always)]
    fn in_quotes(&self) -> bool {
        !self.quote_stack.is_empty()
    }

    #[inline(always)]
    fn get_current_candidate(&mut self) -> ParseAction<'a> {
        if self.discard_next {
            return ParseAction::Skip;
        }

        let mut candidate = &self.input[self.idx_start..=self.idx_end];

        // The bracket stack is not empty, which means that we are dealing with unbalanced
        // brackets.
        if !self.bracket_stack.is_empty() {
            return ParseAction::Skip;
        }

        while !candidate.is_empty() {
            match Extractor::is_valid_candidate_string(candidate) {
                ValidationResult::Valid => return ParseAction::SingleCandidate(candidate),
                ValidationResult::Restart => return ParseAction::RestartAt(self.idx_start + 1),
                _ => {}
            }

            match candidate.split_last() {
                // At this point the candidate is technically invalid, however it can be that it
                // has a few dangling characters attached to it. For example, think about a
                // JavaScript object:
                //
                // ```js
                // { underline: true }
                // ```
                //
                // The candidate at this point will be `underline:`, which is invalid. However, we
                // can assume in this case that the `:` should not be there, and therefore we can
                // try to slice it off and retry the validation.
                Some((b':' | b'/' | b'.', head)) => {
                    candidate = head;
                }

                // It could also be that we have the candidate is nested inside of bracket or quote
                // pairs. In this case we want to retrieve the inner part and try to validate that
                // inner part instead. For example, in a JavaScript array:
                //
                // ```js
                // let myClasses = ["underline"]
                // ```
                //
                // The `underline` is nested inside of quotes and in square brackets. Let's try to
                // get the inner part and validate that instead.
                _ => match Self::slice_surrounding(candidate) {
                    Some(shorter) if shorter != candidate => {
                        candidate = shorter;
                    }
                    _ => break,
                },
            }
        }

        ParseAction::Consume
    }

    #[inline(always)]
    fn split_candidate(candidate: &'a [u8]) -> SplitCandidate<'a> {
        let mut brackets = 0;
        let mut idx_end = 0;

        for (n, c) in candidate.iter().enumerate() {
            match c {
                b'[' => brackets += 1,
                b']' if brackets > 0 => brackets -= 1,
                b':' if brackets == 0 => idx_end = n + 1,
                _ => {}
            }
        }

        SplitCandidate {
            variant: &candidate[0..idx_end],
            utility: &candidate[idx_end..],
        }
    }

    #[inline(always)]
    fn contains_in_constrained(candidate: &'a [u8], bytes: Vec<u8>) -> bool {
        let mut brackets = 0;

        for c in candidate {
            match c {
                b'[' => brackets += 1,
                b']' if brackets > 0 => brackets -= 1,
                _ if brackets == 0 && bytes.contains(c) => return true,
                _ => {}
            }
        }

        false
    }

    #[inline(always)]
    fn is_valid_candidate_string(candidate: &'a [u8]) -> ValidationResult {
        // Reject candidates that start with a capital letter
        if candidate[0].is_ascii_uppercase() {
            return ValidationResult::Invalid;
        }

        // Rejects candidates that end with "-" or "_"
        if candidate.ends_with(b"-") || candidate.ends_with(b"_") {
            return ValidationResult::Invalid;
        }

        // Reject candidates that are single camelCase words, e.g.: `useEffect`
        if candidate.iter().all(|c| c.is_ascii_alphanumeric())
            && candidate.iter().any(|c| c.is_ascii_uppercase())
        {
            return ValidationResult::Invalid;
        }

        // Reject candidates that look like SVG path data, e.g.: `m32.368 m7.5`
        if !candidate.contains(&b'-')
            && !candidate.contains(&b':')
            && candidate.iter().any(|c| c == &b'.')
        {
            return ValidationResult::Invalid;
        }

        // Reject candidates that look like version constraints or email addresses, e.g.: `next@latest`, `bob@example.com`
        if candidate
            .iter()
            .all(|c| c.is_ascii_alphanumeric() || c == &b'.' || c == &b'-' || c == &b'@')
            && candidate[1..].contains(&b'@')
        {
            return ValidationResult::Invalid;
        }

        // Reject candidates that look like URLs
        if candidate.starts_with(b"http://") || candidate.starts_with(b"https://") {
            return ValidationResult::Invalid;
        }

        // Reject candidates that look short markdown links, e.g.: `[https://example.com]`
        if candidate.starts_with(b"[http://") || candidate.starts_with(b"[https://") {
            return ValidationResult::Invalid;
        }

        // Reject candidates that look like imports with path aliases, e.g.: `@/components/button`
        if candidate.len() > 1 && candidate[1] == b'/' {
            return ValidationResult::Invalid;
        }

        // Reject candidates that look like paths, e.g.: `app/assets/stylesheets`
        if !candidate.contains(&b':') && !candidate.contains(&b'[') {
            let mut count = 0;
            for c in candidate {
                if c == &b'/' {
                    count += 1;
                }
                if count > 1 {
                    return ValidationResult::Invalid;
                }
            }
        }

        let split_candidate = Extractor::split_candidate(candidate);

        let mut offset = 0;
        let mut offset_end = 0;
        let utility = &split_candidate.utility;
        let original_utility = &utility;

        // Some special cases that we can ignore while validating
        if utility.starts_with(b"!-") {
            offset += 2;
        } else if utility.starts_with(b"!") || utility.starts_with(b"-") {
            offset += 1;
        } else if utility.ends_with(b"!") {
            offset_end += 1;
        }

        // These are allowed in arbitrary values and in variants but nowhere else
        if Extractor::contains_in_constrained(utility, vec![b'<', b'>']) {
            return ValidationResult::Restart;
        }

        // It's an arbitrary property
        if utility.starts_with(b"[")
            && utility.ends_with(b"]")
            && (utility.starts_with(b"['")
                || utility.starts_with(b"[\"")
                || utility.starts_with(b"[`"))
        {
            return ValidationResult::Restart;
        }

        // Only allow parentheses for the shorthand arbitrary custom properties syntax
        if let Some(index) = utility.find(b"(") {
            let mut skip_parens_check = false;
            let start_brace_index = utility.find(b"[");
            let end_brace_index = utility.find(b"]");

            if let (Some(start_brace_index), Some(end_brace_index)) =
                (start_brace_index, end_brace_index)
            {
                if start_brace_index < index && end_brace_index > index {
                    skip_parens_check = true;
                }
            }

            if !skip_parens_check && !utility[index + 1..].starts_with(b"--") {
                return ValidationResult::Restart;
            }
        }

        // Pluck out the part that we are interested in.
        let utility = &utility[offset..(utility.len() - offset_end)];

        // Validations
        // We should have _something_
        if utility.is_empty() {
            return ValidationResult::Invalid;
        }

        // <sm is fine, but only as a variant
        // TODO: We probably have to ensure that this `:` is not inside the arbitrary values...
        if utility.starts_with(b"<") && !utility.contains(&b':') {
            return ValidationResult::Invalid;
        }

        // Only variants can start with a number. E.g.: `2xl` is fine, but only as a variant.
        // TODO: Adjust this if we run into issues with actual utilities starting with a number?
        // TODO: We probably have to ensure that this `:` is not inside the arbitrary values...
        if utility[0] >= b'0' && utility[0] <= b'9' && !utility.contains(&b':') {
            return ValidationResult::Invalid;
        }

        // In case of an arbitrary property, we should have at least this structure: [a:b]
        if utility.starts_with(b"[") && utility.ends_with(b"]") {
            // [a:b] is at least 5 characters long
            if utility.len() < 5 {
                return ValidationResult::Invalid;
            }

            // Now that we validated that the candidate is technically fine, let's ensure that it
            // doesn't start with a `-` because that would make it invalid for arbitrary properties.
            if original_utility.starts_with(b"-") || original_utility.starts_with(b"!-") {
                return ValidationResult::Invalid;
            }

            // Make sure an arbitrary property/value pair is valid, otherwise
            // we may generate invalid CSS that will cause tools like PostCSS
            // to crash when trying to parse the generated CSS.
            if !Self::validate_arbitrary_property(utility) {
                return ValidationResult::Invalid;
            }

            // The ':` must be preceded by a-Z0-9 because it represents a property name.
            // SAFETY: the Self::validate_arbitrary_property function from above validates that the
            //         `:` exists.
            let colon = utility.find(":").unwrap();

            if !utility
                .chars()
                .nth(colon - 1)
                .map_or_else(|| false, |c| c.is_ascii_alphanumeric())
            {
                return ValidationResult::Invalid;
            }

            let property = &utility[1..colon];

            // The property must match /^[a-zA-Z-][a-zA-Z0-9-_]+$/
            if !property[0].is_ascii_alphabetic() && property[0] != b'-' {
                return ValidationResult::Invalid;
            }

            if !property
                .iter()
                .all(|c| c.is_ascii_alphanumeric() || c == &b'-' || c == &b'_')
            {
                return ValidationResult::Invalid;
            }
        }

        ValidationResult::Valid
    }

    /**
     * Make sure an arbitrary property/value pair is valid, otherwise
     * PostCSS may crash when trying to parse the generated CSS.
     *
     * `input` - the full candidate string, including the brackets
     */
    fn validate_arbitrary_property(candidate: &[u8]) -> bool {
        if !candidate.starts_with(b"[") || !candidate.ends_with(b"]") {
            return false;
        }
        let property = &candidate[1..candidate.len() - 1];
        let is_custom_property = property.starts_with(b"--");
        let Some(colon_pos) = property.find(b":") else {
            return false;
        };
        if is_custom_property {
            return true;
        }

        let mut stack = vec![];
        let mut iter = property[colon_pos + 1..].iter();
        while let Some(c) = iter.next() {
            match c {
                // The value portion cannot contain unquoted colons.
                // E.g. `[foo::bar]` leads to "foo::bar; which errors because of the `:`.
                b':' | b'{' | b'}' if stack.is_empty() => {
                    return false;
                }

                b'\'' => {
                    if let Some(b'\'') = stack.last() {
                        _ = stack.pop()
                    } else {
                        stack.push(b'\'')
                    }
                }
                b'"' => {
                    if let Some(b'"') = stack.last() {
                        _ = stack.pop()
                    } else {
                        stack.push(b'"')
                    }
                }

                // Skip escaped characters.
                b'\\' => {
                    iter.next();
                }

                _ => {}
            }
        }

        true
    }

    #[inline(always)]
    fn parse_escaped(&mut self) -> ParseAction<'a> {
        // If this character is escaped, we don't care about it.
        // It gets consumed.
        trace!("Escape::Consume");

        self.in_escape = false;

        ParseAction::Consume
    }

    #[inline(always)]
    fn parse_arbitrary(&mut self) -> ParseAction<'a> {
        // In this we could technically use memchr 6 times (then looped) to find the indexes / bounds of arbitrary values
        if self.in_escape {
            return self.parse_escaped();
        }

        match self.cursor.curr {
            b'\\' => {
                // The `\` character is used to escape characters in arbitrary content _and_ to prevent the starting of arbitrary content
                trace!("Arbitrary::Escape");
                self.in_escape = true;
            }

            b'(' => self.bracket_stack.push(self.cursor.curr),
            b')' => match self.bracket_stack.last() {
                Some(&b'(') => {
                    self.bracket_stack.pop();
                }

                // This is the last bracket meaning the end of arbitrary content
                _ if !self.in_quotes() => {
                    if matches!(self.cursor.next, b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9') {
                        return ParseAction::Consume;
                    }

                    if let Arbitrary::Parens { start_idx } = self.arbitrary {
                        trace!("Arbitrary::End\t");
                        self.arbitrary = Arbitrary::None;

                        if self.cursor.pos - start_idx == 1 {
                            // We have an empty arbitrary value, which is not allowed
                            return ParseAction::Skip;
                        }

                        // We have a valid arbitrary value
                        return ParseAction::Consume;
                    }

                    // Last parenthesis is different compared to what we expect, therefore we are
                    // not in a valid arbitrary value.
                    return ParseAction::Skip;
                }

                // We're probably in quotes or nested brackets, so we keep going
                _ => {}
            },

            // Make sure the brackets are balanced
            b'[' => self.bracket_stack.push(self.cursor.curr),
            b']' => match self.bracket_stack.last() {
                // We've ended a nested bracket
                Some(&b'[') => {
                    self.bracket_stack.pop();
                }

                // This is the last bracket meaning the end of arbitrary content
                _ if !self.in_quotes() => {
                    if matches!(self.cursor.next, b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9') {
                        return ParseAction::Consume;
                    }

                    if let Arbitrary::Brackets { start_idx: _ } = self.arbitrary {
                        trace!("Arbitrary::End\t");
                        self.arbitrary = Arbitrary::None;

                        // TODO: This is temporarily disabled such that the upgrade tool can work
                        // with legacy arbitrary values. This will be re-enabled in the future (or
                        // with a flag)
                        // if self.cursor.pos - start_idx == 1 {
                        //     // We have an empty arbitrary value, which is not allowed
                        //     return ParseAction::Skip;
                        // }
                    }
                }

                // We're probably in quotes or nested brackets, so we keep going
                _ => {}
            },

            // Arbitrary values sometimes contain quotes
            // These can "escape" the arbitrary value mode
            // switching of `[` and `]` characters
            b'"' | b'\'' | b'`' => match self.quote_stack.last() {
                Some(&last_quote) if last_quote == self.cursor.curr => {
                    trace!("Quote::End\t");
                    self.quote_stack.pop();
                }
                _ => {
                    trace!("Quote::Start\t");
                    self.quote_stack.push(self.cursor.curr);
                }
            },

            c if c.is_ascii_whitespace() && !self.opts.preserve_spaces_in_arbitrary => {
                trace!("Arbitrary::SkipAndEndEarly\t");

                if let Arbitrary::Brackets { start_idx } | Arbitrary::Parens { start_idx } =
                    self.arbitrary
                {
                    // Restart the parser ahead of the arbitrary value It may pick up more
                    // candidates
                    return ParseAction::RestartAt(start_idx + 1);
                }
            }

            // Arbitrary values allow any character inside them
            // Except spaces unless you are in loose mode
            _ => {
                trace!("Arbitrary::Consume\t");
                // No need to move the end index because either the arbitrary value will end properly OR we'll hit invalid characters
            }
        }

        ParseAction::Consume
    }

    #[inline(always)]
    fn parse_start(&mut self) -> ParseAction<'a> {
        match self.cursor.curr {
            // Enter arbitrary property mode
            b'[' if self.cursor.prev != b'\\' => {
                trace!("Arbitrary::Start\t");
                self.arbitrary = Arbitrary::Brackets {
                    start_idx: self.cursor.pos,
                };

                ParseAction::Consume
            }

            // Allowed first characters.
            b'@' | b'!' | b'-' | b'<' | b'>' | b'0'..=b'9' | b'a'..=b'z' | b'A'..=b'Z' | b'*' => {
                // TODO: A bunch of characters that we currently support but maybe we only want it behind
                // a flag. E.g.: `<sm`
                // | '$' | '^' | '_'

                // When the new candidate is preceded by a `:`, then we want to keep parsing, but
                // throw away the full candidate because it can not be a valid candidate at the end
                // of the day.
                if self.cursor.prev == b':' {
                    self.discard_next = true;
                }

                trace!("Candidate::Start\t");

                ParseAction::Consume
            }

            _ => ParseAction::Skip,
        }
    }

    #[inline(always)]
    fn parse_continue(&mut self) -> ParseAction<'a> {
        match self.cursor.curr {
            // Enter arbitrary value mode. E.g.: `bg-[rgba(0, 0, 0)]`
            //                                       ^
            b'[' if matches!(self.cursor.prev, b'@' | b'-' | b':' | b'/' | b'!' | b'\0')
                || self.cursor.prev.is_ascii_whitespace() =>
            {
                trace!("Arbitrary::Start\t");
                self.arbitrary = Arbitrary::Brackets {
                    start_idx: self.cursor.pos,
                };
            }

            // Enter arbitrary value mode. E.g.: `bg-(--my-color)`
            //                                       ^
            b'(' if matches!(self.cursor.prev, b'-' | b'/') => {
                trace!("Arbitrary::Start\t");
                self.arbitrary = Arbitrary::Parens {
                    start_idx: self.cursor.pos,
                };
            }

            // Can't enter arbitrary value mode. This can't be a candidate.
            b'[' | b'(' => {
                trace!("Arbitrary::Skip_Start\t");
                return ParseAction::Skip;
            }

            // A % can only appear at the end of the candidate itself. It can also only be after a
            // digit 0-9. This covers the following cases:
            // - from-15%
            b'%' if self.cursor.prev.is_ascii_digit() => {
                return match (self.cursor.at_end, self.cursor.next) {
                    // End of string == end of candidate == okay
                    (true, _) => ParseAction::Consume,

                    // Looks like the end of a candidate == okay
                    (_, b'\'' | b'"' | b'`') => ParseAction::Consume,
                    (_, c) if c.is_ascii_whitespace() => ParseAction::Consume,

                    // Otherwise, not a valid character in a candidate
                    _ => ParseAction::Skip,
                };
            }
            b'%' => return ParseAction::Skip,

            // < and > can only be part of a variant and only be the first or last character
            b'<' | b'>' | b'*' => {
                // Can only be the first or last character
                //
                // E.g.:
                //
                // - <sm:underline
                //   ^
                // - md>:underline
                //     ^
                if self.cursor.pos == self.idx_start || self.cursor.pos == self.idx_last {
                    trace!("Candidate::Consume\t");
                }
                // If it is in the middle, it can only be part of a stacked variant
                // - dark:<sm:underline
                //        ^
                // - dark:md>:underline
                //          ^
                else if self.cursor.prev == b':' || self.cursor.next == b':' {
                    trace!("Candidate::Consume\t");
                } else {
                    return ParseAction::Skip;
                }
            }

            // Allowed characters in the candidate itself
            // None of these can come after a closing bracket `]`
            b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9' | b'-' | b'_' | b'@'
                if self.cursor.prev != b']' =>
            {
                /* TODO: The `b'@'` is necessary for custom separators like _@, maybe we can handle this in a better way... */
                trace!("Candidate::Consume\t");
            }

            // A dot (.) can only appear in the candidate itself (not the arbitrary part), if the previous
            // and next characters are both digits. This covers the following cases:
            // - p-1.5
            b'.' if self.cursor.prev.is_ascii_digit() => match self.cursor.next {
                next if next.is_ascii_digit() => {
                    trace!("Candidate::Consume\t");
                }
                _ => return ParseAction::Skip,
            },

            // Allowed characters in the candidate itself
            // These MUST NOT appear at the end of the candidate
            b'/' | b':' if !self.cursor.at_end => {
                trace!("Candidate::Consume\t");
            }

            // The important character `!`, is allowed at the end of the candidate
            b'!' => {
                trace!("Candidate::Consume\t");
            }

            _ => return ParseAction::Skip,
        }

        ParseAction::Consume
    }

    #[inline(always)]
    fn can_be_candidate(&mut self) -> bool {
        self.in_candidate
            && matches!(self.arbitrary, Arbitrary::None)
            && (0..=127).contains(&self.cursor.curr)
            && (self.idx_start == 0 || self.input[self.idx_start - 1] <= 127)
    }

    #[inline(always)]
    fn handle_skip(&mut self) {
        // In all other cases, we skip characters and reset everything so we can make new candidates
        trace!("Characters::Skip\t");
        self.idx_start = self.cursor.pos;
        self.idx_end = self.cursor.pos;
        self.in_candidate = false;
        self.arbitrary = Arbitrary::None;
        self.in_escape = false;
    }

    #[inline(always)]
    fn parse_char(&mut self) -> ParseAction<'a> {
        if !matches!(self.arbitrary, Arbitrary::None) {
            self.parse_arbitrary()
        } else if self.in_candidate {
            self.parse_continue()
        } else if self.parse_start() == ParseAction::Consume {
            self.in_candidate = true;
            self.idx_start = self.cursor.pos;
            self.idx_end = self.cursor.pos;

            ParseAction::Consume
        } else {
            ParseAction::Skip
        }
    }

    #[inline(always)]
    fn yield_candidate(&mut self) -> ParseAction<'a> {
        if self.can_be_candidate() {
            self.get_current_candidate()
        } else {
            ParseAction::Consume
        }
    }

    #[inline(always)]
    fn restart(&mut self, pos: usize) {
        trace!("Parser::Restart\t{}", pos);

        self.idx_start = pos;
        self.idx_end = pos;

        self.arbitrary = Arbitrary::None;
        self.in_candidate = false;
        self.in_escape = false;

        self.discard_next = false;

        self.quote_stack.clear();
        self.bracket_stack.clear();
        self.cursor.move_to(pos);
    }

    #[inline(always)]
    fn without_surrounding(&self) -> Bracketing<'a> {
        let range = self.idx_start..=self.idx_end;
        let clipped = &self.input[range];

        Self::slice_surrounding(clipped)
            .map(Bracketing::Included)
            .or_else(|| {
                if self.idx_start == 0 || self.idx_end + 1 == self.idx_last {
                    return None;
                }

                let range = self.idx_start - 1..=self.idx_end + 1;
                let clipped = &self.input[range];
                Self::slice_surrounding(clipped).map(Bracketing::Wrapped)
            })
            .unwrap_or(Bracketing::None)
    }

    #[inline(always)]
    fn is_balanced(input: &[u8]) -> bool {
        let mut depth = 0isize;

        for n in input {
            match n {
                b'[' | b'{' | b'(' => depth += 1,
                b']' | b'}' | b')' => depth -= 1,
                _ => continue,
            }

            if depth < 0 {
                return false;
            }
        }

        depth == 0
    }

    #[inline(always)]
    fn slice_surrounding(input: &[u8]) -> Option<&[u8]> {
        let mut prev = None;
        let mut input = input;

        loop {
            let leading = input.first().unwrap_or(&0x00);
            let trailing = input.last().unwrap_or(&0x00);

            let needed = matches!(
                (leading, trailing),
                (b'(', b')')
                    | (b'{', b'}')
                    | (b'[', b']')
                    | (b'"', b'"')
                    | (b'`', b'`')
                    | (b'\'', b'\'')
            );

            if needed {
                prev = Some(input);
                input = &input[1..input.len() - 1];
                continue;
            }
            if Self::is_balanced(input) && prev.is_some() {
                return Some(input);
            }
            return prev;
        }
    }

    #[inline(always)]
    fn parse_and_yield(&mut self) -> ParseAction<'a> {
        trace!("Cursor {}", self.cursor);

        // Fast skipping of invalid characters
        let can_skip_whitespace = false; // if self.opts.preserve_spaces_in_arbitrary { !self.in_arbitrary } else { true };
        if can_skip_whitespace {
            if let Some(pos) = fast_skip(&self.cursor) {
                trace!("FastSkip::Restart\t{}", pos);
                return ParseAction::RestartAt(pos);
            }
        }

        let action = self.parse_char();

        match action {
            ParseAction::RestartAt(_) => return action,
            ParseAction::Consume => {
                self.idx_end = self.cursor.pos;

                // If we're still consuming characters, we keep going
                // Only exception is if we've hit the end of the input
                if !self.cursor.at_end {
                    return action;
                }
            }
            _ => {}
        }

        let action = self.yield_candidate();

        match (&action, self.cursor.curr) {
            (ParseAction::RestartAt(_), _) => action,
            (_, 0x00) => ParseAction::Done,
            (ParseAction::SingleCandidate(candidate), _) => self.generate_slices(candidate),
            _ => ParseAction::RestartAt(self.cursor.pos + 1),
        }
    }

    /// Peek inside `[]`, `{}`, and `()` pairs
    /// to look for an additional candidate
    #[inline(always)]
    fn generate_slices(&mut self, candidate: &'a [u8]) -> ParseAction<'a> {
        match self.without_surrounding() {
            Bracketing::None => ParseAction::SingleCandidate(candidate),
            Bracketing::Included(sliceable) | Bracketing::Wrapped(sliceable) => {
                if candidate == sliceable {
                    ParseAction::SingleCandidate(candidate)
                } else {
                    let parts = vec![candidate, sliceable];
                    let parts = parts
                        .into_iter()
                        .filter(|v| !v.is_empty())
                        .collect::<Vec<_>>();

                    ParseAction::MultipleCandidates(parts)
                }
            }
        }
    }
}

impl<'a> Iterator for Extractor<'a> {
    type Item = Vec<&'a [u8]>;

    fn next(&mut self) -> Option<Self::Item> {
        if self.cursor.at_end {
            return None;
        }

        loop {
            let result = self.parse_and_yield();

            // Cursor control
            match result {
                ParseAction::RestartAt(pos) => self.restart(pos),
                _ => self.cursor.advance_by(1),
            }

            // Candidate state control
            match result {
                ParseAction::SingleCandidate(_) => self.handle_skip(),
                ParseAction::MultipleCandidates(_) => self.handle_skip(),
                _ => {}
            }

            // Iterator results
            return match result {
                ParseAction::SingleCandidate(candidate) => Some(vec![candidate]),
                ParseAction::MultipleCandidates(candidates) => Some(candidates),
                ParseAction::Done => None,
                _ => continue,
            };
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    fn _please_trace() {
        tracing_subscriber::fmt()
            .with_max_level(tracing::Level::TRACE)
            .with_span_events(tracing_subscriber::fmt::format::FmtSpan::ACTIVE)
            .compact()
            .init();
    }

    fn run(input: &str, loose: bool) -> Vec<&str> {
        Extractor::unique_ord(
            input.as_bytes(),
            ExtractorOptions {
                preserve_spaces_in_arbitrary: loose,
            },
        )
        .into_iter()
        .map(|s| unsafe { std::str::from_utf8_unchecked(s) })
        .collect()
    }

    #[test]
    fn it_can_parse_simple_candidates() {
        let candidates = run("underline", false);
        assert_eq!(candidates, vec!["underline"]);
    }

    #[test]
    fn it_can_parse_multiple_simple_utilities() {
        let candidates = run("font-bold underline", false);
        assert_eq!(candidates, vec!["font-bold", "underline"]);
    }

    #[test]
    fn it_can_parse_simple_candidates_with_variants() {
        let candidates = run("hover:underline", false);
        assert_eq!(candidates, vec!["hover:underline"]);
    }

    #[test]
    fn it_can_parse_start_variants() {
        let candidates = run("*:underline", false);
        assert_eq!(candidates, vec!["*:underline"]);

        let candidates = run("hover:*:underline", false);
        assert_eq!(candidates, vec!["hover:*:underline"]);
    }

    #[test]
    fn it_can_parse_simple_candidates_with_stacked_variants() {
        let candidates = run("focus:hover:underline", false);
        assert_eq!(candidates, vec!["focus:hover:underline"]);
    }

    #[test]
    fn it_can_parse_utilities_with_arbitrary_values() {
        let candidates = run("m-[2px]", false);
        assert_eq!(candidates, vec!["m-[2px]"]);
    }

    #[test]
    fn it_can_parse_utilities_with_arbitrary_var_shorthand() {
        let candidates = run("m-(--my-var)", false);
        assert_eq!(candidates, vec!["m-(--my-var)"]);
    }

    #[test]
    fn it_can_parse_utilities_with_arbitrary_var_shorthand_as_modifier() {
        let candidates = run("bg-(--my-color)/(--my-opacity)", false);
        assert_eq!(candidates, vec!["bg-(--my-color)/(--my-opacity)"]);
    }

    #[test]
    fn it_throws_away_arbitrary_values_that_are_unbalanced() {
        let candidates = run("m-[calc(100px*2]", false);
        assert!(candidates.is_empty());
    }

    #[test]
    fn it_can_parse_utilities_with_arbitrary_values_and_variants() {
        let candidates = run("hover:m-[2px]", false);
        assert_eq!(candidates, vec!["hover:m-[2px]"]);
    }

    #[test]
    fn it_can_parse_arbitrary_variants() {
        let candidates = run("[@media(min-width:200px)]:underline", false);
        assert_eq!(candidates, vec!["[@media(min-width:200px)]:underline"]);
    }

    #[test]
    fn it_can_parse_matched_variants() {
        let candidates = run("group-[&:hover]:underline", false);
        assert_eq!(candidates, vec!["group-[&:hover]:underline"]);
    }

    #[test]
    fn it_should_not_keep_spaces() {
        let candidates = run("bg-[rgba(0, 0, 0)]", false);

        assert_eq!(candidates, vec!["rgba"]);
    }

    #[test]
    fn it_should_keep_spaces_in_loose_mode() {
        let candidates = run("bg-[rgba(0, 0, 0)]", true);
        assert_eq!(candidates, vec!["bg-[rgba(0, 0, 0)]"]);
    }

    #[test]
    fn it_should_keep_important_arbitrary_properties_legacy() {
        let candidates = run("![foo:bar]", false);
        assert_eq!(candidates, vec!["![foo:bar]"]);
    }

    #[test]
    fn it_should_keep_important_arbitrary_properties() {
        let candidates = run("[foo:bar]!", false);
        assert_eq!(candidates, vec!["[foo:bar]!"]);
    }

    #[test]
    fn it_should_keep_important_arbitrary_values() {
        let candidates = run("w-[calc(var(--size)/2)]!", false);
        assert_eq!(candidates, vec!["w-[calc(var(--size)/2)]!"]);
    }

    #[test]
    fn it_should_keep_important_candidates_legacy() {
        let candidates = run("!w-4", false);
        assert_eq!(candidates, vec!["!w-4"]);
    }

    #[test]
    fn it_should_keep_important_candidates() {
        let candidates = run("w-4!", false);
        assert_eq!(candidates, vec!["w-4!"]);
    }

    #[test]
    fn it_should_not_allow_for_bogus_candidates() {
        let candidates = run("[0]", false);
        assert!(candidates.is_empty());

        let candidates = run("[something]", false);
        assert_eq!(candidates, vec!["something"]);

        let candidates = run(" [feature(slice_as_chunks)]", false);
        assert_eq!(candidates, vec!["feature", "slice_as_chunks"]);

        let candidates = run("![feature(slice_as_chunks)]", false);
        assert!(candidates.is_empty());

        let candidates = run("-[feature(slice_as_chunks)]", false);
        assert!(candidates.is_empty());

        let candidates = run("!-[feature(slice_as_chunks)]", false);
        assert!(candidates.is_empty());

        let candidates = run("-[foo:bar]", false);
        assert!(candidates.is_empty());

        let candidates = run("!-[foo:bar]", false);
        assert!(candidates.is_empty());
    }

    #[test]
    fn it_should_keep_candidates_with_brackets_in_arbitrary_values_inside_quotes() {
        let candidates = run("content-['hello_[_]_world']", false);
        assert_eq!(candidates, vec!["content-['hello_[_]_world']"]);
    }

    #[test]
    fn it_should_ignore_leading_spaces() {
        let candidates = run("        backdrop-filter-none", false);
        assert_eq!(candidates, vec!["backdrop-filter-none"]);
    }

    #[test]
    fn it_should_ignore_trailing_spaces() {
        let candidates = run("backdrop-filter-none        ", false);
        assert_eq!(candidates, vec!["backdrop-filter-none"]);
    }

    #[test]
    fn it_should_keep_classes_before_an_ending_newline() {
        let candidates = run("backdrop-filter-none\n", false);
        assert_eq!(candidates, vec!["backdrop-filter-none"]);
    }

    #[test]
    fn it_should_parse_out_the_correct_classes_from_tailwind_tests() {
        // From: tests/arbitrary-variants.test.js
        let candidates = run(
            r#"
                <div class="dark:lg:hover:[&>*]:underline"></div>

                <div class="[&_.foo\_\_bar]:hover:underline"></div>
                <div class="hover:[&_.foo\_\_bar]:underline"></div>
            "#,
            false,
        );
        // TODO: it should not include additional (separate) classes: class, hover:, foo: bar, underline
        // TODO: Double check the expectations based on above information
        assert_eq!(
            candidates,
            vec![
                "div",
                "class",
                r#"dark:lg:hover:[&>*]:underline"#,
                r#"[&_.foo\_\_bar]:hover:underline"#,
                r#"hover:[&_.foo\_\_bar]:underline"#
            ]
        );
    }

    #[test]
    fn potential_candidates_are_skipped_when_hitting_impossible_characters() {
        let candidates = run("        <p class=\"text-sm text-blue-700\">A new software update is available. See what’s new in version 2.0.4.</p>", false);
        assert_eq!(
            candidates,
            vec![
                "p",
                "class",
                "text-sm",
                "text-blue-700",
                // "A", // Uppercase first letter is not allowed
                "new",
                "software",
                "update",
                "is",
                "available",
                // "See", // Uppercase first letter is not allowed
                // "what", // what is dropped because it is followed by the fancy: ’
                // "s",    // s is dropped because it is preceded by the fancy: ’
                // "new", // Already seen
                "in",
                "version",
            ]
        );
    }

    #[test]
    fn ignores_arbitrary_property_ish_things() {
        let candidates = run(" [feature(slice_as_chunks)]", false);
        assert_eq!(candidates, vec!["feature", "slice_as_chunks",]);
    }

    #[test]
    fn foo_bar() {
        // w[…] is not a valid pattern for part of candidate
        // but @[] is (specifically in the context of a variant)

        let candidates = run("%w[text-[#bada55]]", false);
        assert_eq!(candidates, vec!["w", "text-[#bada55]"]);
    }

    #[test]
    fn crash_001() {
        let candidates = run("Aҿɿ[~5", false);
        assert!(candidates.is_empty());
    }

    #[test]
    fn crash_002() {
        let candidates = run("", false);
        assert!(candidates.is_empty());
    }

    #[test]
    fn bad_001() {
        let candidates = run("[杛杛]/", false);
        assert_eq!(candidates, vec!["杛杛"]);
    }

    #[test]
    fn bad_002() {
        let candidates = run(r"[\]\\\:[]", false);
        assert!(candidates.is_empty());
    }

    #[test]
    fn bad_003() {
        // TODO: This seems… wrong
        let candidates = run(r"[𕤵:]", false);
        assert_eq!(candidates, vec!["𕤵", "𕤵:",]);
    }

    #[test]
    fn classes_in_js_arrays() {
        let candidates = run(
            r#"let classes = ['bg-black', 'hover:px-0.5', 'text-[13px]', '[--my-var:1_/_2]', '[.foo_&]:px-[0]', '[.foo_&]:[color:red]']">"#,
            false,
        );
        assert_eq!(
            candidates,
            vec![
                "let",
                "classes",
                "bg-black",
                "hover:px-0.5",
                "text-[13px]",
                "[--my-var:1_/_2]",
                "--my-var:1_/_2",
                "[.foo_&]:px-[0]",
                "[.foo_&]:[color:red]",
            ]
        );
    }

    #[test]
    fn classes_in_js_arrays_without_spaces() {
        let candidates = run(
            r#"let classes = ['bg-black','hover:px-0.5','text-[13px]','[--my-var:1_/_2]','[.foo_&]:px-[0]','[.foo_&]:[color:red]']">"#,
            false,
        );
        assert_eq!(
            candidates,
            vec![
                "let",
                "classes",
                "bg-black",
                "hover:px-0.5",
                "text-[13px]",
                "[--my-var:1_/_2]",
                "--my-var:1_/_2",
                "[.foo_&]:px-[0]",
                "[.foo_&]:[color:red]",
            ]
        );
    }

    #[test]
    fn classes_as_object_keys() {
        let candidates = run(
            r#"<div :class="{ underline: active, 'px-1.5': online }"></div>"#,
            false,
        );
        assert_eq!(
            candidates,
            vec!["div", "underline", "active", "px-1.5", "online"]
        );
    }

    #[test]
    fn multiple_nested_candidates() {
        let candidates = run(r#"{color:red}"#, false);
        assert_eq!(candidates, vec!["color:red"]);
    }

    #[test]
    fn percent_ended_candidates() {
        let candidates = run(
            r#"<!-- This should work `underline from-50% flex` -->"#,
            false,
        );
        assert_eq!(
            candidates,
            vec!["should", "work", "underline", "from-50%", "flex",]
        );
    }

    #[test]
    fn candidate_cannot_start_with_uppercase_character() {
        let candidates = run(r#"<div class="foo Bar baz"></div>"#, false);
        assert_eq!(candidates, vec!["div", "class", "foo", "baz"]);
    }

    #[test]
    fn candidate_cannot_end_with_a_dash() {
        let candidates = run(r#"<div class="foo bar- baz"></div>"#, false);
        assert_eq!(candidates, vec!["div", "class", "foo", "baz"]);
    }

    #[test]
    fn candidate_cannot_end_with_an_underscore() {
        let candidates = run(r#"<div class="foo bar_ baz"></div>"#, false);
        assert_eq!(candidates, vec!["div", "class", "foo", "baz"]);
    }

    #[test]
    fn candidate_cannot_be_a_single_camelcase_word() {
        let candidates = run(r#"<div class="foo useEffect baz"></div>"#, false);
        assert_eq!(candidates, vec!["div", "class", "foo", "baz"]);
    }

    #[test]
    fn candidate_cannot_be_svg_path_data() {
        let candidates = run(r#"<path d="M25.517 0C18.712">"#, false);
        assert_eq!(candidates, vec!["path", "d"]);
    }

    #[test]
    fn candidate_cannot_be_email_or_version_constraint() {
        let candidates = run(r#"<div class="@container/dialog"> next@latest"#, false);
        assert_eq!(candidates, vec!["div", "class", "@container/dialog"]);
    }

    #[test]
    fn candidate_cannot_be_a_url() {
        let candidates = run(
            r#"Our website is https://example.com or http://example.com if you want a virus"#,
            false,
        );
        assert_eq!(
            candidates,
            vec!["website", "is", "com", "or", "if", "you", "want", "a", "virus"]
        );
    }

    #[test]
    fn candidate_cannot_be_a_paths_with_aliases() {
        let candidates = run(r#"import potato from '@/potato';"#, false);
        assert_eq!(candidates, vec!["import", "potato", "from"]);
    }

    #[test]
    fn candidate_cannot_be_a_path() {
        let candidates = run(
            r#"import potato from 'some/path/to/something';
            import banana from '@/banana';"#,
            false,
        );
        assert_eq!(candidates, vec!["import", "potato", "from", "banana"]);
    }

    #[test]
    fn ruby_percent_formatted_strings() {
        let candidates = run(r#"%w[hover:flex]"#, false);
        assert_eq!(candidates, vec!["w", "hover:flex"]);
    }

    #[test]
    fn urls_in_arbitrary_values_are_ok() {
        let candidates = run(r#"<div class="bg-[url('/img/hero-pattern.svg')]">"#, false);
        assert_eq!(
            candidates,
            vec!["div", "class", "bg-[url('/img/hero-pattern.svg')]"]
        );
    }

    #[test]
    fn colon_in_arbitrary_property_value() {
        let candidates = run("[color::] #[test::foo]", false);
        assert!(candidates
            .iter()
            .all(|candidate| !candidate.starts_with('[')));
    }

    #[test]
    fn braces_in_arbitrary_property_value() {
        let candidates = run("[color:${foo}] #[test:{foo}]", false);
        assert!(candidates
            .iter()
            .all(|candidate| !candidate.starts_with('[')));
    }

    #[test]
    fn quoted_colon_in_arbitrary_property_value() {
        let candidates = run("[content:'bar:bar'] [content:\"bar:bar\"]", false);
        assert!(candidates
            .iter()
            .any(|candidate| candidate == &"[content:'bar:bar']"));
        assert!(candidates
            .iter()
            .any(|candidate| candidate == &"[content:\"bar:bar\"]"));
    }

    #[test]
    fn quoted_braces_in_arbitrary_property_value() {
        let candidates = run("[content:'{bar}'] [content:\"{bar}\"]", false);
        assert!(candidates
            .iter()
            .any(|candidate| candidate == &"[content:'{bar}']"));
        assert!(candidates
            .iter()
            .any(|candidate| candidate == &"[content:\"{bar}\"]"));
    }

    #[test]
    fn colon_in_custom_property_value() {
        let candidates = run("[--foo:bar:bar]", false);
        assert!(candidates
            .iter()
            .any(|candidate| candidate == &"[--foo:bar:bar]"));
    }

    #[test]
    fn braces_in_custom_property_value() {
        let candidates = run("[--foo:{bar}]", false);
        assert!(candidates
            .iter()
            .any(|candidate| candidate == &"[--foo:{bar}]"));
    }

    #[test]
    fn candidate_slicing() {
        let result = Extractor::slice_surrounding(&b".foo_&]:px-[0"[..])
            .map(std::str::from_utf8)
            .transpose()
            .unwrap();
        assert_eq!(result, None);

        let result = Extractor::slice_surrounding(&b"[.foo_&]:px-[0]"[..])
            .map(std::str::from_utf8)
            .transpose()
            .unwrap();
        assert_eq!(result, Some("[.foo_&]:px-[0]"));

        let result = Extractor::slice_surrounding(&b"{[.foo_&]:px-[0]}"[..])
            .map(std::str::from_utf8)
            .transpose()
            .unwrap();
        assert_eq!(result, Some("[.foo_&]:px-[0]"));

        let result = Extractor::slice_surrounding(&b"![foo:bar]"[..])
            .map(std::str::from_utf8)
            .transpose()
            .unwrap();
        assert_eq!(result, None);

        let result = Extractor::slice_surrounding(&b"[\"pt-1.5\"]"[..])
            .map(std::str::from_utf8)
            .transpose()
            .unwrap();
        assert_eq!(result, Some("pt-1.5"));

        let count = 1_000;
        let crazy = format!("{}[.foo_&]:px-[0]{}", "[".repeat(count), "]".repeat(count));

        let result = Extractor::slice_surrounding(crazy.as_bytes())
            .map(std::str::from_utf8)
            .transpose()
            .unwrap();
        assert_eq!(result, Some("[.foo_&]:px-[0]"));
    }

    #[test]
    fn does_not_emit_the_same_slice_multiple_times() {
        let candidates: Vec<_> =
            Extractor::with_positions("<div class=\"flex\"></div>".as_bytes(), Default::default())
                .into_iter()
                .map(|(s, p)| unsafe { (std::str::from_utf8_unchecked(s), p) })
                .collect();

        assert_eq!(candidates, vec![("div", 1), ("class", 5), ("flex", 12),]);
    }

    #[test]
    fn empty_arbitrary_values_are_allowed_for_codemods() {
        let candidates = run(
            r#"<div class="group-[]:flex group-[]/name:flex peer-[]:flex peer-[]/name:flex"></div>"#,
            false,
        );
        assert_eq!(
            candidates,
            vec![
                "div",
                "class",
                "group-[]:flex",
                "group-[]/name:flex",
                "peer-[]:flex",
                "peer-[]/name:flex"
            ]
        );
    }

    #[test]
    fn simple_utility_names_with_numbers_work() {
        let candidates = run(r#"<div class="h2 hz"></div>"#, false);
        assert_eq!(candidates, vec!["div", "class", "h2", "hz",]);
    }

    #[test]
    fn classes_in_an_array_without_whitespace() {
        let candidates = run(
            "let classes = ['bg-black','hover:px-0.5','text-[13px]','[--my-var:1_/_2]','[.foo_&]:px-[0]','[.foo_&]:[color:red]']",
            false,
        );

        assert_eq!(
            candidates,
            vec![
                "let",
                "classes",
                "bg-black",
                "hover:px-0.5",
                "text-[13px]",
                "[--my-var:1_/_2]",
                "--my-var:1_/_2",
                "[.foo_&]:px-[0]",
                "[.foo_&]:[color:red]",
            ]
        );
    }

    #[test]
    fn classes_in_an_array_with_spaces() {
        let candidates = run(
            "let classes = ['bg-black', 'hover:px-0.5', 'text-[13px]', '[--my-var:1_/_2]', '[.foo_&]:px-[0]', '[.foo_&]:[color:red]']",
            false,
        );

        assert_eq!(
            candidates,
            vec![
                "let",
                "classes",
                "bg-black",
                "hover:px-0.5",
                "text-[13px]",
                "[--my-var:1_/_2]",
                "--my-var:1_/_2",
                "[.foo_&]:px-[0]",
                "[.foo_&]:[color:red]",
            ]
        );
    }

    #[test]
    fn classes_in_an_array_with_tabs() {
        let candidates = run(
            "let classes = ['bg-black',\t'hover:px-0.5',\t'text-[13px]',\t'[--my-var:1_/_2]',\t'[.foo_&]:px-[0]',\t'[.foo_&]:[color:red]']",
            false,
        );

        assert_eq!(
            candidates,
            vec![
                "let",
                "classes",
                "bg-black",
                "hover:px-0.5",
                "text-[13px]",
                "[--my-var:1_/_2]",
                "--my-var:1_/_2",
                "[.foo_&]:px-[0]",
                "[.foo_&]:[color:red]",
            ]
        );
    }

    #[test]
    fn classes_in_an_array_with_newlines() {
        let candidates = run(
            "let classes = [\n'bg-black',\n'hover:px-0.5',\n'text-[13px]',\n'[--my-var:1_/_2]',\n'[.foo_&]:px-[0]',\n'[.foo_&]:[color:red]'\n]",
            false,
        );

        assert_eq!(
            candidates,
            vec![
                "let",
                "classes",
                "bg-black",
                "hover:px-0.5",
                "text-[13px]",
                "[--my-var:1_/_2]",
                "--my-var:1_/_2",
                "[.foo_&]:px-[0]",
                "[.foo_&]:[color:red]",
            ]
        );
    }

    #[test]
    fn arbitrary_properties_are_not_picked_up_after_an_escape() {
        let candidates = run(
            r#"
              <!-- [!code word:group-has-\\[a\\]\\:block] -->
              \\[a\\]\\:block]
            "#,
            false,
        );

        assert_eq!(candidates, vec!["!code", "a"]);
    }

    #[test]
    fn test_find_candidates_in_braces_inside_brackets() {
        let candidates = run(
            r#"
                const classes = [wrapper("bg-red-500")]
            "#,
            false,
        );

        assert_eq!(
            candidates,
            vec!["const", "classes", "wrapper", "bg-red-500"]
        );
    }

    #[test]
    fn test_find_css_variables() {
        let candidates = run("var(--color-red-500)", false);
        assert_eq!(candidates, vec!["var", "--color-red-500"]);

        let candidates = run("<div style={{ 'color': 'var(--color-red-500)' }}/>", false);
        assert_eq!(
            candidates,
            vec!["div", "style", "color", "var", "--color-red-500"]
        );
    }

    #[test]
    fn test_find_css_variables_with_fallback_values() {
        let candidates = run("var(--color-red-500, red)", false);
        assert_eq!(candidates, vec!["var", "--color-red-500", "red"]);

        let candidates = run("var(--color-red-500,red)", false);
        assert_eq!(candidates, vec!["var", "--color-red-500", "red"]);

        let candidates = run(
            "<div style={{ 'color': 'var(--color-red-500, red)' }}/>",
            false,
        );
        assert_eq!(
            candidates,
            vec!["div", "style", "color", "var", "--color-red-500", "red"]
        );

        let candidates = run(
            "<div style={{ 'color': 'var(--color-red-500,red)' }}/>",
            false,
        );
        assert_eq!(
            candidates,
            vec!["div", "style", "color", "var", "--color-red-500", "red"]
        );
    }

    #[test]
    fn test_find_css_variables_with_fallback_css_variable_values() {
        let candidates = run("var(--color-red-500, var(--color-blue-500))", false);
        assert_eq!(
            candidates,
            vec!["var", "--color-red-500", "--color-blue-500"]
        );
    }

    #[test]
    fn test_is_valid_candidate_string() {
        assert_eq!(
            Extractor::is_valid_candidate_string(b"foo"),
            ValidationResult::Valid
        );
        assert_eq!(
            Extractor::is_valid_candidate_string(b"foo-(--color-red-500)"),
            ValidationResult::Valid
        );
        assert_eq!(
            Extractor::is_valid_candidate_string(b"bg-[url(foo)]"),
            ValidationResult::Valid
        );
        assert_eq!(
            Extractor::is_valid_candidate_string(b"group-foo/(--bar)"),
            ValidationResult::Valid
        );

        assert_eq!(
            Extractor::is_valid_candidate_string(b"foo(\"bg-red-500\")"),
            ValidationResult::Restart
        );
        assert_eq!(
            Extractor::is_valid_candidate_string(b"foo-("),
            ValidationResult::Restart
        );
    }
}
