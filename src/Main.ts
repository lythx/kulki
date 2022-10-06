import { board } from './Board.js';
import { table, clearPath } from './Table.js'
import { path } from './Path.js'
import { isBallColor } from './BallColor.js'

let selected: { x: number, y: number } | undefined

board.create()
board.render()
board.onClick((x, y) => {
  if (selected === undefined) {
    if (table[x][y] === 'none') {
      table[x][y] = 'select'
      selected = { x, y }
    }
  }
  board.render()
})
board.onHover((x, y) => {
  if (selected === undefined || isBallColor(table[x][y])) { return }
  clearPath()
  const p = path.find(selected, { x, y })
  for (const e of p ?? []) {
    if (table[e.x][e.y] === 'none') {
      table[e.x][e.y] = 'path'
    }
  }
  board.render()
})
