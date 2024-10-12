/// Tailwind CSS Candidate Extractor
///
/// Core assumptions:
/// - The extractor is intended to scan data that is valid UTF-8.
/// - Scanning invalid UTF-8 may result in incorrect output.
/// - No code should **ever** panic even in the presence of invalid data.
///
/// The extractor is designed to operate on a tuple of two pieces of data:
/// - The current state
/// - The current byte
///
/// A byte-to-fn-pointer table is used per-state such that the CPU can
/// accurately predict upcoming branches. This is a critical optimization
/// that allows the extractor to run at maximum speed without requiring
/// SIMD-like parallelism for every operation.
///

/// This represents the current "state" of the extractor.
enum ParseState {
  Start,
  Candidate,
  Arbitrary,
}


// Enter arbitrary value mode
// b'[' => {
//     trace!("Arbitrary::Start\t");
//     self.in_arbitrary = true;
//     self.idx_arbitrary_start = self.cursor.pos;

//     ParseAction::Consume
// }

// // Allowed first characters.
// b'@' | b'!' | b'-' | b'<' | b'>' | b'0'..=b'9' | b'a'..=b'z' | b'A'..=b'Z' | b'*' => {
//     // TODO: A bunch of characters that we currently support but maybe we only want it behind
//     // a flag. E.g.: `<sm`
//     // | '$' | '^' | '_'

//     // When the new candidate is preceded by a `:`, then we want to keep parsing, but
//     // throw away the full candidate because it can not be a valid candidate at the end
//     // of the day.
//     if self.cursor.prev == b':' {
//         self.discard_next = true;
//     }

//     trace!("Candidate::Start\t");

//     ParseAction::Consume
// }

// const TABLE_START: [TableCaseStart; 256] = {
//   //
// };

// static __CASES: [Case; 256] = {
//   let mut cases = [Case::Other; 256];

//   cases[0x00] = Case::Nul;

//   let mut i = 0x01;
//   while i <= 0x1f {
//     cases[i] = Case::Control;
//     i+=1;
//   }

//   cases[0x7f] = Case::Control;

//   let mut i = b'0';
//   while i <= b'9' {
//     cases[i as usize] = Case::Ident;
//     i+=1;
//   }

//   let mut i = b'A';
//   while i <= b'Z' {
//     cases[i as usize] = Case::Ident;
//     i+=1;
//   }

//   let mut i = b'a';
//   while i <= b'z' {
//     cases[i as usize] = Case::Ident;
//     i+=1;
//   }

//   cases[b'-' as usize] = Case::Ident;
//   cases[b'_' as usize] = Case::Ident;

//   let mut i = 0x80;
//   while i <= 0xff {
//     cases[i] = Case::Ident;
//     i+=1;
//   }

//   cases
// };


// #[inline(always)]
// fn parse_char(&mut self) -> ParseAction<'a> {
//     if self.in_arbitrary {
//         self.parse_arbitrary()
//     } else if self.in_candidate {
//         self.parse_continue()
//     } else if self.parse_start() == ParseAction::Consume {
//         self.in_candidate = true;
//         self.idx_start = self.cursor.pos;
//         self.idx_end = self.cursor.pos;

//         ParseAction::Consume
//     } else {
//         ParseAction::Skip
//     }
// }
