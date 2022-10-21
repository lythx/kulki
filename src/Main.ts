import { board } from './Board.js';
import { table } from './Table.js'
import { path } from './Path.js'
import { balls } from './Balls.js'
import config from './Config.js'

let selected: { x: number, y: number } | undefined
let isPathValid = false

//gra ballblazer

board.create()
board.render()
board.onClick((x, y) => {
  const tile = table[x][y]
  if (balls.isSelected(tile)) {
    selected = undefined
    table.clearPath({ clearSelection: true })
  }
  if (balls.isBall(tile)) {
    if (selected !== undefined) {
      table.clearPath({ clearSelection: true })
    }
    if (selected?.x === x && selected?.y === y) {
      selected = undefined
    } else {
      table[x][y] = `select ${tile}`
      selected = { x, y }
    }
  } else {
    if (isPathValid === true) {
      table.confirmMove(x, y)
      selected = undefined
      setTimeout(() => {
        table.clearPath({ clearOnlyPrev: true })
        board.render()
      }, config.pathClearTimeout)
    }
  }
  console.log('renderer')
  board.render()
})
board.onHover((x, y) => {
  if (selected === undefined || balls.isBall(table[x][y])) { return }
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
