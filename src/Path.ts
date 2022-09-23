import { table } from "./Table.js"

let start: { x: number, y: number } | undefined

const isValid = (x: number, y: number): boolean => {
  if (start === undefined) { return false }
  console.log(x, y, table)
  return true
}

const getMoves = (x: number, y: number, board: typeof table): { x: number, y: number }[] => {
  const ret: { x: number, y: number }[] = []
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (board[i]?.[j] === '0') {
        ret.push({ x: i, y: j })
        board[i]?.[j] === '1'
      }
    }
  }
  return ret
}

const find = (x: number, y: number): { x: number, y: number }[] | false => {
  const board = table.map(a =>)
  while (true) {
    getMoves(x, y, board)
  }
  if (start === undefined) { return false }
  while (true)
    return []
}

export const path = {
  isValid,
  find,
  set startingPoint(point: { x: number, y: number }) {
    start = point
  },
  resetStartingPoint: () => {
    start = undefined
  }
}