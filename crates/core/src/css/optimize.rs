// Performs an optimization pass on the AST to (usually) reduce the size of the output CSS

use std::{collections::HashSet, mem};

use super::{ast::{at_rule, decl, style_rule, CssNode, Stylesheet}, visit::WalkAction};

pub fn optimize_ast(ast: &mut Stylesheet) {
  remove_duplicate_at_properties(ast);
  add_property_fallbacks(ast);
  hoist_at_roots(ast);
  flatten_utilities(ast);
}

/// Remove duplicate `@property` rules appearing in the AST
/// They're replaced with empty nodes that print nothing
fn remove_duplicate_at_properties(ast: &mut Stylesheet) {
  let mut seen = HashSet::<Vec<u8>>::new();

  ast.walk_mut(&mut |node| {
    let CssNode::AtRule { name, params, .. } = node else {
      return WalkAction::Continue;
    };

    if name != b"property" {
      return WalkAction::Continue;
    }

    if !seen.contains(params) {
      seen.insert(params.clone());

      return WalkAction::Continue;
    }

    *node = CssNode::empty();

    return WalkAction::Skip;
  })
}

/// Collect fallbacks for `@property` rules for Firefox support
/// We turn these into rules on `:root` or `*` and some pseudo-elements
/// based on the value of `inherits`
fn add_property_fallbacks(ast: &mut Stylesheet) {
  let mut fallbacks_root = Vec::<CssNode>::new();
  let mut fallbacks_universal = Vec::<CssNode>::new();

  // Create fallback rules for defined properties
  ast.walk_mut(&mut |node| {
    let CssNode::AtRule { name, params, nodes, .. } = node else {
      return WalkAction::Continue;
    };

    if name != b"property" {
      return WalkAction::Continue;
    }

    let property_name = params.clone();
    let mut initial_value: Option<Vec<u8>> = None;
    let mut inherits = false;

    for child in nodes {
      let CssNode::Declaration { property, value, .. } = child else {
        continue;
      };

      if property == b"initial-value" {
        initial_value = Some(value.clone());
      } else if property == b"inherits" {
        inherits = value == b"true";
      }
    }

    let initial_value = initial_value.unwrap_or(b"initial".to_vec());

    if inherits {
      fallbacks_root.push(decl(property_name, initial_value, false));
    } else {
      fallbacks_universal.push(decl(property_name, initial_value, false));
    }

    return WalkAction::Skip;
  });

  let CssNode::Contents { nodes } = &mut ast.rules else {
    return;
  };

  let mut fallback_ast = vec![];

  if !fallbacks_root.is_empty() {
    fallback_ast.push(style_rule(b":root", fallbacks_root));
  }

  if !fallbacks_universal.is_empty() {
    fallback_ast.push(style_rule(
      b"*, ::before, ::after, ::backdrop",
      fallbacks_universal
    ));
  }

  if !fallback_ast.is_empty() {
    fallback_ast = vec![
      at_rule(b"supports", b"(-moz-orient: inline)", [
        at_rule(b"layer", b"base", fallback_ast),
      ]),
    ];
  }

  nodes.extend(fallback_ast);
}

/// Collect fallbacks for `@property` rules for Firefox support
/// We turn these into rules on `:root` or `*` and some pseudo-elements
/// based on the value of `inherits`
fn hoist_at_roots(ast: &mut Stylesheet) {
  let mut roots = Vec::<CssNode>::new();

  ast.walk_mut(&mut |node| {
    let CssNode::AtRule { name, nodes, .. } = node else {
      return WalkAction::Continue;
    };

    if name != b"at-root" {
      return WalkAction::Continue;
    }

    // Pull the nodes out of the at-root rule
    roots.extend(mem::take(nodes));

    // Replace the at-root rule with an empty node
    *node = CssNode::empty();

    return WalkAction::Skip;
  });

  let CssNode::Contents { nodes } = &mut ast.rules else {
    return;
  };

  nodes.extend(roots);
}

