import { board } from './Board.js';
import { table } from './Table.js'
import { path } from './Path.js'

let isSelected = false

board.create()
board.onClick((x, y) => {
  if (isSelected === false) {
    table[x][y] === 'M'
    isSelected = true
  } else {
    if (path.isValid(x, y) === true) {

    } else {
      for (const row of table) {
        for (const e of row) {
          if (e === '1') { }
        }
      }
    }
  }

})

// const board: ('X' | '0' | '1')[][] = new Array(config.rows)
//   .fill(null).map(() => new Array(config.columns).fill('0'));
