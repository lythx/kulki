import config from './Config.js'
import { Ball, balls } from './Ball.js';

class Table extends Array<(Ball | 'path' | 'select' | 'prevPath' | 'none')[]> {

  readonly nextBalls: Ball[]

  constructor() {
    super()
    this.length = config.rows
    const arr = new Array<(Ball | 'path' | 'select' | 'prevPath' | 'none')>(config.columns).fill('none')
    for (let i = 0; i < config.columns; i++) { this[i] = [...arr] }
    const randomBall = () => balls[~~(Math.random() * balls.length)]
    for (let i = 0; i < config.startBalls; i++) {
      this[~~(Math.random() * this.length)][~~(Math.random() * this[0].length)] = randomBall()
    }
    this.nextBalls = new Array<Ball>(config.nextBalls).fill(balls[0]).map(() => randomBall())
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
