import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useCanvasSize } from '../../utils/hooks'
import { useRender } from '../../utils/render'

interface Props {
  slide: number
}

export default function Canvas({ slide }: Props) {
  const ref = useRef<HTMLCanvasElement>()
  const [width, height] = useCanvasSize(ref)
  const render = useRender(ref, width, height)

  useEffect(() => {
    render(width, height, slide)
  }, [slide, render, width, height])

  return (
    <S.Wrap>
      <S.Canvas ref={ref} width={`${width}px`} height={`${height}px`} />
    </S.Wrap>
  )
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
