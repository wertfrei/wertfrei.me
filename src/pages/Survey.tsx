import React, { useState, useEffect, useContext } from 'react'
import gql from 'graphql-tag'
import api from '~/src/api'
import context from '~/src/context'
import Question from './Survey/Question'
import debounce from 'lodash/debounce'

const query = gql`
  query fetchSurvey($language: Language) {
    survey(language: $language) {
      key
      question
      answers
    }
  }
`

interface Question {
  key: string
  question: string
  answers: string[]
}

export default function Survey() {
  const { language } = useContext(context)
  const [questions, setQuestions] = useState<Question[]>([])
  const [active, setActive] = useState(0)

  const onSubmit = (questionKey: string) => () => {
    let subInd = questions.findIndex(({ key }) => key === questionKey)
    if (subInd < questions.length - 1) setActive(subInd + 1)
  }

  useEffect(() => {
    if (!language) return
    api
      .query({ query, variables: { language: language.toUpperCase() } })
      .then(({ data }) =>
        setQuestions([...data.survey.slice(1), data.survey[0]].reverse())
      )
  }, [language])

  useEffect(() => {
    const handleScroll = debounce(
      () => {
        const root = document.querySelector('#root')
        const slide =
          window.innerWidth > 768
            ? root.scrollTop / window.innerHeight
            : root.scrollLeft / window.innerWidth
        if (active !== slide) setActive(slide)
      },
      100,
      { leading: false, trailing: true }
    )
    document.querySelector('#root').addEventListener('scroll', handleScroll)
    return () =>
      document
        .querySelector('#root')
        .removeEventListener('scroll', handleScroll)
  }, [active])

  return (
    <>
      {questions.map((question, i) => (
        <Question
          key={question.key}
          question={question}
          onSubmit={onSubmit(question.key)}
          active={i === active}
        />
      ))}
    </>
  )
}
