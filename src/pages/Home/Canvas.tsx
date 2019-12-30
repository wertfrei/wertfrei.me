import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useCanvasSize } from '../../utils/hooks'
import { useRender } from '../../utils/render'

interface Props {
  slide: number
  labelVisible: boolean
}

export default function Canvas({ slide, labelVisible }: Props) {
  const ref = useRef<HTMLCanvasElement>()
  const [width, height] = useCanvasSize(ref)
  const render = useRender(ref, width, height)

  useEffect(() => {
    render(width, height, slide)
  }, [slide, render, width, height])

  return (
    <S.Canvas
      ref={ref}
      width={`${width}px`}
      height={`${height}px`}
      fade={labelVisible}
    />
  )
}

const S = {
  Canvas: styled.canvas`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: ${({ fade }) => (fade ? 0.6 : 1)};
    transition: all var(--trans-time) ease;
  `,
}
