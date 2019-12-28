import React, { useState, useRef, useEffect, MutableRefObject } from 'react'
import styled from 'styled-components'
import { useCanvasSize } from '../../utils/hooks'
import slides from '../../slides.json'

interface Props {
  slide: number
}

export default function Canvas({ slide }: Props) {
  const ref = useRef<HTMLCanvasElement>()
  const render = useRender(ref)
  const [width, height] = useCanvasSize(ref)

  useEffect(() => {
    render(width, height, slide)
  }, [slide, render, width, height])

  return (
    <S.Wrap>
      <S.Canvas ref={ref} width={`${width}px`} height={`${height}px`} />
    </S.Wrap>
  )
}

function useRender(ref: MutableRefObject<HTMLCanvasElement>) {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>()

  function render(width: number, height: number, slide: Props['slide'] = 0) {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#ff0739'
    ctx.beginPath()

    function renderSingle(v: number) {
      const A = 29.3 * (Math.PI / 180)
      const h1 = height * v - (1 / 2) * width * Math.tan(A)
      const h2 = (width * Math.sin(A)) / Math.sin(90 * (Math.PI / 180) - A)
      if (h1 > 0 && h1 + h2 <= height) {
        ctx.moveTo(0, height - h1)
        ctx.lineTo(width, height - (h1 + h2))
        ctx.lineTo(width, (1 - slides[0].value) * height)
        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
      } else if (h1 <= 0) {
        const w =
          (Math.sqrt(2) * Math.sqrt(height) * Math.sqrt(width) * Math.sqrt(v)) /
          Math.sqrt(Math.tan(A))
        const h = (w * Math.sin(A)) / Math.sin(90 * (Math.PI / 180) - A)
        ctx.moveTo(width - w, height)
        ctx.lineTo(width, height - h)
        ctx.lineTo(width, height)
      } else {
        const ai = 90 * (Math.PI / 180) - A
        let h =
          (Math.sqrt(2) *
            Math.sqrt(height) *
            Math.sqrt(width) *
            Math.sqrt(1 - v)) /
          Math.sqrt(Math.tan(ai))
        let w = (h * Math.sin(ai)) / Math.sin(90 * (Math.PI / 180) - ai)
        ctx.moveTo(0, h)
        ctx.lineTo(w, 0)
        ctx.lineTo(width, 0)
        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
      }
    }

    if (slide < slides.length && 'value' in slides[slide])
      renderSingle(slides[slide].value)
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

const S = {
  Wrap: styled.div`
    position: absolute;
    display: block;
    top: 90vh;
    z-index: -1;
    width: 100vw;
    height: 310vh;
  `,

  Canvas: styled.canvas`
    position: sticky;
    top: 0;
    width: 100vw;
    height: 100vh;
  `,
}
