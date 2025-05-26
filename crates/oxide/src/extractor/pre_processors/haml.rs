use crate::cursor;
use crate::extractor::bracket_stack::BracketStack;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::pre_processors::pre_processor::PreProcessor;
use crate::extractor::variant_machine::VariantMachine;
use crate::scanner::pre_process_input;
use bstr::ByteVec;

#[derive(Debug, Default)]
pub struct Haml;

impl PreProcessor for Haml {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        let len = content.len();
        let mut result = content.to_vec();
        let mut cursor = cursor::Cursor::new(content);
        let mut bracket_stack = BracketStack::default();

        // Haml Comments: -#
        // https://haml.info/docs/yardoc/file.REFERENCE.html#ruby-evaluation
        //
        // > The hyphen followed immediately by the pound sign signifies a silent comment. Any text
        // > following this isn’t rendered in the resulting document at all.
        //
        // ```haml
        // %p foo
        // -# This is a comment
        // %p bar
        // ```
        //
        // > You can also nest text beneath a silent comment. None of this text will be rendered.
        //
        // ```haml
        // %p foo
        // -#
        //   This won't be displayed
        //     Nor will this
        //                    Nor will this.
        // %p bar
        // ```
        //
        // Ruby Evaluation
        // https://haml.info/docs/yardoc/file.REFERENCE.html#ruby-evaluation
        //
        // When any of the following characters are the first non-whitespace character on the line,
        // then the line is treated as Ruby code:
        //
        // - Inserting Ruby: =
        //   https://haml.info/docs/yardoc/file.REFERENCE.html#inserting_ruby
        //
        //   ```haml
        //   %p
        //     = ['hi', 'there', 'reader!'].join " "
        //     = "yo"
        //   ```
        //
        // - Running Ruby: -
        //   https://haml.info/docs/yardoc/file.REFERENCE.html#running-ruby--
        //
        //   ```haml
        //   - foo = "hello"
        //   - foo << " there"
        //   - foo << " you!"
        //   %p= foo
        //   ```
        //
        // - Whitespace Preservation: ~
        //   https://haml.info/docs/yardoc/file.REFERENCE.html#tilde
        //
        //   > ~ works just like =, except that it runs Haml::Helpers.preserve on its input.
        //
        //   ```haml
        //   ~ "Foo\n<pre>Bar\nBaz</pre>"
        //   ```
        //
        // Important note:
        //
        // > A line of Ruby code can be stretched over multiple lines as long as each line but the
        // > last ends with a comma.
        //
        // ```haml
        // - links = {:home => "/",
        //   :docs => "/docs",
        //   :about => "/about"}
        // ```
        //
        // Ruby Blocks:
        // https://haml.info/docs/yardoc/file.REFERENCE.html#ruby-blocks
        //
        // > Ruby blocks, like XHTML tags, don’t need to be explicitly closed in Haml. Rather,
        // > they’re automatically closed, based on indentation. A block begins whenever the
        // > indentation is increased after a Ruby evaluation command. It ends when the indentation
        // > decreases (as long as it’s not an else clause or something similar).
        //
        // ```haml
        // - (42...47).each do |i|
        //   %p= i
        // %p See, I can count!
        // ```
        //
        let mut last_newline_position = 0;

