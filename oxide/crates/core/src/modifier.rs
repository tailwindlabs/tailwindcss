#[derive(Debug, PartialEq, Eq)]
pub enum Modifier {
    /// A normal modifier -> /sidebar
    Normal(String),

    /// An arbitrary modifier -> /[0.5]
    Arbitrary(String),
}
