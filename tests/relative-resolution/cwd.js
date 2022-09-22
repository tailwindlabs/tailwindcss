// @ts-config

let stack = []

export const cwd = {
  get current() {
    return process.cwd()
  },

  async switch(dir) {
    stack.push(process.cwd())
    process.chdir(dir)
  },

  async restore() {
    process.chdir(stack.pop())
  },

  async unwind() {
    while (stack.length) {
      this.restore()
    }
  },
}
