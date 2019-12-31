import React from 'react'
import styled from 'styled-components'

export default function Intro() {
  return (
    <S.Intro>
      <p>Studierende in Deutschland.</p>
      <p>{window.innerWidth > 768 ? 'Scroll' : 'Swipe'} durch und mach mit!</p>
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

    @media (max-width: 768px) {
      padding: 0;

      p {
        font-size: 1.5rem;
        transform: translateY(30vh);
        width: 100%;
        text-align: center;
        font-stretch: condensed;
      }
    }
  `,
}
