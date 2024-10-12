// The order of these cases is important for performance
// please do not change it without significant profiling
#[derive(Copy, Clone)]
enum Case {
  Escape,
  Ident,
  Other,
}

const __CASES: [Case; 256] = {
  let mut table = [Case::Other; 256];

  let mut i = b'a';
  while i <= b'z' {
    table[i as usize] = Case::Ident;
    i+=1;
  }

  let mut i = b'A';
  while i <= b'Z' {
    table[i as usize] = Case::Ident;
    i+=1;
  }

  let mut i = b'0';
  while i <= b'9' {
    table[i as usize] = Case::Ident;
    i+=1;
  }

  table[b'-' as usize] = Case::Ident;
  table[b'_' as usize] = Case::Ident;
  table[b'\\' as usize] = Case::Escape;

  table
};

/// Consume an <ident-token> from the buffer
///
/// Not intended to be as strict as the [CSS spec][diagram] but merely good enough.
/// [diagram]: https://drafts.csswg.org/css-syntax-3/#ident-token-diagram
#[inline(never)]
#[no_mangle]
pub fn read_ident_token(buffer: &[u8]) -> usize {
  let mut i = 0;

  while i < buffer.len() {
    match __CASES[buffer[i] as usize] {
      Case::Ident => i += 1,
      Case::Escape => i += 2,
      Case::Other => break,
    }
  }

  return i;
}
