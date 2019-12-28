import React from 'react'
import styled from 'styled-components'
import Slide from './Home/Slide'
import Canvas from './Home/Canvas'

const slides = ['a', 'b', 'c']

export default function Home() {
  return (
    <S.Home>
      {slides.map(title => (
        <Slide title={title} key={title} />
      ))}
      <Canvas />
    </S.Home>
  )
}

const S = {
  Home: styled.div``,
}
