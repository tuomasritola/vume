/* globals AudioContext alert */

export default class VolumeMeter {
  constructor () {
    this.volume = 0.0         // volume level at this time instant
    this.smoothedVolume = 0.0 // volume level with smoothing to make it appear more analog
    this.script = null        // handle to registered script processor used for cleanup
    this.mic = null           // handle to mic used for cleanup
  }

  init (stream) {
    const bufferSize = 256
    const nInputChannels = 1
    const nOutputChannels = 1
    const smoothingPercentage = 0.03

    let context

    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext
      context = new AudioContext()
    } catch (e) {
      alert('Web Audio API not supported.')
    }

    this.script = context.createScriptProcessor(bufferSize, nInputChannels, nOutputChannels)

    this.script.onaudioprocess = (event) => {
      let input = event.inputBuffer.getChannelData(0)
      let sum = 0.0
      for (let i = 0; i < input.length; i++) {
        sum += input[i] * input[i]
      }
      this.volume = Math.sqrt(sum / input.length)
      this.smoothedVolume = this.smoothedVolume * (1 - smoothingPercentage) + this.volume * smoothingPercentage
    }

    try {
      this.mic = context.createMediaStreamSource(stream)
      this.mic.connect(this.script)
      this.script.connect(context.destination)
    } catch (e) {
      alert(`Failed to create media stream: ${e}`)
    }
  }

  sampleInputVolume () {
    return this.volume
  }

  sampleSmoothedVolume () {
    return this.smoothedVolume
  }

  destroy () {
    this.mic.disconnect()
    this.script.disconnect()
  }
}
