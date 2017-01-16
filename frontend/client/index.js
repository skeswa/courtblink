
import { h, render } from 'preact'

import style from './index.css'
import App from 'components/App'

// Enables React devtools.
if (process.env.NODE_ENV === 'development') {
  require('preact/devtools')
}

const mainEl = document.getElementsByTagName('main')[0]
render(<App />, mainEl)
