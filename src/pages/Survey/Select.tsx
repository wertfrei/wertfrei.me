import React, { useState } from 'react'
import styled from 'styled-components'

interface Props {
  answers: string[]
  placeholder?: string
}

export default function Select({
  answers = [],
  placeholder = 'language',
}: Props) {
  const [selectVisible, showSelect] = useState(false)
  const [values, setValues] = useState<string[]>([])
  const [input, setInput] = useState('')

  return (
    <S.Select>
      <S.Head>
        {values.map(v => (
          <S.Tag key={v}>{v}</S.Tag>
        ))}
        <S.Input
          placeholder={placeholder}
          value={input}
          onChange={({ target }) => setInput(target.value)}
          onFocus={() => showSelect(true)}
          onBlur={() => {
            setTimeout(() => showSelect(false), 200)
          }}
        />
      </S.Head>
      {selectVisible && (
        <S.Body>
          {answers.map(v => (
            <li
              key={v}
              onClick={() => {
                setValues([...values, v])
                setInput('')
              }}
            >
              {v}
            </li>
          ))}
        </S.Body>
      )}
    </S.Select>
  )
}

const S = {
  Select: styled.div`
    width: 45rem;
    max-width: 90vw;
    border: solid 1px black;
  `,

  Head: styled.div`
    height: 3rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding: 0 0.5rem;
  `,

  Body: styled.ul`
    max-height: 12rem;
    overflow-y: auto;

    li {
      height: 2.5rem;
      line-height: 2.5rem;
      border-top: 1px solid #ddd;
      padding: 0 0.5rem;
      color: #333;
      cursor: pointer;

      &:hover {
        background-color: #ddd;
      }
    }
  `,

  Input: styled.input`
    border: none;
    height: 100%;
    box-sizing: border-box;
    flex-grow: 1;
    font-size: 1.2rem;

    &:focus {
      outline: none;
    }
  `,

  Tag: styled.div`
    display: block;
    height: 2rem;
    line-height: 2rem;
    margin-top: 0.5rem;
    margin-right: 0.5rem;
    padding: 0 0.5rem;
    border: 1px solid #333;
    border-radius: 0.25rem;
  `,
}
