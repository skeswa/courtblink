
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
  [StoreConstants.SELECTED_GAME]: -1,
})

// Fetch the splash data.
fetchSplashData()
  .then(splashData => {
    console.log('splashData', splashData)
    store.update({
      [StoreConstants.SPLASH_LOADED]: true,
      [StoreConstants.GAMES]: splashData.games,
      [StoreConstants.BOX_SCORES]:
        splashData.firstGameDetails
          ? [splashData.firstGameDetails]
          : [],
      [StoreConstants.SELECTED_GAME]:
        splashData.games.length > 0
          ? splashData.games[0]
          : null
    })
  })
  .catch(err => store.update(StoreConstants.SPLASH_ERROR, err))

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementsByTagName('main')[0])
