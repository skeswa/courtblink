
import { h, render } from 'preact'

import style from './index.css'
import App from 'components/App'
import { fetchSplashData } from 'services'

// Enables React devtools.
if (process.env.NODE_ENV === 'development') {
  require('preact/devtools')
}

// Fetch the splash data.
fetchSplashData()
  .then(splashData => console.log('SPLASH DATA', splashData))
  .catch(err => console.log('fetchSplashData failed:', err))

const mainEl = document.getElementsByTagName('main')[0]
render(<App />, mainEl)
