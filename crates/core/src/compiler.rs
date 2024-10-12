use std::error::Error;

use crate::css::parser::parse;
use crate::css::ast::Stylesheet;

struct Compiler {
  ast: Stylesheet,
}

impl Compiler {
  fn new(css: &[u8]) -> Result<Compiler, Box<dyn Error>> {
    let ast = parse(css)?;

    Ok(Compiler {
      ast,
    })
  }
}
