
import { h, render } from 'preact'

import App from 'containers/App'
import style from './index.css'
import { fetchSplashData } from 'services'
import { Store, Provider, Constants as StoreConstants } from 'store'

// Enables React devtools.
if (process.env.NODE_ENV === 'development') {
  require('preact/devtools')
}

// Create a new store.
const store = new Store({
  [StoreConstants.GAMES]: [],
  [StoreConstants.BOX_SCORES]: [],
  [StoreConstants.SPLASH_LOADED]: false,
})

// Fetch the splash data.
fetchSplashData()
  .then(splashData => {
    store.update(StoreConstants.SPLASH_LOADED, true)
    store.update(StoreConstants.GAMES, splashData.games)
    store.update(
      StoreConstants.BOX_SCORES,
      splashData.firstGameDetails ? [splashData.firstGameDetails] : [])
  })
  .catch(err => store.update(StoreConstants.SPLASH_ERROR, err))

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementsByTagName('main')[0])
