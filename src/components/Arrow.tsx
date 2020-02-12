import React from 'react'
import styled from 'styled-components'

interface Props {
  up?: boolean
  down?: boolean
  left?: boolean
  right?: boolean
  onClick?(): void
}

function Arrow({ up, down, left, right, onClick = () => {} }: Props) {
  return (
    <S.Arrow
      height="24"
      viewBox="0 0 24 24"
      width="24"
      data-dir={
        up ? 'up' : down ? 'down' : left ? 'left' : right ? 'right' : 'down'
      }
      onClick={onClick}
    >
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </S.Arrow>
  )
}

const S = {
  Arrow: styled.svg`
    cursor: pointer;
    width: 3rem;
    height: 3rem;

    &[data-dir='up'] {
      transform: rotateZ(180deg);
    }
    &[data-dir='right'] {
      transform: rotateZ(-90deg);
    }
    &[data-dir='left'] {
      transform: rotateZ(90deg);
    }

    path {
      fill: var(--cl-black);
    }
  `,
}
export default Object.assign(Arrow, { sc: S.Arrow })
