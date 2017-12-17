import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import { startApp } from './setup'

let appState = {
  volume: 0.0
}

function renderAppState (appState) {
  ReactDOM.render(<App {...appState} />, document.getElementById('root'))
}

registerServiceWorker()

startApp(appState, renderAppState)
