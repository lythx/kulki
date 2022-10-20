import { board } from './Board.js';
import { table } from './Table.js'
import { path } from './Path.js'
import { isBall } from './Ball.js'
import config from './Config.js'

let selected: { x: number, y: number } | undefined
let isPathValid = false

//gra ballblazer

board.create()
board.render()
board.onClick((x, y) => {
  if (selected === undefined) {
    const tile = table[x][y]
    if (isBall(tile)) {
      table[x][y] = `select ${tile}`
      selected = { x, y }
    }
  } else {
    if (isPathValid === true) {
      table.confirmPath(x, y)
      selected = undefined
      setTimeout(() => {
        table.clearPath(true)
        board.render()
      }, config.pathClearTimeout)
    }
  }
  board.render()
})
board.onHover((x, y) => {
  if (selected === undefined || isBall(table[x][y])) { return }
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
