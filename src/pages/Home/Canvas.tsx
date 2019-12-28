import React, { useState, useRef, useEffect, MutableRefObject } from 'react'
import styled from 'styled-components'
import { useCanvasSize } from '../../utils/hooks'

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
    console.log('render', slide)
    ctx.beginPath()
    if (slide === 0) {
      ctx.moveTo(0, height)
      ctx.lineTo(0, (height / 4) * 3)
      ctx.lineTo(width - width / 5, 0)
      ctx.lineTo(width, 0)
      ctx.lineTo(width, height)
    } else if (slide === 1) {
      ctx.moveTo(width / 2, height)
      ctx.lineTo(width, height / 2)
      ctx.lineTo(width, height)
    } else {
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
