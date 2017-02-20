
import classNames from 'classnames'
import { h, Component } from 'preact'

import style from './gamebox.css'
import Leader from './leader'
import NBAImage from 'components/NBAImage'

class GameBox extends Component {
  onSelection() {
    if (!this.props.selected) {
      this.props.onSelection(this.props.game)
    }
  }

  renderRecords(game) {
    return (
      <div className={style.teamRecords}>
      </div>
    )
  }

  renderTeamLeaders({
    primaryColor,
    pointsLeader,
    assistsLeader,
    reboundsLeader,
  }) {
    return (
      <div
        style={{ backgroundColor: primaryColor }}
        className={style.teamLeaders}>
        <Leader
          statType="PTS"
          playerId={pointsLeader.id}
          statValue={pointsLeader.statValue} />
        <Leader
          statType="REB"
          playerId={reboundsLeader.id}
          statValue={reboundsLeader.statValue} />
        <Leader
          statType="AST"
          playerId={assistsLeader.id}
          statValue={assistsLeader.statValue} />
      </div>
    )
  }

  renderLeaders({ homeTeamStatus, awayTeamStatus }) {
    return (
      <div className={style.gameLeaders}>
        {this.renderTeamLeaders(awayTeamStatus)}
        {this.renderTeamLeaders(homeTeamStatus)}
      </div>
    )
  }

  renderTeamStatus({ triCode, primaryColor, score }, selected, started) {
    return (
      <div className={style.teamStatus}>
        <div className={style.teamIcon}>
          <NBAImage type="team" id={triCode} />
        </div>
        <div
          className={style.teamTriCode}
          style={selected ? { color: primaryColor } : null}>
          {triCode}
        </div>
        {
          started
            ? <div className={style.teamScore}>{score}</div>
            : null
        }
      </div>
    )
  }

  renderTeamStatuses({ homeTeamStatus, awayTeamStatus, notStarted }, selected) {
    return (
      <div className={style.teamStatuses}>
        {this.renderTeamStatus(awayTeamStatus, selected, !notStarted)}
        {this.renderTeamStatus(homeTeamStatus, selected, !notStarted)}
      </div>
    )
  }

  render({ game, selected, displaced }) {
    const className = classNames(
      style.main,
      {
        [style.main__selected]: selected,
        [style.main__displaced]: displaced,
      })

    // TODO(skeswa): handle when the game hasnt started yet.
    return (
      <div className={className} onClick={::this.onSelection}>
        <div className={style.gameInfo}>
          <div className={style.primaryGameInfo}>
            {this.renderTeamStatuses(game, selected)}
          </div>
          <div className={style.secondaryGameInfo}>
            {
              game.notStarted
                ? this.renderRecords(game)
                : this.renderLeaders(game)
            }
          </div>
        </div>
      </div>
    )
  }
}

export default GameBox
