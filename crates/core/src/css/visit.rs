use super::ast::{CssNode, Stylesheet};

#[derive(Debug, Clone, PartialEq)]
pub enum WalkAction {
  // Continue walking, which is the default
  Continue,

  // Skip visiting the children of this node
  Skip,

  // Stop the walk entirely
  Stop,
}

impl Stylesheet {
  pub fn walk<V>(&self, cb: &V)
  where
    V: Fn(&CssNode) -> WalkAction
  {
    self.rules.walk(cb)
  }
}

impl CssNode {
  pub fn walk<V>(&self, cb: &V)
  where
      V: Fn(&CssNode) -> WalkAction
  {
    _ = self.walk_impl(cb);
  }

  fn walk_impl<V>(&self, cb: &V) -> WalkAction
  where
      V: Fn(&CssNode) -> WalkAction
  {
    match cb(self) {
      WalkAction::Stop => return WalkAction::Stop,
      WalkAction::Skip => return WalkAction::Skip,
      WalkAction::Continue => {}
    }

    for node in self.children() {
      match node.walk_impl(cb) {
        WalkAction::Stop => return WalkAction::Stop,
        WalkAction::Skip => {}
        WalkAction::Continue => {}
      }
    }

    WalkAction::Continue
  }

  fn children(&self) -> impl Iterator<Item = &CssNode> {
    match self {
      CssNode::Context { nodes, .. } => nodes.iter(),
      CssNode::AtRule { nodes, .. } => nodes.iter(),
      CssNode::StyleRule { nodes, .. } => nodes.iter(),
      CssNode::Contents { nodes, .. } => nodes.iter(),
      CssNode::Declaration { .. } => [].iter(),
      CssNode::Comment { .. } => [].iter(),
    }
  }
}

impl Stylesheet {
  pub fn walk_mut<V>(&mut self, cb: &mut V)
  where
    V: FnMut(&mut CssNode) -> WalkAction
  {
    self.rules.walk_mut(cb)
  }
}

impl CssNode {
  pub fn walk_mut<V>(&mut self, cb: &mut V)
  where
      V: FnMut(&mut CssNode) -> WalkAction
  {
    _ = self.walk_mut_impl(cb);
  }

  fn walk_mut_impl<V>(&mut self, cb: &mut V) -> WalkAction
  where
      V: FnMut(&mut CssNode) -> WalkAction
  {
    match cb(self) {
      WalkAction::Stop => return WalkAction::Stop,
      WalkAction::Skip => return WalkAction::Skip,
      WalkAction::Continue => {}
    }

    for node in self.children_mut() {
      match node.walk_mut_impl(cb) {
        WalkAction::Stop => return WalkAction::Stop,
        WalkAction::Skip => {}
        WalkAction::Continue => {}
      }
    }

    WalkAction::Continue
  }

  pub fn children_mut(&mut self) -> impl Iterator<Item = &mut CssNode> {
    match self {
      CssNode::Context { nodes, .. } => nodes.iter_mut(),
      CssNode::AtRule { nodes, .. } => nodes.iter_mut(),
      CssNode::StyleRule { nodes, .. } => nodes.iter_mut(),
      CssNode::Contents { nodes, .. } => nodes.iter_mut(),
      CssNode::Declaration { .. } => [].iter_mut(),
      CssNode::Comment { .. } => [].iter_mut(),
    }
  }
}

#[cfg(test)]
mod test {
  use super::*;
  use crate::css::ast::*;
  use std::cell::Cell;

  #[test]
  fn test_walk() {
    let ast = Stylesheet::from([
      style_rule("h1", [
        decl("color", "red", false),
        decl("font-size", "2em", false),
      ]),
      style_rule("h2", [
        decl("color", "blue", false),
        decl("font-size", "1.5em", false),
      ]),
    ]);

    let count = Cell::new(0);

    ast.walk(&|node| {
      if let CssNode::Declaration { property, .. } = node {
        if property == b"color" {
          count.set(count.get() + 1);
        }
      }

      WalkAction::Continue
    });

    assert_eq!(count.get(), 2);
  }

  #[test]
  fn test_walk_mut() {
    let mut ast = Stylesheet::from([
      style_rule("h1", [
        decl("color", "red", false),
        decl("font-size", "2em", false),
      ]),
      style_rule("h2", [
        decl("color", "blue", false),
        decl("font-size", "1.5em", false),
      ]),
    ]);

    // 1. Change all color properties to green
    ast.walk_mut(&mut |node| {
      let CssNode::Declaration { property, value, .. } = node else {
        return WalkAction::Continue;
      };

      if property != b"color" {
        return WalkAction::Continue;
      }

      *value = "green".into();

      return WalkAction::Continue;
    });

    // 2. Re-walk the AST and check that all color properties are green
    let count = Cell::new(0);

    ast.walk(&|node| {
      if let CssNode::Declaration { property, value, .. } = node {
        if property == b"color" && value == b"green" {
          count.set(count.get() + 1);
        }
      }

      WalkAction::Continue
    });

    assert_eq!(count.get(), 2);
  }
}
