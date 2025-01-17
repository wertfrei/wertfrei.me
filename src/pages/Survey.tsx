import React, { useState, useEffect, useContext } from 'react'
import gql from 'graphql-tag'
import api from '~/src/api'
import context from '~/src/context'
import Question from './Survey/Question'
import Done from './Survey/Done'
import debounce from 'lodash/debounce'

const query = gql`
  query fetchSurvey($language: Language) {
    survey(language: $language) {
      key
      question
      answers
      unit
      placeholder
      limit
    }
  }
`

const submit = gql`
  mutation submitAnswer($answer: Answer) {
    submit(answer: $answer)
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
  const [answers, setAnswers] = useState<any>({})

  const onSubmit = (questionKey: string) => (value: any) => {
    setAnswers({ ...answers, [questionKey]: value })
    const { ident, uni } = answers
    if (ident && uni) {
      api.mutate({
        mutation: submit,
        variables: {
          answer: {
            id: ident,
            uni,
            key: questionKey,
            value: JSON.stringify(value),
          },
        },
      })
    }
    let subInd = questions.findIndex(({ key }) => key === questionKey)
    if (subInd < questions.length - 1) setActive(subInd + 1)
    else {
      document
        .querySelector('#root')
        .scrollBy(window.innerWidth > 768 ? { top: 1 } : { left: 1 })
      setActive(null)
    }
  }

  useEffect(() => {
    if (!language) return
    api
      .query({ query, variables: { language: language.toUpperCase() } })
      .then(({ data }) =>
        setQuestions([
          ...data.survey.slice(0, 2),
          ...shuffle(data.survey.slice(2)),
        ])
      )
  }, [language])

  useEffect(() => {
    const handleScroll = debounce(
      () => {
        const root = document.querySelector('#root')
        const slide = Math.round(
          window.innerWidth > 768
            ? root.scrollTop / window.innerHeight
            : root.scrollLeft / window.innerWidth
        )
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
      {(!answers.ident
        ? questions.slice(0, 1)
        : !answers.uni
        ? questions.slice(0, 2)
        : questions
      ).map((question, i, { length }) => (
        <Question
          key={question.key}
          question={question}
          onSubmit={onSubmit(question.key)}
          active={i === active}
          hasPrevious={i > 0}
          hasNext={i < length - 1}
        />
      ))}
      {answers.ident && answers.uni && <Done />}
    </>
  )
}

function shuffle<T>(arr: T[]): T[] {
  const shuffled = []
  while (arr.length)
    shuffled.push(arr.splice((Math.random() * arr.length) | 0, 1)[0])
  return shuffled
}
