import { useState, useEffect, MutableRefObject } from 'react'
import { Vector, Polygon } from './math'
import { interpolate } from 'flubber'
import slides from '../slides.json'

function renderPolygon(ctx: CanvasRenderingContext2D, polygon: Polygon) {
  if (polygon.vertices.length === 0) return
  ctx.beginPath()
  polygon.vertices.forEach(({ x, y }, i) =>
    ctx[i === 0 ? 'moveTo' : 'lineTo'](x, y)
  )
  ctx.fill()
}

function renderSingle(v: number, width: number, height: number): Polygon {
  let polygon: Polygon
  const A = 29.3 * (Math.PI / 180)
  const h1 = height * v - (1 / 2) * width * Math.tan(A)
  const h2 = (width * Math.sin(A)) / Math.sin(90 * (Math.PI / 180) - A)
  if (h1 > 0 && h1 + h2 <= height) {
    const diagonal = {
      p1: new Vector(0, height - h1),
      p2: new Vector(width, height - (h1 + h2)),
    }
    polygon = new Polygon([
      diagonal.p1.values,
      diagonal.p2.values,
      [width, (1 - slides[0].value) * height],
      [width, height],
      [0, height],
    ])
    polygon.diagonal = diagonal
  } else if (h1 <= 0) {
    const w =
      (Math.sqrt(2) * Math.sqrt(height) * Math.sqrt(width) * Math.sqrt(v)) /
      Math.sqrt(Math.tan(A))
    const h = (w * Math.sin(A)) / Math.sin(90 * (Math.PI / 180) - A)
    const diagonal = {
      p1: new Vector(width - w, height),
      p2: new Vector(width, height - h),
    }
    polygon = new Polygon([
      diagonal.p1.values,
      diagonal.p2.values,
      [width, height],
    ])
    polygon.diagonal = diagonal
  } else {
    const ai = 90 * (Math.PI / 180) - A
    let h =
      (Math.sqrt(2) * Math.sqrt(height) * Math.sqrt(width) * Math.sqrt(1 - v)) /
      Math.sqrt(Math.tan(ai))
    let w = (h * Math.sin(ai)) / Math.sin(90 * (Math.PI / 180) - ai)
    const diagonal = { p1: new Vector(0, h), p2: new Vector(w, 0) }
    polygon = new Polygon([
      diagonal.p1.values,
      diagonal.p2.values,
      [width, 0],
      [width, height],
      [0, height],
    ])
    polygon.diagonal = diagonal
  }
  return polygon
}

function renderRadar(values: number[], width: number, height: number): Polygon {
  const radius = (Math.min(width, height) * 0.75) / 2
  const normalized = values.map(v => v / Math.max(...values))
  const vertices = normalized.map((v, i) => [
    Math.sin((i / normalized.length) * (2 * Math.PI)) * v * radius + width / 2,
    Math.cos((i / normalized.length) * (2 * Math.PI)) * v * radius + height / 2,
  ])
  return new Polygon(vertices as [number, number][])
}

const renderSlide = (width: number, height: number) => <I extends number>(
  slide: typeof slides[I]
): Polygon => {
  if ('value' in slide) return renderSingle(slide.value, width, height)
  else if ('values' in slide)
    return renderRadar(Object.values(slide.values), width, height)
  return new Polygon()
}

export let polygons = []
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
      renderPolygon(ctx, polygons[slide].polygon)
      if (slide !== lastSlide) {
        transition.start = performance.now()
        transition.from = lastSlide
        transition.to = slide
        lastSlide = slide
        requestAnimationFrame(() => render(width, height, slide))
      }
    } else {
      if (
        performance.now() - transition.start >= transition.dur ||
        !('inter' in polygons[Math.min(transition.from, transition.to)])
      ) {
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

      renderPolygon(ctx, polygon)
      requestAnimationFrame(() => render(width, height, slide))
    }
  }

  useEffect(() => {
    if (!width || !height) return
    polygons = slides
      .map(renderSlide(width, height))
      .map(polygon => ({
        polygon,
      }))
      .map((p, i, polygons) => ({
        ...p,
        ...(i < polygons.length - 1 &&
          [i, i + 1].every(n => polygons[n].polygon.vertices.length) && {
            inter: interpolate(
              ...[i, i + 1].map(i =>
                polygons[i].polygon.vertices.map(({ x, y }) => [x, y])
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
