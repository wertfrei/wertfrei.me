import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import Input from '~/src/components/Input'
import MultipleChoice from './MultipleChoice'
import strings from '~/src/strings.json'
import context from '~/src/context'

interface Props {
  active?: boolean
  onSubmit(): void
  question: {
    question: string
    key: string
    answers: string[]
  }
}

export default function Question({ question, onSubmit, active }: Props) {
  const { language } = useContext(context)
  const [value, setValue] = useState(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit()
  }

  return (
    <S.Screen>
      <S.Question onSubmit={handleSubmit}>
        <label htmlFor={question.key}>{question.question}</label>
        {!question.answers && (
          <>
            <Input
              id={question.key}
              placeholder={strings[language].type_here}
              onChange={setValue}
              focus={active}
            />
            <S.BtNext
              type="submit"
              data-state={
                typeof value === 'string' && value.length > 0
                  ? 'active'
                  : 'hidden'
              }
            >
              OK
              <svg height="13" width="16">
                <path d="M14.293.293l1.414 1.414L5 12.414.293 7.707l1.414-1.414L5 9.586z" />
              </svg>
            </S.BtNext>
          </>
        )}
        {Array.isArray(question.answers) && (
          <MultipleChoice answers={question.answers} />
        )}
      </S.Question>
    </S.Screen>
  )
}

const S = {
  Screen: styled.div`
    display: block;
    width: 100vw;
    height: 100vh;
    scroll-snap-align: center;
    scroll-snap-stop: always;
    position: relative;
  `,

  Question: styled.form`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    height: 10rem;
    width: 45rem;
    max-width: 90vw;

    label {
      display: block;
      font-size: 1.4rem;
      margin-bottom: 2rem;
      color: #333;
    }

    input {
      margin-bottom: 2rem;
    }
  `,

  BtNext: styled.button`
    -moz-appearance: none;
    -webkit-appearance: none;
    border: none;
    background-color: #ff4d70;
    font-size: 1.2rem;
    padding: 0.75rem 1.3rem;
    font-family: inherit;
    border-radius: 0.25rem;
    color: #000;
    cursor: pointer;
    transition: opacity 0.3s ease, transform 0.3s ease;

    &[data-state='hidden'] {
      opacity: 0;
      transform: translateY(1rem);
    }

    svg {
      margin-left: 0.7rem;
    }

    &:focus {
      outline: none;
    }
  `,
}
