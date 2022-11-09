import { board } from "./Board.js"

interface Point { x: number, y: number, parent?: Point }
let openList: Point[] = []
let closedList: Point[] = []

/**
 * Compares two points and returns whether they are equal
 * @param p1 Point a
 * @param p2 Point b
 * @returns Whether the points are equal
 */
const isEqual = (p1: Point, p2: Point): boolean => p1.x === p2.x && p1.y === p2.y

/**
 * Calculates a vector between end point and each of the points in path open list to, 
 * sorts the open list and returns the closest point
 * @param end End point
 * @returns Closest point
 */
const getClosestPoint = (end: Point): Point => {
  if (openList.length === 0) { throw new Error('openlist is empty in getClosestPoint') }
  openList.sort((a, b) =>
    Math.sqrt((end.x - a.x) ** 2 + (end.y - a.y) ** 2) -
    Math.sqrt((end.x - b.x) ** 2 + (end.y - b.y) ** 2))
  return openList[0]
}

/**
 * Gets array of coordinates representing valid path from a point object
 */
const getFullPath = (p: Point): Point[] => {
  const path = []
  let step: Point | undefined = p
  while (step !== undefined) {
    path.push(step)
    step = step.parent
  }
  return path
}

/**
 * Finds next steps in path
 * @param p Point to take step from
 * @param end Destination point
 * @returns Array of coordinates representing the path steps or undefined if the path doesn't end on next step
 */
const getMoves = (p: Point, end: Point): Point[] | undefined => {
  let points = [{ x: p.x - 1, y: p.y }, { x: p.x, y: p.y - 1 },
  { x: p.x + 1, y: p.y }, { x: p.x, y: p.y + 1 }]
  for (const e of points) {
    if (isEqual(e, end)) {
      return getFullPath({ ...e, parent: p })
    }
    if (board[e.x]?.[e.y] !== undefined && board[e.x][e.y].ball === undefined && !closedList.some(a => isEqual(a, e))) {
      openList.push({ ...e, parent: p })
    }
  }
  openList = openList.filter(a => !isEqual(a, p))
  closedList.push(p)
}

/**
 * Finds the shortest path from point A to point B on the game board
 * @param start Starting point
 * @param end Destination point
 * @returns Array of coordinates representing the path steps or undefined if valid path doesn't exist
 */
const find = (start: Point, end: Point): { x: number, y: number }[] | undefined => {
  if (isEqual(start, end)) { return undefined }
  openList = [start]
  closedList.length = 0
  do {
    const arr = getMoves(getClosestPoint(end), end)
    if (Array.isArray(arr)) {
      return arr
    }
  } while (openList.length !== 0)
}

export const path = {
  find
}
