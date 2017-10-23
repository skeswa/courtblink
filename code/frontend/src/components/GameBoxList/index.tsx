import { h, Component } from 'preact'

import { IGameSummary } from 'common/api/schema/generated'
import GameBox from 'components/GameBox'

import * as style from './style.css'

type Props = {
  games: IGameSummary[]
  selectedGame?: IGameSummary
  onSelectedGameChanged: (newlySelectedGame: IGameSummary) => void
}

class GameList extends Component<Props, {}> {
  private renderGameBoxes(
    games: IGameSummary[],
    selectedGame: IGameSummary | undefined,
    onSelectedGameChanged: (newlySelectedGame: IGameSummary) => void
  ): JSX.Element[] {
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

  public render({
    games,
    selectedGame,
    onSelectedGameChanged,
  }: Props): JSX.Element {
    return (
      <div className={style.main}>
        <div className={style.heading} />
        <div className={style.gameBoxes}>
          {this.renderGameBoxes(games, selectedGame, onSelectedGameChanged)}
        </div>
      </div>
    )
  }
}

export default GameList
