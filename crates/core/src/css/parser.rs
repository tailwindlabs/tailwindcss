use crate::util::FastStack;

use super::{ast::{at_rule, comment, decl, style_rule, CssNode, Stylesheet}, syntax};
use bstr::ByteSlice;

#[inline(never)]
pub fn parse(input: &[u8]) -> Result<Stylesheet, String> {
  type CssNodeRef = Box<CssNode>;

  let input = input.replace(b"\r\n", b"\n");

  let mut rules = Vec::<CssNode>::new();
  let mut buffer = Vec::<u8>::new();
  let mut license_comments = Vec::<CssNode>::new();

  let mut closing_bracket_stack = FastStack::new();

  let mut parent: Option<CssNodeRef> = None;
  let mut stack: Vec<Option<CssNodeRef>> = vec![];

  let mut i = 0;

  while i < input.len() {
    let current_char = input[i];
    let peek_char = *input.get(i+1).unwrap_or(&0x00);

    // Current character is a `\` therefore the next character is escaped,
    // consume it together with the next character and continue.
    //
    // E.g.:
    //
    // ```css
    // .hover\:foo:hover {}
    //       ^
    // ```
    //
    if current_char == b'\\' {
      buffer.extend(&input[i..i+2]);
      i += 1;
    }

    // Start of a comment.
    //
    // E.g.:
    //
    // ```css
    // /* Example */
    // ^^^^^^^^^^^^^
    // .foo {
    //  color: red; /* Example */
    //              ^^^^^^^^^^^^^
    // }
    // .bar {
    //  color: /* Example */ red;
    //         ^^^^^^^^^^^^^
    // }
    // ```
    else if current_char == b'/' && peek_char == b'*' {
      let start = i;

      let mut j = i + 2;

      while j < input.len() {
        let current_char = input[j];
        let peek_char = *input.get(j + 1).unwrap_or(&0x00);

        // Current character is a `\` therefore the next character is escaped.
        if current_char == b'\\' {
          j += 1;
        }

        // End of the comment
        else if current_char == b'*' && peek_char == b'/' {
          i = j + 1;
          break;
        }

        j += 1;
      }

      let comment_str = &input[start+2..i - 1];

      if comment_str.is_empty() {
        i += 1;
        continue;
      }

      if comment_str[0] != b'!' {
        i += 1;
        continue;
      }

      // Collect all license comments so that we can hoist them to the top of
      // the AST.
      license_comments.push(comment(comment_str[1..].to_vec()));
    }

    // Start of a string.
    else if current_char == b'\'' || current_char == b'"' {
      let start = i;

      // We need to ensure that the closing quote is the same as the opening
      // quote.
      //
      // E.g.:
      //
      // ```css
      // .foo {
      //   content: "This is a string with a 'quote' in it";
      //                                     ^     ^         -> These are not the end of the string.
      // }
      // ```
      let mut j = i + 1;
      while j < input.len() {
        let peek_char = input[j];

        // Current character is a `\` therefore the next character is escaped.
        if peek_char == b'\\' {
          j += 1;
        }

        // End of the string.
        else if peek_char == current_char {
          i = j;
          break;
        }

        // End of the line without ending the string but with a `;` at the end.
        //
        // E.g.:
        //
        // ```css
        // .foo {
        //   content: "This is a string with a;
        //                                    ^ Missing "
        // }
        // ```
        // else if peek_char == b';' && input.charCodeAt(j + 1) == b'\n' {
        else if peek_char == b';' && *input.get(j + 1).unwrap_or(&0x00) == b'\n' {
          let mut data = input[start..j+1].to_vec();
          data.push(current_char);

          return Err(format!(
            "Unterminated string: {:}",
            String::from_utf8_lossy(&data)
          ));
        }

        // End of the line without ending the string.
        //
        // E.g.:
        //
        // ```css
        // .foo {
        //   content: "This is a string with a
        //                                    ^ Missing "
        // }
        // ```
        else if peek_char == b'\n' {
          let mut data = input[start..j].to_vec();
          data.push(current_char);

          return Err(format!(
            "Unterminated string: {:}",
            String::from_utf8_lossy(&data)
          ));
        }

        j += 1;
      }

      // Adjust `buffer` to include the string.
      buffer.extend(&input[start..i + 1]);
    }

    // Skip whitespace if the next character is also whitespace. This allows us
    // to reduce the amount of whitespace in the AST.
    else if
      (current_char == b' ' || current_char == b'\n' || current_char == b'\t') &&
      (peek_char == b' ' || peek_char == b'\n' || peek_char == b'\t')
    {
      i += 1;
      continue
    }

    // Replace new lines with spaces.
    else if current_char == b'\n' {
      if buffer.is_empty() {
        i += 1;
        continue
      }

      let peek_char = *buffer.last().unwrap_or(&0x00);
      if peek_char != b' ' && peek_char != b'\n' && peek_char != b'\t' {
        buffer.push(b' ');
      }
    }

    // Start of a custom property.
    //
    // Custom properties are very permissive and can contain almost any
    // character, even `;` and `}`. Therefore we have to make sure that we are
    // at the correct "end" of the custom property by making sure everything is
    // balanced.
    else if current_char == b'-' && peek_char == b'-' && buffer.is_empty() {
      let mut closing_bracket_stack = FastStack::new();

      let mut colon_idx: Option<usize> = None;
      let start = i;

      let mut j = i + 2;

      while j < input.len() {
        let peek_char = input[j];
        let peek2_char = *input.get(j + 1).unwrap_or(&0x00);

        // Current character is a `\` therefore the next character is escaped.
        if peek_char == b'\\' {
          j += 1
        }

        // Start of a comment.
        else if peek_char == b'/' && peek2_char == b'*' {
          let mut k = j + 2;
          while k < input.len() {
            let peek_char = input[k];
            let peek2_char = *input.get(k + 1).unwrap_or(&0x00);

            // Current character is a `\` therefore the next character is escaped.
            if peek_char == b'\\' {
              k += 1
            }

            // End of the comment
            else if peek_char == b'*' && peek2_char == b'/' {
              j = k + 1;
              break
            }

            k += 1;
          }
        }

        // End of the "property" of the property-value pair.
        else if colon_idx.is_none() && peek_char == b':' {
          colon_idx = Some(buffer.len() + j - start);
        }

        // End of the custom property.
        else if peek_char == b';' && closing_bracket_stack.is_empty() {
          buffer.extend(&input[start..j]);
          i = j;
          break
        }

        // Start of a block.
        else if peek_char == b'(' {
          closing_bracket_stack.push(b')')
        } else if peek_char == b'[' {
          closing_bracket_stack.push(b']')
        } else if peek_char == b'{' {
          closing_bracket_stack.push(b'}')
        }

        // End of the custom property if didn't use a `;` to end the custom
        // property.
        //
        // E.g.:
        //
        // ```css
        // .foo {
        //   --custom: value
        //                  ^
        // }
        // ```
        else if (peek_char == b'}' || input.len() - 1 == j) && closing_bracket_stack.is_empty() {
          i = j - 1;
          buffer.extend(&input[start..j+1]); // TODO: ???
          break
        }

        // End of a block.
        else if peek_char == b')' || peek_char == b']' || peek_char == b'}' {
          if closing_bracket_stack.last() == Some(input[j]) {
            closing_bracket_stack.pop();
          }
        }

        j += 1;
      }

      if colon_idx.is_none() {
        return Err(format!(
          "Expected `:` in custom property: {:}",
          String::from_utf8_lossy(&buffer)
        ));
      }

      let node = parse_decl(&buffer, colon_idx.unwrap());

      if let Some(parent) = parent.as_mut() {
        parent.push(node);
      } else {
        rules.push(node);
      }

      buffer.clear();
    }

    // End of a body-less at-rule.
    //
    // E.g.:
    //
    // ```css
    // @charset "UTF-8";
    //                 ^
    // ```
    else if current_char == b';' && buffer.first() == Some(&b'@') {
      let node = parse_rule_header(&buffer);

      if let Some(parent) = parent.as_mut() {
        // At-rule is nested inside of a rule, attach it to the parent.
        parent.push(node);
      } else {
        // We are the root node which means we are done with the current node.
        rules.push(node);
      }

      // Reset the state for the next node.
      buffer.clear();
    }

    // End of a declaration.
    //
    // E.g.:
    //
    // ```css
    // .foo {
    //   color: red;
    //             ^
    // }
    // ```
    //
    else if current_char == b';' {
      let colon_idx = buffer.find(b":");
      if colon_idx.is_none() {
        return Err(format!(
          "Expected `:` in declaration: {:}",
          String::from_utf8_lossy(&buffer)
        ));
      }

      let node = parse_decl(&buffer, colon_idx.unwrap());

      if let Some(parent) = parent.as_mut() {
        parent.push(node);
      } else {
        rules.push(node);
      }

      buffer.clear();
    }

    // Start of a block.
    else if current_char == b'{' {
      closing_bracket_stack.push(b'}');

      // Push the parent node to the stack, so that we can go back once the
      // nested nodes are done.
      stack.push(parent);

      // At this point `buffer` should resemble a selector or an at-rule.
      let node = parse_rule_header(&buffer);

      // Make the current node the new parent, so that nested nodes can be
      // attached to it.
      parent = Some(Box::new(node));

      // Reset the state for the next node.
      buffer.clear();
    }

    // End of a block.
    else if current_char == b'}' {
      if closing_bracket_stack.is_empty() {
        return Err("Missing opening {".to_string());
      }

      closing_bracket_stack.pop();

      // When we hit a `}` and `buffer` is filled in, then it means that we did
      // not complete the previous node yet. This means that we hit a
      // declaration without a `;` at the end.
      if buffer.len() > 0 {
        // This can happen for nested at-rules.
        //
        // E.g.:
        //
        // ```css
        // @layer foo {
        //   @tailwind utilities
        //                      ^
        // }
        // ```
        if buffer[0] == b'@' {
          let node = parse_rule_header(&buffer);

          // At-rule is nested inside of a rule, attach it to the parent.
          if let Some(parent) = parent.as_mut() {
            parent.push(node)
          }

          // We are the root node which means we are done with the current node.
          else {
            rules.push(node);
          }

          // Reset the state for the next node.
          buffer.clear();
        }

        // But it can also happen for declarations.
        //
        // E.g.:
        //
        // ```css
        // .foo {
        //   color: red
        //             ^
        // }
        // ```
        else {
          // Split `buffer` into a `property` and a `value`. At this point the
          // comments are already removed which means that we don't have to worry
          // about `:` inside of comments.
          let colon_idx = buffer.find(b":");

          // Attach the declaration to the parent.
          if let Some(parent) = parent.as_mut() {
            parent.push(parse_decl(&buffer, colon_idx.unwrap()));
          }
        }
      }

      // We are done with the current node, which means we can go up one level
      // in the stack.
      let mut grand_parent = stack.pop().flatten();

      match (grand_parent.as_deref_mut(), parent.take()) {
        // Push the parent node (if it existed) into the grand parent
        (Some(grand_parent), Some(parent)) => {
          grand_parent.push(*parent);
        }

        // We are the root node which means we are done and continue with the next
        // node.
        (None, Some(parent)) => {
          rules.push(*parent);
        }

        _ => {}
      }

      // Go up one level in the stack.
      parent = grand_parent;

      // Reset the state for the next node.
      buffer.clear();
    }

    // Any other character is part of the current node.
    else {
      // Skip whitespace at the start of a new node.
      if buffer.is_empty() && (current_char == b' ' || current_char == b'\n' || current_char == b'\t') {
        i += 1;
        continue;
      }

      buffer.push(current_char);
    }

    i += 1;
  }

  // If we have a leftover `buffer` that happens to start with an `@` then it
  // means that we have an at-rule that is not terminated with a semicolon at
  // the end of the input.
  if *buffer.get(0).unwrap_or(&0x00) == b'@' {
    rules.push(parse_rule_header(&buffer));
  }

  // When we are done parsing then everything should be balanced. If we still
  // have a leftover `parent`, then it means that we have an unterminated block.
  if !closing_bracket_stack.is_empty() {
    match parent.as_deref() {
      Some(CssNode::AtRule { name, params, .. }) => {
        return Err(format!("Missing closing }} at @{:} {:}", String::from_utf8_lossy(name), String::from_utf8_lossy(params)));
      },
      Some(CssNode::StyleRule { selector, .. }) => {
        return Err(format!("Missing closing }} at {:}", String::from_utf8_lossy(selector)));
      },
      _ => {}
    }
  }

  let mut ast = vec![];

  ast.extend(license_comments);
  ast.extend(rules);

  return Ok(Stylesheet::from(ast));
}

