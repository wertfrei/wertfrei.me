import React, { useState, useEffect, useContext } from 'react'
import { useMouseX } from '../../../utils/hooks'
import styled from 'styled-components'
import context, { ScaleSlide } from '~/src/context'

const { format } = new Intl.NumberFormat('de-DE', { style: 'decimal' })

export default function Area({ slide }) {
  const { slides } = useContext(context)
  const [maxY, setMaxY] = useState(0)
  const x = useMouseX()
  const { values, unit, step } = slides[slide] as ScaleSlide

  useEffect(() => {
    setMaxY(Math.max(...values.map(([, v]) => v)))
  }, [values])

  let cm =
    Math.round(
      (((x - (window.innerWidth / 5) * 2) / ((window.innerWidth / 5) * 3)) *
        (values[values.length - 1][0] - values[0][0]) +
        values[0][0]) /
        step
    ) * step

  let num =
    x <= (window.innerWidth / 5) * 2
      ? 0
      : ((slides[slide].values as [number, number][]).find(
          ([v]) => v === cm
        ) || [0, 0])[1]

  let posX =
    (window.innerWidth / 5) * 2 +
    ((cm - slides[slide].values[0][0]) /
      ((slides[slide].values as [number, number][]).slice(-1)[0][0] -
        slides[slide].values[0][0])) *
      ((window.innerWidth / 5) * 3)

  if (x < (window.innerWidth / 5) * 2) {
    cm = slides[slide].values[0][1]
    num = cm
    posX = (window.innerWidth / 5) * 2
  }

  return (
    <>
      <S.Label>
        {num}
        <span>
          {format(cm)}
          {unit}
        </span>
      </S.Label>
      <S.Cursor hidden pos={posX} normY={num / maxY} />
    </>
  )
}

const S = {
  Cursor: styled.div.attrs(({ pos, normY }) => ({
    style: {
      left: `${pos}px`,
      top: `${window.innerHeight - normY * ((window.innerHeight / 5) * 2)}px`,
    },
  }))`
    position: relative;
    z-index: 2;
    display: block;
    --crs-size: 0.8rem;
    width: var(--crs-size);
    height: var(--crs-size);
    transform: translateX(-50%) translateY(-50%);

    &::before {
      content: '';
      position: absolute;
      display: block;
      width: 1px;
      top: -100vh;
      left: calc(50% + 1px);
      height: 200vh;
      background-color: var(--cl-black);
      opacity: 0.5;
    }

    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #fff;
      border: 1.5px solid var(--cl-red);
    }
  `,

  Label: styled.p`
    position: absolute;
    left: 2rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 3rem;
    font-weight: bold;

    span {
      color: var(--cl-red);
    }
  `,
}