/// Collect fallbacks for `@property` rules for Firefox support
/// We turn these into rules on `:root` or `*` and some pseudo-elements
/// based on the value of `inherits`
fn flatten_utilities(ast: &mut Stylesheet) {
  ast.walk_mut(&mut |node| {
    let CssNode::AtRule { name, params, nodes, .. } = node else {
      return WalkAction::Continue;
    };

    if name != b"tailwind" {
      return WalkAction::Continue;
    }

    if params != b"utilities" {
      return WalkAction::Continue;
    }

    *node = CssNode::from(mem::take(nodes));

    return WalkAction::Skip;
  });
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_remove_duplicate_at_properties() {
    let mut css = Stylesheet::from([
      at_rule("property", "--foo", [
        decl("syntax", "<length>", false),
        decl("inherits", "false", false),
        decl("initial-value", "0", false),
      ]),

      at_rule("property", "--foo", [
        decl("syntax", "<length>", false),
        decl("inherits", "false", false),
        decl("initial-value", "0", false),
      ]),
    ]);

    remove_duplicate_at_properties(&mut css);

    let expected = Stylesheet::from([
      at_rule("property", "--foo", [
        decl("syntax", "<length>", false),
        decl("inherits", "false", false),
        decl("initial-value", "0", false),
      ]),

      CssNode::empty(),
    ]);

    assert_eq!(css, expected);
  }

  #[test]
  fn test_add_property_fallbacks() {
    let mut css = Stylesheet::from([
      at_rule("property", "--foo", [
        decl("syntax", "<length>", false),
        decl("inherits", "true", false),
        decl("initial-value", "0", false),
      ]),

      at_rule("property", "--bar", [
        decl("syntax", "<length>", false),
        decl("inherits", "false", false),
        decl("initial-value", "0", false),
      ]),
    ]);

    add_property_fallbacks(&mut css);

    let expected = Stylesheet::from([
      at_rule("property", "--foo", [
        decl("syntax", "<length>", false),
        decl("inherits", "true", false),
        decl("initial-value", "0", false),
      ]),

      at_rule("property", "--bar", [
        decl("syntax", "<length>", false),
        decl("inherits", "false", false),
        decl("initial-value", "0", false),
      ]),

      at_rule("supports", "(-moz-orient: inline)", [
        at_rule("layer", "base", [
          style_rule(":root", [
            decl("--foo", "0", false),
          ]),

          style_rule("*, ::before, ::after, ::backdrop", [
            decl("--bar", "0", false),
          ]),
        ]),
      ]),
    ]);

    assert_eq!(css, expected);
  }

  #[test]
  fn test_hoist_at_roots() {
    let mut css = Stylesheet::from([
      at_rule("layer", "base", [
        at_rule("at-root", "", [
          at_rule("keyframes", "spin", [
            style_rule("from", [
              decl("transform", "rotate(0deg)", false),
            ]),

            style_rule("to", [
              decl("transform", "rotate(360deg)", false),
            ]),
          ]),
        ]),

        at_rule("layer", "defaults", [
          at_rule("at-root", "", [
            at_rule("keyframes", "pulse", [
              style_rule("50%", [
                decl("opacity", "0", false),
              ]),
            ]),
          ]),
        ]),
      ])
    ]);

    hoist_at_roots(&mut css);

    let expected = Stylesheet::from([
      at_rule("layer", "base", [
        CssNode::empty(),

        at_rule("layer", "defaults", [
          CssNode::empty(),
        ]),
      ]),

      at_rule("keyframes", "spin", [
        style_rule("from", [
          decl("transform", "rotate(0deg)", false),
        ]),

        style_rule("to", [
          decl("transform", "rotate(360deg)", false),
        ]),
      ]),

      at_rule("keyframes", "pulse", [
        style_rule("50%", [
          decl("opacity", "0", false),
        ]),
      ]),
    ]);

    assert_eq!(css, expected);
  }
}
