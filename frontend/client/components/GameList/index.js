
import { h, Component } from 'preact'

import style from './index.css'
import GameBox from './gamebox'

class GameList extends Component {
  renderGameBoxes(games, selectedGame, onSelectedGameChanged) {
    let selectedGameFound = false
    return games.map(game => {
      let currentGameSelected = game === selectedGame
      if (currentGameSelected) {
        selectedGameFound = true
      }

      return (
        <GameBox
          key={game.id}
          game={game}
          selected={currentGameSelected}
          displaced={!currentGameSelected && selectedGameFound}
          onSelection={onSelectedGameChanged} />
      )
    })
  }

  render({ games, selectedGame, onSelectedGameChanged }) {
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
          {this.renderGameBoxes(games, selectedGame, onSelectedGameChanged)}
        </div>
      </div>
    )
  }
}

export default GameList
