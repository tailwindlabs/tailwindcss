/// The `IndexConverter` is used to convert UTF-8 *BYTE* indexes to UTF-16
/// *character* indexes
#[derive(Clone)]
pub struct IndexConverter<'a> {
  input: &'a str,
  curr_utf8: usize,
  curr_utf16: usize,
}

impl<'a> IndexConverter<'a> {
  pub fn new(input: &'a str) -> Self {
    Self {
      input,
      curr_utf8: 0,
      curr_utf16: 0,
    }
  }

  pub fn get(&mut self, pos: usize) -> i64 {
    #[cfg(debug_assertions)]
    if self.curr_utf8 > self.input.len() {
      panic!("curr_utf8 points past the end of the input string");
    }

    if pos < self.curr_utf8 {
      self.curr_utf8 = 0;
      self.curr_utf16 = 0;
    }

    // SAFETY: No matter what `pos` is passed into this function `curr_utf8`
    // will only ever be incremented up to the length of the input string.
    //
    // This eliminates a "potential" panic that cannot actually happen
    let slice = unsafe { self.input.get_unchecked(self.curr_utf8..) };

    for c in slice.chars() {
      if self.curr_utf8 >= pos {
        break;
      }

      self.curr_utf8 += c.len_utf8();
      self.curr_utf16 += c.len_utf16();
    }

    self.curr_utf16 as i64
  }
}

#[cfg(test)]
mod test {
  use super::*;
  use std::collections::HashMap;

  #[test]
  fn test_index_converter() {
    let mut converter = IndexConverter::new("Hello 🔥🥳 world!");

    let map = HashMap::from([
      // hello<space>
      (0, 0),
      (1, 1),
      (2, 2),
      (3, 3),
      (4, 4),
      (5, 5),
      (6, 6),
      // inside the 🔥
      (7, 8),
      (8, 8),
      (9, 8),
      (10, 8),
      // inside the 🥳
      (11, 10),
      (12, 10),
      (13, 10),
      (14, 10),
      // <space>world!
      (15, 11),
      (16, 12),
      (17, 13),
      (18, 14),
      (19, 15),
      (20, 16),
      (21, 17),
      // Past the end should return the last utf-16 character index
      (22, 17),
      (100, 17),
    ]);

    for (idx_utf8, idx_utf16) in map {
      assert_eq!(converter.get(idx_utf8), idx_utf16);
    }
  }
}
