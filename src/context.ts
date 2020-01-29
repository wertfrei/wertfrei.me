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
  universities: string[]
  filter: string
  setLanguage(lang: Language): void
  setFilter(uni: string): void
}

const language =
  (localStorage.getItem('language') as Language) ||
  (navigator.language.startsWith('de') ? 'de' : 'en')

export const defaultCtx: Context = {
  language,
  strings: strs[language],
  slides: [],
  universities: [],
  filter: null,
  setLanguage: () => {},
  setFilter: () => {},
}

export default createContext(defaultCtx)
