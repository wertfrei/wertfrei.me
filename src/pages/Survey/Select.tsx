import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Fuse from 'fuse.js'

interface Props {
  answers: string[]
  placeholder?: string
  focus?: boolean
  onChange(v: string[] | string): void
  blockNext(v: boolean): void
  limit?: number
}

export default function Select({
  answers = [],
  placeholder,
  focus = false,
  onChange,
  blockNext,
  limit,
}: Props) {
  const [selectVisible, showSelect] = useState(false)
  const [values, setValues] = useState<string[]>([])
  const [fuse, setFuse] = useState()
  const [input, setInput] = useState('')
  const [filtered, setFiltered] = useState(values)
  const [focused, setFocused] = useState('')
  const [disabled, setDisabled] = useState(false)
  const listRef = useRef<HTMLUListElement>()
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (!limit) return
    setDisabled(values.length >= limit)
    if (values.length >= limit) {
      setDisabled(true)
      inputRef.current.blur()
    } else setDisabled(false)
  }, [limit, values.length])

  useEffect(() => {
    setFuse(
      new Fuse(
        answers.map(name => ({ name })),
        {
          shouldSort: true,
          threshold: 0.3,
          keys: ['name'],
        }
      )
    )
  }, [answers])

  useEffect(() => {
    if (!inputRef.current) return
    if (focus !== (inputRef.current === document.activeElement)) {
      if (!focus) inputRef.current.blur()
      else if (values.length === 0) inputRef.current.focus()
    }
  }, [inputRef, focus, values.length])

  useEffect(() => {
    if (input === '')
      return setFiltered(answers.filter(v => !values.includes(v)))
    setFiltered(
      fuse
        .search(input)
        .map(({ name }) => name)
        .filter(v => !values.includes(v))
    )
  }, [input, answers, values, fuse])

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

  function changeValues(values: string[]) {
    setValues(values)
    onChange(limit !== 1 ? values : values[0])
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      if (focused) {
        changeValues([...values, focused])
        setFocused('')
        setInput('')
      }
      return
    }
    if (e.key === 'Backspace') {
      if (input.length === 0 && values.length > 0)
        changeValues(values.slice(0, -1))
      return
    }
    if (e.key === 'Escape') {
      return (e.target as HTMLInputElement).blur()
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
          <S.Tag
            key={v}
            onClick={() => {
              changeValues(values.filter(val => val !== v))
              setTimeout(() => inputRef.current.focus(), 200)
            }}
          >
            <span>{v}</span>
            <svg width="32" height="32">
              <polygon
                xmlns="http://www.w3.org/2000/svg"
                points="2,26 6,30 16,20 26,30 30,26 20,16 30,6 26,2 16,12 6,2 2,6 12,16  "
              />
            </svg>
          </S.Tag>
        ))}

        <S.Input
          {...(values.length === 0 && { placeholder })}
          value={input}
          onChange={({ target }) => setInput(target.value)}
          onFocus={() => {
            blockNext(true)
            showSelect(true)
          }}
          onBlur={() => {
            setTimeout(() => {
              showSelect(false)
              blockNext(false)
            }, 100)
          }}
          onKeyDown={handleKey}
          ref={inputRef}
          disabled={disabled}
        />

        {document.activeElement !== inputRef.current && (
          <svg
            width="24"
            height="24"
            onClick={() => {
              inputRef.current.focus()
            }}
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        )}
      </S.Head>
      {selectVisible && !disabled && (
        <S.Body ref={listRef}>
          {filtered.map(v => (
            <li
              key={v}
              onClick={() => {
                changeValues([...values, v])
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
    justify-content: flex-end;
    display: flex;
    flex-direction: row;
    padding: 0 0.5rem;
    overflow-x: auto;

    & > svg {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }
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
    display: flex;
    align-items: center;
    height: 2rem;
    margin-top: 0.5rem;
    margin-right: 0.5rem;
    padding-left: 0.5rem;
    border: 1px solid #333;
    border-radius: 0.25rem;
    cursor: pointer;

    svg {
      transform: scale(0.3);
    }
  `,
}
