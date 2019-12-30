import React, { useEffect, useState } from 'react'
import throttle from 'lodash/throttle'
import { useWindowSize } from '../utils/hooks'
import Intro from './Home/Intro'
import Slide from './Home/Slide'
import DrawLayer from './Home/DrawLayer'
import Menu from '../components/Menu'
import slides from '../slides.json'

export default function Home() {
  const [label, showLabel] = useState(false)
  const slide = useActiveSlide()

  return (
    <>
      <Menu />
      <Intro />
      {slides.map(({ question }, i) => (
        <Slide slide={i} key={question} labelVisible={label} />
      ))}
      <DrawLayer
        slide={slide}
        label={label}
        onToggleLabel={(v = !label) => showLabel(v)}
      />
    </>
  )
}

function useActiveSlide() {
  const [active, setActive] = useState(null)
  const [width] = useWindowSize()

  useEffect(() => {
    const root = document.getElementById('root')

    const handleScroll = throttle(() => {
      const slide =
        width > 768
          ? ((root.scrollTop + window.innerHeight / 3) / window.innerHeight) | 0
          : ((root.scrollLeft + window.innerWidth / 2) / window.innerWidth) | 0
      if (active !== slide) setActive(slide - 1)
    }, 1000 / 30)

    root.addEventListener('scroll', handleScroll, {
      passive: true,
    })
    return () => root.removeEventListener('scroll', handleScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return active === null ? -1 : active
}
