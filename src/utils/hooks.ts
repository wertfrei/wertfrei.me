import { useState, useEffect, MutableRefObject } from 'react'
import debounce from 'lodash/debounce'
import ResObs from 'resize-observer-polyfill'

export function useCanvasSize(
  ref: MutableRefObject<any>,
  onResize?: (w: number, h: number) => void
) {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const handleChange = debounce(
      ([entry]) => {
        let { width, height } = entry.contentRect
        ;[width, height] = [width, height].map(v => v * devicePixelRatio)
        setWidth(width)
        setHeight(height)
        if (onResize) onResize(width, height)
      },
      200,
      { leading: false, trailing: true }
    )

    // @ts-ignore
    const sizeOb = new (window.ResizeObserver || ResObs)(handleChange)

    sizeOb.observe(ref.current)

    return () => sizeOb.disconnect()
  }, [onResize, ref])

  return [width, height]
}

export function useWindowSize() {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const handleChange = debounce(
      () => {
        setTimeout(() => {
          setWidth(window.innerWidth)
          setHeight(window.innerHeight)
        }, 50)
      },
      200,
      { leading: false, trailing: true }
    )
    window.addEventListener('resize', handleChange, { passive: true })
    return () => window.removeEventListener('resize', handleChange)
  }, [])

  return [width, height]
}
