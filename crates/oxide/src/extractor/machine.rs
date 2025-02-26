use crate::cursor;

#[derive(Debug, Clone, Copy)]
pub struct Span {
    /// Inclusive start position of the span
    pub start: usize,

    /// Inclusive end position of the span
    pub end: usize,
}

impl Span {
    pub fn new(start: usize, end: usize) -> Self {
        Self { start, end }
    }

    #[inline(always)]
    pub fn slice<'a>(&self, input: &'a [u8]) -> &'a [u8] {
        &input[self.start..=self.end]
    }
}

#[derive(Debug, Default)]
pub enum MachineState {
    /// Machine is not doing anything at the moment
    #[default]
    Idle,

    /// Machine is done parsing and has extracted a span
    Done(Span),
}

pub trait Machine: Sized + Default {
    fn reset(&mut self);
    fn next(&mut self, cursor: &mut cursor::Cursor<'_>) -> MachineState;

    /// Reset the state machine, and mark the machine as [MachineState::Idle].
    #[inline(always)]
    fn restart(&mut self) -> MachineState {
        self.reset();
        MachineState::Idle
    }

    /// Reset the state machine, and mark the machine as [MachineState::Done(…)].
    #[inline(always)]
    fn done(&mut self, start: usize, cursor: &cursor::Cursor<'_>) -> MachineState {
        self.reset();
        MachineState::Done(Span::new(start, cursor.pos))
    }

    #[cfg(test)]
    fn test_throughput(iterations: usize, input: &str) {
        use crate::throughput::Throughput;
        use std::hint::black_box;

        let input = input.as_bytes();
        let len = input.len();

        let throughput = Throughput::compute(iterations, len, || {
            let mut machine = Self::default();
            let mut cursor = cursor::Cursor::new(input);

            while cursor.pos < len {
                _ = black_box(machine.next(&mut cursor));

                cursor.advance();
            }
        });
        eprintln!(
            "{}: Throughput: {}",
            std::any::type_name::<Self>(),
            throughput
        );
    }

    #[cfg(test)]
    fn test_duration_once(input: &str) {
        use std::hint::black_box;

        let input = input.as_bytes();
        let len = input.len();

        let duration = {
            let start = std::time::Instant::now();
            let mut machine = Self::default();
            let mut cursor = cursor::Cursor::new(input);

            while cursor.pos < len {
                _ = black_box(machine.next(&mut cursor));

                cursor.advance();
            }

            start.elapsed()
        };
        eprintln!(
            "{}:   Duration: {:?}",
            std::any::type_name::<Self>(),
            duration
        );
    }

    #[cfg(test)]
    fn test_duration_n(n: usize, input: &str) {
        use std::hint::black_box;

        let input = input.as_bytes();
        let len = input.len();

        let duration = {
            let start = std::time::Instant::now();

            for _ in 0..n {
                let mut machine = Self::default();
                let mut cursor = cursor::Cursor::new(input);

                while cursor.pos < len {
                    _ = black_box(machine.next(&mut cursor));

                    cursor.advance();
                }
            }

            start.elapsed()
        };
        eprintln!(
            "{}:   Duration: {:?} ({} iterations, ~{:?} per iteration)",
            std::any::type_name::<Self>(),
            duration,
            n,
            duration / n as u32
        );
    }

    #[cfg(test)]
    fn test_extract_all(input: &str) -> Vec<&str> {
        input
            // Mimicking the behavior of how we parse lines individually
            .split_terminator("\n")
            .flat_map(|input| {
                let mut machine = Self::default();
                let mut cursor = cursor::Cursor::new(input.as_bytes());

                let mut actual: Vec<&str> = vec![];
                let len = cursor.input.len();

                while cursor.pos < len {
                    if let MachineState::Done(span) = machine.next(&mut cursor) {
                        actual.push(unsafe {
                            std::str::from_utf8_unchecked(span.slice(cursor.input))
                        });
                    }

                    cursor.advance();
                }

                actual
            })
            .collect()
    }
}
