import React from 'react'
import styled from 'styled-components'
import Question from './Question'

interface Props {
  question: string
}

export default function Screen({ question }: Props) {
  return (
    <S.Screen>
      <Question question={question} />
    </S.Screen>
  )
}

const S = {
  Screen: styled.div`
    display: block;
    width: 100vw;
    height: 100vh;
    scroll-snap-align: center;
    scroll-snap-stop: always;
    position: relative;
  `,
}
