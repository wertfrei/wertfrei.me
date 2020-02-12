import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

interface Props {
  id?: string
  placeholder?: string
  onChange?(v: string | number): void
  focus?: boolean
  type?: string
  unit?: string
  spin?: boolean
}

export default function Input({
  id,
  placeholder,
  onChange,
  focus,
  type,
  unit,
  spin,
}: Props) {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLInputElement>()

  useEffect(() => {
    if (!ref.current) return
    if (focus !== (ref.current === document.activeElement)) {
      if (focus === false) return ref.current.blur()
      if (value.length > 0) return
      const slide = ref.current.parentElement.parentElement.parentElement
      if (
        slide.offsetTop <
        document.querySelector('#root').scrollTop + window.innerHeight
      )
        return ref.current.focus()
      slide.scrollIntoView()
      setTimeout(() => {
        ref.current.focus()
      }, 600)
    }
  }, [ref, focus, value.length])

  return (
    <S.Wrap {...(unit && { 'data-unit': unit })}>
      <S.Input
        id={id}
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        ref={ref}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === 'Escape') (e.target as HTMLInputElement).blur()
        }}
        onChange={({ target }) => {
          setValue(target.value)
          if (onChange)
            onChange(
              type === 'number' ? parseFloat(target.value) : target.value
            )
        }}
        type={type}
        {...(spin === false && { 'data-spin': false })}
      />
    </S.Wrap>
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
    font-family: inherit;
    box-sizing: border-box;

    &:focus {
      border-color: transparent;
      outline: none;
    }

    &:placeholder {
      color: #bbb;
    }

    &[data-spin='false']::-webkit-outer-spin-button,
    &[data-spin='false']::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  `,

  Wrap: styled.div`
    position: relative;

    &[data-unit] {
      & > input {
        padding-right: ${(props: any) => (props['data-unit'] || '').length}ch;
      }

      &::after {
        content: attr(data-unit);
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        font-size: 1.6rem;
        line-height: 3rem;
      }
    }
  `,
}
