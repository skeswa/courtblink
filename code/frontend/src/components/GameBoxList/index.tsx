import { h, Component } from 'preact'

import { IGameSummary } from 'common/api/schema/generated/schema'
import GameBox from 'components/GameBox'
import CyclingBackground from 'components/CyclingBackground'

import * as style from './style.css'

type Props = {
  games: IGameSummary[]
  selectedGame: IGameSummary
  onSelectedGameChanged: (newlySelectedGame: IGameSummary) => void
}

class GameList extends Component<Props, {}> {
  renderGameBoxes(
    games: IGameSummary[],
    selectedGame: IGameSummary,
    onSelectedGameChanged: (newlySelectedGame: IGameSummary) => void
  ) {
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
          onSelection={onSelectedGameChanged}
        />
      )
    })
  }

  render({ games, selectedGame, onSelectedGameChanged }: Props) {
    return (
      <div className={style.main}>
        <div className={style.back}>
          <CyclingBackground
            src={
              selectedGame && selectedGame.homeTeamStatus
                ? selectedGame.homeTeamStatus.splashUrl
                : null
            }
            blurred={true}
          />
        </div>
        <div className={style.front}>
          <div className={style.heading} />
          <div className={style.gameBoxes}>
            {this.renderGameBoxes(games, selectedGame, onSelectedGameChanged)}
          </div>
        </div>
      </div>
    )
  }
}

export default GameList
