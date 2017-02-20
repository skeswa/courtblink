
import classNames from 'classnames'
import { h, Component } from 'preact'

import style from './style.css'
import Loader from 'components/Loader'
import GameList from 'components/GameList'
import CyclingBackground from 'components/CyclingBackground'
import { subscribe, Constants as StoreConstants } from 'store'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = { backgroundLoaded: false }
  }

  onBackgroundLoaded() {
    this.setState({ backgroundLoaded: true })
  }

  onSelectedGameChanged(newlySelectedGame) {
    this.context.store.update(StoreConstants.SELECTED_GAME, newlySelectedGame)
  }

  render() {
    const {
      [StoreConstants.GAMES]: games,
      [StoreConstants.SPLASH_LOADED]: splashLoaded,
      [StoreConstants.SELECTED_GAME]: selectedGame,
    } = this.props.storeData
    const { backgroundLoaded } = this.state
    const ready = splashLoaded && backgroundLoaded
    const className = classNames(style.main, { [style.main__ready]: ready })

    return (
      <div className={className}>
        <div className={style.loader}>
          <Loader />
        </div>
        <div className={style.back}>
          <CyclingBackground
            src={
              selectedGame && selectedGame.homeTeamStatus
                  ? selectedGame.homeTeamStatus.splashUrl
                  : null
            }
            onFirstBackgroundLoaded={::this.onBackgroundLoaded} />
        </div>
        <div className={style.front}>
          <div className={style.left}>
            <GameList
              games={games}
              selectedGame={selectedGame}
              onSelectedGameChanged={::this.onSelectedGameChanged} />
          </div>
          <div className={style.right}>
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
  StoreConstants.SPLASH_LOADED,
  StoreConstants.SELECTED_GAME)
