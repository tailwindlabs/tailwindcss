use crate::cursor;

#[derive(Debug, Clone, Copy)]
pub(crate) struct Span {
    /// Inclusive start position of the span
    pub(crate) start: usize,

    /// Inclusive end position of the span
    pub(crate) end: usize,
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

#[derive(Debug)]
pub enum MachineState {
    /// Machine is not doing anything at the moment
    Idle,

    /// Machine is currently parsing
    Parsing,

    /// Machine is done parsing and has extracted a span
    Done(Span),
}

pub(crate) trait Machine: Sized + Default {
    fn next(&mut self, cursor: &cursor::Cursor<'_>) -> MachineState;
    fn reset(&mut self) {
        *self = Default::default();
    }

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

            for i in (0..len).step_by(4) {
                cursor.move_to(i);
                _ = black_box(machine.next(&cursor));

                cursor.move_to(i);
                _ = black_box(machine.next(&cursor));

                cursor.move_to(i);
                _ = black_box(machine.next(&cursor));

                cursor.move_to(i);
                _ = black_box(machine.next(&cursor));
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

            for i in (0..len).step_by(4) {
                cursor.move_to(i);
                _ = black_box(machine.next(&cursor));

                cursor.move_to(i);
                _ = black_box(machine.next(&cursor));

                cursor.move_to(i);
                _ = black_box(machine.next(&cursor));

                cursor.move_to(i);
                _ = black_box(machine.next(&cursor));
            }

            start.elapsed()
        };
        eprintln!(
            "{}:   Duration: {:?}",
            std::any::type_name::<Self>(),
            duration
        );
    }
}
