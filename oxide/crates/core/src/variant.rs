use crate::modifier::Modifier;

#[derive(Debug)]
pub struct Variant {
    pub raw: String,
    pub name: String,
    pub modifier: Option<Modifier>,
    pub arbitrary: Option<String>,
}

enum VariantParts {
    Variant,
    Modifier,
}

impl Variant {
    pub fn new(raw: &str) -> Variant {
        let mut in_arbitrary = false;
        let mut last_char: char = '\0';

        let mut part = VariantParts::Variant;

        let mut variant_base = String::from("");
        let mut variant_arbitrary = String::from("");
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
                        VariantParts::Variant => variant_arbitrary.push(c),
                        VariantParts::Modifier => modifier_arbitrary.push(c),
                    }
                }
                '[' if !is_escaped && !in_arbitrary && quotes.is_empty() => in_arbitrary = true,
                ']' if !is_escaped && in_arbitrary && quotes.is_empty() => in_arbitrary = false,
                '/' if !is_escaped && !in_arbitrary => part = VariantParts::Modifier,
                _ => match (&part, in_arbitrary) {
                    (VariantParts::Variant, true) => variant_arbitrary.push(c),
                    (VariantParts::Variant, false) => variant_base.push(c),
                    (VariantParts::Modifier, true) => modifier_arbitrary.push(c),
                    (VariantParts::Modifier, false) => modifier_base.push(c),
                },
            }
        }

        // group-[&:hover] would result in `group-` being the base type. We don't need that `-`
        // anymore so we can safely delete it.
        if variant_base.ends_with('-') {
            variant_base.remove(variant_base.len() - 1);
        }

        let name = variant_base;
        let modifier = if !modifier_base.is_empty() {
            Some(Modifier::Normal(modifier_base))
        } else if !modifier_arbitrary.is_empty() {
            Some(Modifier::Arbitrary(modifier_arbitrary))
        } else {
            None
        };

        let arbitrary = if !variant_arbitrary.is_empty() {
            Some(variant_arbitrary)
        } else {
            None
        };

        Variant {
            raw: raw.to_string(),
            name,
            modifier,
            arbitrary,
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn it_can_parse_basic_variants() {
        let v = Variant::new("hover");
        assert_eq!(v.raw, "hover");
        assert_eq!(v.name, "hover");
        assert_eq!(v.modifier, None);
        assert_eq!(v.arbitrary, None);
    }

    #[test]
    fn it_can_parse_arbitrary_variants() {
        let v = Variant::new("[@media(min-width:200px)]");
        assert_eq!(v.raw, "[@media(min-width:200px)]");
        assert_eq!(v.name, "");
        assert_eq!(v.modifier, None);
        assert_eq!(v.arbitrary, Some("@media(min-width:200px)".to_string()));
    }

    #[test]
    fn it_can_parse_modifiers() {
        let v = Variant::new("group-hover/sidebar");
        assert_eq!(v.raw, "group-hover/sidebar");
        assert_eq!(v.name, "group-hover");
        assert_eq!(v.modifier, Some(Modifier::Normal("sidebar".to_string())));
        assert_eq!(v.arbitrary, None);
    }

    #[test]
    fn it_can_parse_arbitrary_modifiers() {
        let v = Variant::new("group-hover/[sidebar]");
        assert_eq!(v.raw, "group-hover/[sidebar]");
        assert_eq!(v.name, "group-hover");
        assert_eq!(v.modifier, Some(Modifier::Arbitrary("sidebar".to_string())));
        assert_eq!(v.arbitrary, None);
    }

    #[test]
    fn it_can_parse_parametrized_variants() {
        let v = Variant::new("group-[&:hover]");
        assert_eq!(v.raw, "group-[&:hover]");
        assert_eq!(v.name, "group");
        assert_eq!(v.modifier, None);
        assert_eq!(v.arbitrary, Some("&:hover".to_string()));
    }

    #[test]
    fn it_can_parse_parametrized_variants_with_modifiers() {
        let v = Variant::new("group-[&:hover]/sidebar");
        assert_eq!(v.raw, "group-[&:hover]/sidebar");
        assert_eq!(v.name, "group");
        assert_eq!(v.modifier, Some(Modifier::Normal("sidebar".to_string())));
        assert_eq!(v.arbitrary, Some("&:hover".to_string()));
    }

    #[test]
    fn it_can_parse_parametrized_variants_with_arbitrary_modifiers() {
        let v = Variant::new("group-[&:hover]/[sidebar]");
        assert_eq!(v.raw, "group-[&:hover]/[sidebar]");
        assert_eq!(v.name, "group");
        assert_eq!(v.modifier, Some(Modifier::Arbitrary("sidebar".to_string())));
        assert_eq!(v.arbitrary, Some("&:hover".to_string()));
    }

    #[test]
    fn it_can_parse_container_query_syntax() {
        let v = Variant::new("@sm");
        assert_eq!(v.raw, "@sm");
        assert_eq!(v.name, "@sm");
        assert_eq!(v.modifier, None);
        assert_eq!(v.arbitrary, None);
    }

    #[test]
    fn it_can_parse_container_query_syntax_with_arbitrary_values() {
        let v = Variant::new("@[400px]");
        assert_eq!(v.raw, "@[400px]");
        assert_eq!(v.name, "@");
        assert_eq!(v.modifier, None);
        assert_eq!(v.arbitrary, Some("400px".to_string()));
    }
}
