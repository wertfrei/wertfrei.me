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
  {
    questions(language: EN) {
      question
      type
      answers
      data {
        ... on BinaryData {
          value
        }
        ... on LanguageData {
          de
          en
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
    api.query({ query }).then(console.log)
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
