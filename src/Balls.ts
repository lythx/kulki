const list = ['white', 'black', 'blue', 'red', 'yellow', 'pink', 'green'] as const
const selectedBalls = list.map(a => `select ${a}`)
const prevPathBalls = list.map(a => `prevPath ${a}`)

export type Ball = typeof list[number]

const isSelected = (name: any): name is `select ${Ball}` => {
  return selectedBalls.includes(name)
}

const isPrevPath = (name: any): name is `prevPath ${Ball}` => {
  return prevPathBalls.includes(name)
}

const isBall = (name: any): name is Ball => {
  return list.includes(name)
}

const get = <T extends string>(str: T):
  T extends `select ${Ball}` | `prevPath ${Ball}` | Ball ? Ball : (Ball | undefined) => {
  const split = str.split(' ')
  return list.find(a => a === split[1] ?? split[0]) as Ball
}

const random = () => list[~~(Math.random() * list.length)]

export const balls = {
  list,
  isSelected,
  isPrevPath,
  isBall,
  get,
  random
}