use crate::cursor::Cursor;

#[inline(always)]
pub fn fast_skip<F>(cursor: &Cursor, is_skippable: F) -> Option<usize> where F: Fn(u8) -> bool {
    const STRIDE: usize = 16;

    if !is_skippable(cursor.curr) || !is_skippable(cursor.next) {
        return None;
    }

    if cursor.at_end {
        return None;
    }

    // We're guaranteed that the current and next bytes are skippable
    let remaining = unsafe { cursor.input.get_unchecked(cursor.pos..) };

    // This loop is auto-vectorized by the compiler
    let mut skip_to_offset = 1;
    for (i, chunk) in remaining.chunks_exact(STRIDE).enumerate() {
        let mut value = [0u8; STRIDE];
        value.copy_from_slice(&chunk);

        // PERF:
        // These separate loops are required because they are written to
        // be auto-vectorized by the compiler. Combining them results
        // in a loop that can't be thus sacrificing performance.

        // Check all 16 bytes in the chunk at once
        let mut can_skip = [false; STRIDE];
        for n in 0..STRIDE {
            can_skip[n] = is_skippable(value[n]);
        }

        // Merge the results of all 16 bytes at once
        let mut all_can_skip = true;
        for n in 0..STRIDE {
            all_can_skip &= can_skip[n];
        }

        if !all_can_skip {
            break;
        }

        skip_to_offset = i*STRIDE;
    }

    return Some(cursor.pos + skip_to_offset + 1);
}
