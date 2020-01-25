import { createContext } from 'react'
import strs from './strings.json'

export type Language = 'en' | 'de'

interface Slide {
  question: string
  value?: number
  answers?: [string, string]
  values?: { [key: string]: number } | [number, number][]
}

export interface ScaleSlide extends Slide {
  values: [number, number][]
  step: number
  unit: string
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
  slides: [],
  setLanguage: () => {},
}

export default createContext(defaultCtx)
