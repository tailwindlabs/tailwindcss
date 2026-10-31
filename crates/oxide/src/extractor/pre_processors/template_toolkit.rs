use crate::cursor;
use crate::extractor::pre_processors::pre_processor::PreProcessor;

#[derive(Debug, Default)]
pub struct TemplateToolkit;

impl PreProcessor for TemplateToolkit {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        let len = content.len();
        let mut result = content.to_vec();
        let mut cursor = cursor::Cursor::new(content);

        while cursor.pos < len {
            match (cursor.curr(), cursor.next()) {
                (b'[', b'%') => result[cursor.pos] = b' ',
                (b'%', b']') => result[cursor.pos + 1] = b' ',
                _ => {}
            }

            cursor.advance();
        }

        result
    }
}

#[cfg(test)]
mod tests {
    use super::TemplateToolkit;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;

    #[test]
    fn test_template_toolkit_pre_processor() {
        for (input, expected) in [
            (
                "[% IF $is_open %]bg-white/40[% ELSE %]bg-white/10[% END %]",
                " % IF $is_open % bg-white/40 % ELSE % bg-white/10 % END % ",
            ),
            ("[% WRAPPER %]flex[% END %]", " % WRAPPER % flex % END % "),
        ] {
            TemplateToolkit::test(input, expected);
        }
    }

    #[test]
    fn test_extraction_between_template_tags_works() {
        TemplateToolkit::test_extract_contains(
            r#"<div class="[% IF $is_open %]bg-white/40[% ELSE %]bg-white/10[% END %]"></div>"#,
            vec!["bg-white/40", "bg-white/10"],
        );
    }
}
