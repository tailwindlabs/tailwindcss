#[derive(Clone, Copy)]
enum Case {
  Other,
  Ident,
  Nul,
  Control,
}

// This list allows us to quickly identify what kind of byte we are looking at
// and jump to the right block of code to handle it producing a roughly 2x
// speedup in the general case.
static __CASES: [Case; 256] = {
  let mut cases = [Case::Other; 256];

  cases[0x00] = Case::Nul;

  let mut i = 0x01;
  while i <= 0x1f {
    cases[i] = Case::Control;
    i+=1;
  }

  cases[0x7f] = Case::Control;

  let mut i = b'0';
  while i <= b'9' {
    cases[i as usize] = Case::Ident;
    i+=1;
  }

  let mut i = b'A';
  while i <= b'Z' {
    cases[i as usize] = Case::Ident;
    i+=1;
  }

  let mut i = b'a';
  while i <= b'z' {
    cases[i as usize] = Case::Ident;
    i+=1;
  }

  cases[b'-' as usize] = Case::Ident;
  cases[b'_' as usize] = Case::Ident;

  let mut i = 0x80;
  while i <= 0xff {
    cases[i] = Case::Ident;
    i+=1;
  }

  cases
};

// https://drafts.csswg.org/cssom/#serialize-an-identifier
pub fn escape(value: &[u8]) -> Vec<u8> {
  if value.len() == 0 {
    return vec![];
  }

  if value == b"-" {
    return b"\\-".to_vec();
  }

  // While the worst-case is 4x the size of the input, the "average" worst case
  // is actually 2x the size of the input. This would happen for a string
  // consisting of all printable, non-ident characters. If we pre-allocate
  // for this case we can avoid all re-allocations during the loop unless we
  // happen to have enough control characters to trigger the worst-case.
  let mut result: Vec<u8> = Vec::with_capacity(2 * value.len());

  let mut value = value;

  if value[0] == b'-' {
    result.push(b'-');
    value = &value[1..];
  }

  // SAFETY: We're guaranteed to have at least one byte in `value` at this point
  // because if len() > 0 AND the only byte is `-` then we've already handled
  // that case.
  if let digit @ b'0'..=b'9' = *unsafe { value.get_unchecked(0) } {
    write_hex_digit(digit, &mut result);
    value = &value[1..];
  }

  write_escape_scalar(value, &mut result);

  return result;
}

#[inline(always)]
fn write_escape_scalar(value: &[u8], result: &mut Vec<u8>) {
  let replacement = "\u{FFFD}".as_bytes();

  // Note: there’s no need to special-case astral symbols, surrogate
  // pairs, or lone surrogates.
  for &code_unit in value.iter() {
    match __CASES[code_unit as usize] {
      // Every character in /[0-9a-zA-Z-_]/ can be included directly
      Case::Ident  => result.push(code_unit),

      // Other printable ASCII characters should be printed with an escape
      // https://drafts.csswg.org/cssom/#escape-a-character
      Case::Other => result.extend([
        b'\\',
        code_unit,
      ]),

      // The NUL character (U+0000) becomes the REPLACEMENT CHARACTER (U+FFFD)
      Case::Nul => result.extend(replacement),

      // Control characters (U+0001–U+001F and U+007F) are written in hex
      // https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
      Case::Control => write_hex_digit(code_unit, result),
    }
  }
}

