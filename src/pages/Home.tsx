import React, { useEffect, useState, useContext } from 'react'
import throttle from 'lodash/throttle'
import { useWindowSize } from '../utils/hooks'
import Slide from './Home/Slide'
import NoData from './Home/NoData'
import DrawLayer from './Home/DrawLayer'
import Intro from './Home/Intro'
import context from '~/src/context'

export default function Home() {
  const [label, showLabel] = useState(false)
  const slide = useActiveSlide()
  const { slides } = useContext(context)

  return (
    <>
      <Intro />
      {slides.length > 0 &&
        slides.map(({ question }, i) => (
          <Slide slide={i} key={question} labelVisible={label} />
        ))}
      {slides.length === 0 && <NoData />}
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
      if (active !== slide - 1) setActive(slide - 1)
    }, 1000 / 30)

    root.addEventListener('scroll', handleScroll, {
      passive: true,
    })
    return () => root.removeEventListener('scroll', handleScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, width])

  useEffect(() => {
    const root = document.getElementById('root')
    const handleKey = ({ code, metaKey }) => {
      if (!code.startsWith('Arrow') || metaKey) return
      root.scrollBy({
        [window.innerWidth > 768 ? 'top' : 'right']:
          window.innerHeight * (/Down|Right$/.test(code) ? 1 : -1),
        behavior: 'smooth',
      })
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  return active === null ? -1 : active
}
