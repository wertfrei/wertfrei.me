import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Slide from './Home/Slide'
import Canvas from './Home/Canvas'
import throttle from 'lodash/throttle'

const slides = ['a', 'b', 'c']

export default function Home() {
  const slide = useActiveSlide()

  return (
    <S.Home>
      {slides.map(title => (
        <Slide title={title} key={title} />
      ))}
      <Canvas slide={slides[slide]} />
    </S.Home>
  )
}

function useActiveSlide() {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const handleScroll = throttle(() => {
      const slide = (window.scrollY / window.innerHeight) | 0
      if (active !== slide) setActive(slide)
    }, 1000 / 30)

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })
    return () => window.removeEventListener('scroll', handleScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return active || 0
}

const S = {
  Home: styled.div``,
}
