import config from './Config.js'
import { BallColor } from './BallColor.js';

export const table: (BallColor | 'path' | 'select' | 'prevPath' | 'none')[][] =
  new Array<(BallColor | 'path' | 'select' | 'prevPath' | 'none')[]>(config.rows)
    .fill([]).map(() => new Array<(BallColor | 'path' | 'select' | 'prevPath' | 'none')>
      (config.columns).fill('none'));

export const clearPath = () => {
  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < table[i].length; j++) {
      if (['path', 'prevPath'].includes(table[i][j])) { table[i][j] = 'none' }
    }
  }
}
