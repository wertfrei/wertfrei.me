import React, { useState, useEffect, useRef } from 'react'
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
  const [filtered, setFiltered] = useState(values)
  const [focused, setFocused] = useState('')
  const listRef = useRef<HTMLUListElement>()

  useEffect(() => {
    if (input === '')
      return setFiltered(answers.filter(v => !values.includes(v)))
    setFiltered(
      answers.filter(
        v => v.toLowerCase().startsWith(input) && !values.includes(v)
      )
    )
  }, [input, answers, values])

  useEffect(() => {
    if (filtered.length === 0) return setFocused('')
    if (!focused || !filtered.includes(focused)) setFocused(filtered[0])
  }, [focused, filtered])

  useEffect(() => {
    if (!listRef.current) return
    const focusedEl = Array.from(listRef.current.querySelectorAll('li')).find(
      item => item.innerHTML === focused
    )
    if (!focusedEl) return
    const focusTop = focusedEl.offsetTop
    const focusBottom = focusTop + focusedEl.offsetHeight
    const listTop = listRef.current.offsetTop + listRef.current.scrollTop
    const listBottom = listTop + listRef.current.offsetHeight
    if (focusBottom > listBottom)
      listRef.current.scrollBy({ top: focusBottom - listBottom })
    else if (focusTop < listTop)
      listRef.current.scrollBy({ top: focusTop - listTop })
  }, [focused])

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      if (focused) {
        setValues([...values, focused])
        setFocused('')
        setInput('')
      }
      return
    }
    if (e.key === 'Backspace') {
      if (input.length === 0 && values.length > 0)
        setValues(values.slice(0, -1))
      return
    }
    const current = filtered.findIndex(v => v === focused)
    if (e.key === 'ArrowDown')
      return setFocused(filtered[Math.min(current + 1, filtered.length - 1)])
    if (e.key === 'ArrowUp')
      return setFocused(filtered[Math.max(current - 1, 0)])
  }

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
          onKeyDown={handleKey}
        />
      </S.Head>
      {selectVisible && (
        <S.Body ref={listRef}>
          {filtered.map(v => (
            <li
              key={v}
              onClick={() => {
                setValues([...values, v])
                setInput('')
              }}
              onMouseOver={() => setFocused(v)}
              {...(v === focused && { 'aria-selected': true })}
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
    border-radius: 0.25rem;
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
    max-height: 15rem;
    overflow-y: auto;

    li {
      height: 2.5rem;
      line-height: 2.5rem;
      border-top: 1px solid #ddd;
      padding: 0 0.5rem;
      color: #333;
      cursor: pointer;

      &[aria-selected='true'] {
        background-color: #eee;
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
