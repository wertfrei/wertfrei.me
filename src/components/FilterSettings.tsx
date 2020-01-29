import React, { useContext } from 'react'
import styled from 'styled-components'
import Select from '~/src/pages/Survey/Select'
import context from '~/src/context'

export default function Filter() {
  const { universities, setFilter } = useContext(context)

  return (
    <S.Filter>
      <Select answers={universities} limit={1} onChange={setFilter} />
    </S.Filter>
  )
}

const S = {
  Filter: styled.div`
    position: absolute;
    top: 10rem;
    right: 6rem;
    width: 20rem;

    & > div {
      width: 100%;
    }

    @media (max-width: 768px) {
      right: initial;
      top: 65%;
      width: calc(100vw - 4rem);
    }
  `,
}
