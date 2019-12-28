import React from 'react'
import styled from 'styled-components'

interface Props {
  title: string
}

export default function Slide({ title }: Props) {
  return (
    <S.Slide>
      <p>{title}</p>
    </S.Slide>
  )
}

const S = {
  Slide: styled.div`
    display: block;
    height: 100vh;
    padding: 0 2rem;
    position: relative;

    p {
      position: absolute;
      top: 70%;
      font-size: 2rem;
    }
  `,
}
