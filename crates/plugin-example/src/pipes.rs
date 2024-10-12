use std::{
    io::{self, stdin, stdout, BufReader, BufWriter, Write}, process::{Child, ChildStdin, ChildStdout}, thread
};

use log::debug;

use crossbeam_channel::{bounded, Receiver, Sender};
use lsp_server::Message;

/// Creates an LSP connection via stdio.
pub fn process_transport(
  child: &mut Child,
) -> (Sender<Message>, Receiver<Message>, IoThreads) {
  let stdout = child.stdin.take().expect("failed to get child stdin");
  let stdin = child.stdout.take().expect("failed to get child stdout");

  pipes_transport(stdout, stdin)
}

/// Creates an LSP connection via stdio.
pub fn pipes_transport(
  stdout: ChildStdin,
  stdin: ChildStdout,
) -> (Sender<Message>, Receiver<Message>, IoThreads) {
    // Send messages to the child process
    let mut writer = stdout;
    let (writer_sender, writer_receiver) = bounded::<Message>(0);
    let writer = thread::spawn(move || {
        writer_receiver.into_iter().try_for_each(|it| it.write(&mut writer))
    });

    // Recieve messages from the child process
    let mut reader = BufReader::with_capacity(1, stdin);
    let (reader_sender, reader_receiver) = bounded::<Message>(0);
    let reader = thread::spawn(move || {
        loop {
            let Some(msg) = Message::read(&mut reader)? else {
              break;
            };

            let is_exit = matches!(&msg, Message::Notification(n) if n.method == "exit");

            debug!("sending message {:#?}", msg);
            reader_sender.send(msg).expect("receiver was dropped, failed to send a message");

            if is_exit {
                break;
            }
        }
        Ok(())
    });

    let threads = IoThreads { reader, writer };
    (writer_sender, reader_receiver, threads)
}

pub struct IoThreads {
    reader: thread::JoinHandle<io::Result<()>>,
    writer: thread::JoinHandle<io::Result<()>>,
}

impl IoThreads {
    pub fn join(self) -> io::Result<()> {
        match self.reader.join() {
            Ok(r) => r?,
            Err(err) => {
                println!("reader panicked!");
                std::panic::panic_any(err)
            }
        }
        match self.writer.join() {
            Ok(r) => r,
            Err(err) => {
                println!("writer panicked!");
                std::panic::panic_any(err);
            }
        }
    }
}
