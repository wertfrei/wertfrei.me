import React, { useContext } from 'react'
import styled from 'styled-components'
import strings from '~/src/strings.json'
import context from '~/src/context'
import { Link } from 'react-router-dom'

export default function Done() {
  const { language } = useContext(context)

  return (
    <S.Done>
      <h1>{strings[language].thanks}</h1>
      <Link to="/">
        <S.Back>{strings[language].back}</S.Back>
      </Link>
    </S.Done>
  )
}

const S = {
  Done: styled.div`
    display: block;
    height: 100vh;
    width: 100vw;
    scroll-snap-align: center;
    scroll-snap-stop: always;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
      font-size: 2rem;
      margin-bottom: 4rem;
    }
  `,

  Back: styled.button`
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

    &:focus {
      outline: none;
    }
  `,
}
