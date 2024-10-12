use crate::util::gurantee::gurantee;

use super::fast_stack::FastStack;

// The order of these cases is important for performance
// please do not change it without significant profiling
#[derive(Copy, Clone)]
enum Case {
  Other,

  // This makes things faster
  // It has to be the 2nd case
  Dummy1,

  Close, // b')'
  ParenL, // b'('
  BracketL, // b'['
  CurlyL, // b'{'

  Escape, // b'\'
  QuoteDouble, // b'"'
  QuoteSingle, // b'\''
  Separator, // other
}

const fn generate_cases(separator: u8) -> [Case; 256] {
  let mut table = [Case::Other; 256];

  table[b'\\' as usize] = Case::Escape;
  table[b'"' as usize] = Case::QuoteDouble;
  table[b'\'' as usize] = Case::QuoteSingle;
  table[b'(' as usize] = Case::ParenL;
  table[b'[' as usize] = Case::BracketL;
  table[b'{' as usize] = Case::CurlyL;
  table[b')' as usize] = Case::Close;
  table[b']' as usize] = Case::Close;
  table[b'}' as usize] = Case::Close;
  table[separator as usize] = Case::Separator;

  return table;
}

/**
 * This splits a string on a top-level character.
 *
 * Regex doesn't support recursion (at least not the JS-flavored version),
 * so we have to use a tiny state machine to keep track of paren placement.
 *
 * Expected behavior using commas:
 * var(--a, 0 0 1px rgb(0, 0, 0)), 0 0 1px rgb(0, 0, 0)
 *        ┬              ┬  ┬    ┬
 *        x              x  x    ╰──────── Split because top-level
 *        ╰──────────────┴──┴───────────── Ignored b/c inside >= 1 levels of parens
 */
#[inline(never)]
#[no_mangle]
pub fn segment(input: &[u8], separator: u8) -> Vec<&[u8]> {
  return segment_table(input, generate_cases(separator))
}

