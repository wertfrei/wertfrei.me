import React, { useContext } from 'react'
import styled from 'styled-components'
import strings from '~/src/strings.json'
import context from '~/src/context'

export default function Impressum() {
  const { language } = useContext(context)

  return (
    <S.Impressum>
      <h1>Impressum</h1>
      <h2>{strings[language].imp_serv}</h2>
      <p>Anastasia Wagner &amp; Jonas Bullinger</p>
      <p>Prinz-Ferdinand-Straße 101</p>
      <p>47798 Krefeld</p>
      <p>{strings[language].germany}</p>
      <h2>{strings[language].imp_contact}</h2>
      <p>
        <b>Email:</b> jonas.bullinger@hs-niederrhein.de
      </p>
      <p>
        <b>Telefon:</b> +49 15735306603
      </p>
      <h2>{strings[language].imp_implementation}</h2>
      <p>Mathis Bullinger</p>
      <p>
        <b>Email:</b> mathis@bullinger.dev
      </p>
    </S.Impressum>
  )
}

const S = {
  Impressum: styled.div`
    padding: 1rem 2rem;
    margin-top: 5rem;
    height: calc(100vh - 5rem);
    width: 100vw;
    overflow-y: auto;

    @media (max-width: 768px) {
      padding: 1rem;
    }

    * {
      line-height: 150%;
    }

    h1,
    h2,
    h3 {
      font-weight: bold;
      margin-bottom: 1rem;
      margin-top: 2rem;
    }

    h1 {
      font-size: 1.5rem;
    }

    h2 {
      font-size: 1.25rem;
    }

    p {
      margin: 1rem 0;
    }

    b {
      font-weight: bold;
    }
  `,
}
