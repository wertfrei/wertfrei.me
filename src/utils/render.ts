import { useState, useEffect, MutableRefObject } from 'react'
import { interpolate } from 'flubber'
import slides from '../slides.json'

interface Edge {
  p1: Vector
  p2: Vector
}
class Polygon {
  constructor(public vertices: Vector[] = []) {}

  get edges(): Edge[] {
    const vertices = [...this.vertices, this.vertices[0]]
    return vertices
      .slice(0, -1)
      .map((_, i) => ({ p1: vertices[i], p2: vertices[i + 1] }))
  }
  get perimeter() {
    return this.edges
      .map(Vector.fromEdge)
      .map(([, dir]) => dir.magnitude)
      .reduce((a, b) => a + b)
  }
}

class Vector {
  constructor(public x = 0, public y = 0) {}

  static fromEdge({ p1, p2 }: Edge) {
    return [new Vector(p1.x, p1.y), p2.minus(p1)]
  }

  get magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  add(vec: Vector) {
    return new Vector(this.x + vec.x, this.y + vec.y)
  }

  minus(vec: Vector) {
    return new Vector(this.x - vec.x, this.y - vec.y)
  }

  map(func: (v: number) => number) {
    return new Vector(...[this.x, this.y].map(func))
  }
}

function renderPolygon(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  polygon: Polygon
) {
  if (polygon.vertices.length === 0) return
  ctx.beginPath()
  polygon.vertices.forEach(({ x, y }, i) =>
    ctx[i === 0 ? 'moveTo' : 'lineTo'](x * width, y * height)
  )
  ctx.fill()
}

function segmentPolygon(polygon: Polygon, vertices: number = 100): Polygon {
  const segmented = new Polygon()
  let v = vertices
  for (let i = 0; i < polygon.vertices.length && v > 0; i++) {
    segmented.vertices.push(polygon.vertices[i])
    v--
  }
  const perimeter = polygon.perimeter
  const numEdgeVerts = v
  const edges = polygon.edges.map(Vector.fromEdge).map(([pos, dir]) => {
    const verts = Math.min(
      Math.ceil((dir.magnitude / perimeter) * numEdgeVerts),
      v
    )
    v -= verts
    return {
      pos,
      dir,
      verts,
    }
  })
  segmented.vertices = [
    ...segmented.vertices.flatMap((v, i) => [
      v,
      ...new Array(edges[i].verts)
        .fill(0)
        .map((_, iv, { length }) =>
          edges[i].pos.add(edges[i].dir.map(v => (v * iv) / length))
        ),
    ]),
  ]
  return segmented
}

function renderSingle(v: number): Polygon {
  const polygon = new Polygon()
  const A = 29.3 * (Math.PI / 180)
  const h1 = v - (1 / 2) * Math.tan(A)
  const h2 = Math.sin(A) / Math.sin(90 * (Math.PI / 180) - A)
  if (h1 > 0 && h1 + h2 <= 1) {
    polygon.vertices.push(new Vector(0, 1 - h1))
    polygon.vertices.push(new Vector(1, 1 - (h1 + h2)))
    polygon.vertices.push(new Vector(1, 1 - slides[0].value))
    polygon.vertices.push(new Vector(1, 1))
    polygon.vertices.push(new Vector(0, 1))
  } else if (h1 <= 0) {
    const w = (Math.sqrt(2) * Math.sqrt(v)) / Math.sqrt(Math.tan(A))
    const h = (w * Math.sin(A)) / Math.sin(90 * (Math.PI / 180) - A)
    polygon.vertices.push(new Vector(1 - w, 1))
    polygon.vertices.push(new Vector(1, 1 - h))
    polygon.vertices.push(new Vector(1, 1))
  } else {
    const ai = 90 * (Math.PI / 180) - A
    let h = (Math.sqrt(2) * Math.sqrt(1 - v)) / Math.sqrt(Math.tan(ai))
    let w = (h * Math.sin(ai)) / Math.sin(90 * (Math.PI / 180) - ai)
    polygon.vertices.push(new Vector(0, h))
    polygon.vertices.push(new Vector(w, 0))
    polygon.vertices.push(new Vector(1, 0))
    polygon.vertices.push(new Vector(1, 1))
    polygon.vertices.push(new Vector(0, 1))
  }
  return polygon
}

const polygons = [
  renderSingle(slides[0].value),
  renderSingle(slides[1].value),
  new Polygon([
    new Vector(0.2, 0.1),
    new Vector(0.55, 0.5),
    new Vector(0.7, 0.55),
    new Vector(0.5, 0.9),
    new Vector(0.4, 0.55),
    new Vector(0.48, 0.5),
  ]),
]
  .map(polygon => ({
    polygon,
    segmented: segmentPolygon(polygon),
  }))
  .map((p, i, polygons) => ({
    ...p,
    ...(i < polygons.length - 1 && {
      inter: interpolate(
        ...[i, i + 1].map(i =>
          polygons[i].segmented.vertices.map(({ x, y }) => [x, y])
        ),
        { string: false }
      ),
    }),
  }))

let lastSlide = 0
const transition = {
  start: null,
  from: null,
  to: null,
  dur: 500,
}
export function useRender(ref: MutableRefObject<HTMLCanvasElement>) {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>()

  function render(width: number, height: number, slide = 0) {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#ff0739'

    if (!transition.start) {
      renderPolygon(ctx, width, height, polygons[slide].polygon)
      if (slide !== lastSlide) {
        transition.start = performance.now()
        transition.from = lastSlide
        transition.to = slide
        lastSlide = slide
        requestAnimationFrame(() => render(width, height, slide))
      }
    } else {
      if (performance.now() - transition.start >= transition.dur) {
        transition.start = null
        return render(width, height, slide)
      }
      let dt = (performance.now() - transition.start) / transition.dur
      dt = dt ** 2 * (3 - 2 * dt)
      if (transition.from > transition.to) dt = 1 - dt
      const polygon = new Polygon(
        polygons[Math.min(transition.from, transition.to)]
          .inter(dt)
          .map(([x, y]) => new Vector(x, y))
      )

      renderPolygon(ctx, width, height, polygon)
      requestAnimationFrame(() => render(width, height, slide))
    }
  }

  useEffect(() => {
    if (!ref.current) return
    setCtx(ref.current.getContext('2d'))
  }, [ref])

  return render
}
