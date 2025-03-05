const SIZE: usize = 32;

#[repr(C)]
#[derive(Debug, Default)]
pub struct BracketStack {
    /// Bracket stack to ensure properly balanced brackets.
    bracket_stack: [u8; SIZE],
    bracket_stack_len: usize,
}

impl BracketStack {
    #[inline(always)]
    pub fn is_empty(&self) -> bool {
        self.bracket_stack_len == 0
    }

    #[inline(always)]
    pub fn push(&mut self, bracket: u8) -> bool {
        if self.bracket_stack_len >= SIZE {
            return false;
        }

        unsafe {
            *self.bracket_stack.get_unchecked_mut(self.bracket_stack_len) = match bracket {
                b'(' => b')',
                b'[' => b']',
                b'{' => b'}',
                _ => std::hint::unreachable_unchecked(),
            };
        }

        self.bracket_stack_len += 1;
        true
    }

    #[inline(always)]
    pub fn pop(&mut self, bracket: u8) -> bool {
        if self.bracket_stack_len == 0 {
            return false;
        }

        self.bracket_stack_len -= 1;
        unsafe {
            if *self.bracket_stack.get_unchecked(self.bracket_stack_len) != bracket {
                return false;
            }
        }

        true
    }

    #[inline(always)]
    pub fn reset(&mut self) {
        self.bracket_stack_len = 0;
    }
}
