import config from './Config.js'
import { Ball, balls, getBall, isPrevPathBall, isSelectedBall } from './Ball.js';

type Tile = Ball | 'path' | `select ${Ball}` | 'prevPath' | 'none' | `prevPath ${Ball}`

class Table extends Array<Tile[]> {

  readonly nextBalls: Ball[]

  constructor() {
    super()
    this.length = config.rows
    const arr = new Array<Tile>(config.columns).fill('none')
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
        const cell = this[i][j]
        if (arr.includes(cell)) { this[i][j] = 'none' }
        if (isPrevPathBall(cell)) {
          this[i][j] = getBall(cell)
        }
      }
    }
  }

  confirmPath(x: number, y: number) {
    let ball: Ball | undefined
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this[i].length; j++) {
        const cell = this[i][j]
        if (cell === 'path') { this[i][j] = 'prevPath' }
        else if (isSelectedBall(cell)) {
          this[i][j] = 'prevPath'
          ball = getBall(cell)
        }
      }
    }
    if (ball === undefined) { throw new Error("Ball is undefined") }
    this[x][y] = `prevPath ${ball}`
  }

}

export const table = new Table()
