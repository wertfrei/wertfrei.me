import React, { useState, useEffect } from 'react'
import { useMouseX } from '../../../utils/hooks'
import styled from 'styled-components'
import slides from '../../../slides.json'

export default function Area({ slide }) {
  const [maxY, setMaxY] = useState(0)
  const x = useMouseX()
  const values = slides[slide].values as [number, number][]

  useEffect(() => {
    setMaxY(Math.max(...values.map(([, v]) => v)))
  }, [values])

  if (x < (window.innerWidth / 5) * 2) return null
  return <S.Cursor hidden pos={x} slide={slide} values={values} maxY={maxY} />
}

const S = {
  Cursor: styled.div.attrs(({ pos, slide, values, maxY }) => ({
    style: {
      left: `${pos}px`,
      top: `${window.innerHeight -
        (((((slides[slide].values as [number, number][]).find(
          ([cm]) =>
            cm ===
            Math.round(
              ((pos - (window.innerWidth / 5) * 2) /
                ((window.innerWidth / 5) * 3)) *
                (values[values.length - 1][0] - values[0][0]) +
                values[0][0]
            )
        ) || [0, 0])[1] /
          maxY) *
          window.innerHeight) /
          5) *
          2}px`,
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
}
