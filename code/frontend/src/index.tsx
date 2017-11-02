import { h, render } from 'preact'

import App from 'containers/App'
import { registerServiceWorker } from 'network/ServiceWorker'

// Before doing anything in production, make sure we're on HTTPS.
if (process.env.NODE_ENV === 'production') {
  const isSessionUnencrypted = location.protocol !== 'https:'
  if (isSessionUnencrypted) {
    location.href = `https:${location.href.substring(location.protocol.length)}`
  }
}

// Enables React devtools.
if (process.env.NODE_ENV === 'development') {
  require('preact/devtools')
}

// Render courtblink to the DOM.
render(<App />, document.getElementsByTagName('main')[0])

// Register the courtblink servcie worker.
registerServiceWorker()
