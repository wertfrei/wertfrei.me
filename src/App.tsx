import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import gql from 'graphql-tag'
import api from './api'
import Home from './pages/Home'
import Context, { defaultCtx, Language } from './context'
import strs from './strings.json'
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
        ... on RadarData {
          items {
            key
            value
          }
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

    const prepRadarData = (data: { items: { key; value }[] }) => {
      return Object.fromEntries(
        data.items.map(({ key, value }) => [key, value])
      )
    }

    api
      .query({ query, variables: { language: ctx.language.toUpperCase() } })
      .then(({ data }) => {
        let slides = data.questions.map(({ question, answers, type, ...v }) =>
          type === 'BINARY'
            ? { question, answers, value: v.data.value }
            : { question, values: prepRadarData(v.data) }
        )
        slides = [slides[0], slides.slice(-1)[0]]
        setCtx({ ...ctx, slides })
      })
    // eslint-disable-next-line
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
