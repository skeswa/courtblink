
import { h, Component } from 'preact'

import style from './style.css'
import Loader from 'components/Loader'
import GameList from 'components/GameList'
import { subscribe, Constants as StoreConstants } from 'store'

class App extends Component {
  onSelectedGameChanged(newlySelectedGame) {
    this.context.store.update(StoreConstants.SELECTED_GAME, newlySelectedGame)
  }

  render() {
    const {
      [StoreConstants.GAMES]: games,
      [StoreConstants.BOX_SCORES]: boxScores,
      [StoreConstants.SPLASH_ERROR]: splashError,
      [StoreConstants.SPLASH_LOADED]: splashLoaded,
      [StoreConstants.SELECTED_GAME]: selectedGame,
    } = this.props.storeData

    return (
      <div className={style.main}>
        <div
          className={style.back}
          style={
            selectedGame
            ? { backgroundImage: `url(${selectedGame.homeTeamSplashUrl})` }
            : null
          } />
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
