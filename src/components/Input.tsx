import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

interface Props {
  id?: string
  placeholder?: string
  onChange?(v: string): void
  focus?: boolean
}

export default function Input({
  id,
  placeholder,
  onChange,
  focus = false,
}: Props) {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLInputElement>()

  useEffect(() => {
    if (!ref.current) return
    if (focus !== (ref.current === document.activeElement))
      ref.current[focus ? 'focus' : 'blur']()
  }, [ref, focus])

  return (
    <S.Input
      id={id}
      placeholder={placeholder}
      value={value}
      autoComplete="off"
      ref={ref}
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
    width: 45rem;
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
