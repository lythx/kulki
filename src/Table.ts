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
      if (row[random].ball !== undefined) { i-- }
      row[random].ball = balls.random()
    }
    this.nextBalls = new Array(config.nextBalls).fill(null).map(() => balls.random())
  }

  showPath(cells: { x: number, y: number }[]) {
    for (const e of cells) {
      this[e.x][e.y].type = 'path'
    }
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
        if (this[i][j].selected) {
          this[i][j].selected = false
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
    const canAppend = this.appendBalls()
    if (!canAppend) { return false }
    let points = 0
    const streak = this.handleStreak(x, y)
    return points
  }

  private handleStreak(x: number, y: number): number | false {
    if (this[x][y].ball === undefined) {
      throw new Error('moved ball undefined in handle streak')
    }
    let streaks: { x: number, y: number }[][] = [...Array(8)].map(() => []);
    const movedBall = this[x][y].ball as Ball
    const isStreak = (a: number, b: number) => this[a]?.[b]?.ball === movedBall
    let i = x - 1
    while (isStreak(i, y)) {
      streaks[0].push({ x: i--, y })
    }
    i = x - 1
    let j = y + 1
    while (isStreak(i, j)) {
      streaks[1].push({ x: i--, y: j++ })
    }
    j = y + 1
    while (isStreak(x, j)) {
      streaks[2].push({ x, y: j++ })
    }
    i = x + 1
    j = y + 1
    while (isStreak(i, j)) {
      streaks[3].push({ x: i++, y: j++ })
    }
    i = x + 1
    while (isStreak(i, y)) {
      streaks[4].push({ x: i++, y })
    }
    i = x + 1
    j = y - 1
    while (isStreak(i, j)) {
      streaks[5].push({ x: i++, y: j-- })
    }
    j = y - 1
    while (isStreak(x, j)) {
      streaks[6].push({ x, y: j-- })
    }
    i = x - 1
    j = y - 1
    while (isStreak(i, j)) {
      streaks[7].push({ x: i--, y: j-- })
    }
    console.table(streaks)
    const ballsToDelete = streaks.filter(a => a.length >= config.minStreak - 1).flat()
    if (ballsToDelete.length > 0) {
      this[x][y].ball = undefined
      this[x][y].type = 'prevBall'
    }
    for (const e of ballsToDelete) {
      this[e.x][e.y].ball = undefined
      this[e.x][e.y].type = 'prevBall'
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

  /**
   * Puts new balls on board
   * @returns Boolean indicating whether theres enough place for new balls
   */
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
