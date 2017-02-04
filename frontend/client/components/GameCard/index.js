
import classNames from 'classnames'
import { h, Component } from 'preact'

import style from './style.css'
import TeamIcon from 'components/TeamIcon'

class GameCard extends Component {
  onClick() {
    const { index, onClick } = this.props

    if (onClick) onClick(index)
  }

  renderTeamInfo(game, isHome) {
    const wins = isHome ? game.homeTeamWins : game.awayTeamWins
    const losses = isHome ? game.homeTeamLosses : game.awayTeamLosses
    const triCode = isHome ? game.homeTeamTriCode : game.awayTeamTriCode

    return (
      <div className={style.teamInfo}>
        <TeamIcon triCode={triCode} />
        <div className={style.teamRecord}>
          <span className={style.teamRecordPart}>
            <span className={style.teamRecordNumber}>{wins}</span>
            <span className={style.teamRecordLabel}>W</span>
          </span>
          <span className={style.teamRecordPart}>
            <span className={style.teamRecordNumber}>{losses}</span>
            <span className={style.teamRecordLabel}>L</span>
          </span>
        </div>
      </div>
    )
  }

  render({ game, selected, offsetLeft, offsetRight }) {
    console.log('game', game)

    const mainClassName = classNames(style.main, {
      [style.main__selected]: selected,
      [style.main__offsetLeft]: offsetLeft,
      [style.main__offsetRight]: offsetRight,
    })

    return (
      <div className={mainClassName} onClick={::this.onClick}>
        <div className={style.top}>{game.liveGameStats.channel}</div>
        <div className={style.bottom}>
          {this.renderTeamInfo(game, true)}
          {this.renderTeamInfo(game, false)}
        </div>
      </div>
    )
  }
}

export default GameCard
