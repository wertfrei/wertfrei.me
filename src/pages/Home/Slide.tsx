import React from 'react'
import styled from 'styled-components'
import slides from '../../slides.json'

interface Props {
  slide: number
  labelVisible: boolean
}

export default function Slide({ slide, labelVisible }: Props) {
  return (
    <S.Slide fade={labelVisible} bottom={slides[slide].value > 0.5}>
      <p>{slides[slide].question}</p>
    </S.Slide>
  )
}

const S = {
  Slide: styled.div`
    position: relative;
    display: block;
    height: 100vh;
    padding: 0 2rem;
    scroll-snap-align: center;
    scroll-snap-stop: always;
    transition: opacity var(--trans-time) ease;
    opacity: ${({ fade }) => (fade ? 0.3 : 1)};

    p {
      position: absolute;
      top: 70%;
      font-size: 2.5rem;
      text-transform: uppercase;
    }

    @media (max-width: 768px) {
      width: 100vw;

      p {
        display: block;
        font-size: 2rem;
        text-align: center;
        width: 100%;
        left: 0;

        ${({ bottom }) =>
          bottom ? 'top: initial; bottom: 2rem; color: white;' : 'top: 6rem;'}
        bottom: 100px;
      }
    }
  `,
}
