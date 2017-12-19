import React, { Component } from 'react'
import Gauge from './Gauge'
import './VuMeter.css'

export default class VuMeter extends Component {
  constructor () {
    super()

    this.canvasRef = null // Handle to Canvas passed to Gauge for accessing drawing context.
  }

  componentDidMount () {
    const boostedVolume = this.props.volume * this.props.boost

    this.gauge = new Gauge(this.canvasRef)
    this.gauge.renderWithVolume(boostedVolume)
  }

  componentWillReceiveProps (props) {
    const boostedVolume = props.volume * props.boost

    this.gauge.renderWithVolume(boostedVolume)
  }

  render () {
    return (
      <canvas ref={c => { this.canvasRef = c }} height={600} width={800} />
    )
  }
}
