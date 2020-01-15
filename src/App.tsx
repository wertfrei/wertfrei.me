import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import gql from 'graphql-tag'
import api from './api'
import Home from './pages/Home'
import Context, { defaultCtx, Language } from './context'
import strs from './strings.json'
import languages from './languages.json'
import './styles/master.scss'

const query = gql`
  query fetchData($language: Language) {
    questions(language: $language) {
      question
      type
      answers
      data {
        ... on BinaryData {
          value
        }
        ... on LanguageData {
          ${Object.keys(languages).join('\n')}
        }
      }
    }
  }
`

function App() {
  const [ctx, setCtx] = useState({
    ...defaultCtx,
    setLanguage(language: Language) {
      setCtx({ ...ctx, language, strings: strs[language] })
    },
  })

  useEffect(() => {
    if (!ctx.language) return

    const prepRadarData = (data: { [key: string]: number }) => {
      let valid = Object.entries(data).filter(([, v]) => typeof v === 'number')
      if (valid.map(([k]) => k).every(code => code in languages))
        valid = valid.map(([k, v]) => [languages[k][ctx.language], v])
      return Object.fromEntries(valid)
    }

    api
      .query({ query, variables: { language: ctx.language.toUpperCase() } })
      .then(({ data }) => {
        const slides = data.questions.map(({ question, answers, type, ...v }) =>
          type === 'BINARY'
            ? { question, answers, value: v.data.value }
            : { question, values: prepRadarData(v.data) }
        )
        setCtx({ ...ctx, slides })
      })
  }, [ctx.language])

  return (
    <Context.Provider value={ctx}>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
        </Switch>
      </Router>
    </Context.Provider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