pub fn parse_rule_header(buffer: &[u8]) -> CssNode {
  let buffer = buffer.trim_ascii();

  // Check if the buffer is an at-rule.
  if buffer.starts_with(b"@") {
    let name_end_idx = syntax::read_ident_token(&buffer[1..]) + 1;
    let name = buffer[1..name_end_idx].trim_ascii();
    let params = buffer[name_end_idx..].trim_ascii();

    return at_rule(name, params, []);
  }

  return style_rule(buffer, []);
}

pub fn parse_decl(buffer: &[u8], colon_idx: usize) -> CssNode {
  let important_idx = buffer[colon_idx + 1..].find(b"!important");
  let important_idx = important_idx.map(|idx| colon_idx + idx + 1);

  let property = &buffer[..colon_idx];
  let value = buffer[colon_idx + 1..important_idx.unwrap_or(buffer.len())].trim_ascii();

  return decl(property, value, important_idx.is_some());
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::css::ast::{style_rule, Stylesheet};
  use rstest::*;

  #[derive(Debug)]
  enum LineEnding {
    Unix,
    Windows,
  }

  use LineEnding::*;

  fn test_parse(line_ending: LineEnding, css: &[u8]) -> Result<Stylesheet, String> {
    let input = css
      .replace("\r\n", "\n")
      .replace("\n", match line_ending {
        LineEnding::Unix => "\n",
        LineEnding::Windows => "\r\n",
      });

    return parse(&input);
  }

  //
  // Comments
  //

  #[rstest]
  fn should_parse_a_comment_and_ignore_it(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      /*Hello, world!*/
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([]));
  }

  #[rstest]
  fn should_parse_a_comment_with_an_escaped_ending_and_ignore_it(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      /*Hello, \\*\\/ world!*/
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([]));
  }

  #[rstest]
  fn should_parse_a_comment_inside_of_a_selector_and_ignore_it(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo {
        /*Example comment*/
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".foo", []),
    ]));
  }

  #[rstest]
  fn should_remove_comments_in_between_selectors_while_maintaining_the_correct_whitespace(
    #[values(Unix)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo/*.bar*/.baz {
      }
      .foo/*.bar*//*.baz*/.qux
      {
      }
      .foo/*.bar*/ /*.baz*/.qux {
        /*        ^ whitespace */
      }
      .foo /*.bar*/.baz {
        /*^ whitespace */
      }
      .foo/*.bar*/ .baz {
        /*        ^ whitespace */
      }
      .foo/*.bar*/
      .baz {
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".foo.baz", []),
      style_rule(b".foo.qux", []),
      style_rule(b".foo .qux", []),
      style_rule(b".foo .baz", []),
      style_rule(b".foo .baz", []),
      style_rule(b".foo .baz", []),
    ]));
  }

  #[rstest]
  fn collects_license_comments(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      /*! License #1 */
      /*!
        * License #2
        */
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      comment(b" License #1 ".to_vec()),
      comment(b"\n        * License #2\n        ".to_vec()),
    ]));
  }

  #[rstest]
  fn should_hoist_all_license_comments(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      /*! License #1 */
      .foo {
        color: red; /*! License #1.5 */
      }
      /*! License #2 */
      .bar {
        /*! License #2.5 */
        color: blue;
      }
      /*! License #3 */
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      comment(b" License #1 ".to_vec()),
      comment(b" License #1.5 ".to_vec()),
      comment(b" License #2 ".to_vec()),
      comment(b" License #2.5 ".to_vec()),
      comment(b" License #3 ".to_vec()),
      style_rule(b".foo", [
        decl(b"color", b"red", false),
      ]),
      style_rule(b".bar", [
        decl(b"color", b"blue", false),
      ]),
    ]));
  }

  #[rstest]
  fn should_handle_comments_before_element_selectors(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .dark /* comment */p {
        color: black;
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".dark p", [
        decl(b"color", b"black", false),
      ]),
    ]));
  }

  //
  // Declarations
  //

  #[rstest]
  fn should_parse_a_simple_declaration(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      color: red;
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"color", b"red", false),
    ]));
  }

  #[rstest]
  fn should_parse_declarations_with_strings(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      content: 'Hello, world!';
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"content", b"'Hello, world!'", false),
    ]));
  }

  #[rstest]
  fn should_parse_declarations_with_nested_strings(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      content: 'Good, \"monday\", morning!';
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"content", b"'Good, \"monday\", morning!'", false),
    ]));
  }

  #[rstest]
  fn should_parse_declarations_with_nested_strings_that_are_not_balanced(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      content: \"It's a beautiful day!\";
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"content", b"\"It's a beautiful day!\"", false),
    ]));
  }

  #[rstest]
  fn should_parse_declarations_with_with_strings_and_escaped_string_endings(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      content: 'These are not the end \"\\' of the string';
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"content", b"'These are not the end \"\\' of the string'", false),
    ]));
  }

  ///
  /// Declarations: Important
  ///

  #[rstest]
  fn should_parse_declarations_with_important(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      color: red !important;
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"color", b"red", true),
    ]));
  }

  #[rstest]
  fn should_parse_declarations_with_important_and_trailing_comment(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      color: red !important; /* Very important */
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"color", b"red", true),
    ]));
  }

  ///
  /// Declarations: Custom properties
  ///

  #[rstest]
  fn should_parse_a_custom_property(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      --foo: bar;
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"--foo", b"bar", false),
    ]));
  }

  #[rstest]
  fn should_parse_a_minified_custom_property(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"--foo:bar;";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"--foo", b"bar", false),
    ]));
  }

  #[rstest]
  fn should_parse_a_minified_custom_property_with_no_semicolon(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"--foo:bar";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"--foo", b"bar", false),
    ]));
  }

  #[rstest]
  fn should_parse_a_custom_property_with_a_missing_semicolon(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      --foo: bar
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"--foo", b"bar", false),
    ]));
  }

  #[rstest]
  fn should_parse_a_custom_property_with_a_missing_semicolon_and_important(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      --foo: bar !important
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"--foo", b"bar", true),
    ]));
  }

  #[rstest]
  fn should_parse_a_custom_property_with_an_embedded_programming_language(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      --foo: if(x > 5) this.width = 10;
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"--foo", b"if(x > 5) this.width = 10", false),
    ]));
  }

  #[rstest]
  fn should_parse_a_custom_property_with_an_empty_block_as_the_value(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      --foo: {};
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"--foo", b"{}", false),
    ]));
  }

  #[rstest]
  fn should_parse_a_custom_property_with_a_block_including_nested_css(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      --foo: {
        background-color: red;
        /* A comment */
        content: 'Hello, world!';
      };
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"--foo", b"{
        background-color: red;
        /* A comment */
        content: 'Hello, world!';
      }", false),
    ]));
  }

  #[rstest]
  fn should_parse_a_custom_property_with_a_block_including_nested_css_and_comments_with_end_characters_inside_them(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      --foo: {
        background-color: red;
        /* A comment ; */
        content: 'Hello, world!';
      };
      --bar: {
        background-color: red;
        /* A comment } */
        content: 'Hello, world!';
      };
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"--foo", b"{
        background-color: red;
        /* A comment ; */
        content: 'Hello, world!';
      }", false),
      decl(b"--bar", b"{
        background-color: red;
        /* A comment } */
        content: 'Hello, world!';
      }", false),
    ]));
  }

  #[rstest]
  fn should_parse_a_custom_property_with_escaped_characters_in_the_value(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      --foo: This is not the end \\;, but this is;
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"--foo", b"This is not the end \\;, but this is", false),
    ]));
  }

  #[rstest]
  fn should_parse_a_custom_property_with_escaped_characters_inside_a_comment_in_the_value(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      --foo: /* This is not the end \\; this is also not the end ; */ but this is;
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"--foo", b"/* This is not the end \\; this is also not the end ; */ but this is", false),
    ]));
  }

  #[rstest]
  fn should_parse_empty_custom_properties(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      --foo: ;
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"--foo", b"", false),
    ]));
  }

  #[rstest]
  fn should_parse_custom_properties_with_important(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      --foo: bar !important;
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"--foo", b"bar", true),
    ]));
  }

  #[rstest]
  fn should_parse_multiple_declarations(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      color: red;
      background-color: blue;
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"color", b"red", false),
      decl(b"background-color", b"blue", false),
    ]));
  }

  #[rstest]
  fn should_correctly_parse_comments_with_colon_inside_of_them(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      color/* color: #f00; */: red;
      font-weight:/* font-size: 12px */ bold;

      .foo {
        background-color/* background-color: #f00; */: red;
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      decl(b"color", b"red", false),
      decl(b"font-weight", b"bold", false),
      style_rule(b".foo", [
        decl(b"background-color", b"red", false),
      ]),
    ]));
  }

  #[rstest]
  fn should_parse_multi_line_declarations(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo {
        grid-template-areas:
          'header header header'
          'sidebar main main'
          'footer footer footer';
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".foo", [
        decl(b"grid-template-areas", b"'header header header' 'sidebar main main' 'footer footer footer'", false),
      ]),
    ]));
  }

  //
  // Selectors (Style Rules)
  //

  #[rstest]
  fn should_parse_a_simple_style_rule(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo {
        color: red;
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".foo", [
        decl(b"color", b"red", false),
      ]),
    ]));
  }

  #[rstest]
  fn should_parse_selectors_with_escaped_characters(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .hover\\:foo:hover {
      }
      .\\32 xl\\:foo {
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".hover\\:foo:hover", []),
      style_rule(b".\\32 xl\\:foo", []),
    ]));
  }

  #[rstest]
  fn should_parse_multiple_simple_selectors(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo,
      .bar {
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".foo, .bar", []),
    ]));
  }

  #[rstest]
  fn should_parse_multiple_declarations_inside_of_a_selector(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo {
        color: red;
        font-size: 16px;
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".foo", [
        decl(b"color", b"red", false),
        decl(b"font-size", b"16px", false),
      ]),
    ]));
  }

  #[rstest]
  fn should_parse_rules_with_declarations_that_end_with_a_missing_semicolon(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo {
        color: red;
        font-size: 16px
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".foo", [
        decl(b"color", b"red", false),
        decl(b"font-size", b"16px", false),
      ]),
    ]));
  }

  #[rstest]
  fn should_parse_rules_with_declarations_that_end_with_a_missing_semicolon_and_important(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo {
        color: red;
        font-size: 16px !important
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".foo", [
        decl(b"color", b"red", false),
        decl(b"font-size", b"16px", true),
      ]),
    ]));
  }

  #[rstest]
  fn should_parse_a_multi_line_selector(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo,
      .bar,
      .baz
      {
        color: red;
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".foo, .bar, .baz", [
        decl(b"color", b"red", false),
      ]),
    ]));
  }

  #[rstest]
  fn should_parse_a_multi_line_selector_and_preserves_important_whitespace(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo,
      .bar,
      .baz\t\n \n .qux
      {
        color: red;
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".foo, .bar, .baz .qux", [
        decl(b"color", b"red", false),
      ]),
    ]));
  }

  //
  // At-Rules
  //

  #[rstest]
  fn should_parse_an_at_rule_without_a_block(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      @charset \"UTF-8\";
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      at_rule(b"charset", b"\"UTF-8\"", []),
    ]));
  }

  #[rstest]
  fn should_parse_an_at_rule_without_a_block_or_semicolon(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      @tailwind utilities
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      at_rule(b"tailwind", "utilities", []),
    ]));
  }

  #[rstest]
  fn should_parse_an_at_rule_without_a_block_or_semicolon_when_its_the_last_rule_in_a_block(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      @layer utilities {
        @tailwind utilities
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      at_rule(b"layer", b"utilities", [
        at_rule(b"tailwind", b"utilities", []),
      ]),
    ]));
  }

  #[rstest]
  fn should_parse_a_nested_at_rule_without_a_block(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      @layer utilities {
        @charset \"UTF-8\";
      }

      .foo {
        @apply font-bold hover:text-red-500;
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      at_rule(b"layer", b"utilities", [
        at_rule(b"charset", b"\"UTF-8\"", []),
      ]),
      style_rule(b".foo", [
        at_rule(b"apply", b"font-bold hover:text-red-500", []),
      ]),
    ]));
  }

  #[rstest]
  fn should_parse_custom_at_rules_without_a_block(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      @tailwind;
      @tailwind base;
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      at_rule(b"tailwind", b"", []),
      at_rule(b"tailwind", b"base", []),
    ]));
  }

  #[rstest]
  fn should_parse_nested_media_queries(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      @media (width >= 600px) {
        .foo {
          color: red;
          @media (width >= 800px) {
            color: blue;
          }
          @media (width >= 1000px) {
            color: green;
          }
        }
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      at_rule(b"media", b"(width >= 600px)", [
        style_rule(b".foo", [
          decl(b"color", b"red", false),
          at_rule(b"media", b"(width >= 800px)", [
            decl(b"color", b"blue", false),
          ]),
          at_rule(b"media", b"(width >= 1000px)", [
            decl(b"color", b"green", false),
          ]),
        ]),
      ]),
    ]));
  }

  #[rstest]
  fn should_parse_at_rules_that_span_multiple_lines(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo {
        @apply hover:text-red-100
               sm:hover:text-red-200
               md:hover:text-red-300
               lg:hover:text-red-400
               xl:hover:text-red-500;
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".foo", [
        at_rule(b"apply", b"hover:text-red-100 sm:hover:text-red-200 md:hover:text-red-300 lg:hover:text-red-400 xl:hover:text-red-500", []),
      ]),
    ]));
  }

  //
  // Nesting
  //

  #[rstest]
  fn should_parse_nested_rules(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo {
        .bar {
          .baz {
            color: red;
          }
        }
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".foo", [
        style_rule(b".bar", [
          style_rule(b".baz", [
            decl(b"color", b"red", false),
          ]),
        ]),
      ]),
    ]));
  }

  #[rstest]
  fn should_parse_nested_selector_with_ampersand(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo {
        color: red;

        &:hover {
          color: blue;
        }
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".foo", [
        decl(b"color", b"red", false),
        style_rule(b"&:hover", [
          decl(b"color", b"blue", false),
        ]),
      ]),
    ]));
  }

  #[rstest]
  fn should_parse_nested_sibling_selector(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo {
        .bar {
          color: red;
        }

        .baz {
          color: blue;
        }
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".foo", [
        style_rule(b".bar", [
          decl(b"color", b"red", false),
        ]),
        style_rule(b".baz", [
          decl(b"color", b"blue", false),
        ]),
      ]),
    ]));
  }

  #[rstest]
  fn should_parse_nested_sibling_selectors_and_sibling_declaration(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo {
        font-weight: bold;
        text-decoration-line: underline;

        .bar {
          color: red;
        }

        --in-between: 1;

        .baz {
          color: blue;
        }

        --at-the-end: 2;
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".foo", [
        decl(b"font-weight", b"bold", false),
        decl(b"text-decoration-line", b"underline", false),
        style_rule(b".bar", [
          decl(b"color", b"red", false),
        ]),
        decl(b"--in-between", b"1", false),
        style_rule(b".baz", [
          decl(b"color", b"blue", false),
        ]),
        decl(b"--at-the-end", b"2", false),
      ]),
    ]));
  }

  //
  // Complex
  //

  #[rstest]
  fn should_parse_complex_examples(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      @custom \\{ {
        foo: bar;
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      at_rule(b"custom", b"\\{", [
        decl(b"foo", b"bar", false),
      ]),
    ]));
  }

  #[rstest]
  fn should_parse_minified_nested_css(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b".foo{color:red;@media(width>=600px){.bar{color:blue;font-weight:bold}}}";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".foo", [
        decl(b"color", b"red", false),
        at_rule(b"media", b"(width>=600px)", [
          style_rule(b".bar", [
            decl(b"color", b"blue", false),
            decl(b"font-weight", b"bold", false),
          ]),
        ]),
      ]),
    ]));
  }

  #[rstest]
  fn should_ignore_everything_inside_of_comments(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo:has(.bar /* instead \\*\\/ of .baz { */) {
        color: red;
      }
    ";

    let output = test_parse(line_ending, input).unwrap();
    assert_eq!(output, Stylesheet::from([
      style_rule(b".foo:has(.bar )", [
        decl(b"color", b"red", false),
      ]),
    ]));
  }

  //
  // Errors
  //

  #[rstest]
  fn should_error_when_curly_brackets_are_unbalanced_opening(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo {
        color: red;
      }

      .bar
        /* ^ Missing opening { */
        color: blue;
      }
    ";

    let output = test_parse(line_ending, input);
    assert_eq!(output, Err("Missing opening {".to_owned()));
  }

  #[rstest]
  fn should_error_when_curly_brackets_are_unbalanced_closing(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo {
        color: red;
      }

      .bar {
        color: blue;

   /* ^ Missing closing } */
    ";

    let output = test_parse(line_ending, input);
    assert_eq!(output, Err("Missing closing } at .bar".to_owned()));
  }

  #[rstest]
  fn should_error_when_an_unterminated_string_is_used(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo {
        content: \"Hello world!
        /*                    ^ missing \" */
        font-weight: bold;
      }
    ";

    let output = test_parse(line_ending, input);
    assert_eq!(output, Err("Unterminated string: \"Hello world!\"".to_owned()));
  }

  #[rstest]
  fn should_error_when_an_unterminated_string_is_used_with_a_semicolon(
    #[values(Unix, Windows)]
    line_ending: LineEnding
  ) {
    let input = b"
      .foo {
        content: \"Hello world!;
        /*                    ^ missing \" */
        font-weight: bold;
      }
    ";

    let output = test_parse(line_ending, input);
    assert_eq!(output, Err("Unterminated string: \"Hello world!;\"".to_owned()));
  }
}
