use std::ops::{Add, Sub};

#[derive(Debug, Clone)]
pub struct Cursor<'a> {
    // The input we're scanning
    pub input: &'a [u8],

    // The location of the cursor in the input
    pub pos: usize,

    /// Is the cursor at the start of the input
    pub at_start: bool,

    /// Is the cursor at the end of the input
    pub at_end: bool,

    /// The previously consumed character
    /// If `at_start` is true, this will be NUL
    pub prev: u8,

    /// The current character
    pub curr: u8,

    /// The upcoming character (if any)
    /// If `at_end` is true, this will be NUL
    pub next: u8,
}

impl<'a> Cursor<'a> {
    pub fn new(input: &'a [u8]) -> Self {
        let mut cursor = Self {
            input,
            pos: 0,
            at_start: true,
            at_end: false,
            prev: 0x00,
            curr: 0x00,
            next: 0x00,
        };
        cursor.move_to(0);
        cursor
    }

    pub fn rewind_by(&mut self, amount: usize) {
        self.move_to(self.pos.saturating_sub(amount));
    }

    pub fn advance_by(&mut self, amount: usize) {
        self.move_to(self.pos.saturating_add(amount));
    }

    pub fn move_to(&mut self, pos: usize) {
        let len = self.input.len();
        let pos = pos.clamp(0, len);

        self.pos = pos;
        self.at_start = pos == 0;
        self.at_end = pos + 1 >= len;

        self.prev = if pos > 0 { self.input[pos - 1] } else { 0x00 };
        self.curr = if pos < len { self.input[pos] } else { 0x00 };
        self.next = if pos + 1 < len {
            self.input[pos + 1]
        } else {
            0x00
        };
    }
}

impl<'a> Add<usize> for Cursor<'a> {
    type Output = Self;

    fn add(mut self, rhs: usize) -> Self::Output {
        self.advance_by(rhs);
        self
    }
}

impl<'a> Sub<usize> for Cursor<'a> {
    type Output = Self;

    fn sub(mut self, rhs: usize) -> Self::Output {
        self.rewind_by(rhs);
        self
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_cursor() {
        let mut cursor = Cursor::new(b"hello world");
        assert_eq!(cursor.pos, 0);
        assert!(cursor.at_start);
        assert!(!cursor.at_end);
        assert_eq!(cursor.prev, 0x00);
        assert_eq!(cursor.curr, b'h');
        assert_eq!(cursor.next, b'e');

        cursor.advance_by(1);
        assert_eq!(cursor.pos, 1);
        assert!(!cursor.at_start);
        assert!(!cursor.at_end);
        assert_eq!(cursor.prev, b'h');
        assert_eq!(cursor.curr, b'e');
        assert_eq!(cursor.next, b'l');

        // Advancing too far should stop at the end
        cursor.advance_by(10);
        assert_eq!(cursor.pos, 11);
        assert!(!cursor.at_start);
        assert!(cursor.at_end);
        assert_eq!(cursor.prev, b'd');
        assert_eq!(cursor.curr, 0x00);
        assert_eq!(cursor.next, 0x00);

        // Can't advance past the end
        cursor.advance_by(1);
        assert_eq!(cursor.pos, 11);
        assert!(!cursor.at_start);
        assert!(cursor.at_end);
        assert_eq!(cursor.prev, b'd');
        assert_eq!(cursor.curr, 0x00);
        assert_eq!(cursor.next, 0x00);

        cursor.rewind_by(1);
        assert_eq!(cursor.pos, 10);
        assert!(!cursor.at_start);
        assert!(cursor.at_end);
        assert_eq!(cursor.prev, b'l');
        assert_eq!(cursor.curr, b'd');
        assert_eq!(cursor.next, 0x00);

        cursor.rewind_by(10);
        assert_eq!(cursor.pos, 0);
        assert!(cursor.at_start);
        assert!(!cursor.at_end);
        assert_eq!(cursor.prev, 0x00);
        assert_eq!(cursor.curr, b'h');
        assert_eq!(cursor.next, b'e');
    }
}
