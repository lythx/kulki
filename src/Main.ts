import { board } from './Board.js';
import { table } from './Table.js'
import { path } from './Path.js'
import config from './Config.js'

let selected: { x: number, y: number } | undefined
let isPathValid = false
board.create()
board.render()
board.onClick((x, y) => {
  const tile = table[x][y]
  if (tile.selected) {
    selected = undefined
    isPathValid = false
    table.clearPath({ clearSelection: true })
  } else if (tile.ball !== undefined) {
    if (selected !== undefined) {
      table.clearPath({ clearSelection: true })
    }
    table[x][y].selected = true
    table[x][y].type = 'path'
    selected = { x, y }
  } else if (isPathValid === true) {
    const pointsOrLose = table.confirmMove(x, y)
    if (pointsOrLose === false) {
      onLose()
      return
    }
    selected = undefined
    isPathValid = false
    table.score += pointsOrLose
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
  if (p !== undefined) {
    table.showPath(p)
  }
  board.render()
})

const onLose = () => {
  selected = undefined
  isPathValid = false
  board.lose()
}