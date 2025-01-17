import React, { useEffect, useContext } from 'react'
import Canvas from './Canvas'
import Label from './Label'
import styled from 'styled-components'
import context from '~/src/context'

interface Props {
  slide: number
  label: boolean
  onToggleLabel(v?: boolean): void
}

export default function DrawLayer({ slide, label, onToggleLabel }: Props) {
  const { slides } = useContext(context)

  useEffect(() => {
    onToggleLabel(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide])

  useEffect(() => {
    const onClick = () => {
      if ((document.querySelector('#root') as any).dataset.menu === 'true')
        return
      setTimeout(() => {
        if ((document.querySelector('#root') as any).dataset.menu === 'true')
          return
        if (slide >= 0) onToggleLabel(!label)
      }, 100)
    }
    document.getElementById('root').addEventListener('click', onClick)
    return () =>
      document.getElementById('root').removeEventListener('click', onClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide, label])

  return (
    <S.Wrap slides={slides}>
      <S.Layer>
        <Canvas
          slide={Math.max(slide, 0)}
          labelVisible={
            label && !('value' in (slides[Math.max(slide, 0)] || {}))
          }
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
    height: ${({ slides }) => slides.length * 100 + 10}vh;

    @media (max-width: 768px) {
      height: 100vh;
      width: ${({ slides }) => slides.length * 100}vw;
      top: 0;
      left: 100vw;
    }
  `,

  Layer: styled.div`
    position: sticky;
    top: 0;
    width: 100vw;
    height: 100vh;

    @media (max-width: 768px) {
      left: 0;
    }
  `,
}
