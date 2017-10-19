
import { h, render } from 'preact'

import App from 'containers/App'

// Enables React devtools.
if (process.env.NODE_ENV === 'development') {
  require('preact/devtools')
}

render(<App />, document.getElementsByTagName('main')[0])
