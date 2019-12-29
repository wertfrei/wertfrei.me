import React from 'react'
import styled from 'styled-components'
import { polygons } from '../../../utils/render'
import slides from '../../../slides.json'

export default function YesNo({ slide = 0 }) {
  if (slide >= polygons.length || !polygons[slide].polygon.diagonal) return null
  let diagonal = polygons[slide].polygon.diagonal
  return (
    <S.Label diagonal={diagonal}>
      <p>{Math.round((1 - slides[slide].value) * 100)}% nein</p>
      <p>{Math.round(slides[slide].value * 100)}% Ja</p>
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
    transform: translateX(-50%) translateY(calc(-50% + 0.3rem))
      rotateZ(-29.3deg);

    p {
      font-size: 4rem;
      line-height: 3.5rem;
      font-weight: 600;
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
