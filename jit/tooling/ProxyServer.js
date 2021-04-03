// @ts-check

const connect = require('connect')
const path = require('path')
const sirv = require('sirv')

let nextPort = 1100

/** @typedef {{path: string, target: string}} ProxyConfigItem */

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
    // @ts-ignore
    return sirv(path.resolve(this.base, item.target), { dev: true })
  }
}
