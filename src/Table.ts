import config from './Config.js'

export const table: ('X' | '0' | '1' | 'M' | 'S')[][] = new Array(config.rows)
  .fill(null).map(() => new Array(config.columns).fill('0'));

export const clearPath = () => {
  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < table[i].length; j++) {
      if (table[i][j] === '1') { table[i][j] = '0' }
    }
  }
}
