import config from './Config.js'
import { table } from './Table.js'

const wrapperEl = document.getElementById('wrapper') as HTMLDivElement
const scoreEl = document.getElementById('score') as HTMLDivElement
const boardEl = document.getElementById('board') as HTMLDivElement
const nextEl = document.getElementById('next') as HTMLDivElement
const clickListeners: ((x: number, y: number, e: MouseEvent) => void)[] = []
const hoverListeners: ((x: number, y: number, e: MouseEvent) => void)[] = []

const emitClick = (x: number, y: number, ev: MouseEvent): void => {
  for (const e of clickListeners) { e(x, y, ev) }
}

const emitHover = (x: number, y: number, ev: MouseEvent): void => {
  for (const e of hoverListeners) { e(x, y, ev) }
}

const create = (): void => {
  scoreEl.innerHTML = '0'
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
  scoreEl.innerHTML = table.score.toString()
  for (const [i, row] of table.entries()) {
    for (const [j, entry] of row.entries()) {
      const el = getTile(i, j)
      el.innerHTML = ''
      if (entry.ball !== undefined) {
        const ballEl = document.createElement('div')
        ballEl.className = 'ball'
        ballEl.style.background = entry.ball
        el.appendChild(ballEl)
      }
      el.style.background = entry.type !== undefined ?
        config.colours[entry.type] : config.colours.none
    }
  }
  for (const [i, e] of table.nextBalls.entries()) {
    const el = document.getElementById(`next${i}`) as HTMLElement
    const ball = document.createElement(`div`)
    ball.className = 'ball'
    ball.style.background = e
    el.innerHTML = ''
    el.appendChild(ball)
  }
}

const lose = () => {
  const createEl = (id: string, text?: string): HTMLDivElement => {
    const el = document.createElement('div')
    el.id = id
    if (text !== undefined) { el.innerHTML = text }
    return el
  }
  const bg = createEl('losebg')
  const msg = createEl('loseprompt')
  const header = createEl('loseheader', 'Przegrałeś!')
  const text = createEl('losetext', `Wynik: ${table.score}`)
  const button = createEl('losebt', 'Zagraj ponownie')
  button.onclick = () => {
    scoreEl.innerHTML = ''
    boardEl.innerHTML = ''
    nextEl.innerHTML = ''
    bg.remove()
    table.restart()
    create()
    render()
  }
  msg.appendChild(header)
  msg.appendChild(text)
  msg.appendChild(button)
  bg.appendChild(msg)
  wrapperEl.appendChild(bg)
}

export const board = {
  create,
  render,
  lose,
  onClick: (callback: (x: number, y: number, e: MouseEvent) => void): void => {
    clickListeners.push(callback)
  },
  onHover: (callback: (x: number, y: number, e: MouseEvent) => void): void => {
    hoverListeners.push(callback)
  }
}