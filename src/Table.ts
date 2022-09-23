import config from './Config.js'

export const table: ('X' | '0' | '1' | 'M' | 'S')[][] = new Array(config.rows)
  .fill(null).map(() => new Array(config.columns).fill('0'));
