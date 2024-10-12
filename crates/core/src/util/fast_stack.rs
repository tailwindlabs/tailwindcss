use super::gurantee;

pub struct FastStack {
  storage: [u8; 256],
  pos: usize
}

impl FastStack {
  #[inline(always)]
  pub fn new() -> FastStack {
    FastStack {
      storage: [0; 256],
      pos: 0
    }
  }

  #[inline(always)]
  pub fn push(&mut self, value: u8) {
    gurantee(!self.overgrown());

    self.storage[self.pos] = value;
    self.pos += 1;
  }

  #[inline(always)]
  pub fn peek(&self) -> u8 {
    gurantee(!self.overgrown());

    return self.storage[self.pos - 1];
  }

  #[inline(always)]
  pub fn last(&self) -> Option<u8> {
    if self.is_empty() || self.overgrown() {
      return None;
    }

    return Some(self.peek());
  }

  #[inline(always)]
  pub fn pop(&mut self) {
    // SAFETY: The buffer does not need to be mutated because the stack is
    // only ever read from or written to its current position. Its current
    // position is only ever incremented after writing to it. Meaning that
    // the buffer can be dirty for the next use and still be correct since
    // reading/writing always starts at position `0`.
    self.pos = self.pos.saturating_sub(1);
  }

  #[inline(always)]
  pub fn is_empty(&self) -> bool {
    return self.pos == 0;
  }

  #[inline(always)]
  pub fn overgrown(&self) -> bool {
    self.pos > 256
  }
}
