use std::fmt::Display;

pub struct Throughput {
    rate: f64,
    elapsed: std::time::Duration,
}

impl Display for Throughput {
    #[inline(always)]
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(
            f,
            "{}/s over {:.2}s",
            format_byte_size(self.rate),
            self.elapsed.as_secs_f64()
        )
    }
}

impl Throughput {
    #[inline(always)]
    pub fn compute<F>(iterations: usize, memory_baseline: usize, cb: F) -> Self
    where
        F: Fn(),
    {
        let now = std::time::Instant::now();
        for _ in 0..iterations {
            cb();
        }
        let elapsed = now.elapsed();
        let memory_size = iterations * memory_baseline;

        Self {
            rate: memory_size as f64 / elapsed.as_secs_f64(),
            elapsed,
        }
    }
}

#[inline(always)]
fn format_byte_size(size: f64) -> String {
    let units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let unit = 1000;
    let mut size = size;
    let mut i = 0;
    while size > unit as f64 {
        size /= unit as f64;
        i += 1;
    }

    format!("{:.2} {}", size, units[i])
}
