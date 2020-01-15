import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import YesNo from './Label/YesNo'
import Radar from './Label/Radar'
import Area from './Label/Area'
import { useWindowSize } from '../../utils/hooks'
import context from '~/src/context'

interface Props {
  slide: number
}

export default function Label({ slide }: Props) {
  const { slides } = useContext(context)
  const [fade, setFade] = useState(true)
  useWindowSize()

  useEffect(() => {
    setFade(false)
  }, [])

  if (slide < 0 || slide >= slides.length) return null
  return (
    <S.Label fade={fade}>
      {slide < slides.length &&
        ('value' in slides[slide] ? (
          <YesNo slide={slide} />
        ) : Array.isArray(slides[slide].values) ? (
          <Area slide={slide} />
        ) : (
          <Radar slide={slide} />
        ))}
    </S.Label>
  )
}
const S = {
  Label: styled.div`
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: ${({ fade }) => (fade ? 0 : 1)};
    transition: opacity var(--trans-time) ease;
  `,
}
