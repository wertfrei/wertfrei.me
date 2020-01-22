import React, { useState, useEffect, useContext } from 'react'
import gql from 'graphql-tag'
import api from '~/src/api'
import context from '~/src/context'
import Screen from './Survey/Screen'

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

  useEffect(() => {
    if (!language) return
    api
      .query({ query, variables: { language: language.toUpperCase() } })
      .then(({ data }) => setQuestions(data.survey))
  }, [language])

  return (
    <div>
      {questions.map(question => (
        <Screen key={question.key} question={question} />
      ))}
    </div>
  )
}
