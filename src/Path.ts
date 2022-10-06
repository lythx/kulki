import { table } from "./Table.js"

interface Point { x: number, y: number, parent?: Point }
let openList: Point[] = []
let closedList: Point[] = []

const isEqual = (p1: Point, p2: Point): boolean => p1.x === p2.x && p1.y === p2.y

const getClosestPoint = (end: Point): Point => {
  if (openList.length === 0) { throw new Error('openlist is empty in getClosestPoint') }
  openList.sort((a, b) => Math.abs(end.x - a.x) + Math.abs(a.y - end.y) -
    Math.abs(end.x - b.x) + Math.abs(a.y - end.y))
  return openList[0]
}

const getFullPath = (p: Point): Point[] => {
  const path = []
  while (p.parent !== undefined) {
    path.push(p)
    p = p.parent
  }
  return path
}

const getMoves = (p: Point, end: Point): Point[] | undefined => {
  let points = [{ x: p.x - 1, y: p.y }, { x: p.x, y: p.y - 1 },
  { x: p.x + 1, y: p.y }, { x: p.x, y: p.y + 1 }]
  for (const e of points) {
    if (isEqual(e, end)) {
      return getFullPath({ ...e, parent: p })
    }
    if (table?.[e.x]?.[e.y] === '0' && !closedList.some(a => isEqual(a, e))) {
      openList.push({ ...e, parent: p })
    }
  }
  openList = openList.filter(a => !isEqual(a, p))
  closedList.push(p)
}

const find = (start: Point, end: Point): { x: number, y: number }[] | undefined => {
  if (isEqual(start, end)) { return [] }
  openList = [start]
  closedList.length = 0
  do {
    const arr = getMoves(getClosestPoint(end), end)
    if (Array.isArray(arr)) {
      console.log(arr.length)
      return arr
    }
  } while (openList.length !== 0)
}

export const path = {
  find
}
