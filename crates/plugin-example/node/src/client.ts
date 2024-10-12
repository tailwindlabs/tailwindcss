import * as net from 'node:net'
import * as rpc from 'vscode-jsonrpc/node'

let client = net.connect(12345)

// Use stdin and stdout for communication:
let connection = rpc.createMessageConnection(client, client)

connection.onNotification('loaded', () => console.log('server loaded'))
connection.onNotification('ping', () => console.log('ping'))
connection.onNotification('@/plugins/loaded', () => console.log('plugins loaded'))

connection.listen()
connection.sendRequest('@/plugins/load', 'foo')
