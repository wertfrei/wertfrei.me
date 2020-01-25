import React, { useState, useEffect, useContext } from 'react'
import { useMouseX } from '../../../utils/hooks'
import styled from 'styled-components'
import context from '~/src/context'

const { format } = new Intl.NumberFormat('de-DE', { style: 'decimal' })

export default function Area({ slide }) {
  const { slides } = useContext(context)
  const [maxY, setMaxY] = useState(0)
  const x = useMouseX()
  const values = slides[slide].values as [number, number][]
  const unit = (slides[slide] as any).unit

  useEffect(() => {
    setMaxY(Math.max(...values.map(([, v]) => v)))
  }, [values])

  const cm = Math.round(
    ((x - (window.innerWidth / 5) * 2) / ((window.innerWidth / 5) * 3)) *
      (values[values.length - 1][0] - values[0][0]) +
      values[0][0]
  )
  const num = ((slides[slide].values as [number, number][]).find(
    ([v]) => v === cm
  ) || [0, 0])[1]

  if (x < (window.innerWidth / 5) * 2) return null
  return (
    <>
      <S.Label>
        {num}
        <span>
          {format(cm / 100)}
          {unit}
        </span>
      </S.Label>
      <S.Cursor hidden pos={x} normY={num / maxY} />
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
    position: absolute;
    display: block;
    --crs-size: 0.8rem;
    width: var(--crs-size);
    height: var(--crs-size);
    border-radius: calc(var(--crs-size) / 2);
    transform: translateX(-50%) translateY(-50%);
    background-color: #fff;
    border: 1.5px solid var(--cl-red);
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
