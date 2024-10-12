mod app;
mod pipes;

use std::{collections::HashMap, error::Error, net::SocketAddr, process::{Command, Stdio}, thread, time::Duration};

use app::App;
use lsp_server::{Connection, Message, ReqQueue, Request};
use tailwindcss_css::ast::{rule, AstNode, WalkAction};

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error + Sync + Send>> {
  let mut ast: Vec<AstNode> = vec![
    rule(b"@plugin \"./plugin.ts\"".to_vec(), vec![]),
  ];

  // 1. Collect paths of all plugins in the CSS
  let mut plugins_paths: Vec<String> = vec![];

  for node in ast.iter_mut() {
    node.walk(&mut |node, _| {
      let AstNode::Rule { selector, .. } = node else {
        return WalkAction::Continue;
      };

      if !selector.starts_with(b"@plugin") {
        return WalkAction::Continue;
      }

      let path = selector.split_at(7).1;
      let path = &path[2..path.len()-1];
      let path = path.to_vec();

      plugins_paths.push(unsafe {
        String::from_utf8_unchecked(path)
      });

      WalkAction::Continue
    });
  }

  // 2. Spawn node server
  let mut node_server = Command::new("bun")
      .args(["node/src/server.ts"])
      .stdin(Stdio::inherit())
      .stdout(Stdio::inherit())
      .spawn()
      .unwrap();

  // 3. Wait for the server to start
  thread::sleep(Duration::from_millis(500));

  let (conn, io_threads) = Connection::connect("127.0.0.1:12345".parse::<SocketAddr>()?)?;

  let mut app = App::new(conn);

  _ = app.main_loop().await;

  // 4. Load Plugins
  app.load_plugins(plugins_paths).await?;

  // 6. Ask server to match utilities
  app.call_match_utility("skew", "f10").await?;

  // 7. Wait for the server to respond
  thread::sleep(Duration::from_millis(100));

  // 7. Update the AST with the matched utilities

  io_threads.join()?;
  node_server.kill()?;

  Ok(())
}