        while cursor.pos < len {
            match cursor.curr {
                // Escape the next character
                b'\\' => {
                    cursor.advance_twice();
                    continue;
                }

                // Track the last newline position
                b'\n' => {
                    last_newline_position = cursor.pos;
                    cursor.advance();
                    continue;
                }

                // Skip HAML comments. `-#`
                b'-' if cursor.input[last_newline_position..cursor.pos]
                    .iter()
                    .all(u8::is_ascii_whitespace)
                    && matches!(cursor.next, b'#') =>
                {
                    // Just consume the comment
                    let updated_last_newline_position =
                        self.skip_indented_block(&mut cursor, last_newline_position);

                    // Override the last known newline position
                    last_newline_position = updated_last_newline_position;
                }

                // Skip HTML comments. `/`
                b'/' if cursor.input[last_newline_position..cursor.pos]
                    .iter()
                    .all(u8::is_ascii_whitespace) =>
                {
                    // Just consume the comment
                    let updated_last_newline_position =
                        self.skip_indented_block(&mut cursor, last_newline_position);

                    // Override the last known newline position
                    last_newline_position = updated_last_newline_position;
                }

                // Ruby evaluation
                b'-' | b'=' | b'~'
                    if cursor.input[last_newline_position..cursor.pos]
                        .iter()
                        .all(u8::is_ascii_whitespace) =>
                {
                    let mut start = cursor.pos;
                    let end = self.skip_indented_block(&mut cursor, last_newline_position);

                    // Increment start with 1 character to skip the `=` or `-` character
                    start += 1;

                    let ruby_code = &cursor.input[start..end];

                    // Override the last known newline position
                    last_newline_position = end;

                    let replaced = pre_process_input(ruby_code, "rb");
                    result.replace_range(start..end, replaced);
                }

                // Only replace `.` with a space if it's not surrounded by numbers. E.g.:
                //
                // ```diff
                // - .flex.items-center
                // +  flex items-center
                // ```
                //
                // But with numbers, it's allowed:
                //
                // ```diff
                // - px-2.5
                // + px-2.5
                // ```
                b'.' => {
                    // Don't replace dots with spaces when inside of any type of brackets, because
                    // this could be part of arbitrary values. E.g.: `bg-[url(https://example.com)]`
                    //                                                                       ^
                    if !bracket_stack.is_empty() {
                        cursor.advance();
                        continue;
                    }

                    // If the dot is surrounded by digits, we want to keep it. E.g.: `px-2.5`
                    // EXCEPT if it's followed by a valid variant that happens to start with a
                    // digit.
                    // E.g.: `bg-red-500.2xl:flex`
                    //                 ^^^
                    if cursor.prev.is_ascii_digit() && cursor.next.is_ascii_digit() {
                        let mut next_cursor = cursor.clone();
                        next_cursor.advance();

                        let mut variant_machine = VariantMachine::default();
                        if let MachineState::Done(_) = variant_machine.next(&mut next_cursor) {
                            result[cursor.pos] = b' ';
                        }
                    } else {
                        result[cursor.pos] = b' ';
                    }
                }

                // Replace following characters with spaces if they are not inside of brackets
                b'#' | b'=' if bracket_stack.is_empty() => {
                    result[cursor.pos] = b' ';
                }

                b'(' | b'[' | b'{' => {
                    // Replace first bracket with a space
                    if bracket_stack.is_empty() {
                        result[cursor.pos] = b' ';
                    }
                    bracket_stack.push(cursor.curr);
                }

                b')' | b']' | b'}' if !bracket_stack.is_empty() => {
                    bracket_stack.pop(cursor.curr);

                    // Replace closing bracket with a space
                    if bracket_stack.is_empty() {
                        result[cursor.pos] = b' ';
                    }
                }

                // Consume everything else
                _ => {}
            };

            cursor.advance();
        }

        result
    }
}

impl Haml {
    fn skip_indented_block(
        &self,
        cursor: &mut cursor::Cursor,
        last_known_newline_position: usize,
    ) -> usize {
        let len = cursor.input.len();

        // Special case: if the first character of the block is `=`, then newlines are only allowed
        // _if_ the last character of the previous line is a comma `,`.
        //
        // https://haml.info/docs/yardoc/file.REFERENCE.html#inserting_ruby
        //
        // > A line of Ruby code can be stretched over multiple lines as long as each line but the
        // > last ends with a comma. For example:
        //
        // ```haml
        // = link_to_remote "Add to cart",
        //     :url => { :action => "add", :id => product.id },
        //     :update => { :success => "cart", :failure => "error" }
        // ```
        let evaluation_type = cursor.curr;

        let block_indentation_level = cursor
            .pos
            .saturating_sub(last_known_newline_position)
            .saturating_sub(1); /* The newline itself */

        let mut last_newline_position = last_known_newline_position;

        // Consume until the end of the line first
        while cursor.pos < len && cursor.curr != b'\n' {
            cursor.advance();
        }

        // Block is already done, aka just a line
        if evaluation_type == b'=' && cursor.prev != b',' {
            return cursor.pos;
        }

        'outer: while cursor.pos < len {
            match cursor.curr {
                // Escape the next character
                b'\\' => {
                    cursor.advance_twice();
                    continue;
                }

                // Track the last newline position
                b'\n' => {
                    last_newline_position = cursor.pos;

                    // We are done with this block
                    if evaluation_type == b'=' && cursor.prev != b',' {
                        break;
                    }

                    cursor.advance();
                    continue;
                }

                // Skip whitespace and compute the indentation level
                x if x.is_ascii_whitespace() => {
                    // Find first non-whitespace character
                    while cursor.pos < len && cursor.curr.is_ascii_whitespace() {
                        if cursor.curr == b'\n' {
                            last_newline_position = cursor.pos;

                            if evaluation_type == b'=' && cursor.prev != b',' {
                                // We are done with this block
                                break 'outer;
                            }
                        }

                        cursor.advance();
                    }

                    let indentation = cursor
                        .pos
                        .saturating_sub(last_newline_position)
                        .saturating_sub(1); /* The newline itself */
                    if indentation < block_indentation_level {
                        // We are done with this block
                        break;
                    }
                }

                // Not whitespace, end of block
                _ => break,
            };

            cursor.advance();
        }

