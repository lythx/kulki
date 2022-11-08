const list = ['white', 'black', 'blue', 'red', 'yellow', 'pink', 'green'] as const

export type Ball = typeof list[number]

const random = (): Ball => list[~~(Math.random() * list.length)]

export const balls = {
  list,
  random
}
