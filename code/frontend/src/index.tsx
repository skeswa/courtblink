import { h, render } from 'preact'

import App from 'containers/App'
import { registerServiceWorker } from 'network/ServiceWorker'

// Enables React devtools.
if (process.env.NODE_ENV === 'development') {
  require('preact/devtools')
}

// Render courtblink to the DOM.
render(<App />, document.getElementsByTagName('main')[0])

// Register the courtblink servcie worker.
registerServiceWorker()