        // We didn't find a newline, we reached the end of the input
        if last_known_newline_position == last_newline_position {
            return cursor.pos;
        }

        // Move the cursor to the last newline position
        cursor.move_to(last_newline_position);

        last_newline_position
    }
}

#[cfg(test)]
mod tests {
    use super::Haml;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;
    use pretty_assertions::assert_eq;

    #[test]
    fn test_haml_pre_processor() {
        for (input, expected) in [
            // Element with classes
            (
                "%body.flex.flex-col.items-center.justify-center",
                "%body flex flex-col items-center justify-center",
            ),
            // Plain element
            (
                ".text-slate-500.xl:text-gray-500",
                " text-slate-500 xl:text-gray-500",
            ),
            // Element with hash attributes
            (
                ".text-black.xl:text-red-500{ data: { tailwind: 'css' } }",
                " text-black xl:text-red-500  data: { tailwind: 'css' }  ",
            ),
            // Element with a boolean attribute
            (
                ".text-green-500.xl:text-blue-500(data-sidebar)",
                " text-green-500 xl:text-blue-500 data-sidebar ",
            ),
            // Element with interpreted content
            (
                ".text-yellow-500.xl:text-purple-500= 'Element with interpreted content'",
                " text-yellow-500 xl:text-purple-500  'Element with interpreted content'",
            ),
            // Element with a hash at the end and an extra class.
            (
                ".text-orange-500.xl:text-pink-500{ class: 'bg-slate-100' }",
                " text-orange-500 xl:text-pink-500  class: 'bg-slate-100'  ",
            ),
            // Object reference
            (
                ".text-teal-500.xl:text-indigo-500[@user, :greeting]",
                " text-teal-500 xl:text-indigo-500 @user, :greeting ",
            ),
            // Element with an ID
            (
                ".text-lime-500.xl:text-emerald-500#root",
                " text-lime-500 xl:text-emerald-500 root",
            ),
            // Dots in strings in HTML attributes stay as-is
            (r#"<div id="px-2.5"></div>"#, r#"<div id "px-2.5"></div>"#),
        ] {
            Haml::test(input, expected);
        }
    }

    #[test]
    fn test_strings_only_occur_when_nested() {
        let input = r#"
            %p.mt-2.text-xl
              The quote in the next word, can't be the start of a string

            %h3.mt-24.text-center.text-4xl.font-bold.italic
              The classes above should be extracted
        "#;

        Haml::test_extract_contains(
            input,
            vec![
                // First paragraph
                "mt-2",
                "text-xl",
                // second paragraph
                "mt-24",
                "text-center",
                "text-4xl",
                "font-bold",
                "italic",
            ],
        );
    }

    // https://github.com/tailwindlabs/tailwindcss/pull/17051#issuecomment-2711181352
    #[test]
    fn test_haml_full_file_17051() {
        let actual = Haml::extract_annotated(include_bytes!("./test-fixtures/haml/src-17051.haml"));
        let expected = include_str!("./test-fixtures/haml/dst-17051.haml");

        assert_eq!(actual.replace("\r\n", "\n"), expected.replace("\r\n", "\n"));
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/17813
    #[test]
    fn test_haml_full_file_17813() {
        let actual = Haml::extract_annotated(include_bytes!("./test-fixtures/haml/src-17813.haml"));
        let expected = include_str!("./test-fixtures/haml/dst-17813.haml");

        assert_eq!(actual.replace("\r\n", "\n"), expected.replace("\r\n", "\n"));
    }

    #[test]
    fn test_arbitrary_code_followed_by_classes() {
        let input = r#"
            %p
              = i < 3
              .flex.items-center
        "#;
        Haml::test_extract_contains(input, vec!["flex", "items-center"]);
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/17379#issuecomment-2910108646
    #[test]
    fn test_crash_missing_newline() {
        // The empty `""` will introduce a newline
        let good = ["- index = 0", "- index += 1", ""].join("\n");
        Haml::test_extract_contains(&good, vec!["index"]);

        // This used to crash before the fix
        let bad = ["- index = 0", "- index += 1"].join("\n");
        Haml::test_extract_contains(&bad, vec!["index"]);
    }
}
