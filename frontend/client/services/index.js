
import SplashData from 'services/dtos/splash-data'

const API_ERROR_MESSAGE = 'Failed to communicate with the server. ' +
  'Make sure you have a good connection, and then try again.'

// Fetches splash data from the backend.
export function fetchSplashData() {
  return fetch('/api/splash')
    .then(response => {
      if (response.ok) {
        return response.json()
      }

      return Promise.reject(API_ERROR_MESSAGE)
    }, err => Promise.reject(API_ERROR_MESSAGE))
    .then(rawSplashData => Promise.resolve(SplashData.buildFrom(rawSplashData)))
}
