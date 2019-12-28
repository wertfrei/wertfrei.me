import React, { useState, useRef, useEffect, MutableRefObject } from 'react'
import styled from 'styled-components'
import { useCanvasSize } from '../../utils/hooks'

export default function Canvas() {
  const ref = useRef<HTMLCanvasElement>()
  const render = useRender(ref)
  const [width, height] = useCanvasSize(ref, render)

  return <S.Canvas ref={ref} width={`${width}px`} height={`${height}px`} />
}

function useRender(ref: MutableRefObject<HTMLCanvasElement>) {
  const [ctx, setCtx] = useState()

  function render(width: number, height: number) {
    if (!ctx) return
    ctx.fillStyle = 'red'
    ctx.fillRect(width / 4, height / 4, width / 2, height / 2)
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
