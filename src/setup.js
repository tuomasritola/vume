/* globals alert */
import VolumeMeter from './lib/VolumeMeter'

const constraints = {
  audio: true,
  video: false
}

function handleSuccess (stream, appState, renderAppState) {
  const volumeMeter = new VolumeMeter()

  volumeMeter.init(stream)

  function step () {
    renderAppState({
      volume: volumeMeter.sampleSmoothedVolume()
    })

    window.requestAnimationFrame(step)
  }

  window.requestAnimationFrame(step)
}

function handleError (e) {
  alert(`Failed to initialize microphone: ${e}`)
}

export function startApp (appState, renderAppState) {
  return navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => handleSuccess(stream, appState, renderAppState))
    .catch(handleError)
}
