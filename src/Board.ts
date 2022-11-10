import config from './Config.js'
import { balls, Ball } from './Balls.js';

interface Tile {
  ball?: Ball
  selected: boolean
  type?: 'path' | 'prevPath' | 'prevBall'
}

/**
 * Flips the board matrix
 * @param descriptor confirmMove method descriptor
 */
function transform(_: object, __: string, descriptor: any) {
  const original = descriptor.value
  descriptor.value = function (x: number, y: number) {
    original.apply(this, [x, y])
    const matrix: Tile[][] = Array.from(Array(this.length), () => [])
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this[i].length; j++) {
        matrix[j][i] = this[i][j]
      }
    }
    for (let i = 0; i < matrix.length; i++) {
      this[i] = matrix[i]
    }
  }
}

class Board extends Array<Tile[]>  {

  score = 0
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
    this.nextBalls = new Array(config.nextBalls).fill(null).map(() => balls.random())
    this.appendBalls()
  }

  /**
   * Clears the board and score for game restart
   */
  restart() {
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this[i].length; j++) {
        this[i][j] = { selected: false }
      }
    }
    this.score = 0
    this.appendBalls()
  }

  /**
   * Sets table elements to path based on given array
   * @param cells Array of coordinates representing the path
   */
  showPath(cells: { x: number, y: number }[]) {
    for (const e of cells) {
      this[e.x][e.y].type = 'path'
    }
  }

  /**
   * Clears previously marked path
   * @param options Optional type of path to clear
   */
  clearPath(options?: { clearSelection?: true, clearOnlyPrev?: true, clearOnlyBalls?: true }) {
    let arr = ['prevPath', 'prevBall', 'path']
    if (options?.clearOnlyPrev) { arr.pop() }
    if (options?.clearOnlyBalls) { arr = ['prevBall'] }
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this[i].length; j++) {
        const cell = this[i][j]
        if (arr.includes(cell.type as string)) {
          this[i][j].type = undefined
        }
        if (options?.clearSelection && this[i][j].selected) {
          this[i][j].selected = false
        }
      }
    }
  }

  /**
   * Moves selected ball to given position, handles streaks and checks for lose
   * @param x Coordinate x of the move
   * @param y Coordinate y of the move
   */
  @transform
  confirmMove(x: number, y: number): void {
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
      throw new Error('Ball is undefined on move confirm')
    }
    this[x][y].ball = ball
  }

  /** 
   * @returns Number of points or false if lost
   */
  handleMove(): number | false {
    const ballsToDelete: { x: number, y: number }[] = []
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this[i].length; j++) {
        const arr = this.handleStreak(i, j)
        for (const e of arr) {
          if (!ballsToDelete.some(a => a.x === e.x && a.y === e.y)) {
            ballsToDelete.push(e)
          }
        }
      }
    }

    if (ballsToDelete.length !== 0) {
      for (const e of ballsToDelete) {
        this[e.x][e.y].ball = undefined
        this[e.x][e.y].type = 'prevBall'
      }
      return ballsToDelete.length
    }
    const appendStatus = this.appendBalls()
    if (appendStatus === 'no space') { return false }
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this[i].length; j++) {
        const arr = this.handleStreak(i, j)
        for (const e of arr) {
          if (!ballsToDelete.some(a => a.x === e.x && a.y === e.y)) {
            ballsToDelete.push(e)
          }
        }
      }
    }
    for (const e of ballsToDelete) {
      this[e.x][e.y].ball = undefined
      this[e.x][e.y].type = 'prevBall'
    }
    if (ballsToDelete.length === 0 && appendStatus === 'full') { return false }
    return ballsToDelete.length
  }

  /**
   * Returns current ball streaks for given tile (checks only half of them)
   * @param x X coordinate of the tile
   * @param y Y coordinate of the tile
   * @returns An array of tiles affected by the streaks
   */
  private handleStreak(x: number, y: number): { x: number, y: number }[] {
    if (this[x][y].ball === undefined) {
      return []
    }
    let streaks: { x: number, y: number }[][] = [...Array(4)].map(() => []);
    const movedBall = this[x][y].ball as Ball
    const isStreak = (a: number, b: number) => this[a]?.[b]?.ball === movedBall
    let i = x - 1
    let j = y + 1
    while (isStreak(i, j)) {
      streaks[0].push({ x: i--, y: j++ })
    }
    j = y + 1
    while (isStreak(x, j)) {
      streaks[1].push({ x, y: j++ })
    }
    i = x + 1
    j = y + 1
    while (isStreak(i, j)) {
      streaks[2].push({ x: i++, y: j++ })
    }
    i = x + 1
    while (isStreak(i, y)) {
      streaks[3].push({ x: i++, y })
    }
    const ballsToDelete = streaks.filter(a => a.length >= config.minStreak - 1).flat()
    if (ballsToDelete.length > 0) { ballsToDelete.push({ x, y }) }
    return ballsToDelete
  }

  /**
   * Searches for empty tiles in the board
   * @returns Array of all empty tiles
   */
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
   * @returns No space if theres no space for new balls, 
   * full if theres not empty space after the balls were placed, ok if none of those happened
   */
  private appendBalls(): 'ok' | 'no space' | 'full' {
    const emptyTiles = this.findEmptyTiles()
    let full = false
    if (emptyTiles.length < this.nextBalls.length) {
      return 'no space'
    } else if (emptyTiles.length === this.nextBalls.length) {
      full = true
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
    if (full) { return 'full' }
    return 'ok'
  }

}

export const board = new Board()
