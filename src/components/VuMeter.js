import React, { Component } from 'react'
import './VuMeter.css'

const PI = 3.141596

export default class App extends Component {
  constructor () {
    super()

    this.canvasRef = null             // Handle to Canvas used to get access to drawing context.
    this.boost = 3                    // Input volume boost.
    this.percentageWarningArea = 0.25 // Percentage of the top end volume range to consider too loud.
    this.canvasScaled = false         // Whether or not the canvas has been scaled according to device pixel ratio.
  }

  componentDidMount () {
    this.renderCanvas(this.canvasRef)
  }

  componentWillReceiveProps (props) {
    this.renderCanvas(this.canvasRef)
  }

  renderCanvas (canvas) {
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const x = canvas.width / 2    // Center of the gauge in canvas x-axis.
    const y = canvas.height * 1.7 // Center of the gauge in canvas y-axis.
    const radius = canvas.width   // Radius of the gauge in canvas pixels.
    const startAngle = PI + 1.2   // Start angle of the gauge in radians.
    const endAngle = 2 * PI - 1.2 // End angle of the gauge in radians.

    this.scaleCanvas(canvas)
    this.renderScale(canvas, x, y, radius, startAngle, endAngle)
    this.renderWarningLevel(canvas, x, y, radius, startAngle, endAngle)
    // A warning light turns on when the audio is too loud.
    this.renderWarningLight(canvas, x, y, radius)
    this.renderNeedle(canvas, x, y, radius, startAngle, endAngle)
    // A shield covers the bottom of the gauge to make it look more like a real analog dial.
    this.renderNeedleShield(canvas, x, y, radius)
  }

  scaleCanvas (canvas) {
    if (this.canvasScaled) {
      return
    }
    this.canvasScaled = true

    const ratio = window.devicePixelRatio || 1
    canvas.width /= ratio
    canvas.height /= ratio
  }

  renderScale (canvas, x, y, radius, startAngle, endAngle) {
    const ctx = canvas.getContext('2d')

    ctx.beginPath()
    ctx.arc(x, y, radius, startAngle, endAngle, false)
    ctx.strokeStyle = '#a0a0a0'
    ctx.lineWidth = 2
    ctx.stroke()
  }

  renderWarningLevel (canvas, x, y, radius, startAngle, endAngle) {
    const ctx = canvas.getContext('2d')

    const range = endAngle - startAngle
    const warningStartAngle = endAngle - range * this.percentageWarningArea

    ctx.beginPath()
    ctx.arc(x, y, radius - 1, warningStartAngle, endAngle, false)
    ctx.strokeStyle = '#ff0000'
    ctx.lineWidth = 4
    ctx.stroke()
  }

  renderWarningLight (canvas, x, y, radius) {
    const ctx = canvas.getContext('2d')

    const startAngle = 0
    const endAngle = 2 * PI
    const tooLoud = (this.props.volume * this.boost) > (1 - this.percentageWarningArea)

    ctx.beginPath()
    ctx.arc(x, y - radius / 1.3, radius / 30, startAngle, endAngle, false)
    ctx.fillStyle = tooLoud ? '#ff8080' : '#aebecf'
    ctx.fill()
  }

  renderNeedle (canvas, x, y, radius, startAngle, endAngle) {
    const ctx = canvas.getContext('2d')

    const volume = this.props.volume * this.boost
    const angle = Math.min(volume * (endAngle - startAngle) + startAngle, endAngle)
    const needleTipX = x + radius * 0.97 * Math.cos(angle)
    const needleTipY = y + radius * 0.97 * Math.sin(angle)

    ctx.beginPath()
    ctx.moveTo(needleTipX, needleTipY)
    ctx.lineTo(x, y)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.stroke()
  }

  renderNeedleShield (canvas, x, y, radius) {
    const ctx = canvas.getContext('2d')

    const startAngle = PI
    const endAngle = 2 * PI

    ctx.beginPath()
    ctx.arc(x, y, radius / 1.6, startAngle, endAngle, false)
    ctx.fillStyle = '#414141'
    ctx.fill()
  }

  render () {
    return (
      <canvas ref={c => { this.canvasRef = c }} height={600} width={800} />
    )
  }
}
