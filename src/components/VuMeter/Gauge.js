const PI = 3.141596

export default class Gauge {
  constructor (canvasRef) {
    this.canvas = canvasRef                      // Handle to Canvas used to get access to drawing context.
    this.canvasScaled = false                    // Whether or not the canvas has been scaled according to device pixel ratio.
    this.percentageWarningArea = 0.25            // Percentage of the top end volume range to consider too loud.
    this.ctx = this.canvas.getContext('2d')      // Canvas drawing context.
    this.x = this.canvas.width / 2               // Center of the gauge in canvas x-axis.
    this.y = this.canvas.height * 1.7            // Center of the gauge in canvas y-axis.
    this.radius = this.canvas.width              // Radius of the gauge in canvas pixels.
    this.startAngle = PI + 1.2                   // Start angle of the gauge in radians.
    this.endAngle = 2 * PI - 1.2                 // End angle of the gauge in radians.
    this.range = this.endAngle - this.startAngle // Degrees in Radians covered by gauge.
  }

  renderWithVolume (volume) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.scaleCanvas()
    this.renderScale()
    this.renderWarningLevel()
    // A warning light turns on when the audio is too loud.
    this.renderWarningLight(volume)
    this.renderNeedle(volume)
    // A shield covers the bottom of the gauge to make it look more like a real analog dial.
    this.renderNeedleShield()
  }

  scaleCanvas () {
    if (this.canvasScaled) {
      return
    }
    this.canvasScaled = true

    const ratio = window.devicePixelRatio || 1
    this.canvas.width /= ratio
    this.canvas.height /= ratio
  }

  renderScale () {
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, false)
    this.ctx.strokeStyle = '#a0a0a0'
    this.ctx.lineWidth = 2
    this.ctx.stroke()
  }

  renderWarningLevel () {
    const warningStartAngle = this.endAngle - this.range * this.percentageWarningArea

    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius - 1, warningStartAngle, this.endAngle, false)
    this.ctx.strokeStyle = '#ff0000'
    this.ctx.lineWidth = 4
    this.ctx.stroke()
  }

  renderWarningLight (volume) {
    const startAngle = 0
    const endAngle = 2 * PI
    const tooLoud = volume > (1 - this.percentageWarningArea)

    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y - this.radius / 1.3, this.radius / 30, startAngle, endAngle, false)
    this.ctx.fillStyle = tooLoud ? '#ff8080' : '#aebecf'
    this.ctx.fill()
  }

  renderNeedle (volume) {
    const angle = Math.min(volume * (this.endAngle - this.startAngle) + this.startAngle, this.endAngle)
    const needleTipX = this.x + this.radius * 0.97 * Math.cos(angle)
    const needleTipY = this.y + this.radius * 0.97 * Math.sin(angle)

    this.ctx.beginPath()
    this.ctx.moveTo(needleTipX, needleTipY)
    this.ctx.lineTo(this.x, this.y)
    this.ctx.strokeStyle = '#000000'
    this.ctx.lineWidth = 2
    this.ctx.stroke()
  }

  renderNeedleShield () {
    const startAngle = PI
    const endAngle = 2 * PI

    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius / 1.6, startAngle, endAngle, false)
    this.ctx.fillStyle = '#414141'
    this.ctx.fill()
  }
}
