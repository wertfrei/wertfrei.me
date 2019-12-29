import React, { useEffect, useState } from 'react'
import Canvas from './Canvas'
import Label from './Label'
import styled from 'styled-components'
import slides from '../../slides.json'

interface Props {
  slide: number
}

export default function DrawLayer({ slide }: Props) {
  const [label, showLabel] = useState(false)

  useEffect(() => {
    showLabel(false)
  }, [slide])

  useEffect(() => {
    const onClick = () => {
      if (slide >= 0) showLabel(!label)
    }
    document.getElementById('root').addEventListener('click', onClick)
    return () =>
      document.getElementById('root').removeEventListener('click', onClick)
  }, [label, slide])

  return (
    <S.Wrap>
      <S.Layer>
        <Canvas slide={Math.max(slide, 0)} />
        {label && <Label slide={slide} />}
      </S.Layer>
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
    height: ${slides.length * 100 + 10}vh;
  `,

  Layer: styled.div`
    position: sticky;
    top: 0;
    width: 100vw;
    height: 100vh;
  `,
}
