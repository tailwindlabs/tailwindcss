use std::collections::HashMap;

#[derive(Debug, Default)]
pub struct Config {
    pub prefix: Option<String>,
    pub important: bool,
    pub separator: String,

    pub content: Content,
    pub theme: Theme,
    pub plugins: Vec<Option<bool>>,
}

#[derive(Debug, Default)]
pub struct Theme {
    pub colors: HashMap<String, String>,
}

#[derive(Debug, Default)]
pub struct Content {
    pub relative: bool,
    pub files: Vec<File>,
}

#[derive(Debug, Default)]
pub struct File {
    pub raw: Option<String>,
    pub path: Option<String>,
    pub extension: Option<String>,
}
