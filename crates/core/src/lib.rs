mod compat;
mod css;
mod util;
mod engine;

use css::optimize::optimize_ast;
use css::parser::parse;
use wasm_bindgen::prelude::*;
use std::cell::Cell;
use css::ast::CssNode;
use css::visit::WalkAction;

#[wasm_bindgen]
pub fn wip() {
  // 1. Parse the CSS
  let mut ast = parse(b"h1 { color: red; font-size: 2em; } h2 { color: blue; font-size: 1.5em; }").unwrap();

  // 2. Walk the AST and mutate all color properties to green
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

  // 3. Walk the AST and count the number of font-size properties
  let count = Cell::new(0);

  ast.walk(&|node| {
    let CssNode::Declaration { property, .. } = node else {
      return WalkAction::Continue;
    };

    if property != b"font-size" {
      return WalkAction::Continue;
    }

    count.set(count.get() + 1);

    WalkAction::Continue
  });

  // 4. Optimize the AST
  optimize_ast(&mut ast);

  // 5. Serialize the AST back to CSS
  let css = ast.to_css();

  // 6. Print the CSS
  println!("{}", String::from_utf8_lossy(&css));
  println!("{}", count.get());
}

// use css::ast::{decl, rule, Ast, AstNode, WalkAction};

// pub struct Compiler {
//   ast: Stylesheet,
//   config_paths: Vec<String>,
//   plugin_paths: Vec<String>,
// }

// impl Compiler {
//   fn new(css: &[u8]) -> Compiler {
//     let mut ast = parse_css(css);
//     let mut plugin_paths = vec![];
//     let mut config_paths = vec![];

//     ast.walk(&mut |node, _| {
//       let AstNode::Rule { selector, .. } = node else {
//         return WalkAction::Continue;
//       };

//       if selector.starts_with(b"@plugin") {
//         let path = selector.split_at(7).1;
//         let path = &path[2..path.len()-1];
//         let path = path.to_vec();

//         plugin_paths.push(unsafe {
//           String::from_utf8_unchecked(path)
//         });
//       }

//       if selector.starts_with(b"@config") {
//         let path = selector.split_at(7).1;
//         let path = &path[2..path.len()-1];
//         let path = path.to_vec();

//         config_paths.push(unsafe {
//           String::from_utf8_unchecked(path)
//         });
//       }

//       WalkAction::Continue
//     });

//     Compiler {
//       ast,
//     }
//   }

//   // fn plugin_paths(&self) -> Vec<String> {
//   //   vec![]
//   // }

//   // fn config_paths(&self) -> Vec<String> {
//   //   vec![]
//   // }
// }

// fn parse_css(css: &[u8]) -> Ast {
//   // TODO: Parse the CSS into an AST
//   _ = css;

//   Ast::from(vec![
//     rule(b"body", vec![
//       decl(b"color", Some(b"red"), false),
//     ]),
//   ])
// }

// fn foo() {
//   let css = b"body { color: red; }";
//   let compiler = Compiler::new(css);
// }

// enum UtilityDescriptor {
//   Simple {
//     name: String,
//     ast: Ast,
//   },
// }
