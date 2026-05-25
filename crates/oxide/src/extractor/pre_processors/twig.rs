use crate::extractor::pre_processors::pre_processor::PreProcessor;

#[derive(Debug, Default)]
pub struct Twig;

impl PreProcessor for Twig {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        let mut result = content.to_vec();
        let mut cursor = 0;

        while cursor < content.len() {
            let Some(directive_len) = directive_at(content, cursor) else {
                cursor += 1;
                continue;
            };

            result[cursor..cursor + directive_len].fill(b' ');

            let mut depth = 1;
            let mut end = cursor + directive_len;

            while end < content.len() {
                match content[end] {
                    b'\\' => {
                        end += 2;
                        continue;
                    }
                    b'(' => depth += 1,
                    b')' => {
                        depth -= 1;

                        if depth == 0 {
                            result[end] = b' ';
                            cursor = end + 1;
                            break;
                        }
                    }
                    _ => {}
                }

                end += 1;
            }

            if end >= content.len() {
                break;
            }
        }

        result
    }
}

fn directive_at(content: &[u8], offset: usize) -> Option<usize> {
    if !is_directive_boundary(content, offset) {
        return None;
    }

    for directive in [b"addClass(".as_slice(), b"removeClass(".as_slice()] {
        if content[offset..].starts_with(directive) {
            return Some(directive.len());
        }
    }

    None
}

fn is_directive_boundary(content: &[u8], offset: usize) -> bool {
    if offset == 0 {
        return true;
    }

    matches!(
        content[offset - 1],
        b'\t' | b'\n' | b'\x0C' | b'\r' | b' ' | b'"' | b'\'' | b'`' | b'|' | b'='
    )
}

#[cfg(test)]
mod tests {
    use super::Twig;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;

    #[test]
    fn test_live_component_loading_directives() {
        Twig::test("addClass(opacity-50)", "         opacity-50 ");
        Twig::test(
            "data-loading=\"delay|addClass(opacity-50)|removeClass(hidden)\"",
            "data-loading=\"delay|         opacity-50 |            hidden \"",
        );
        Twig::test(
            "data-loading=\"model(user.email)|addClass(bg-(--loading-color))\"",
            "data-loading=\"model(user.email)|         bg-(--loading-color) \"",
        );
    }

    #[test]
    fn test_extract_live_component_classes() {
        Twig::test_extract_contains(
            r#"<div data-loading="addClass(opacity-50)"></div>"#,
            vec!["opacity-50"],
        );
        Twig::test_extract_contains(
            r#"<div data-loading="delay|addClass(opacity-50 pointer-events-none)|removeClass(hidden)"></div>"#,
            vec!["opacity-50", "pointer-events-none", "hidden"],
        );
        Twig::test_extract_contains(
            r#"<div data-loading="addClass(bg-(--loading-color) bg-[url(https://example.com)])"></div>"#,
            vec!["bg-(--loading-color)", "bg-[url(https://example.com)]"],
        );
    }
}
