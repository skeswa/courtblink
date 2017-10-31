import bind from 'bind-decorator'
import * as classNames from 'classnames'
import { h, Component } from 'preact'

import {
  IGameLeader,
  IGameTeamStatus,
  IGameSummary,
} from 'common/api/schema/generated'
import GameLeaders from 'components/GameLeaders'
import NbaImage from 'components/NbaImage'
import PregameInfo from 'components/PregameInfo'
import { setStateAndWait, setTimeoutAndWait } from 'util/asyncUI'

import * as style from './style.css'

// Height of the bottom section of the game box.
const rem = 10
const bottomSectionHeight = 20 * rem

// How long to wait before starting the fade animation.
const fadeAnimationDelay = 100

// How long it takes for the fade animation to finish.
const fadeAnimationDuration = 250

// How long it takes for the resize animation to finish.
const resizeAnimationDuration = 250

/** Properties of the `GameBox` component. */
type Props = {
  /** The game that this game box represents. */
  game: IGameSummary
  /** True if this game box is currently selected. */
  isSelected: boolean
  /** Callback that gets invoked when this game box is selected. */
  onSelect: (game: IGameSummary) => void
  /** Callback that gets invoked when this game box finished expanding. */
  onFinishedExpanding: (game: IGameSummary) => void
  /** How many game box heights this game box is vertically displaced. */
  verticalDisplacementUnits: number
}

/** Internal state of the `GameBox` component. */
type State = {
  /** True if this game box should appear expanded. */
  isExpanded: boolean
}

/**
 * Represents one game in the game box list on the left-hand side of the
 * screen.
 */
class GameBox extends Component<Props, State> {
  /** True if this instance of `GameBox` is currently mounted. */
  private isMounted: boolean = false
  /** Internal state of this component. */
  public state: State = { isExpanded: false }

  public componentDidMount() {
    this.isMounted = true
  }

  public componentWillMount() {
    // Check to see if this game box is starting out selected. If so, it should
    // also be expanded.
    if (this.props.isSelected) {
      this.setState({ isExpanded: true })
    }
  }

  public async componentWillReceiveProps(nextProps: Props): Promise<void> {
    if (!this.props.isSelected && nextProps.isSelected) {
      return this.expand()
    } else if (this.props.isSelected && !nextProps.isSelected) {
      return this.collapse()
    }
  }

  public componentWillUnmount() {
    this.isMounted = false
  }

  /** Collapses this game box. */
  private async collapse(): Promise<void> {
    await setStateAndWait(this, { isExpanded: false })
  }

  /** Expands this game box. */
  private async expand(): Promise<void> {
    // Wait for the expansion animation to finish.
    await setTimeoutAndWait(resizeAnimationDuration + fadeAnimationDelay)

    // Check to see if this game box is still selected. If not, there is
    // nothing left to do.
    if (!this.isMounted || !this.props.isSelected) return

    // Mark this game box as expanded.
    await setStateAndWait(this, { isExpanded: true })

    // Check to see if this game box is still selected AND still expanded.
    // If not, there is nothing left to do.
    if (!this.isMounted || !this.props.isSelected || !this.state.isExpanded) {
      return
    }

    // Wait for the fade animation to finish.
    await setTimeoutAndWait(fadeAnimationDuration)

    // Check to see if this game box is still selected AND still expanded.
    // If not, there is nothing left to do.
    if (!this.isMounted || !this.props.isSelected || !this.state.isExpanded) {
      return
    }

    // Fire the the expansion callback.
    if (this.props.onFinishedExpanding) {
      this.props.onFinishedExpanding(this.props.game)
    }
  }

  /**
   * Formats the game start time to look like "8:00 PM".
   * @param gameStartTimeInSeconds how many seconds after the epoch the game
   *     will start.
   * @return a formatted game time string.
   */
  private formatGameTime(gameStartTimeInSeconds: number): string {
    // `gameStartTime` is sent over the wire in minutes.
    return new Date(gameStartTimeInSeconds * 60 * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      hour12: true,
      minute: '2-digit',
    })
  }

  @bind
  private onSelection(): void {
    // Only unselected game boxes can be selected.
    if (this.props.isSelected) return

    // Fire the selection callback.
    this.props.onSelect(this.props.game)
  }

  /**
   * Renders the status for a team.
   * @param gameTeamStatus game status to render.
   * @param isLive true if this game is currently happening.
   * @param isSelected true if this game box is selected.
   */
  private renderTeamStatus(
    { losses, score, splashPrimaryColor, tricode, wins }: IGameTeamStatus,
    isSelected: boolean,
    isStarted: boolean
  ): JSX.Element {
    return (
      <div className={style.teamStatus}>
        <div className={style.icon}>
          <NbaImage type="team" id={tricode} />
        </div>
        <div className={style.info}>
          <div
            className={style.triCode}
            style={isSelected ? { color: splashPrimaryColor } : null}>
            {tricode}
          </div>

          {isStarted ? (
            <div className={style.score}>{score}</div>
          ) : (
            <div className={style.record}>
              <span>{wins}</span>
              <span className={style.dash}>-</span>
              <span>{losses}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  /**
   * Renders the statuses for both teams.
   * @param game game that this game box represents.
   * @param isSelected true if this game box is selected.
   */
  private renderTeamStatuses(
    { awayTeamStatus, finished, homeTeamStatus, notStarted }: IGameSummary,
    isSelected: boolean
  ): JSX.Element {
    return (
      <div className={style.teamStatuses}>
        {awayTeamStatus
          ? this.renderTeamStatus(awayTeamStatus, isSelected, !notStarted)
          : null}
        {homeTeamStatus
          ? this.renderTeamStatus(homeTeamStatus, isSelected, !notStarted)
          : null}
      </div>
    )
  }

  /**
   * Renders information about when & where a game can be watched.
   * @param game game that this game box represents.
   */
  private renderWhereToWatch({
    gameStartTime,
    gameStartTimeTbd,
    liveGameStats,
  }: IGameSummary): JSX.Element {
    const startTime =
      !gameStartTimeTbd && gameStartTime
        ? this.formatGameTime(gameStartTime)
        : 'TBD'

    return (
      <div className={style.w2w}>
        <div className={style.startTime}>{startTime}</div>
        {liveGameStats && liveGameStats.channel ? (
          <div className={style.channel}>
            <span className={style.on}>on&nbsp;</span>
            <span className={style.text}>{liveGameStats.channel}</span>
          </div>
        ) : null}
      </div>
    )
  }

  public render(
    { game, isSelected, verticalDisplacementUnits }: Props,
    { isExpanded }: State
  ): JSX.Element {
    const verticalDisplacement = verticalDisplacementUnits * bottomSectionHeight

    const className = classNames(style.main, {
      [style.main__expanded]: isExpanded && isSelected,
      [style.main__selected]: isSelected,
    })
    const gameBoxStyle = {
      transform: `translateY(${verticalDisplacement}px)`,
    }

    return (
      <div
        style={gameBoxStyle}
        className={className}
        onClick={this.onSelection}>
        <div className={style.top}>
          <div className={style.back} />
          <div className={style.front}>
            {this.renderTeamStatuses(game, isSelected)}
            {game.notStarted ? this.renderWhereToWatch(game) : null}
          </div>
        </div>
        <div className={style.bottomClippingMask}>
          <div className={style.bottom}>
            <div className={style.back} />
            <div className={style.front}>
              {game.notStarted ? (
                <PregameInfo game={game} />
              ) : (
                <GameLeaders game={game} />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default GameBox
