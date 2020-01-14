import React, { useState, useContext } from 'react'
import Language from './Language'
import context from '~/src/context'
import styled from 'styled-components'

export default function Menu() {
  const [open, setOpen] = useState(false)
  const { strings } = useContext(context)

  return (
    <>
      <S.Menu data-state={open ? 'open' : 'closed'}>
        <S.List>
          <li>
            <a>{strings.menu_participate}</a>
          </li>
          <br />
          <li>
            <a>{strings.menu_filter}</a>
          </li>
          <br />
          <li>
            <a>{strings.menu_privacy}</a>
          </li>
          <li>
            <a>{strings.menu_impressum}</a>
          </li>
        </S.List>
        <Language />
      </S.Menu>
      <S.Hamburger onClick={() => setOpen(!open)}>
        <S.HamburgerBox>
          <S.HamburgerInner data-state={open ? 'open' : 'closed'} />
        </S.HamburgerBox>
      </S.Hamburger>
    </>
  )
}

const S = {
  Menu: styled.nav`
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    display: block;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    clip-path: circle(10px at 50px 40px);
    opacity: 0;
    --trans-time: 0.5s;
    transition: clip-path var(--trans-time) ease-in,
      opacity 0s linear var(--trans-time);
    will-change: clip-path;
    padding: 10rem 2rem;

    &[data-state='open'] {
      clip-path: circle(150vmax at 50px 40px);
      transition: clip-path var(--trans-time) ease;
      opacity: 1;
    }
  `,

  List: styled.ul`
    font-size: 2rem;
    text-transform: uppercase;
    justify-content: space-between;

    line-height: 3rem;
  `,

  Hamburger: styled.button`
    position: fixed;
    z-index: 1001;
    left: 1rem;
    top: 1rem;
    -moz-appearance: none;
    -webkit-appearance: none;
    border: none;
    padding: 15px;
    display: inline-block;
    cursor: pointer;
    transition: opacity 0.15s;
    background-color: transparent;

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
