import React from 'react'
import styled from 'styled-components'

interface Props {
  title: string
  labelVisible: boolean
}

export default function Slide({ title, labelVisible }: Props) {
  return (
    <S.Slide fade={labelVisible}>
      <p>{title}</p>
    </S.Slide>
  )
}

const S = {
  Slide: styled.div`
    display: block;
    height: 100vh;
    padding: 0 2rem;
    scroll-snap-align: center;
    transition: opacity var(--trans-time) ease;
    opacity: ${({ fade }) => (fade ? 0.3 : 1)};

    p {
      position: relative;
      top: 70%;
      font-size: 2.5rem;
      text-transform: uppercase;
    }
  `,
}
