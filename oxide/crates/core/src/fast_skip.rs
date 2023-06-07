use crate::cursor::Cursor;

const STRIDE: usize = 16;
type Mask = [bool; STRIDE];

#[inline(always)]
pub fn fast_skip(cursor: &Cursor) -> Option<usize> {
    // If we don't have enough bytes left to check then bail early
    if cursor.pos + STRIDE >= cursor.input.len() {
        return None;
    }

    if !cursor.curr.is_ascii_whitespace() {
        return None;
    }

    let mut offset = 1;

    // SAFETY: We've already checked (indirectly) that this index is valid
    let remaining = unsafe { cursor.input.get_unchecked(cursor.pos..) };

    // NOTE: This loop uses primitives designed to be auto-vectorized
    // Do not change this loop without benchmarking the results
    // And checking the generated assembly using godbolt.org
    for (i, chunk) in remaining.chunks_exact(STRIDE).enumerate() {
        let value = load(chunk);
        let is_whitespace = is_ascii_whitespace(value);
        let is_all_whitespace = all_true(is_whitespace);

        if is_all_whitespace {
            offset = (i + 1) * STRIDE;
        } else {
            break;
        }
    }

    Some(cursor.pos + offset)
}

#[inline(always)]
fn load(input: &[u8]) -> [u8; STRIDE] {
    let mut value = [0u8; STRIDE];
    value.copy_from_slice(input);
    value
}

#[inline(always)]
fn eq(input: [u8; STRIDE], val: u8) -> Mask {
    let mut res = [false; STRIDE];
    for n in 0..STRIDE {
        res[n] = input[n] == val
    }
    res
}

#[inline(always)]
fn or(a: [bool; STRIDE], b: [bool; STRIDE]) -> [bool; STRIDE] {
    let mut res = [false; STRIDE];
    for n in 0..STRIDE {
        res[n] = a[n] | b[n];
    }
    res
}

#[inline(always)]
fn all_true(a: [bool; STRIDE]) -> bool {
    let mut res = true;
    for item in a.iter().take(STRIDE) {
        res &= item;
    }
    res
}

#[inline(always)]
fn is_ascii_whitespace(value: [u8; STRIDE]) -> [bool; STRIDE] {
    let whitespace_1 = eq(value, b'\t');
    let whitespace_2 = eq(value, b'\n');
    let whitespace_3 = eq(value, b'\x0C');
    let whitespace_4 = eq(value, b'\r');
    let whitespace_5 = eq(value, b' ');

    or(
        or(
            or(or(whitespace_1, whitespace_2), whitespace_3),
            whitespace_4,
        ),
        whitespace_5,
    )
}
