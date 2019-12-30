import React, { useEffect } from 'react'
import Canvas from './Canvas'
import Label from './Label'
import styled from 'styled-components'
import slides from '../../slides.json'

interface Props {
  slide: number
  label: boolean
  onToggleLabel(v?: boolean): void
}

export default function DrawLayer({ slide, label, onToggleLabel }: Props) {
  useEffect(() => {
    onToggleLabel(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide])

  useEffect(() => {
    const onClick = () => {
      if (slide >= 0) onToggleLabel(!label)
    }
    document.getElementById('root').addEventListener('click', onClick)
    return () =>
      document.getElementById('root').removeEventListener('click', onClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide, label])

  return (
    <S.Wrap>
      <S.Layer>
        <Canvas
          slide={Math.max(slide, 0)}
          labelVisible={label && !('value' in slides[slide])}
        />
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
