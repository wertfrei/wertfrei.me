import React, { useContext } from 'react'
import context from '~/src/context'
import styled from 'styled-components'
import Arrow from '~/src/components/Arrow'

export default function Intro() {
  const { strings } = useContext(context)

  return (
    <S.Intro>
      <p>{strings.intro_student}</p>
      <p>
        {window.innerWidth > 768 ? strings.intro_scroll : strings.intro_swipe}
      </p>
      {window.innerWidth <= 769 && <Arrow right />}
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

    ${Arrow.sc} {
      position: absolute;
      bottom: 2rem;
      left: calc(50% - 1.5rem);
    }
  `,
}
