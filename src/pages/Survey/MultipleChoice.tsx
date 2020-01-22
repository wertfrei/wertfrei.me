import React from 'react'
import styled from 'styled-components'

interface Props {
  answers: string[]
}

export default function MultipleChoice({ answers = [] }: Props) {
  return (
    <S.Answers>
      {answers.map(v => (
        <S.Button key={v}>{v}</S.Button>
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

    &:hover {
      background-color: #eee;
    }
  `,
}
