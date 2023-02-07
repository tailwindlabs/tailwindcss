use crate::modifier::Modifier;

#[derive(Debug)]
pub enum Utility {
    /// Arbitrary properties. E.g.: `[color:red]`
    Property(PropertyUtility),

    /// Utility from plugins. E.g.: `bg-red-500`
    Plugin(PluginUtility),
}

#[derive(Debug)]
pub struct PropertyUtility {
    pub raw: String,
    pub important: bool,
    pub property: String,
    pub value: String,
}

#[derive(Debug)]
pub struct PluginUtility {
    pub raw: String,
    pub name: String,
    pub important: bool,
    pub negative: bool,
    pub modifier: Option<Modifier>,
    pub arbitrary: Option<String>,
}

enum UtilityParts {
    Utility,
    Modifier,
}

impl Utility {
    pub fn new(raw: &str) -> Utility {
        let raw_string = raw.to_string();
        let mut raw = raw.to_string();

        let important = raw.starts_with('!');
        if important {
            raw.remove(0);
        }

        let negative = raw.starts_with('-');
        if negative {
            raw.remove(0);
        }

        // If the utility starts with [ and ends with ], then we know that we are in an
        // arbitrary property. Even if the utility is [color:red]/[0.5] it is still an arbitrary
        // property.
        let is_arbitrary_property = raw.starts_with('[') && raw.ends_with(']') && raw.contains(':');

        if is_arbitrary_property {
            if let Some((property, value)) = raw[1..(raw.len() - 1)].split_once(':') {
                Utility::Property(PropertyUtility {
                    raw: raw_string,
                    important,
                    property: property.to_string(),
                    value: value.to_string(),
                })
            } else {
                println!("BUG: \n{:#?}\n", raw_string);
                unreachable!()
            }
        } else {
            let mut in_arbitrary = false;
            let mut last_char: char = '\0';

            let mut part = UtilityParts::Utility;

            let mut utility_base = String::from("");
            let mut utility_arbitrary = String::from("");
            let mut modifier_base = String::from("");
            let mut modifier_arbitrary = String::from("");

            let mut quotes: Vec<char> = vec![];

            for (i, c) in raw.char_indices() {
                let is_escaped = i > 0 && last_char == '\\';
                last_char = c;

                match c {
                    '\'' | '"' | '`' if in_arbitrary => {
                        if quotes.is_empty() {
                            quotes.push(c);
                        } else if let Some(head) = quotes.last() {
                            if *head == c {
                                quotes.pop();
                            } else {
                                quotes.push(c);
                            }
                        }

                        match part {
                            UtilityParts::Utility => utility_arbitrary.push(c),
                            UtilityParts::Modifier => modifier_arbitrary.push(c),
                        }
                    }
                    '[' if !is_escaped && !in_arbitrary && quotes.is_empty() => in_arbitrary = true,
                    ']' if !is_escaped && in_arbitrary && quotes.is_empty() => in_arbitrary = false,
                    '/' if !is_escaped && !in_arbitrary => part = UtilityParts::Modifier,
                    _ => match (&part, in_arbitrary) {
                        (UtilityParts::Utility, true) => utility_arbitrary.push(c),
                        (UtilityParts::Utility, false) => utility_base.push(c),
                        (UtilityParts::Modifier, true) => modifier_arbitrary.push(c),
                        (UtilityParts::Modifier, false) => modifier_base.push(c),
                    },
                }
            }

            // content-['foo'] would result in `content-` being the base type. We don't need that
            // `-` anymore so we can safely delete it.
            if utility_base.ends_with('-') {
                utility_base.remove(utility_base.len() - 1);
            }

            let name = utility_base;
            let modifier = if !modifier_base.is_empty() {
                Some(Modifier::Normal(modifier_base))
            } else if !modifier_arbitrary.is_empty() {
                Some(Modifier::Arbitrary(modifier_arbitrary))
            } else {
                None
            };

            let arbitrary = if !utility_arbitrary.is_empty() {
                Some(utility_arbitrary)
            } else {
                None
            };

            Utility::Plugin(PluginUtility {
                raw: raw_string,
                name,
                important,
                negative,
                modifier,
                arbitrary,
            })
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn it_can_parse_basic_utilities() {
        if let Utility::Plugin(p @ PluginUtility { .. }) = Utility::new("bg-red-500") {
            assert_eq!(p.raw, "bg-red-500");
            assert_eq!(p.name, "bg-red-500");
            assert!(!p.important);
            assert!(!p.negative);
            assert_eq!(p.modifier, None);
            assert_eq!(p.arbitrary, None);
        }
    }

    #[test]
    fn it_can_parse_utilities_with_arbitrary_values() {
        if let Utility::Plugin(p @ PluginUtility { .. }) = Utility::new("bg-[#0088cc]") {
            assert_eq!(p.raw, "bg-[#0088cc]");
            assert_eq!(p.name, "bg");
            assert!(!p.important);
            assert!(!p.negative);
            assert_eq!(p.modifier, None);
            assert_eq!(p.arbitrary, Some("#0088cc".to_string()));
        }
    }

    #[test]
    fn it_can_parse_utilities_with_arbitrary_values_that_contain_brackets() {
        if let Utility::Plugin(p @ PluginUtility { .. }) =
            Utility::new("content-['Hello_\\[_\\]_world']")
        {
            assert_eq!(p.raw, "content-['Hello_\\[_\\]_world']");
            assert_eq!(p.name, "content");
            assert!(!p.important);
            assert!(!p.negative);
            assert_eq!(p.modifier, None);
            assert_eq!(p.arbitrary, Some("'Hello_\\[_\\]_world'".to_string()));
        }
    }

    #[test]
    fn it_can_parse_utilities_with_arbitrary_values_that_are_inside_quotes() {
        if let Utility::Plugin(p @ PluginUtility { .. }) =
            Utility::new("content-['Hello_[_]_world']")
        {
            assert_eq!(p.raw, "content-['Hello_[_]_world']");
            assert_eq!(p.name, "content");
            assert!(!p.important);
            assert!(!p.negative);
            assert_eq!(p.modifier, None);
            assert_eq!(p.arbitrary, Some("'Hello_[_]_world'".to_string()));
        }
    }

    #[test]
    fn it_can_parse_utilities_with_modifiers() {
        if let Utility::Plugin(p @ PluginUtility { .. }) = Utility::new("bg-red-500/50") {
            assert_eq!(p.raw, "bg-red-500/50");
            assert_eq!(p.name, "bg-red-500");
            assert!(!p.important);
            assert!(!p.negative);
            assert_eq!(p.modifier, Some(Modifier::Normal("50".to_string())));
            assert_eq!(p.arbitrary, None);
        }
    }

    #[test]
    fn it_can_parse_utilities_with_arbitrary_values_and_modifiers() {
        if let Utility::Plugin(p @ PluginUtility { .. }) = Utility::new("bg-[#008cc]/dark") {
            assert_eq!(p.raw, "bg-[#008cc]/dark");
            assert_eq!(p.name, "bg");
            assert!(!p.important);
            assert!(!p.negative);
            assert_eq!(p.modifier, Some(Modifier::Normal("dark".to_string())));
            assert_eq!(p.arbitrary, Some("#008cc".to_string()));
        }
    }

    #[test]
    fn it_can_parse_arbitrary_values_and_arbitrary_modifiers() {
        if let Utility::Plugin(p @ PluginUtility { .. }) = Utility::new("bg-[#008cc]/[0.5]") {
            assert_eq!(p.raw, "bg-[#008cc]/[0.5]");
            assert_eq!(p.name, "bg");
            assert!(!p.important);
            assert!(!p.negative);
            assert_eq!(p.modifier, Some(Modifier::Arbitrary("0.5".to_string())));
            assert_eq!(p.arbitrary, Some("#008cc".to_string()));
        }
    }

    #[test]
    fn it_can_parse_important_utilities() {
        if let Utility::Plugin(p @ PluginUtility { .. }) = Utility::new("!bg-red-500") {
            assert_eq!(p.raw, "!bg-red-500");
            assert_eq!(p.name, "bg-red-500");
            assert!(p.important);
            assert!(!p.negative);
            assert_eq!(p.modifier, None);
            assert_eq!(p.arbitrary, None);
        }
    }

    #[test]
    fn it_can_parse_negative_utilities() {
        if let Utility::Plugin(p @ PluginUtility { .. }) = Utility::new("-bg-red-500") {
            assert_eq!(p.raw, "-bg-red-500");
            assert_eq!(p.name, "bg-red-500");
            assert!(!p.important);
            assert!(p.negative);
            assert_eq!(p.modifier, None);
            assert_eq!(p.arbitrary, None);
        }
    }

    #[test]
    fn it_can_parse_important_negative_utilities() {
        if let Utility::Plugin(p @ PluginUtility { .. }) = Utility::new("!-bg-red-500") {
            assert_eq!(p.raw, "!-bg-red-500");
            assert_eq!(p.name, "bg-red-500");
            assert!(p.important);
            assert!(p.negative);
            assert_eq!(p.modifier, None);
            assert_eq!(p.arbitrary, None);
        }
    }

    #[test]
    fn it_can_parse_arbitrary_properties() {
        if let Utility::Property(p @ PropertyUtility { .. }) = Utility::new("[color:red]") {
            assert_eq!(p.raw, "[color:red]");
            assert_eq!(p.property, "color");
            assert_eq!(p.value, "red");
            assert!(!p.important);
        }
    }

    #[test]
    fn it_can_parse_important_arbitrary_properties() {
        if let Utility::Property(p @ PropertyUtility { .. }) = Utility::new("![color:red]") {
            assert_eq!(p.raw, "![color:red]");
            assert_eq!(p.property, "color");
            assert_eq!(p.value, "red");
            assert!(p.important);
        }
    }
}
