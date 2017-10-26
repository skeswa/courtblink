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

import * as style from './style.css'

const rem = 10
const bottomSectionHeight = 20 * rem

type Props = {
  game: IGameSummary
  index: number
  isSelected: boolean
  onSelection: (game: IGameSummary) => void
  verticalDisplacementUnits: number
}

type State = {}

class GameBox extends Component<Props, State> {
  private formatGameTime(gameStartTime: number): string {
    // `gameStartTime` is sent over the wire in minutes.
    const gameStartDate = new Date(gameStartTime * 60 * 1000)
    return gameStartDate.toLocaleTimeString([], {
      hour: '2-digit',
      hour12: true,
      minute: '2-digit',
    })
  }

  @bind
  private onSelection(): void {
    if (!this.props.isSelected) {
      this.props.onSelection(this.props.game)
    }
  }

  private renderTeamStatus(
    { losses, score, splashPrimaryColor, tricode, wins }: IGameTeamStatus,
    selected: boolean,
    started: boolean
  ): JSX.Element {
    return (
      <div className={style.teamStatus}>
        <div className={style.icon}>
          <NbaImage type="team" id={tricode} />
        </div>
        <div className={style.info}>
          <div
            className={style.triCode}
            style={selected ? { color: splashPrimaryColor } : null}>
            {tricode}
          </div>

          {started ? (
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

  private renderTeamStatuses(
    { homeTeamStatus, awayTeamStatus, notStarted }: IGameSummary,
    selected: boolean
  ): JSX.Element {
    return (
      <div className={style.teamStatuses}>
        {awayTeamStatus
          ? this.renderTeamStatus(awayTeamStatus, selected, !notStarted)
          : null}
        {homeTeamStatus
          ? this.renderTeamStatus(homeTeamStatus, selected, !notStarted)
          : null}
      </div>
    )
  }

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

  public render({
    game,
    isSelected,
    verticalDisplacementUnits,
  }: Props): JSX.Element {
    const className = isSelected
      ? `${style.main} ${style.main__selected}`
      : style.main

    // TODO(skeswa): handle when the game hasnt started yet.
    return (
      <div
        style={{
          transform: `translateY(${verticalDisplacementUnits *
            bottomSectionHeight}px)`,
        }}
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
