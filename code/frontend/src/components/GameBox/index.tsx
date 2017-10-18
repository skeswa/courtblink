import bind from 'bind-decorator'
import * as classNames from 'classnames'
import { h, Component } from 'preact'

import {
  IGameLeader,
  IGameTeamStatus,
  IGameSummary,
} from 'common/api/schema/generated/schema'
import LeaderPortrait from 'components/LeaderPortrait'
import NbaImage from 'components/NbaImage'

import * as style from './style.css'

type Props = {
  displaced: boolean
  game: IGameSummary
  onSelection: (game: IGameSummary) => void
  selected: boolean
}

class GameBox extends Component<Props, {}> {
  @bind
  onSelection(): void {
    if (!this.props.selected) {
      this.props.onSelection(this.props.game)
    }
  }

  renderRecords(game: IGameSummary): JSX.Element {
    return <div className={style.teamRecords} />
  }

  renderTeamLeaders({
    splashPrimaryColor,
    pointsLeader,
    assistsLeader,
    reboundsLeader,
  }: IGameTeamStatus): JSX.Element {
    return (
      <div
        style={{ backgroundColor: splashPrimaryColor }}
        className={style.teamLeaders}>
        <LeaderPortrait
          statType="PTS"
          playerId={pointsLeader.id}
          statValue={pointsLeader.statValue}
        />
        <LeaderPortrait
          statType="REB"
          playerId={reboundsLeader.id}
          statValue={reboundsLeader.statValue}
        />
        <LeaderPortrait
          statType="AST"
          playerId={assistsLeader.id}
          statValue={assistsLeader.statValue}
        />
      </div>
    )
  }

  renderLeaders({ homeTeamStatus, awayTeamStatus }: IGameSummary): JSX.Element {
    return (
      <div className={style.gameLeaders}>
        {this.renderTeamLeaders(awayTeamStatus)}
        {this.renderTeamLeaders(homeTeamStatus)}
      </div>
    )
  }

  renderTeamStatus(
    { tricode, splashPrimaryColor, score }: IGameTeamStatus,
    selected: boolean,
    started: boolean
  ) {
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

  renderTeamStatuses(
    { homeTeamStatus, awayTeamStatus, notStarted }: IGameSummary,
    selected: boolean
  ) {
    return (
      <div className={style.teamStatuses}>
        {this.renderTeamStatus(awayTeamStatus, selected, !notStarted)}
        {this.renderTeamStatus(homeTeamStatus, selected, !notStarted)}
      </div>
    )
  }

  render({ game, selected, displaced }: Props) {
    const className = classNames(style.main, {
      [style.main__selected]: selected,
      [style.main__displaced]: displaced,
    })

    // TODO(skeswa): handle when the game hasnt started yet.
    return (
      <div className={className} onClick={this.onSelection}>
        <div className={style.gameInfo}>
          <div className={style.primaryGameInfo}>
            {this.renderTeamStatuses(game, selected)}
          </div>
          <div className={style.secondaryGameInfo}>
            {game.notStarted
              ? this.renderRecords(game)
              : this.renderLeaders(game)}
          </div>
        </div>
      </div>
    )
  }
}

export default GameBox
