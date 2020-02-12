import React, { useContext, useState, useRef } from 'react'
import styled from 'styled-components'
import Input from '~/src/components/Input'
import MultipleChoice from './MultipleChoice'
import Select from './Select'
import strings from '~/src/strings.json'
import context from '~/src/context'
import Arrow from '~/src/components/Arrow'

interface Props {
  active?: boolean
  onSubmit(value: any): void
  question: {
    question: string
    key: string
    answers: string[]
    unit?: string
    placeholder?: string
    limit?: number
  }
  hasPrevious?: boolean
  hasNext?: boolean
}

export default function Question({
  question,
  onSubmit,
  active,
  hasPrevious = true,
  hasNext = true,
}: Props) {
  const { language } = useContext(context)
  const [value, setValue] = useState<string | string[] | number>(null)
  const [blockNext, setBlockNext] = useState(false)
  const nextRef = useRef<HTMLButtonElement>()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTimeout(
      () => {
        onSubmit(value)
      },
      window.innerWidth <= 768 ? 500 : 0
    )
  }

  const type = !question.answers
    ? 'free'
    : !Array.isArray(question.answers)
    ? null
    : question.answers.length === 2
    ? 'binary'
    : 'select'

  const showOk =
    value !== undefined &&
    value !== null &&
    (Array.isArray(value) ? value : value.toString()).length > 0 &&
    !blockNext
  return (
    <S.Screen>
      <S.Question onSubmit={handleSubmit} data-type={type}>
        {hasPrevious && (
          <Arrow
            {...{
              [window.innerWidth > 768 ? 'up' : 'left']: true,
            }}
            onClick={() =>
              document.querySelector('#root').scrollBy({
                [window.innerWidth > 768 ? 'top' : 'left']: -window.innerHeight,
              })
            }
          />
        )}
        <label htmlFor={question.key}>{question.question}</label>
        {type === 'free' && (
          <Input
            id={question.key}
            placeholder={strings[language].type_here}
            onChange={setValue}
            focus={active}
            unit={question.unit}
            {...(question.key !== 'ident' && {
              type: 'number',
              spin: true,
            })}
          />
        )}
        {type === 'binary' && (
          <MultipleChoice
            answers={question.answers}
            onSelect={onSubmit}
            focus={active}
          />
        )}
        {type === 'select' && (
          <Select
            answers={question.answers}
            placeholder={question.placeholder}
            limit={question.limit}
            focus={active}
            onChange={setValue}
            blockNext={v => {
              if (v) return setBlockNext(true)
              setBlockNext(false)
              setTimeout(() => {
                if (nextRef.current) nextRef.current.focus()
              }, 100)
            }}
          />
        )}
        {(type === 'free' || type === 'select') && (
          <S.BtNext
            type="submit"
            data-state={showOk ? 'active' : 'hidden'}
            ref={nextRef}
          >
            OK
            <svg height="13" width="16">
              <path d="M14.293.293l1.414 1.414L5 12.414.293 7.707l1.414-1.414L5 9.586z" />
            </svg>
          </S.BtNext>
        )}
        {hasNext && !showOk && !blockNext && (
          <Arrow
            {...{
              [window.innerWidth > 768 ? 'down' : 'right']: true,
            }}
            onClick={() =>
              document.querySelector('#root').scrollBy({
                [window.innerWidth > 768 ? 'top' : 'left']: window.innerHeight,
              })
            }
          />
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

    & > label {
      display: block;
      font-size: 1.4rem;
      margin-bottom: 2rem;
      color: #333;
    }

    & > button {
      margin-top: 2rem;
    }

    ${Arrow.sc} {
      left: 0;
      position: absolute;

      &:first-child {
        top: -5rem;
      }
      &:last-child {
        bottom: -1.5rem;

        @media (max-width: 768px) {
          bottom: -4rem;
          left: calc(100% - 3.5rem);
        }
      }
    }
    &[data-type='binary'] {
      ${Arrow.sc}:last-child {
        bottom: -5rem;

        @media (max-width: 768px) {
          bottom: -6rem;
        }
      }
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
