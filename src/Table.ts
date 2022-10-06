import config from './Config.js'
import { BallColor } from './BallColor.js';

class Table extends Array<(BallColor | 'path' | 'select' | 'prevPath' | 'none')[]> {

  constructor() {
    super()
    this.length = config.rows
    const arr = new Array<(BallColor | 'path' | 'select' | 'prevPath' | 'none')>(config.columns).fill('none')
    for (let i = 0; i < config.columns; i++) { this[i] = [...arr] }
  }

  clearPath(clearOnlyConfirmed?: true) {
    const arr = ['prevPath', 'path']
    if (clearOnlyConfirmed) { arr.pop() }
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this[i].length; j++) {
        if (arr.includes(this[i][j])) { this[i][j] = 'none' }
      }
    }
  }

  confirmPath() {
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this[i].length; j++) {
        if (this[i][j] === 'path') { this[i][j] = 'prevPath' }
      }
    }
  }

}

export const table = new Table()
