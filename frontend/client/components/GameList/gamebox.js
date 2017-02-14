
import classNames from 'classnames'
import { h, Component } from 'preact'

import style from './gamebox.css'
import Leader from './leader'
import NBAImage from 'components/NBAImage'
import { extractLocalTeamName } from 'util'

class GameBox extends Component {
  onSelection() {
    if (!this.props.selected) {
      this.props.onSelection(this.props.game)
    }
  }

  renderLeaders(game) {
    return (
      <div className={style.gameLeaders}>
        <div
          style={{ backgroundColor: game.awayTeamSplashPrimaryColor }}
          className={style.teamLeaders}>
          <Leader
            statType="PTS"
            playerId={game.awayTeamPointsLeader.id}
            statValue={game.awayTeamPointsLeader.statValue} />
          <Leader
            statType="REB"
            playerId={game.awayTeamReboundsLeader.id}
            statValue={game.awayTeamReboundsLeader.statValue} />
          <Leader
            statType="AST"
            playerId={game.awayTeamAssistsLeader.id}
            statValue={game.awayTeamAssistsLeader.statValue} />
        </div>
        <div
          style={{ backgroundColor: game.homeTeamSplashPrimaryColor }}
          className={style.teamLeaders}>
          <Leader
            statType="PTS"
            playerId={game.homeTeamPointsLeader.id}
            statValue={game.homeTeamPointsLeader.statValue} />
          <Leader
            statType="REB"
            playerId={game.homeTeamReboundsLeader.id}
            statValue={game.homeTeamReboundsLeader.statValue} />
          <Leader
            statType="AST"
            playerId={game.homeTeamAssistsLeader.id}
            statValue={game.homeTeamAssistsLeader.statValue} />
        </div>
      </div>
    )
  }

  renderTeamStatus(triCode, color, score, selected, started) {
    return (
      <div className={style.teamStatus}>
        <div className={style.teamIcon}>
          <NBAImage type="team" id={triCode} />
        </div>
        <div
          className={style.teamTriCode}
          style={selected ? { color } : null}>
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

  renderTeamStatuses(game, selected) {
    return (
      <div className={style.teamStatuses}>
        {
          this.renderTeamStatus(
            game.awayTeamTriCode,
            game.awayTeamSplashPrimaryColor,
            game.awayTeamScore,
            selected,
            !game.notStarted)
        }
        {
          this.renderTeamStatus(
            game.homeTeamTriCode,
            game.homeTeamSplashPrimaryColor,
            game.homeTeamScore,
            selected,
            !game.notStarted)
        }
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
              !game.notStarted
                ? this.renderLeaders(game)
                : null
            }
          </div>
        </div>
      </div>
    )
  }
}

export default GameBox
