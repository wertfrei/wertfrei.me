import React, { useContext } from 'react'
import styled from 'styled-components'
import { polygons } from '../../../utils/render'
import context from '~/src/context'

export default function YesNo({ slide = 0 }) {
  const { slides } = useContext(context)

  if (slide >= polygons.length || !polygons[slide].polygon.diagonal) return null
  let diagonal = polygons[slide].polygon.diagonal
  const [yes, no] = slides[slide].answers || ['yes', 'no']
  return (
    <S.Label diagonal={diagonal}>
      <p>
        {Math.round((1 - slides[slide].value) * 100)}% {no}
      </p>
      <p>
        {Math.round(slides[slide].value * 100)}% {yes}
      </p>
    </S.Label>
  )
}

const S = {
  Label: styled.div`
    position: absolute;
    left: ${({ diagonal: { p1, p2 } }) =>
      (p1.x + (p2.x - p1.x) / 2) / devicePixelRatio}px;
    top: ${({ diagonal: { p1, p2 } }) =>
      (p1.y + (p2.y - p1.y) / 2) / devicePixelRatio}px;

    transform-origin: center;
    transform: translateX(-50%) translateY(calc(-50% + 0.1rem))
      rotateZ(-29.3deg);

    @media (min-width: 560px) {
      transform: translateX(-50%) translateY(calc(-50% - 0.04rem))
        rotateZ(-29.3deg);
    }

    p {
      font-size: 4rem;
      font-size: min(4rem, 10vw);
      line-height: 2.9rem;
      line-height: min(2.9rem, 7.2vw);
      font-weight: bold;
      text-transform: uppercase;
      vertical-align: baseline;
      white-space: nowrap;

      &:first-child {
        color: var(--cl-red);
      }

      &:last-child {
        color: #fff;
      }
    }
  `,
}
