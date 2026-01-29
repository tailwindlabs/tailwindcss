use std::{ascii::escape_default, fmt::Display};

#[derive(Debug, Clone, Copy)]
pub struct Cursor<'a> {
    // The input we're scanning
    pub input: &'a [u8],

    // The location of the cursor in the input
    pub pos: usize,
}

impl<'a> Cursor<'a> {
    #[inline(always)]
    pub fn new(input: &'a [u8]) -> Self {
        Self { input, pos: 0 }
    }

    /// The current byte at `pos`, or 0x00 if past the end.
    #[inline(always)]
    pub fn curr(&self) -> u8 {
        if self.pos < self.input.len() {
            unsafe { *self.input.get_unchecked(self.pos) }
        } else {
            0x00
        }
    }

    /// The next byte at `pos + 1`, or 0x00 if past the end.
    #[inline(always)]
    pub fn next(&self) -> u8 {
        let next_pos = self.pos + 1;
        if next_pos < self.input.len() {
            unsafe { *self.input.get_unchecked(next_pos) }
        } else {
            0x00
        }
    }

    /// The previous byte at `pos - 1`, or 0x00 if at the start.
    #[inline(always)]
    pub fn prev(&self) -> u8 {
        if self.pos > 0 {
            unsafe { *self.input.get_unchecked(self.pos - 1) }
        } else {
            0x00
        }
    }

    pub fn advance_by(&mut self, amount: usize) {
        self.move_to(self.pos.saturating_add(amount));
    }

    #[inline(always)]
    pub fn advance(&mut self) {
        self.pos += 1;
    }

    #[inline(always)]
    pub fn advance_twice(&mut self) {
        self.pos += 2;
    }

    pub fn move_to(&mut self, pos: usize) {
        self.pos = pos.min(self.input.len());
    }
}

impl Display for Cursor<'_> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let len = self.input.len().to_string();

        let pos = format!("{: >len_count$}", self.pos, len_count = len.len());
        write!(f, "{}/{} ", pos, len)?;

        if self.pos == 0 {
            write!(f, "S ")?;
        } else if self.pos + 1 >= self.input.len() {
            write!(f, "E ")?;
        } else {
            write!(f, "M ")?;
        }

        fn to_str(c: u8) -> String {
            if c == 0x00 {
                "NUL".into()
            } else {
                format!("{:?}", escape_default(c).to_string())
            }
        }

        write!(
            f,
            "[{} {} {}]",
            to_str(self.prev()),
            to_str(self.curr()),
            to_str(self.next())
        )
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use pretty_assertions::assert_eq;

    #[test]
    fn test_cursor() {
        let mut cursor = Cursor::new(b"hello world");
        assert_eq!(cursor.pos, 0);
        assert_eq!(cursor.prev(), 0x00);
        assert_eq!(cursor.curr(), b'h');
        assert_eq!(cursor.next(), b'e');

        cursor.advance_by(1);
        assert_eq!(cursor.pos, 1);
        assert_eq!(cursor.prev(), b'h');
        assert_eq!(cursor.curr(), b'e');
        assert_eq!(cursor.next(), b'l');

        // Advancing too far should stop at the end
        cursor.advance_by(10);
        assert_eq!(cursor.pos, 11);
        assert_eq!(cursor.prev(), b'd');
        assert_eq!(cursor.curr(), 0x00);
        assert_eq!(cursor.next(), 0x00);

        // Can't advance past the end
        cursor.advance_by(1);
        assert_eq!(cursor.pos, 11);
        assert_eq!(cursor.prev(), b'd');
        assert_eq!(cursor.curr(), 0x00);
        assert_eq!(cursor.next(), 0x00);
    }
}
