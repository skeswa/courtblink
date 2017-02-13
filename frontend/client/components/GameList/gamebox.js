
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
        <div className={style.teamLeaders} style={{ backgroundColor: game.awayTeamSplashPrimaryColor }}>
          <Leader playerId={game.awayTeamPointsLeader.id} statType="PTS" statValue={game.awayTeamPointsLeader.statValue} />
          <Leader playerId={game.awayTeamReboundsLeader.id} statType="REB" statValue={game.awayTeamReboundsLeader.statValue} />
          <Leader playerId={game.awayTeamAssistsLeader.id} statType="AST" statValue={game.awayTeamAssistsLeader.statValue} />
        </div>
        <div className={style.teamLeaders} style={{ backgroundColor: game.homeTeamSplashPrimaryColor }}>
          <Leader playerId={game.homeTeamPointsLeader.id} statType="PTS" statValue={game.homeTeamPointsLeader.statValue} />
          <Leader playerId={game.homeTeamReboundsLeader.id} statType="REB" statValue={game.homeTeamReboundsLeader.statValue} />
          <Leader playerId={game.homeTeamAssistsLeader.id} statType="AST" statValue={game.homeTeamAssistsLeader.statValue} />
        </div>
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
            <div className={style.teamStatuses}>
              <div className={style.teamStatus}>
                <div className={style.teamIcon}>
                  <NBAImage type="team" id={game.awayTeamTriCode} />
                </div>
                <div
                  className={style.teamTriCode}
                  style={
                    selected
                      ? { color: game.awayTeamSplashPrimaryColor }
                      : null
                  }>
                  {game.awayTeamTriCode}
                </div>
                <div className={style.teamScore}>{game.awayTeamScore}</div>
              </div>
              <div className={style.teamStatus}>
                <div className={style.teamIcon}>
                  <NBAImage type="team" id={game.homeTeamTriCode} />
                </div>
                <div
                  className={style.teamTriCode}
                  style={
                    selected
                      ? { color: game.homeTeamSplashPrimaryColor }
                      : null
                  }>
                  {game.homeTeamTriCode}
                </div>
                <div className={style.teamScore}>{game.homeTeamScore}</div>
              </div>
            </div>
          </div>
          <div className={style.secondaryGameInfo}>
            {
              !(game.notStarted)
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
