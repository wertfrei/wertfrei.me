import React, { useState } from 'react'
import styled from 'styled-components'

export default function Menu() {
  const [open, setOpen] = useState(false)

  return (
    <S.Hamburger onClick={() => setOpen(!open)}>
      <S.HamburgerBox>
        <S.HamburgerInner data-state={open ? 'open' : 'closed'} />
      </S.HamburgerBox>
    </S.Hamburger>
  )
}

const S = {
  Hamburger: styled.button`
    position: fixed;
    left: 1rem;
    top: 1rem;
    -moz-appearance: none;
    -webkit-appearance: none;
    border: none;
    padding: 15px;
    display: inline-block;
    cursor: pointer;
    transition: opacity 0.15s;

    &:focus {
      outline: none;
    }
    &:hover {
      opacity: 0.7;
    }
  `,

  HamburgerBox: styled.span`
    width: 40px;
    height: 24px;
    display: inline-block;
    position: relative;
  `,

  HamburgerInner: styled.span`
    &,
    &::before,
    &::after {
      content: '';
      display: block;
      width: 40px;
      height: 4px;
      background-color: #000;
      border-radius: 4px;
      position: absolute;
      transition-property: transform;
      transition-duration: 0.15s;
      transition-timing-function: ease;
    }
    &::before {
      top: 10px;
      transition-property: transform, opacity;
      transition-timing-function: ease;
      transition-duration: 0.15s;
    }
    &::after {
      bottom: -10px;
      top: 20px;
    }

    &[data-state='open'] {
      transform: translate3d(0, 10px, 0) rotate(45deg);

      &::before {
        transform: rotate(-45deg) translate3d(-5.71429px, -6px, 0);
        opacity: 0;
      }

      &::after {
        transform: translate3d(0, -20px, 0) rotate(-90deg);
      }
    }
  `,
}
