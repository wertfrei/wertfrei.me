import React from 'react'
import styled from 'styled-components'

interface Props {
  slide: number
}

export default function Label({ slide }: Props) {
  return (
    <S.Label>
      <h1>{slide}</h1>
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
