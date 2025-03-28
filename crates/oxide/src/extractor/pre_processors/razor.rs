use crate::extractor::pre_processors::pre_processor::PreProcessor;
use bstr::ByteSlice;

#[derive(Debug, Default)]
pub struct Razor;

impl PreProcessor for Razor {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        content.replace("@@", " @").replace(r#"@("@")"#, "     @")
    }
}

#[cfg(test)]
mod tests {
    use super::Razor;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;

    #[test]
    fn test_razor_pre_processor() {
        let (input, expected) = (
            r#"<div class="@@sm:text-red-500">"#,
            r#"<div class=" @sm:text-red-500">"#,
        );
        Razor::test(input, expected);
        Razor::test_extract_contains(input, vec!["@sm:text-red-500"]);
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/17424
    #[test]
    fn test_razor_syntax_with() {
        let (input, expected) = (
            r#"<p class="@("@")md:bg-red-500 @@md:border-green-500 border-8">With 2 elements</p>"#,
            r#"<p class="     @md:bg-red-500  @md:border-green-500 border-8">With 2 elements</p>"#,
        );

        Razor::test(input, expected);
        Razor::test_extract_contains(
            input,
            vec!["@md:bg-red-500", "@md:border-green-500", "border-8"],
        );
    }
}
