import React from 'react'
import styled from 'styled-components'

export default function Impressum() {
  return (
    <S.Impressum>
      <h1>Impressum</h1>
      <h2>Dienstanbieter</h2>
      <p>Anastasia Wagner &amp; Jonas Bullinger</p>
      <p>Prinz-Ferdinand-Straße 101</p>
      <p>47798 Krefeld</p>
      <p>Deutschland</p>
      <h2>Kontaktmöglichkeiten</h2>
      <p>
        <b>Email:</b> jonas.bullinger@hs-niederrhein.de
      </p>
      <p>
        <b>Telefon:</b> +49 15735306603
      </p>
    </S.Impressum>
  )
}

const S = {
  Impressum: styled.div`
    padding: 1rem 3rem;
    width: 100vw;
    height: 100vh;
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
