export type BallColor = 'white' | 'black' | 'blue' | 'red' | 'yellow' | 'pink' | 'green'

export const isBallColor = (color: string): color is BallColor => {
  return ['white', 'black', 'blue', 'red', 'yellow', 'pink', 'green'].includes(color)
}