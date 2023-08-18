import React from 'react'
import s1 from './images/s1.png'
import s2 from './images/s2.png'

type Props = {}

export default function FindSheetsId({}: Props) {
  return (
    <div>
      <h1>Find your Google Sheets ID</h1>
      <p>
        First, go to your google sheets:{' '}
        <a href="https://docs.google.com/spreadsheets/" target="_blank">
          https://docs.google.com/spreadsheets/
        </a>
      </p>
      <p>Then, create a new sheet for job applications or using existing one</p>
      <p>
        <img src={s1} />
      </p>
      <p>Finally, copy the id from the url and paste it above.</p>
      <p>
        <img src={s2} />
      </p>
    </div>
  )
}
