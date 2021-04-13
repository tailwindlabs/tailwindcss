// @ts-check

const connect = require('connect')
const path = require('path')
const sirv = require('sirv')
const { createProxyMiddleware } = require('http-proxy-middleware')

let nextPort = 1100

/** @typedef {{path: string, target: string | URL}} ProxyConfigItem */

module.exports.ProxyServer = class ProxyServer {
  /**
   *
   * @param {string} base
   */
  constructor(base) {
    this.base = base
  }

  async start() {
    this.server = connect()
    this.listener = this.server.listen(nextPort++)
  }

  /** @type {string} */
  get address() {
    // @ts-ignore
    const addr = this.listener.address()

    return `http://localhost:${addr.port}`
  }

  /**
   *
   * @param {ProxyConfigItem[]} config
   */
  async reconfigure(config) {
    this.server.stack = []

    for (const item of config) {
      this.server.use(item.path, this.handlerForItem(item))
    }
  }

  async stop() {
    if (this.listener) {
      this.listener.close()
    }
  }

  /**
   *
   * @param {ProxyConfigItem} item
   * @returns {import('connect').NextHandleFunction}
   */
  handlerForItem(item) {
    if (item.target instanceof URL) {
      // @ts-ignore
      return createProxyMiddleware({
        target: 'http://localhost:1337',
        changeOrigin: true,
        logProvider: () => ({
          log: () => {},
          debug: () => {},
          info: () => {},
          warn: () => {},
          error: () => {},
        }),
        pathRewrite: {
          [`^${item.path}`]: '/'
        }
      })
    }

    // @ts-ignore
    return sirv(path.resolve(this.base, item.target), { dev: true })
  }
}
