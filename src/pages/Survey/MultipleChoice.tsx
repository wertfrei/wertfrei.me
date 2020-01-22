import React, { useRef, useEffect, SyntheticEvent, useState } from 'react'
import styled from 'styled-components'

interface Props {
  answers: string[]
  focus?: boolean
  onSelect(v: string): void
}

export default function MultipleChoice({
  answers = [],
  focus = false,
  onSelect,
}: Props) {
  const ref = useRef<HTMLButtonElement>()
  const [value, setValue] = useState<string>(null)

  useEffect(() => {
    if (!ref.current) return
    if (focus !== (ref.current === document.activeElement))
      ref.current[focus ? 'focus' : 'blur']()
  }, [ref, focus])

  const handleClick = (key: string) => (e?: SyntheticEvent) => {
    if (e) e.preventDefault()
    setValue(key)
    setTimeout(() => {
      onSelect(key)
    }, 200)
  }

  function handleKey(e: React.KeyboardEvent) {
    const input = e.key.toLowerCase().charCodeAt(0) - 97
    if (input < 0 || input > Math.min(answers.length - 1, 25)) return
    handleClick(answers[input])()
  }

  return (
    <S.Answers onKeyDown={handleKey}>
      {answers.map((v, i) => (
        <S.Button key={v} {...(i === 0 && { ref })} onClick={handleClick(v)}>
          {v}
          {v === value && (
            <svg height="13" width="16">
              <path d="M14.293.293l1.414 1.414L5 12.414.293 7.707l1.414-1.414L5 9.586z" />
            </svg>
          )}
        </S.Button>
      ))}
    </S.Answers>
  )
}

const S = {
  Answers: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    counter-reset: choice;
  `,

  Button: styled.button`
    -moz-appearance: none;
    -webkit-appearance: none;
    margin-bottom: 0.5rem;
    width: 12rem;
    border: 1px solid #333;
    font-size: 1.2rem;
    height: 3rem;
    padding-left: 0.5rem;
    text-align: left;
    font-family: inherit;
    border-radius: 0.25rem;
    color: #000;
    cursor: pointer;
    background-color: #fff;
    position: relative;

    &::before {
      counter-increment: choice;
      content: counter(choice, upper-alpha);
      display: inline-block;
      text-align: center;
      height: 2rem;
      width: 2rem;
      line-height: 2rem;
      margin-right: 1rem;
      outline: 1px solid #333;
      border-radius: 0.15rem;
      font-size: 1rem;
      background-color: #fff;
    }

    svg {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }

    &:hover {
      background-color: #eee;

      @media (min-width: 769px) {
        &::before {
          content: 'key ' counter(choice, upper-alpha);
          position: relative;
          width: auto;
          width: 4rem;
          margin-right: -1rem;
          transform: translateX(-2rem);
        }
      }
    }

    &:focus {
      outline: none;
    }
  `,
}
