import React from 'react'
import styled from 'styled-components'

interface Props {
  question: string
}

export default function Question({ question }: Props) {
  return <S.Question>{question}</S.Question>
}

const S = {
  Question: styled.p`
    position: absolute;
    width: 100%;
    top: 50%;
    text-align: center;
  `,
}
