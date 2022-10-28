import config from './Config.js'
import { balls, Ball } from './Balls.js';

interface Tile {
  ball?: Ball
  selected: boolean
  type?: 'path' | 'prevPath' | 'prevBall'
}

class Table extends Array<Tile[]>  {

  readonly nextBalls: Ball[]

  constructor() {
    super()
    this.length = config.rows
    for (let i = 0; i < config.rows; i++) {
      this[i] = []
      for (let j = 0; j < config.columns; j++) {
        this[i][j] = { selected: false }
      }
    }
    for (let i = 0; i < config.startBalls; i++) {
      const row = this[~~(Math.random() * this.length)]
      const random = ~~(Math.random() * this[0].length)
      console.log(row[random].ball)
      //if (row[random].ball !== undefined) { i-- }
      console.log(i)
      row[random].ball = balls.random()
    }
    this.nextBalls = new Array(config.nextBalls).fill(null).map(() => balls.random())
    // console.log('asd')
  }

  clearPath(options?: { clearSelection?: true, clearOnlyPrev?: true }) {
    const arr = ['prevPath', 'path']
    if (options?.clearOnlyPrev) { arr.pop() }
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this[i].length; j++) {
        const cell = this[i][j]
        if (arr.includes(cell.type as string)) {
          this[i][j].type = undefined
        }
      }
    }
  }

  /**
   * Moves selected ball to given position, handles streaks and checks for lose
   * @param x Position x of move
   * @param y Position y of move
   * @returns Number of points or false if lost
   */
  confirmMove(x: number, y: number): number | false {
    let ball: Ball | undefined
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this[i].length; j++) {
        if (this[i][j].type === 'path') {
          this[i][j].type = 'prevPath'
        }
        else if (this[i][j].selected) {
          this[i][j].selected = false
          this[i][j].type = 'prevPath'
          ball = this[i][j].ball
          this[i][j].ball = undefined
        }
      }
    }
    if (ball === undefined) {
      // this.clearPath({ clearSelection: true })
      // return
      throw new Error('Ball is undefined on move confirm')
    }
    this[x][y].ball = ball
    const isLost = this.appendBalls()
    if (isLost) { return false }
    let points = 0
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this[i].length; j++) {
        const streak = this.handleStreak(i, j)
        if (streak) {
          points += streak
        }
      }
    }
    return points === 0 ? false : points
  }

  private handleStreak(x: number, y: number): number | false {
    let ballsToDelete: { x: number, y: number }[] = []
    let curStreak: { x: number, y: number }[] = []
    if (this[x][y].ball === undefined) {
      throw new Error(`Ball is undefined in handleStreak`)
    }
    const movedBall = this[x][y].ball as Ball
    let i = x + 1
    let j = y + 1
    while (this[i]?.[j]?.ball === movedBall) {
      curStreak.push({ x: i, y: j })
      i++
      j++
    }
    if (curStreak.length + 1 >= config.minStreak) {
      ballsToDelete.push(...curStreak)
    }
    curStreak.length = 0
    i = x + 1
    while (this[i]?.[y]?.ball === movedBall) {
      curStreak.push({ x: i, y })
      i++
    }
    if (curStreak.length + 1 >= config.minStreak) {
      ballsToDelete.push(...curStreak)
    }
    curStreak.length = 0
    i = x + 1
    j = y + 1
    while (this[i]?.[j]?.ball === movedBall) {
      curStreak.push({ x: i, y: j })
      i--
      j--
    }
    if (curStreak.length >= config.minStreak) {
      ballsToDelete.push(...curStreak)
    }
    curStreak.length = 0
    j = y + 1
    while (this[x]?.[j]?.ball === movedBall) {
      curStreak.push({ x, y: j })
      j++
    }
    if (curStreak.length >= config.minStreak) {
      ballsToDelete.push(...curStreak)
    }
    for (const e of ballsToDelete) {
      this[e.x][e.y].ball = undefined
    }
    return ballsToDelete.length === 0 ? false : ballsToDelete.length
  }

  private findEmptyTiles(): { x: number, y: number }[] {
    const emptyIndexes: { x: number, y: number }[] = []
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this[i].length; j++) {
        if (this[i][j].ball === undefined) {
          emptyIndexes.push({ x: i, y: j })
        }
      }
    }
    return emptyIndexes
  }

  private appendBalls(): boolean {
    const emptyTiles = this.findEmptyTiles()
    if (emptyTiles.length < 3) {
      return false
    }
    for (const e of this.nextBalls) {
      const rand = ~~(Math.random() * emptyTiles.length)
      const tile = emptyTiles[rand]
      emptyTiles.splice(rand, 1)
      this[tile.x][tile.y].ball = e
    }
    this.nextBalls.length = 0
    for (let i = 0; i < config.nextBalls; i++) {
      this.nextBalls.push(balls.random())
    }
    return true
  }

}

export const table = new Table()
