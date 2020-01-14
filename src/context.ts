import { createContext } from 'react'
import strs from './strings.json'

interface Context {
  language: 'en' | 'de'
  strings: typeof strs.en
}

const language = navigator.language.startsWith('de') ? 'de' : 'en'

export const defaultCtx: Context = {
  language,
  strings: strs[language],
}

export default createContext(defaultCtx)
