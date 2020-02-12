import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <S.About>
      <h3>WERTFREI</h3>
      <p>Ein Projekt von Studenten. Für Studenten.</p>
      <p>
        WERTFREI ist ein gestalterisches Experiment auf das du in Echtzeit
        Einfluss nehmen kannst. Wir bilden Studenten und Studentinnen in
        Deutschland ab, indem wir Informationen in eine abstrakte Formsprache
        verwandeln. Die Angaben, die du in unseren Datenpool einpflegst, werden
        grafisch interpretiert und verändern so das Abbild des Durchschnitts an
        deiner Hochschule, Stadt-, landes- oder sogar bundesweit.
      </p>
      <p>
        Das Projekt verfolgt keinerlei kommerzielles Interesse, sondern dient
        lediglich dem Selbstzweck.
      </p>
      <h3>User Guide</h3>
      <p>
        Bei der Eingabe deiner Angaben fragen wir deine Martrikelnummer ab, um
        mehrfache Nutzung zu vermeiden und die Grafiken dadurch möglichst exakt
        zu halten. Du kannst jederzeit Fragen überspringen und alle Angaben und
        Informationen bleiben selbstverständlich anonym und sind entsprechend
        gesichert. Weiteres zur Datenverarbeitung findest du{' '}
        <Link to="/privacy">hier</Link>.
      </p>
      <p>
        Willst du dir nun die Ergebnisse anschauen, scrolle einfach durch die
        Seite. Interessiert dich eine Frage besonders, kannst du dir mit einem
        Klick alle wichtigen Informationen und Datenverteilungen ansehen.
      </p>
    </S.About>
  )
}

const S = {
  About: styled.div`
    padding: 3rem;

    * {
      line-height: 150%;
    }

    h3 {
      font-weight: bold;
      margin-bottom: 1rem;

      &:not(:first-of-type) {
        margin-top: 2rem;
      }
    }

    p {
      margin: 1rem 0;
    }
  `,
}
