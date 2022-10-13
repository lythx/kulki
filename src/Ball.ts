export const balls = ['white', 'black', 'blue', 'red', 'yellow', 'pink', 'green'] as const

export type Ball = typeof balls[number]

export const isBall = (name: any): name is Ball => {
  return balls.includes(name)
}
