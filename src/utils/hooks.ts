import { useState, useEffect, MutableRefObject } from 'react'
import debounce from 'lodash/debounce'
import ResObs from 'resize-observer-polyfill'

export function useCanvasSize(
  ref: MutableRefObject<any>,
  onResize?: (w: number, h: number) => void
) {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

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

  useEffect(() => {
    // @ts-ignore
    const sizeOb = new (window.ResizeObserver || ResObs)(handleChange)

    sizeOb.observe(ref.current)

    return () => sizeOb.disconnect()
  }, [handleChange, ref])

  return [width, height]
}
