import React, { useState, useRef, useEffect, MutableRefObject } from 'react'
import styled from 'styled-components'
import { useCanvasSize } from '../../utils/hooks'

interface Props {
  slide: string
}

export default function Canvas({ slide }: Props) {
  const ref = useRef<HTMLCanvasElement>()
  const render = useRender(ref)
  const [width, height] = useCanvasSize(ref)

  useEffect(() => {
    render(width, height, slide)
  }, [slide, render, width, height])

  return <S.Canvas ref={ref} width={`${width}px`} height={`${height}px`} />
}

function useRender(ref: MutableRefObject<HTMLCanvasElement>) {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>()

  function render(width: number, height: number, slide: Props['slide'] = 'a') {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#ff0739'
    console.log('render', slide)
    if (slide === 'a')
      ctx.fillRect(width / 4, height / 4, width / 2, height / 2)
    else {
      ctx.beginPath()
      ctx.moveTo(width / 4, (height / 4) * 3)
      ctx.lineTo(width / 2, height / 4)
      ctx.lineTo((width / 4) * 3, (height / 4) * 3)
      ctx.fill()
    }
  }

  useEffect(() => {
    if (!ref.current) return
    setCtx(ref.current.getContext('2d'))
  }, [ref])

  return render
}

const S = {
  Canvas: styled.canvas`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
  `,
}
