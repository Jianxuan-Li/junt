import React from 'react'
import './index.css'
import a1 from './images/a1.png'

type Props = {}

export default function About({}: Props) {
  return (
    <div className="aboutPage">
      <h1>About</h1>
      <p>Junt is an open-source chrome extension helps you track your job applications</p>
      <p>
        Source code:{' '}
        <a href="https://github.com/Jianxuan-Li/junt" title="github" target="_blank">
          https://github.com/Jianxuan-Li/junt
        </a>
      </p>
      <h1>Privacy</h1>
      <p>Junt does not collect any data from you. All your data is stored in your google sheets.</p>
      <h1>Bug report and new feature requests</h1>
      <p>
        If you find any bugs, please report it to Github issues:{' '}
        <a href="https://github.com/Jianxuan-Li/junt/issues" title="github" target="_blank">
          https://github.com/Jianxuan-Li/junt/issues
        </a>
      </p>
      <h1>How to organize data in your google sheets</h1>
      <p>If you google sheet is empty, Junt will organizes it</p>
      <p>If you have history data, please format it in to the following form:</p>
      <p>column A: Date or Datetime</p>
      <p>column B: Company name</p>
      <p>column C: Job title</p>
      <p>column D: Job link</p>
      <p>Example:</p>
      <p>
        <img src={a1} alt="a1" />
      </p>
      <h1>How to delete a record</h1>
      <p>Remove that record from your google sheet.</p>
      <h1>Synchronize data</h1>
      <p>
        Junt automatically cache data from your Google sheet, usually you don't need to click the `Synchronize` button.
        Still, have control: hit 'Synchronize' anytime.
      </p>
    </div>
  )
}
