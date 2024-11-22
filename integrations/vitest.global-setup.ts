import http from 'http'
import net from 'node:net'
import type { GlobalSetupContext } from 'vitest/node'

// Random port to start from
let CURRENT_PORT = 3000

export default async function setup({ provide }: GlobalSetupContext) {
  // Start mini server to provide free-ports-as-a-service
  let server = http.createServer(async (_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })

    while (await testIfPortTaken(CURRENT_PORT)) {
      CURRENT_PORT++
    }

    res.end(JSON.stringify({ port: CURRENT_PORT++ }))
  })

  await new Promise<void>((resolve) => {
    server.listen(0, resolve)
  })

  let address = server.address()
  let port = address === null || typeof address === 'string' ? null : address.port

  if (port === null) {
    throw new Error('Failed to start server')
  }

  // `CURRENT_PORT` is the first port that is free, so we increment it to get
  // the next free port.
  CURRENT_PORT = port + 1

  provide('port-resolver', `http://localhost:${port}`)

  return () => server.close()
}

function testIfPortTaken(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    let client = new net.Socket()
    client.once('connect', () => {
      resolve(true)
      client.end()
    })
    client.once('error', (error: any) => {
      if (error.code !== 'ECONNREFUSED') {
        resolve(true)
      } else {
        resolve(false)
      }
      client.end()
    })
    client.connect({ port, host: 'localhost' })
  })
}

declare module 'vitest' {
  export interface ProvidedContext {
    'port-resolver': string
  }
}
