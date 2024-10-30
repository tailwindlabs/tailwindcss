use std::fmt::Display;
use std::io;
use std::path;

#[derive(Clone)]
pub struct Path {
    inner: path::PathBuf,
}

impl From<path::PathBuf> for Path {
    fn from(value: path::PathBuf) -> Self {
        Self { inner: value }
    }
}

impl From<String> for Path {
    fn from(value: String) -> Self {
        Self {
            inner: value.into(),
        }
    }
}

impl From<&str> for Path {
    fn from(value: &str) -> Self {
        Self {
            inner: value.into(),
        }
    }
}

impl Display for Path {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            format!("{}", self.inner.display()).replace('\\', "/")
        )
    }
}

impl Path {
    pub fn trim_prefix(&self, prefix: String) -> Self {
        let prefix = prefix.replace('\\', "/");
        let my_path = self.to_string();

        if let Some(str) = my_path.strip_prefix(&prefix) {
            return str.into();
        }

        my_path.into()
    }

    pub fn join(&self, component: &str) -> Self {
        if component.is_empty() {
            return self.clone();
        }

        self.inner.join(component).into()
    }

    pub fn canonicalize(&self) -> io::Result<Self> {
        Ok(dunce::canonicalize(&self.inner)?.into())
    }
}
