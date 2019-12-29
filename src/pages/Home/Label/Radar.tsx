import React from 'react'
import styled from 'styled-components'
import slides from '../../../slides.json'

export default function YesNo({ slide = 0 }) {
  if (slide >= slides.length || !slides[slide].values) return null
  return (
    <>
      {Object.entries(slides[slide].values).map(([k, v], i) => (
        <S.Label key={k} num={i / 2 / slides.length}>
          {k}
          <span>{Math.round(v * 100)}%</span>
        </S.Label>
      ))}
    </>
  )
}

const S = {
  Label: styled.p`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(
        calc(
          ${({ num }) => Math.round(Math.sin(num * (2 * Math.PI)) * 85) / 2}vmin -
            50%
        )
      )
      translateY(
        ${({ num }) => Math.round(Math.cos(num * (2 * Math.PI)) * 80) / 2}vmin
      );
    text-transform: uppercase;
    font-size: 1.1rem;
    font-weight: bold;

    span {
      color: var(--cl-red);
    }
  `,
}
