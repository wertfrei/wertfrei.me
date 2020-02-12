import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import gql from 'graphql-tag'
import api from './api'
import Home from './pages/Home'
import Survey from './pages/Survey'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Impressum from './pages/Impressum'
import Menu from './components/Menu'
import Logo from './components/Logo'
import Context, { defaultCtx, Language } from './context'
import strs from './strings.json'
import './styles/master.scss'

const query = gql`
  query fetchData($language: Language, $fake: Boolean, $uni: String) {
    questions(language: $language, fake: $fake, uni: $uni) {
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
        ... on ScaleData {
          values
          unit
          step
        }
      }
    }
  }
`

const uniQuery = gql`
  query fetchUnis {
    universities
  }
`

function App() {
  const [ctx, setCtx] = useState({
    ...defaultCtx,
    setLanguage(language: Language) {
      setCtx({ ...ctx, language, strings: strs[language] })
    },
    setFilter(filter: string) {
      setCtx({ ...ctx, filter })
    },
  })

  useEffect(() => {
    if (!ctx.language) return

    const prepRadarData = (data: {
      items: { key: string; value: number }[]
    }) => {
      return Object.fromEntries(
        data.items.map(({ key, value }) => [key, value])
      )
    }

    api
      .query({
        query,
        variables: {
          language: ctx.language.toUpperCase(),
          fake: window.location.search.includes('fake'),
          uni: ctx.filter || 'ALL',
        },
      })
      .then(({ data }) => {
        let slides = data.questions.map(({ question, answers, type, ...v }) =>
          type === 'BINARY'
            ? { question, answers, value: v.data.value }
            : type === 'RADAR'
            ? { question, values: prepRadarData(v.data) }
            : {
                question,
                answers,
                ...v.data,
              }
        )
        const firstSlide = slides.find(
          ({ value }) =>
            value ===
            Math.max(
              ...slides
                .filter(({ value }) => value < 0.95)
                .map(({ value }) => value)
            )
        )
        if (firstSlide)
          slides = [firstSlide, ...slides.filter(slide => slide !== firstSlide)]
        setCtx({ ...ctx, slides })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.language, ctx.filter])

  useEffect(() => {
    if (ctx.universities.length) return
    api.query({ query: uniQuery }).then(({ data }) => {
      setCtx({ ...ctx, universities: data.universities })
    })
  }, [ctx])

  return (
    <Context.Provider value={ctx}>
      <Router>
        <Menu />
        <Logo />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/survey" exact component={Survey} />
          <Route path="/about" exact component={About} />
          <Route path="/privacy" exact component={Privacy} />
          <Route path="/impressum" exact component={Impressum} />
        </Switch>
      </Router>
    </Context.Provider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
