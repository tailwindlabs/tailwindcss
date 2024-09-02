use super::ast::{CssNode, Stylesheet};

impl Stylesheet {
  pub fn to_css(&self) -> Vec<u8> {
    self.rules.to_css()
  }
}

impl CssNode {
  fn to_css(&self) -> Vec<u8> {
    let mut css: Vec<u8> = vec![];
    self.write_css_to(&mut css, 0);
    return css;
  }

  fn write_css_to(&self, css: &mut Vec<u8>, depth: usize) {
    let indent = b"  ".repeat(depth);

    match self {
      CssNode::Comment { value } => {
        css.extend(&indent);
        css.extend(b"/*");
        css.extend(value);
        css.extend(b"*/\n");
      },

      CssNode::Declaration { property, value, important } => {
        css.extend(&indent);
        css.extend(property);
        css.extend(b": ");
        css.extend(value);
        if *important {
          css.extend(b" !important");
        }
        css.extend(b";\n");
      },

      CssNode::Context { nodes, .. } => {
        for child in nodes {
          child.write_css_to(css, depth);
        }
      },

      CssNode::Contents { nodes } => {
        for child in nodes {
          child.write_css_to(css, depth);
        }
      },

      CssNode::AtRule { name, params, nodes } => {
        css.extend(&indent);
        css.extend(b"@");
        css.extend(name);
        css.extend(b" ");
        css.extend(params);

        // Print at-rules without nodes with a `;` instead of an empty block.
        //
        // E.g.:
        //
        // ```css
        // @layer base, components, utilities;
        // ```
        if nodes.is_empty() {
          css.extend(b";\n");
        } else {
          css.extend(b" {\n");

          for child in nodes {
            child.write_css_to(css, depth + 1);
          }

          css.extend(&indent);
          css.extend(b"}\n");
        }
      },

      CssNode::StyleRule { selector, nodes } => {
        css.extend(&indent);
        css.extend(selector);
        css.extend(b" {\n");

        for child in nodes {
          child.write_css_to(css, depth + 1);
        }

        css.extend(&indent);
        css.extend(b"}\n");
      }
    }
  }
}

#[cfg(test)]
mod test {
  use crate::css::{ast::{comment, decl}, parser::parse};

  #[test]
  fn should_pretty_print_an_ast() {
    let css = parse(b".foo{color:red;&:hover{color:blue;}}").unwrap();

    assert_eq!(css.to_css(), b".foo {\n  color: red;\n  &:hover {\n    color: blue;\n  }\n}\n");
  }

  #[test]
  fn should_print_decls() {
    let css = decl(b"color", "red", false);
    assert_eq!(css.to_css(), b"color: red;\n");
  }

  #[test]
  fn should_print_decls_important() {
    let css = decl(b"color", "red", true);
    assert_eq!(css.to_css(), b"color: red !important;\n");
  }

  #[test]
  fn should_print_comments() {
    let css = comment(b" hello world ");

    assert_eq!(css.to_css(), b"/* hello world */\n");
  }

  #[test]
  fn should_print_at_rules_without_a_body() {
    let css = parse(b"@layer base, components, utilities;").unwrap();
    assert_eq!(css.to_css(), b"@layer base, components, utilities;\n");
  }

  #[test]
  fn should_print_at_rules_with_a_body() {
    let css = parse(b"@layer base { color: red; }").unwrap();
    assert_eq!(css.to_css(), b"@layer base {\n  color: red;\n}\n");
  }

  #[test]
  fn should_print_at_rules_with_a_body_and_nested_rules() {
    let css = parse(b"@layer base { color: red; &:hover { color: blue; } }").unwrap();
    assert_eq!(css.to_css(), b"@layer base {\n  color: red;\n  &:hover {\n    color: blue;\n  }\n}\n");
  }

  #[test]
  fn should_print_style_rules() {
    let css = parse(b".foo { color: red; }").unwrap();
    assert_eq!(css.to_css(), b".foo {\n  color: red;\n}\n");
  }

  #[test]
  fn should_print_style_rules_with_nested_style_rules() {
    let css = parse(b".foo { color: red; &:hover { color: blue; } }").unwrap();
    assert_eq!(css.to_css(), b".foo {\n  color: red;\n  &:hover {\n    color: blue;\n  }\n}\n");
  }

  #[test]
  fn should_print_style_rules_with_nested_at_rules() {
    let css = parse(b".foo { color: red; @layer base { color: blue; } }").unwrap();
    assert_eq!(css.to_css(), b".foo {\n  color: red;\n  @layer base {\n    color: blue;\n  }\n}\n");
  }
}
