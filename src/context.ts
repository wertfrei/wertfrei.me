import { createContext } from 'react'
import strs from './strings.json'
import slides from './slides.json'

export type Language = 'en' | 'de'

interface Slide {
  question: string
  value?: number
  values?: { [key: string]: number } | [number, number][]
}

interface Context {
  language: Language
  strings: typeof strs.en
  slides: Slide[]
  setLanguage(lang: Language): void
}

const language = navigator.language.startsWith('de') ? 'de' : 'en'

export const defaultCtx: Context = {
  language,
  strings: strs[language],
  slides: slides as Slide[],
  setLanguage: () => {},
}

export default createContext(defaultCtx)
