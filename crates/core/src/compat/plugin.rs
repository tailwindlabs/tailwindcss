pub struct Plugin {
  /// An internal identifier that the server uses to identify the plugin.
  /// This identifier is guaranteed to be unique for the lifetime of the
  /// plugin server but is not guaranteed to be unique across multiple
  /// invocations of the server.
  handle: u64
}
