import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import Input from '~/src/components/Input'
import strings from '~/src/strings.json'
import context from '~/src/context'

interface Props {
  question: {
    question: string
    key: string
  }
}

export default function Question({ question }: Props) {
  const { language } = useContext(context)
  const [value, setValue] = useState(null)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
  }

  return (
    <S.Question onSubmit={onSubmit}>
      <label htmlFor={question.key}>{question.question}</label>
      <Input
        id={question.key}
        placeholder={strings[language].type_here}
        onChange={setValue}
      />
      {typeof value === 'string' && value.length > 0 && (
        <S.BtNext type="submit">
          OK
          <svg height="13" width="16">
            <path d="M14.293.293l1.414 1.414L5 12.414.293 7.707l1.414-1.414L5 9.586z" />
          </svg>
        </S.BtNext>
      )}
    </S.Question>
  )
}

const S = {
  Question: styled.form`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    height: 10rem;

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

    svg {
      margin-left: 0.7rem;
    }

    &:focus {
      outline: none;
    }
  `,
}
