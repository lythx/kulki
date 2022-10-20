export const balls = ['white', 'black', 'blue', 'red', 'yellow', 'pink', 'green'] as const
const selectedBalls = balls.map(a => `select ${a}`)
const prevPathBalls = balls.map(a => `prevPath ${a}`)

export type Ball = typeof balls[number]

export const isSelectedBall = (name: any): name is `select ${Ball}` => {
  return selectedBalls.includes(name)
}

export const isPrevPathBall = (name: any): name is `prevPath ${Ball}` => {
  return prevPathBalls.includes(name)
}

export const isBall = (name: any): name is Ball => {
  return balls.includes(name)
}

export const getBall = (str: `select ${Ball}` | `prevPath ${Ball}`): Ball => {
  return str.split(' ')[1] as Ball
}