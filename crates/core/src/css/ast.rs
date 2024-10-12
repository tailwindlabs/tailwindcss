use std::{collections::HashMap, fmt, unreachable};

/// Represents the AST of a CSS stylesheet
#[derive(Clone, PartialEq)]
pub struct Stylesheet {
  pub(crate) rules: CssNode,
}

/// A node in a CSS Stylesheet
#[derive(Clone, PartialEq)]
pub enum CssNode {
  /// A context block used to provide shared data to subtrees
  Context {
    data: HashMap<String, String>,
    nodes: Vec<CssNode>,
  },

  /// A CSS at rule
  AtRule {
    name: Vec<u8>,
    params: Vec<u8>,
    nodes: Vec<CssNode>,
  },

  /// A CSS style rule
  StyleRule {
    selector: Vec<u8>,
    nodes: Vec<CssNode>,
  },

  /// A CSS declaration
  Declaration {
    property: Vec<u8>,
    value: Vec<u8>,
    important: bool,
  },

  /// A comment
  Comment {
    value: Vec<u8>,
  },

  /// Represents multiple CSS nodes
  /// This is used when replacing a single node with multiple nodes
  Contents {
    nodes: Vec<CssNode>,
  },
}

pub fn style_rule(selector: impl Into<Vec<u8>>, nodes: impl Into<Vec<CssNode>>) -> CssNode {
  CssNode::StyleRule {
    selector: selector.into(),
    nodes: nodes.into(),
  }
}

pub fn at_rule(name: impl Into<Vec<u8>>, params: impl Into<Vec<u8>>, nodes: impl Into<Vec<CssNode>>) -> CssNode {
  CssNode::AtRule {
    name: name.into(),
    params: params.into(),
    nodes: nodes.into()
  }
}


pub fn decl(property: impl Into<Vec<u8>>, value: impl Into<Vec<u8>>, important: bool) -> CssNode {
  CssNode::Declaration {
    property: property.into(),
    value: value.into(),
    important,
  }
}

pub fn comment(value: impl Into<Vec<u8>>) -> CssNode {
  CssNode::Comment { value: value.into() }
}

impl<T> From<T> for CssNode where T: Into<Vec<CssNode>> {
  fn from(nodes: T) -> Self {
    CssNode::Contents { nodes: nodes.into() }
  }
}

impl<T> From<T> for Stylesheet where T: Into<Vec<CssNode>> {
  fn from(nodes: T) -> Self {
    Stylesheet {
      rules: CssNode::from(nodes.into())
    }
  }
}

impl CssNode {
  pub fn empty() -> Self {
    CssNode::from([])
  }
}

impl fmt::Debug for Stylesheet {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "Stylesheet {{ rules: {:?} }}", self.rules)
  }
}

impl fmt::Debug for CssNode {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      CssNode::Context { data, nodes } => {
        write!(f, "Context {{ data: {:?}, nodes: {:?} }}", data, nodes)
      },

      CssNode::AtRule { name, params, nodes } => {
        write!(f, "AtRule {{ name: {:?}, params: {:?}, nodes: {:?} }}", String::from_utf8_lossy(name), String::from_utf8_lossy(params), nodes)
      },

      CssNode::StyleRule { selector, nodes } => {
        write!(f, "StyleRule {{ selector: {:?}, nodes: {:?} }}", String::from_utf8_lossy(selector), nodes)
      },

      CssNode::Declaration { property, value, important } => {
        write!(f, "Declaration {{ property: {:?}, value: {:?}, important: {:?} }}", String::from_utf8_lossy(property), String::from_utf8_lossy(value), important)
      },

      CssNode::Comment { value } => {
        write!(f, "Comment {{ value: {:?} }}", String::from_utf8_lossy(value))
      },

      CssNode::Contents { nodes } => {
        write!(f, "Contents {{ nodes: {:?} }}", nodes)
      },
    }
  }
}

impl CssNode {
  #[inline(always)]
  pub fn push(&mut self, node: CssNode) {
    match self {
      CssNode::AtRule { nodes, .. } => {
        nodes.push(node);
      },
      CssNode::StyleRule { nodes, .. } => {
        nodes.push(node);
      },
      CssNode::Contents { nodes, .. } => {
        nodes.push(node);
      },
      _ => {
        if cfg!(debug_assertions) {
          panic!("Cannot push to a non-container node.");
        } else {
          unreachable!();
        }
      }
    }
  }
}
