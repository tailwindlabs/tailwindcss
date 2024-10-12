// import { addWhitespaceAroundMathOperators } from './math-operators'

use std::mem;

pub fn decode_arbitrary_value(input: &[u8]) -> Vec<u8> {
  // We do not want to normalize anything inside of a url() because if we
  // replace `_` with ` `, then it will very likely break the url.
  if input.starts_with(b"url(") {
    return input.to_vec()
  }

  let input = convert_underscores_to_whitespace(input);
  // let input = addWhitespaceAroundMathOperators(input);

  return input.to_vec();
}

/// Convert `_` to ` ` unless escaped (`\_`) in which case they
/// should be converted to `_` instead.
pub fn convert_underscores_to_whitespace(input: &[u8]) -> Vec<u8> {
  let mut result = Vec::<u8>::with_capacity(input.len());

  let input = write_decoded_8(input, &mut result);
  write_decoded_scalar(input, &mut result);

  result
}

pub fn write_decoded_8<'a, 'b>(input: &'a [u8], result: &'b mut Vec<u8>) -> &'a [u8] {
  const CHUNK_SIZE: usize = mem::size_of::<u64>();
  const NUL_8: [u8; CHUNK_SIZE] = [0x00; CHUNK_SIZE];
  const SPACE_8: [u8; CHUNK_SIZE] = [b' '; CHUNK_SIZE];
  const ESCAPE_8: [u8; CHUNK_SIZE] = [b'\\'; CHUNK_SIZE];
  const UNDERSCORE_8: [u8; CHUNK_SIZE] = [b'_'; CHUNK_SIZE];

  let mut chunks = input.chunks_exact(CHUNK_SIZE);

  while let Some(chunk) = chunks.next() {
    let mut chunk: [u8; CHUNK_SIZE] = chunk.try_into().unwrap();
    let mut chunk: u64 = u64::from_ne_bytes(chunk);

    let mut is_escape = [false; CHUNK_SIZE];
    for j in 0..CHUNK_SIZE {
      is_escape[j] = chunk[j] == b'\\';
    }

    let mut is_underscore = [false; CHUNK_SIZE];
    for j in 0..CHUNK_SIZE {
      is_underscore[j] = chunk[j] == b'_';
    }

    // Replace underscores with spaces in the chunk
    for j in 0..CHUNK_SIZE {
      chunk[j] = if is_underscore[j] {
        SPACE_8[j]
      } else {
        chunk[j]
      };
    }

    // Replace escaped underscores with underscores
    for j in 0..(CHUNK_SIZE - 1) {
      chunk[j] = if is_escape[j] && is_underscore[j + 1] {
        UNDERSCORE_8[j]
      } else {
        chunk[j]
      };
    }

    // Replace escapes with NUL bytes
    for j in 0..CHUNK_SIZE {
      chunk[j] = if is_escape[j] {
        NUL_8[j]
      } else {
        chunk[j]
      };
    }

    result.extend(&chunk);
  }

  return chunks.remainder();
}


pub fn write_decoded_scalar(input: &[u8], result: &mut Vec<u8>) {
  let mut i = 0;

  while i < input.len() {
    match input[i] {
      b'\\' => {
        if i + 1 == input.len() {
          // We've hit the end of the string and there's no character to escape
          result.extend(b"\\");
        } else if input[i + 1] == b'_' {
          // We've hit an escaped underscore
          result.extend(b"_");
        } else {
          // We've hit an "escaped" character that isn't an underscore
          // which means its not actually escaped and should be treated
          // as a literal character. Since we've already read the next
          // character, we'll just write both of them out here.
          result.extend(&input[i..i+1]);
        }

        i += 2;
      },

      b'_' => {
        result.push(b' ');
        i += 1;
      },

      _ => {
        result.push(input[i]);
        i += 1;
      }
    }
  }
}

// a\b\c
