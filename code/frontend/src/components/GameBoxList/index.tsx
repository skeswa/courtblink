import bind from 'bind-decorator'
import { h, Component } from 'preact'

import { IGameSummary } from 'common/api/schema/generated'
import GameBox from 'components/GameBox'

import * as style from './style.css'

const rem = 10
const collapsedGameBoxHeight = 12.5 * rem
const expandedGameBoxHeight = (12.5 + 20) * rem

type Props = {
  games: IGameSummary[]
  selectedGame?: IGameSummary
  onCurrentlyViewedGameChanged: (game: IGameSummary) => void
  onGameSelected: (game: IGameSummary) => void
}

type State = {
  gameIdToIndex?: Map<string, number>
  selectedIndex?: number
}

class GameList extends Component<Props, State> {
  public state: State = {}

  public componentWillReceiveProps(nextProps: Props): void {
    let stateDiffs: Pick<State, keyof State> | undefined
    let updatedGameIdToIndex: Map<string, number> | undefined

    // Check to see if the games changed.
    if (nextProps.games && nextProps.games !== this.props.games) {
      updatedGameIdToIndex = new Map(
        nextProps.games.map((game, i) => [game.id, i] as [string, number])
      )

      // Update the state diffs.
      stateDiffs = { gameIdToIndex: updatedGameIdToIndex }
    }

    // Get the latest `gameIdToIndex` map.
    const gameIdToIndex = updatedGameIdToIndex || this.state.gameIdToIndex

    // Check to see if the selected game changed.
    if (
      nextProps.selectedGame &&
      nextProps.selectedGame.id &&
      nextProps.selectedGame !== this.props.selectedGame &&
      gameIdToIndex
    ) {
      const selectedIndex = gameIdToIndex.get(nextProps.selectedGame.id)

      // Make sure that state diffs is defined before the next statement.
      if (!stateDiffs) {
        stateDiffs = {}
      }

      stateDiffs.selectedIndex = selectedIndex
    }

    // If there are state diffs, change state.
    if (stateDiffs) {
      this.setState(stateDiffs)
    }
  }

  private renderGameBoxes(
    games: IGameSummary[],
    selectedIndex: number | undefined,
    onGameFinishedExpanding: (newlySelectedGame: IGameSummary) => void,
    onGameSelected: (newlySelectedGame: IGameSummary) => void
  ): JSX.Element[] {
    return games.map((game, i) => {
      const isAfterSelectedGameBox = i > (selectedIndex || 0)
      const isSelected = i === selectedIndex
      const verticalDisplacementOffset = isAfterSelectedGameBox ? 1 : 0
      const verticalDisplacementUnits = verticalDisplacementOffset - i

      return (
        <GameBox
          game={game}
          isSelected={isSelected}
          key={game.id}
          onFinishedExpanding={onGameFinishedExpanding}
          onSelect={onGameSelected}
          verticalDisplacementUnits={verticalDisplacementUnits}
        />
      )
    })
  }

  public render(
    { games, onCurrentlyViewedGameChanged, onGameSelected }: Props,
    { selectedIndex }: State
  ): JSX.Element {
    // Requisite variables for calculating CSS styling.
    const numberOfCollapsedGameBoxes = games.length > 1 ? games.length - 1 : 0
    const numberOfExpandedGameBoxes = games.length > 0 ? 1 : 0
    const totalGameBoxHeight =
      numberOfCollapsedGameBoxes * collapsedGameBoxHeight +
      numberOfExpandedGameBoxes * expandedGameBoxHeight

    // Make sure that the game boxes div remains exactly as tall as it needs to
    // be.
    const gameBoxesStyle = {
      maxHeight: totalGameBoxHeight,
      minHeight: totalGameBoxHeight,
    }

    return (
      <div className={style.main}>
        <div className={style.heading} />
        <div className={style.gameBoxesContainer}>
          <div style={gameBoxesStyle} className={style.gameBoxes}>
            {this.renderGameBoxes(
              games,
              selectedIndex,
              onCurrentlyViewedGameChanged,
              onGameSelected
            )}
          </div>
          <div className={style.footer} />
        </div>
      </div>
    )
  }
}

export default GameList
