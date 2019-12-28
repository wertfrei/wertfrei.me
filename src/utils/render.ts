import { useState, useEffect, MutableRefObject } from 'react'
import slides from '../slides.json'

interface Point {
  x: number
  y: number
}
interface Polygon {
  vertices: Point[]
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

function renderSingle(v: number): Polygon {
  const polygon = { vertices: [] }
  const A = 29.3 * (Math.PI / 180)
  const h1 = v - (1 / 2) * Math.tan(A)
  const h2 = Math.sin(A) / Math.sin(90 * (Math.PI / 180) - A)
  if (h1 > 0 && h1 + h2 <= 1) {
    polygon.vertices.push({ x: 0, y: 1 - h1 })
    polygon.vertices.push({ x: 1, y: 1 - (h1 + h2) })
    polygon.vertices.push({ x: 1, y: 1 - slides[0].value })
    polygon.vertices.push({ x: 1, y: 1 })
    polygon.vertices.push({ x: 0, y: 1 })
  } else if (h1 <= 0) {
    const w = (Math.sqrt(2) * Math.sqrt(v)) / Math.sqrt(Math.tan(A))
    const h = (w * Math.sin(A)) / Math.sin(90 * (Math.PI / 180) - A)
    polygon.vertices.push({ x: 1 - w, y: 1 })
    polygon.vertices.push({ x: 1, y: 1 - h })
    polygon.vertices.push({ x: 1, y: 1 })
  } else {
    const ai = 90 * (Math.PI / 180) - A
    let h = (Math.sqrt(2) * Math.sqrt(1 - v)) / Math.sqrt(Math.tan(ai))
    let w = (h * Math.sin(ai)) / Math.sin(90 * (Math.PI / 180) - ai)
    polygon.vertices.push({ x: 0, y: h })
    polygon.vertices.push({ x: w, y: 0 })
    polygon.vertices.push({ x: 1, y: 0 })
    polygon.vertices.push({ x: 1, y: 1 })
    polygon.vertices.push({ x: 0, y: 1 })
  }
  return polygon
}

export function useRender(ref: MutableRefObject<HTMLCanvasElement>) {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>()

  function render(width: number, height: number, slide = 0) {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#ff0739'
    ctx.beginPath()

    if (slide < slides.length && 'value' in slides[slide])
      renderPolygon(ctx, width, height, renderSingle(slides[slide].value))
    else {
      ctx.moveTo(width / 4, (height / 4) * 3)
      ctx.lineTo(width / 2, height / 4)
      ctx.lineTo((width / 4) * 3, (height / 4) * 3)
    }
    ctx.fill()
  }

  useEffect(() => {
    if (!ref.current) return
    setCtx(ref.current.getContext('2d'))
  }, [ref])

  return render
}
