import { createContext } from 'react'
import strs from './strings.json'
import slides from './slides.json'

export type Language = 'en' | 'de'

interface Context {
  language: Language
  strings: typeof strs.en
  slides: any[]
  setLanguage(lang: Language): void
}

const language = navigator.language.startsWith('de') ? 'de' : 'en'

export const defaultCtx: Context = {
  language,
  strings: strs[language],
  slides,
  setLanguage: () => {},
}

export default createContext(defaultCtx)
