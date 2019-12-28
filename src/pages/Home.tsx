import React from 'react'
import styled from 'styled-components'

export default function Home() {
  return <S.Home />
}

const S = {
  Home: styled.div`
    display: block;
    width: 100vw;
    height: 100vh;
    background: yellow;
  `,
}
