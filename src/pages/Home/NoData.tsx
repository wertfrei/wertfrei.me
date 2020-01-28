import React, { useContext } from 'react'
import styled from 'styled-components'
import context from '~/src/context'
import strings from '~/src/strings.json'

export default function NoData() {
  const { language } = useContext(context)

  return (
    <S.NoData>
      <div>
        <p>{strings[language].nodata}</p>
        <p>{strings[language].checkback}</p>
      </div>
    </S.NoData>
  )
}

const S = {
  NoData: styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 100vh;
    width: 100vw;
    padding: 0 2rem;
    scroll-snap-align: center;
    scroll-snap-stop: always;
    font-size: 1.5rem;

    div {
      display: block;
      width: 95%;
    }

    p {
      margin-bottom: 2rem;
    }
  `,
}
