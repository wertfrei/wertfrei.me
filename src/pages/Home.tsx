import React, { useEffect, useState } from 'react'
import throttle from 'lodash/throttle'
import Intro from './Home/Intro'
import Slide from './Home/Slide'
import Canvas from './Home/Canvas'
import Menu from '../components/Menu'

const slides = [
  'Bist du glücklich?',
  'Trägst du Tattoos?',
  'Welche Sprache sprichst du?',
]

export default function Home() {
  const slide = useActiveSlide()

  return (
    <>
      <Menu />
      <Intro />
      {slides.map(title => (
        <Slide title={title} key={title} />
      ))}
      <Canvas slide={slide} />
    </>
  )
}

function useActiveSlide() {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const root = document.getElementById('root')

    const handleScroll = throttle(() => {
      const slide =
        ((root.scrollTop + window.innerHeight / 3) / window.innerHeight) | 0
      if (active !== slide) setActive(slide - 1)
    }, 1000 / 30)

    root.addEventListener('scroll', handleScroll, {
      passive: true,
    })
    return () => root.removeEventListener('scroll', handleScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return Math.max(active || 0, 0)
}
