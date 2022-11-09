import { frontEnd } from './Frontend.js';
import { board } from './Board.js'
import { path } from './Path.js'
import config from './Config.js'

let selected: { x: number, y: number } | undefined
let isPathValid = false
let isDisabled = false
frontEnd.create()
frontEnd.render()
frontEnd.onClick(async (x, y) => {
  if (isDisabled) { return }
  const tile = board[x][y]
  if (tile.selected) {
    selected = undefined
    isPathValid = false
    board.clearPath({ clearSelection: true })
  } else if (tile.ball !== undefined) {
    if (selected !== undefined) {
      board.clearPath({ clearSelection: true })
    }
    board[x][y].selected = true
    board[x][y].type = 'path'
    selected = { x, y }
  } else if (isPathValid === true) {
    board.confirmMove(x, y)
    frontEnd.render()
    isDisabled = true
    await new Promise(resolve => setTimeout(resolve, config.moveTimeout))
    board.clearPath({ clearOnlyPrev: true })
    const pointsOrLose = board.handleMove()
    if (pointsOrLose === false) {
      onLose()
      return
    }
    selected = undefined
    isPathValid = false
    board.score += pointsOrLose
    if (pointsOrLose === 0) {
      isDisabled = false
    } else {
      setTimeout(() => {
        board.clearPath({ clearOnlyBalls: true })
        frontEnd.render()
        isDisabled = false
      }, config.pathClearTimeout)
    }
  }
  frontEnd.render()
})
frontEnd.onHover((x, y) => {
  if (isDisabled || selected === undefined || board[x][y].ball !== undefined) { return }
  board.clearPath()
  const p = path.find(selected, { x, y })
  isPathValid = p !== undefined
  if (p !== undefined) {
    board.showPath(p)
  }
  frontEnd.render()
})

const onLose = () => {
  selected = undefined
  isPathValid = false
  isDisabled = false
  frontEnd.lose()
}