import React, { Component } from 'react'
import './App.css'

import VuMeter from './components/VuMeter'

class App extends Component {
  render () {
    return (
      <article className='app'>
        <header>
          <h1>VU Meter</h1>
        </header>
        <section>
          <VuMeter volume={this.props.volume} boost={3} />
        </section>
      </article>
    )
  }
}

export default App
