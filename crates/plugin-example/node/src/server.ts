import * as net from 'node:net'
import * as rpc from 'vscode-jsonrpc/node'
import { buildPluginController, PluginFn } from './plugin-api'

let socket = await new Promise<net.Socket>((resolve) => {
  net.createServer(resolve).listen(12345)
})

let server = rpc.createMessageConnection(socket, socket)
let controller = buildPluginController(server)

async function loadPlugin(path: string): Promise<PluginFn> {
  return import(path).then((m) => m.default ?? m)
}

server.onRequest('@/plugins/load', async ({ plugins: paths }) => {
  console.log('Loading…')
  let plugins: PluginFn[] = await Promise.all(paths.map(loadPlugin))

  for (let plugin of plugins) {
    plugin(controller.api)
  }
  console.log('Loaded…')
})

server.onRequest('@/plugins/match-utility', async ({ id, value, modifier }) => {
  let ast = controller.matchUtility(id, value, modifier)

  return { ast }
})

server.listen()
server.sendNotification('loaded')
