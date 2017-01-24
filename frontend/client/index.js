
import { h, render } from 'preact'

import App from 'components/App'
import style from './index.css'
import Store from 'store'
import { fetchSplashData } from 'services'

// Store key constants.
const STORE_KEY_GAMES = 'games'
const STORE_KEY_BOX_SCORES = 'boxScores'
const STORE_KEY_SPLASH_ERROR = 'splashError'
const STORE_KEY_SPLASH_LOADED = 'splashLoaded'

// Enables React devtools.
if (process.env.NODE_ENV === 'development') {
  require('preact/devtools')
}

// Fetch the splash data.
fetchSplashData()
  .then(splashData => {
    Store.update(STORE_KEY_SPLASH_LOADED, true)
    Store.update(STORE_KEY_GAMES, splashData.games)
    Store.update(
      STORE_KEY_BOX_SCORES,
      splashData.firstGameDetails ? [splashData.firstGameDetails] : [])
  })
  .catch(err => Store.update(STORE_KEY_SPLASH_ERROR, err))

const mainEl = document.getElementsByTagName('main')[0]
const BoundApp = Store.bind(App, STORE_KEY_SPLASH_LOADED)
render(<BoundApp />, mainEl)
