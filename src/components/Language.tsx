import React, { useContext } from 'react'
import context, { Language } from '~/src/context'
import styled from 'styled-components'

const languages: Language[] = ['de', 'en']

export default function LanguageSelection() {
  const ctx = useContext(context)

  return (
    <S.Selection>
      {languages.map(lang => (
        <li
          key={lang}
          {...(lang === ctx.language
            ? { 'data-active': true }
            : { onClick: () => ctx.setLanguage(lang) })}
        >
          {lang}
        </li>
      ))}
    </S.Selection>
  )
}

const S = {
  Selection: styled.ul`
    position: absolute;
    top: 2rem;
    right: calc(6rem);
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    li {
      font-size: 1.2rem;
      cursor: pointer;

      &[data-active='true'] {
        font-weight: bold;
        cursor: initial;
      }

      & + li::before {
        content: ' | ';
        white-space: pre;
        font-weight: normal;
      }
    }
  `,
}
