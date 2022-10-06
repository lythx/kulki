import { board } from './Board.js';
import { table, clearPath } from './Table.js'
import { path } from './Path.js'

let selected: { x: number, y: number } | undefined
let lastPath: { x: number, y: number }[] | undefined

board.create()
board.render()
board.onClick((x, y) => {
  if (selected === undefined) {
    if (table[x][y] === '0') {
      table[x][y] = 'S'
      selected = { x, y }
    }
  } else {
    lastPath = path.find(selected, { x, y })
  }
  for (const e of lastPath ?? []) {
    table[e.x][e.y] = '1'
  }
  console.log(lastPath)
  // else if (table[x][y] === 'S') {
  //   table[x][y] = '0'
  //   selected = undefined
  // } else if (path.isValid === true) {
  //   table[x][y] = 'M'
  //   const p = path.find(selected, { x, y })
  // }
  board.render()
})
board.onHover((x, y) => {
  if (selected === undefined || !['0', '1'].includes(table[x][y])) { return }
  clearPath()
  const p = path.find(selected, { x, y })
  for (const e of p ?? []) {
    if (table[e.x][e.y] === '0') {
      table[e.x][e.y] = '1'
    }
  }
  board.render()
  // board.render()
  // const p = path.find(x, y)
  // if (p === false) {
  //   for (const row of table) {
  //     for (const [i, e] of row.entries()) {
  //       if (e === '1') {
  //         row[i] === '0'
  //       }
  //     }
  //   }
  // } else {
  //   for (const e of p) {
  //     table[e.x][e.y] === '1'
  //   }
  // }
  // board.render()
})

// const board: ('X' | '0' | '1')[][] = new Array(config.rows)
//   .fill(null).map(() => new Array(config.columns).fill('0'));
