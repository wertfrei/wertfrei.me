import React, { useState } from 'react'
import styled from 'styled-components'

interface Props {
  id?: string
  placeholder?: string
  onChange?(v: string): void
}

export default function Input({ id, placeholder, onChange }: Props) {
  const [value, setValue] = useState('')

  return (
    <S.Input
      id={id}
      placeholder={placeholder}
      value={value}
      autoComplete="off"
      onChange={({ target }) => {
        setValue(target.value)
        if (onChange) onChange(target.value)
      }}
    />
  )
}

const S = {
  Input: styled.input`
    font-size: 1.6rem;
    width: 50rem;
    max-width: 90vw;
    border: none;
    border-bottom: 1px solid #bbb;
    line-height: 3rem;
    transition: border-color 0.15s ease;

    &:focus {
      border-color: transparent;
      outline: none;
    }

    &:placeholder {
      color: #bbb;
    }
  `,
}
