import { board } from './Board.js';
import { table } from './Table.js'
import { path } from './Path.js'
import { isBallColor } from './BallColor.js'
import config from './Config.js'

let selected: { x: number, y: number } | undefined
let isPathValid = false

board.create()
board.render()
board.onClick((x, y) => {
  if (selected === undefined) {
    if (table[x][y] === 'none') {
      table[x][y] = 'select'
      selected = { x, y }
    }
  } else {
    if (isPathValid === true) {
      table.confirmPath()
      setTimeout(() => {
        table.clearPath(true)
        board.render()
      }, config.pathClearTimeout)
    }
  }
  board.render()
})
board.onHover((x, y) => {
  if (selected === undefined || isBallColor(table[x][y])) { return }
  table.clearPath()
  const p = path.find(selected, { x, y })
  isPathValid = p !== undefined
  for (const e of p ?? []) {
    if (table[e.x][e.y] === 'none') {
      table[e.x][e.y] = 'path'
    }
  }
  board.render()
})
