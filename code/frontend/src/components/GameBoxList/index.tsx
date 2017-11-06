import bind from 'bind-decorator'
import * as classNames from 'classnames'
import { h, Component } from 'preact'

import { IGameSummary } from 'common/api/schema/generated'
import GameBox from 'components/GameBox'
import GameBoxPlaceholder from 'components/GameBoxPlaceholder'

import * as style from './style.css'

// Constants representing the dimensions of each and every game box.
const rem = 10
const collapsedGameBoxHeight = 14 * rem
const expandedGameBoxHeight =
  collapsedGameBoxHeight + /* panel */ (20 + /* border */ 0.1) * rem

/** Properties of the `GameBox` component. */
type Props = {
  /** Games to render as game boxes. */
  games: IGameSummary[]
  /** True if this component should show that data is loading. */
  isLoading: boolean
  /** The currently selected game. */
  selectedGame?: IGameSummary
  /**
   * Callback that gets invoked when the selected game becomes visuall
   * highlighted.
   */
  onSelectedGameHighlighted: (game: IGameSummary) => void
  /** Callback that gets invoked when a game is selected. */
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

  private renderGameBoxPlaceholders(): JSX.Element[] {
    const gameBoxPlaceholders: JSX.Element[] = []

    for (let i = 0; i < 10; i++) {
      gameBoxPlaceholders.push(<GameBoxPlaceholder key={i} />)
    }

    return gameBoxPlaceholders
  }

  private renderGameBoxes(
    games: IGameSummary[],
    selectedIndex: number | undefined,
    onGameFinishedExpanding: (newlySelectedGame: IGameSummary) => void,
    onGameSelected: (newlySelectedGame: IGameSummary) => void
  ): JSX.Element[] {
    return games.map((game, i) => {
      const isAfterSelectedGameBox =
        selectedIndex !== undefined ? i > (selectedIndex || 0) : false
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
    { games, isLoading, onSelectedGameHighlighted, onGameSelected }: Props,
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
    const gameBoxesStyle = !isLoading
      ? {
          maxHeight: totalGameBoxHeight,
          minHeight: totalGameBoxHeight,
        }
      : undefined

    const className = classNames(style.main, {
      [style.main__loading]: isLoading,
    })

    return (
      <div className={className}>
        <div className={style.heading} />
        <div className={style.gameBoxesContainer}>
          <div style={gameBoxesStyle} className={style.gameBoxes}>
            {isLoading
              ? this.renderGameBoxPlaceholders()
              : this.renderGameBoxes(
                  games,
                  selectedIndex,
                  onSelectedGameHighlighted,
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
