import { useState, useEffect, MutableRefObject } from 'react'
import { Vector, Polygon } from './math'
import { interpolate } from 'flubber'
import slides from '../slides.json'

function renderPolygon(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  polygon: Polygon
) {
  if (polygon.vertices.length === 0) return
  ctx.beginPath()
  polygon.vertices.forEach(({ x, y }, i) =>
    ctx[i === 0 ? 'moveTo' : 'lineTo'](x, y)
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

function renderSingle(v: number, width, height): Polygon {
  let polygon: Polygon
  const A = 29.3 * (Math.PI / 180)
  const h1 = height * v - (1 / 2) * width * Math.tan(A)
  const h2 = (width * Math.sin(A)) / Math.sin(90 * (Math.PI / 180) - A)
  if (h1 > 0 && h1 + h2 <= height) {
    polygon = new Polygon([
      [0, height - h1],
      [width, height - (h1 + h2)],
      [width, (1 - slides[0].value) * height],
      [width, height],
      [0, height],
    ])
  } else if (h1 <= 0) {
    const w =
      (Math.sqrt(2) * Math.sqrt(height) * Math.sqrt(width) * Math.sqrt(v)) /
      Math.sqrt(Math.tan(A))
    const h = (w * Math.sin(A)) / Math.sin(90 * (Math.PI / 180) - A)
    polygon = new Polygon([
      [width - w, height],
      [width, height - h],
      [width, height],
    ])
  } else {
    const ai = 90 * (Math.PI / 180) - A
    let h =
      (Math.sqrt(2) * Math.sqrt(height) * Math.sqrt(width) * Math.sqrt(1 - v)) /
      Math.sqrt(Math.tan(ai))
    let w = (h * Math.sin(ai)) / Math.sin(90 * (Math.PI / 180) - ai)
    polygon = new Polygon([
      [0, h],
      [w, 0],
      [width, 0],
      [width, height],
      [0, height],
    ])
  }
  return polygon
}
let polygons = []

let lastSlide = 0
const transition = {
  start: null,
  from: null,
  to: null,
  dur: 500,
}
export function useRender(
  ref: MutableRefObject<HTMLCanvasElement>,
  width: number,
  height: number
) {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>()

  function render(width: number, height: number, slide = 0) {
    if (!ctx || polygons.length === 0) return
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
    if (!width || !height) return
    polygons = [
      renderSingle(slides[0].value, width, height),
      renderSingle(slides[1].value, width, height),
      new Polygon([
        [0.2 * width, 0.1 * height],
        [0.55 * width, 0.5 * height],
        [0.7 * width, 0.55 * height],
        [0.5 * width, 0.9 * height],
        [0.4 * width, 0.55 * height],
        [0.48 * width, 0.5 * height],
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
  }, [width, height])

  useEffect(() => {
    if (!ref.current) return
    setCtx(ref.current.getContext('2d'))
  }, [ref])

  return render
}
