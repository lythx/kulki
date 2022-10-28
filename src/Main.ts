import { board } from './Board.js';
import { table } from './Table.js'
import { path } from './Path.js'
import config from './Config.js'

let selected: { x: number, y: number } | undefined
let isPathValid = false
console.log('1')
board.create()
console.log('2')
board.render()
board.onClick((x, y) => {
  const tile = table[x][y]
  if (tile.selected) {
    selected = undefined
    table.clearPath({ clearSelection: true })
  } else if (tile.ball !== undefined) {
    if (selected !== undefined) {
      table.clearPath({ clearSelection: true })
    }
    table[x][y].selected = true
    selected = { x, y }
  } else if (isPathValid === true) {
    table.confirmMove(x, y)
    selected = undefined
    setTimeout(() => {
      table.clearPath({ clearOnlyPrev: true })
      board.render()
    }, config.pathClearTimeout)
  }
  board.render()
})
board.onHover((x, y) => {
  if (selected === undefined || table[x][y].ball !== undefined) { return }
  table.clearPath()
  const p = path.find(selected, { x, y })
  isPathValid = p !== undefined
  for (const e of p ?? []) {
    table[e.x][e.y].type = 'path'
  }
  board.render()
})
