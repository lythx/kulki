import config from './Config.js'
import { table } from './Table.js'
import { getBall, isBall, isPrevPathBall, isSelectedBall } from './Ball.js'
const boardEl = document.getElementById('board') as HTMLElement
const nextEl = document.getElementById('next') as HTMLElement
const clickListeners: ((x: number, y: number, e: MouseEvent) => void)[] = []
const hoverListeners: ((x: number, y: number, e: MouseEvent) => void)[] = []

const emitClick = (x: number, y: number, ev: MouseEvent): void => {
  for (const e of clickListeners) {
    e(x, y, ev)
  }
}

const emitHover = (x: number, y: number, ev: MouseEvent): void => {
  for (const e of hoverListeners) {
    e(x, y, ev)
  }
}

const create = (): void => {
  boardEl.style.gridTemplateRows = `repeat(${config.rows}, 1fr)`
  boardEl.style.gridTemplateColumns = `repeat(${config.columns}, 1fr)`
  for (let i = 0; i < config.columns; i++) {
    for (let j = 0; j < config.rows; j++) {
      const el = document.createElement('div')
      el.className = `tile`
      el.id = `tile${i}x${j}`
      el.style.background = config.colours.none
      el.onclick = (e) => emitClick(i, j, e)
      el.onmouseover = (e) => emitHover(i, j, e)
      boardEl.appendChild(el)
    }
  }
  for (let i = 0; i < config.nextBalls; i++) {
    const el = document.createElement('div')
    el.className = `tile`
    el.id = `next${i}`
    el.style.background = config.colours.none
    nextEl.appendChild(el)
  }
}

const getTile = (x: number, y: number): HTMLElement => {
  const tile = document.getElementById(`tile${x}x${y}`)
  if (tile === null) { throw new Error(`no tile${x}x${y}`) }
  return tile
}

const render = (): void => {
  for (const [i, row] of table.entries()) {
    for (const [j, entry] of row.entries()) {
      const el = getTile(i, j)
      el.innerHTML = ''
      let background: string = config.colours.none
      let ball: string | undefined
      if (isBall(entry)) {
        ball = entry
      } else if (isSelectedBall(entry)) {
        ball = getBall(entry)
        background = config.colours.select
      } else if (isPrevPathBall(entry)) {
        ball = getBall(entry)
        background = config.colours.prevPath
      } else {
        background = config.colours[entry]
      }
      if (ball !== undefined) {
        const ballEl = document.createElement('div')
        ballEl.className = 'ball'
        ballEl.style.background = ball
        el.appendChild(ballEl)
      }
      el.style.background = background
    }
  }
}

export const board = {
  create,
  render,
  onClick: (callback: (x: number, y: number, e: MouseEvent) => void): void => {
    clickListeners.push(callback)
  },
  onHover: (callback: (x: number, y: number, e: MouseEvent) => void): void => {
    hoverListeners.push(callback)
  }
}