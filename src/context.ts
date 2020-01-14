import { createContext } from 'react'
import strs from './strings.json'

export type Language = 'en' | 'de'

interface Context {
  language: Language
  strings: typeof strs.en

  setLanguage(lang: Language): void
}

const language = navigator.language.startsWith('de') ? 'de' : 'en'

export const defaultCtx: Context = {
  language,
  strings: strs[language],
  setLanguage: console.log,
}

export default createContext(defaultCtx)