#[inline(always)]
fn segment_table(input: &[u8], cases: [Case; 256]) -> Vec<&[u8]> {
  let mut closing_bracket_stack = FastStack::new();

  let mut parts: Vec<&[u8]> = vec![];
  let mut last_pos = 0;

  let mut idx = 0;
  while idx < input.len() {
    // SAFETY: last_pos can never be greater than idx at the start of the loop
    // body. It's set to one greater than idx on a separator but idx is always
    // incremented before the next iteration.
    gurantee(last_pos <= idx);

    match cases[input[idx] as usize] {
      Case::Separator => {
        if closing_bracket_stack.is_empty() {
          parts.push(&input[last_pos..idx]);
          last_pos = idx + 1;
        }
      }

      // The next character is escaped, so we skip it.
      Case::Escape => idx += 1,

      // Strings should be handled as-is until the end of the string. No need to
      // worry about balancing parens, brackets, or curlies inside a string.
      Case::QuoteDouble => {
        loop {
          idx += 1;

          // Ensure we don't go out of bounds.
          if idx >= input.len() {
            break
          }

          match cases[input[idx] as usize] {
            Case::Escape => idx += 1,
            Case::QuoteDouble => break,
            _ => {},
          }
        }
      }

      // Strings should be handled as-is until the end of the string. No need to
      // worry about balancing parens, brackets, or curlies inside a string.
      Case::QuoteSingle => {
        loop {
          idx += 1;

          // Ensure we don't go out of bounds.
          if idx >= input.len() {
            break
          }

          match cases[input[idx] as usize] {
            Case::Escape => idx += 1,
            Case::QuoteSingle => break,
            _ => {},
          }
        }
      }

      Case::ParenL => {
        closing_bracket_stack.push(b')');

        if closing_bracket_stack.overgrown() {
          break
        }
      }

      Case::BracketL => {
        closing_bracket_stack.push(b']');

        if closing_bracket_stack.overgrown() {
          break
        }
      }

      Case::CurlyL => {
        closing_bracket_stack.push(b'}');

        if closing_bracket_stack.overgrown() {
          break
        }
      }

      Case::Close => {
        if !closing_bracket_stack.is_empty() && closing_bracket_stack.peek() == input[idx] {
          closing_bracket_stack.pop();
        }
      }

      Case::Other => {},
      Case::Dummy1 => {},
    }

    idx += 1;
  }

  // SAFETY: last_pos will be at most `input.len() - 1` ensuring that the slice
  // is always within bounds.
  gurantee(last_pos < input.len());

  parts.push(&input[last_pos..]);

  return parts
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn should_result_in_a_single_segment_when_the_separator_is_not_present() {
    assert_eq!(segment(b"foo", b':'), vec![b"foo"])
  }

  #[test]
  fn should_split_by_the_separator() {
    assert_eq!(segment(b"foo:bar:baz", b':'), vec![b"foo" as &[u8], b"bar", b"baz"])
  }

  #[test]
  fn should_not_split_inside_of_parens() {
    assert_eq!(segment(b"a:(b:c):d", b':'), vec![b"a" as &[u8], b"(b:c)", b"d"])
  }

  #[test]
  fn should_not_split_inside_of_brackets() {
    assert_eq!(segment(b"a:[b:c]:d", b':'), vec![b"a" as &[u8], b"[b:c]", b"d"])
  }

  #[test]
  fn should_not_split_inside_of_curlies() {
    assert_eq!(segment(b"a:{b:c}:d", b':'), vec![b"a" as &[u8], b"{b:c}", b"d"])
  }

  #[test]
  fn should_not_split_inside_of_double_quotes() {
    assert_eq!(segment(b"a:\"b:c\":d", b':'), vec![b"a" as &[u8], b"\"b:c\"", b"d"])
  }

  #[test]
  fn should_not_split_inside_of_single_quotes() {
    assert_eq!(segment(b"a:'b:c':d", b':'), vec![b"a" as &[u8], b"'b:c'", b"d"])
  }

  #[test]
  fn should_not_crash_when_double_quotes_are_unbalanced() {
    assert_eq!(segment(b"a:\"b:c:d", b':'), vec![b"a" as &[u8], b"\"b:c:d"])
  }

  #[test]
  fn should_not_crash_when_single_quotes_are_unbalanced() {
    assert_eq!(segment(b"a:'b:c:d", b':'), vec![b"a" as &[u8], b"'b:c:d"])
  }

  #[test]
  fn should_skip_escaped_double_quotes() {
    assert_eq!(segment(b"a:\"b:c\\\":d\":e", b':'), vec![b"a" as &[u8], b"\"b:c\\\":d\"", b"e"])
  }

  #[test]
  fn should_skip_escaped_single_quotes() {
    assert_eq!(segment(b"a:'b:c\\':d':e", b':'), vec![b"a" as &[u8], b"'b:c\\':d'", b"e"])
  }

  #[test]
  fn should_skip_escaped_separators() {
    assert_eq!(segment(b"a:b\\:c:d", b':'), vec![b"a" as &[u8], b"b\\:c", b"d"])
  }

  #[test]
  fn should_split_by_the_escape_sequence_which_is_escape_as_well() {
    assert_eq!(segment(b"a\\b\\c\\d", b'\\'), vec![b"a" as &[u8], b"b", b"c", b"d"]);
    assert_eq!(segment(b"a\\(b\\c)\\d", b'\\'), vec![b"a" as &[u8], b"(b\\c)", b"d"]);
    assert_eq!(segment(b"a\\[b\\c]\\d", b'\\'), vec![b"a" as &[u8], b"[b\\c]", b"d"]);
    assert_eq!(segment(b"a\\{b\\c}\\d", b'\\'), vec![b"a" as &[u8], b"{b\\c}", b"d"]);
  }
}
