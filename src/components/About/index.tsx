import React from 'react'
import './index.css'

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
    </div>
  )
}
