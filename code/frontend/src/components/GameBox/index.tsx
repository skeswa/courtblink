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
  @bind
  private onSelection(): void {
    if (!this.props.isSelected) {
      this.props.onSelection(this.props.game)
    }
  }

  private renderTeamStatus(
    { tricode, splashPrimaryColor, score }: IGameTeamStatus,
    selected: boolean,
    started: boolean
  ): JSX.Element {
    return (
      <div className={style.teamStatus}>
        <div className={style.teamIcon}>
          <NbaImage type="team" id={tricode} />
        </div>
        <div
          className={style.teamTriCode}
          style={selected ? { color: splashPrimaryColor } : null}>
          {tricode}
        </div>
        {started ? <div className={style.teamScore}>{score}</div> : null}
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
            <div className={style.primaryInfo}>
              {this.renderTeamStatuses(game, isSelected)}
            </div>
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