pub fn write_hex_digit(value: u8, s: &mut Vec<u8>) {
    static HEX: &[u8; 16] = b"0123456789abcdef";

    if value > 0x0F {
        let hi = value >> 4 & 0x0F;
        let lo = value >> 0 & 0x0F;
        s.extend([
          b'\\',
          HEX[hi as usize],
          HEX[lo as usize],
          b' ',
        ]);
    } else {
      s.extend([
        b'\\',
        HEX[value as usize],
        b' ',
      ]);
    };
}

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn test() {
    assert_eq!(escape(b"\0"), "\u{FFFD}".as_bytes());
    assert_eq!(escape(b"a\0"), "a\u{FFFD}".as_bytes());
    assert_eq!(escape(b"\0b"), "\u{FFFD}b".as_bytes());
    assert_eq!(escape(b"a\0b"), "a\u{FFFD}b".as_bytes());

    assert_eq!(escape("\u{FFFD}".as_bytes()), "\u{FFFD}".as_bytes());
    assert_eq!(escape("a\u{FFFD}".as_bytes()), "a\u{FFFD}".as_bytes());
    assert_eq!(escape("\u{FFFD}b".as_bytes()), "\u{FFFD}b".as_bytes());
    assert_eq!(escape("a\u{FFFD}b".as_bytes()), "a\u{FFFD}b".as_bytes());

    assert_eq!(escape(b""), b"");

    assert_eq!(escape(b"\x01\x02\x1E\x1F"), b"\\1 \\2 \\1e \\1f ");

    assert_eq!(escape(b"0a"), b"\\30 a");
    assert_eq!(escape(b"1a"), b"\\31 a");
    assert_eq!(escape(b"2a"), b"\\32 a");
    assert_eq!(escape(b"3a"), b"\\33 a");
    assert_eq!(escape(b"4a"), b"\\34 a");
    assert_eq!(escape(b"5a"), b"\\35 a");
    assert_eq!(escape(b"6a"), b"\\36 a");
    assert_eq!(escape(b"7a"), b"\\37 a");
    assert_eq!(escape(b"8a"), b"\\38 a");
    assert_eq!(escape(b"9a"), b"\\39 a");

    assert_eq!(escape(b"a0b"), b"a0b");
    assert_eq!(escape(b"a1b"), b"a1b");
    assert_eq!(escape(b"a2b"), b"a2b");
    assert_eq!(escape(b"a3b"), b"a3b");
    assert_eq!(escape(b"a4b"), b"a4b");
    assert_eq!(escape(b"a5b"), b"a5b");
    assert_eq!(escape(b"a6b"), b"a6b");
    assert_eq!(escape(b"a7b"), b"a7b");
    assert_eq!(escape(b"a8b"), b"a8b");
    assert_eq!(escape(b"a9b"), b"a9b");

    assert_eq!(escape(b"-0a"), b"-\\30 a");
    assert_eq!(escape(b"-1a"), b"-\\31 a");
    assert_eq!(escape(b"-2a"), b"-\\32 a");
    assert_eq!(escape(b"-3a"), b"-\\33 a");
    assert_eq!(escape(b"-4a"), b"-\\34 a");
    assert_eq!(escape(b"-5a"), b"-\\35 a");
    assert_eq!(escape(b"-6a"), b"-\\36 a");
    assert_eq!(escape(b"-7a"), b"-\\37 a");
    assert_eq!(escape(b"-8a"), b"-\\38 a");
    assert_eq!(escape(b"-9a"), b"-\\39 a");

    assert_eq!(escape(b"-"), b"\\-");
    assert_eq!(escape(b"-a"), b"-a");
    assert_eq!(escape(b"--"), b"--");
    assert_eq!(escape(b"--a"), b"--a");

    assert_eq!(escape(b"\x80\x2D\x5F\xA9"), b"\x80\x2D\x5F\xA9");
    assert_eq!(escape(b"\x7F\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F"), b"\\7f \x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F");
    assert_eq!(escape(b"\xA0\xA1\xA2"), b"\xA0\xA1\xA2");
    assert_eq!(escape(b"a0123456789b"), b"a0123456789b");
    assert_eq!(escape(b"abcdefghijklmnopqrstuvwxyz"), b"abcdefghijklmnopqrstuvwxyz");
    assert_eq!(escape(b"ABCDEFGHIJKLMNOPQRSTUVWXYZ"), b"ABCDEFGHIJKLMNOPQRSTUVWXYZ");

    assert_eq!(escape(b"\x20\x21\x78\x79"), b"\\ \\!xy");

    // astral symbol (U+1D306 TETRAGRAM FOR CENTRE)
    assert_eq!(escape("\u{1D306}".as_bytes()), "\u{1D306}".as_bytes());

    // surrogates
    // assert_eq!(escape("\u{D834}\u{DF06}".as_bytes()), "\u{D834}\u{DF06}".as_bytes());
    // assert_eq!(escape("\u{DF06}".as_bytes()), "\u{DF06}".as_bytes());
    // assert_eq!(escape("\u{D834}".as_bytes()), "\u{D834}".as_bytes());
  }
}
