
import { h, Component } from 'preact'

import style from './style.css'
import Loader from 'components/Loader'
import Carousel from 'components/Carousel'
import { subscribe, Constants as StoreConstants } from 'store'

class App extends Component {
  render() {
    const {
      [StoreConstants.GAMES]: games,
      [StoreConstants.BOX_SCORES]: boxScores,
      [StoreConstants.SPLASH_ERROR]: splashError,
      [StoreConstants.SPLASH_LOADED]: splashLoaded,
    } = this.props.storeData

    return (
      <div className={style.main}>
        <div className={style.back}>
        </div>
        <div className={style.front}>
          <div className={style.top}></div>
          <div className={style.middle}>
            <Loader />
          </div>
          <div className={style.bottom}>
            <Carousel games={games} visible={splashLoaded} />
          </div>
        </div>
      </div>
    )
  }
}

export default subscribe(
  App,
  StoreConstants.GAMES,
  StoreConstants.BOX_SCORES,
  StoreConstants.SPLASH_ERROR,
  StoreConstants.SPLASH_LOADED)
