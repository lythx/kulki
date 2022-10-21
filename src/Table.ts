import config from './Config.js'
import { balls, Ball } from './Balls.js';

type Tile = Ball | 'path' | `select ${Ball}` | 'prevPath' | 'none' | `prevPath ${Ball}`

class Table extends Array<Tile[]>  {

  readonly nextBalls: Ball[]

  constructor() {
    super()
    this.length = config.rows
    const arr = new Array<Tile>(config.columns).fill('none')
    for (let i = 0; i < config.columns; i++) { this[i] = [...arr] }
    for (let i = 0; i < config.startBalls; i++) {
      const row = this[~~(Math.random() * this.length)]
      const random = ~~(Math.random() * this[0].length)
      if (balls.isBall(row[random])) { i-- }
      else { row[random] = balls.random() }
    }
    this.nextBalls = new Array<Ball>(config.nextBalls).fill(balls.list[0]).map(() => balls.random())
  }

  clearPath(options?: { clearSelection?: true, clearOnlyPrev?: true }) {
    const arr = ['prevPath', 'path']
    if (options?.clearOnlyPrev) { arr.pop() }
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this[i].length; j++) {
        const cell = this[i][j]
        if (arr.includes(cell)) { this[i][j] = 'none' }
        if (balls.isPrevPath(cell) ||
          (options?.clearSelection === true && balls.isSelected(cell))) {
          this[i][j] = balls.get(cell)
        }
      }
    }
  }

  confirmMove(x: number, y: number) {
    let ball: Ball | undefined
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this[i].length; j++) {
        const cell = this[i][j]
        if (cell === 'path') { this[i][j] = 'prevPath' }
        else if (balls.isSelected(cell)) {
          this[i][j] = 'prevPath'
          ball = balls.get(cell)
        }
      }
    }
    if (ball === undefined) {
      this.clearPath({ clearSelection: true })
      return
    }
    this[x][y] = `prevPath ${ball}`
    let random1: number
    let random2: number
    for (const e of this.nextBalls) {
      do {
        random1 = ~~(Math.random() * this.length)
        random2 = ~~(Math.random() * this[0].length)
      } while (balls.isBall(this[random1][random2]))
      if (this[random1][random2] === 'prevPath') {
        this[random1][random2] = `prevPath ${e}`
      } else {
        this[random1][random2] = e
      }
    }
    this.nextBalls.length = 0
    for (let i = 0; i < config.nextBalls; i++) {
      this.nextBalls.push(balls.random())
    }
    let streak = false
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this[i].length; j++) {
        if (this.handleStreak(i, j)) {
          streak = true
        }
      }
    }
    return streak
  }

  handleStreak(x: number, y: number): boolean {
    let ballsToDelete: { x: number, y: number }[] = []
    let curStreak: { x: number, y: number }[] = []
    const ball = this[x][y]
    console.log(ball)
    console.log(balls.get(ball))
    if (balls.get(ball) === undefined) { return false }
    let i = x + 1
    let j = y + 1
    while (this[i]?.[j] === ball) {
      curStreak.push({ x: i, y: j })
      i++
      j++
    }
    if (curStreak.length > config.minStreak) {
      ballsToDelete.push(...curStreak)
    }
    curStreak.length = 0
    i = x + 1
    while (this[i]?.[y] === ball) {
      curStreak.push({ x: i, y })
      i++
    }
    if (curStreak.length > config.minStreak) {
      ballsToDelete.push(...curStreak)
    }
    curStreak.length = 0
    i = x + 1
    j = y + 1
    while (this[i]?.[j] === ball) {
      curStreak.push({ x: i, y: j })
      i--
      j--
    }
    if (curStreak.length > config.minStreak) {
      ballsToDelete.push(...curStreak)
    }
    curStreak.length = 0
    j = y + 1
    while (this[x]?.[j] === ball) {
      curStreak.push({ x, y: j })
      j++
    }
    if (curStreak.length = config.minStreak) {
      ballsToDelete.push(...curStreak)
    }
    console.table(ballsToDelete)
    for (const e of ballsToDelete) {
      this[e.x][e.y] = 'none'
    }
    return ballsToDelete.length > 0
  }

}

export const table = new Table()
