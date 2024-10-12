use std::{collections::HashMap, error::Error};

use lsp_server::{Connection, Message, Notification, ReqQueue, Request, RequestId, Response};
use serde_json::Value;
use tokio::sync::oneshot;

type AppResult<T> = Result<T, Box<dyn Error + Sync + Send>>;
type ReqHandler = Box<dyn Fn(&mut App, Response) -> ()>;

pub struct App {
  connection: Connection,
  queue: ReqQueue::<usize, ReqHandler>,
  utilities: HashMap::<String, Vec<String>>,
}

impl App {
  pub fn new(connection: Connection) -> Self {
    Self {
      connection,
      queue: ReqQueue::default(),
      utilities: HashMap::new(),
    }
  }

  pub async fn main_loop(&mut self) -> AppResult<()> {
    for msg in self.connection.receiver.clone() {
      match msg {
        Message::Request(req) => self.on_request(req).await?,
        Message::Response(res) => self.on_response(res).await?,
        Message::Notification(note) => self.on_note(note).await?,
        _ => {},
      };
    }

    Ok(())
  }

  async fn on_request(&mut self, req: Request) -> AppResult<()> {
    //
    Ok(())
  }

  async fn on_response(&mut self, res: Response) -> AppResult<()> {
    self.queue.outgoing.complete(res.id);

    Ok(())
  }

  async fn on_note(&mut self, note: Notification) -> AppResult<()> {
    match &note.method[..] {
      "@/plugin/match-utility" => {
        self.on_match_utility(note.params)?;
      },
      _ => {},
    };

    Ok(())
  }

  pub async fn load_plugins(&mut self, paths: Vec<String>) -> AppResult<()> {
    let (tx, rx) = oneshot::channel::<usize>();

    let request = self.queue.outgoing.register(
      "@/plugins/load".to_owned(),
      serde_json::json!({
        "plugins": paths,
      }),
      Box::new(move |app, res| {
        tx.send(0).unwrap();
      })
    );

    let id = request.id.clone();

    self.connection.sender.send(Message::Request(request))?;

    rx.await?;

    Ok(())
  }

  fn on_match_utility(&mut self, params: Value) -> AppResult<()> {
    let params = params["utilities"].as_object().unwrap();

    for (key, value) in params {
      let id = value.as_str().unwrap().to_owned();

      self.utilities.entry(key.clone()).or_default().push(id);
    }

    Ok(())
  }

  pub async fn call_match_utility(&mut self, name: &str, value: &str) -> AppResult<()> {
    let utility_id = self.utilities.get(name).unwrap().first().unwrap().clone();

    let request = self.queue.outgoing.register(
      "@/plugins/match-utility".to_owned(),
      serde_json::json!({
        "id": utility_id,
        "value": value,
        "modifier": null,
      }),
      0
    );

    self.connection.sender.send(Message::Request(request))?;

    Ok(())
  }
}
