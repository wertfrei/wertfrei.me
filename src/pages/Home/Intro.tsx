import React from 'react'
import styled from 'styled-components'

export default function Intro() {
  return (
    <S.Intro>
      <p>Studierende in Deutschland.</p>
      <p>Scroll durch und mach mit!</p>
    </S.Intro>
  )
}

const S = {
  Intro: styled.div`
    display: block;
    width: 100vw;
    height: 100vh;
    padding: 0 2rem;
    scroll-snap-align: center;

    p {
      text-transform: uppercase;
      font-size: 2rem;
      transform: translateY(70vh);
      margin-bottom: 1rem;

      &:last-child {
        color: var(--cl-red);
      }
    }
  `,
}
