const list = ['white'] as const

export type Ball = typeof list[number]

/**
 * @returns Random ball colour
 */
const random = (): Ball => list[~~(Math.random() * list.length)]

export const balls = {
  list,
  random
}
