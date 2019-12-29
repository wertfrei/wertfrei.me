import React from 'react'
import styled from 'styled-components'
import YesNo from './Label/YesNo'
import Radar from './Label/Radar'
import { useWindowSize } from '../../utils/hooks'
import slides from '../../slides.json'

interface Props {
  slide: number
}

export default function Label({ slide }: Props) {
  useWindowSize()

  if (slide < 0 || slide >= slides.length) return null
  return (
    <S.Label>
      {slide < slides.length &&
        ('value' in slides[slide] ? (
          <YesNo slide={slide} />
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
  `,
}
