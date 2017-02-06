
import classNames from 'classnames'
import { h, Component } from 'preact'

import style from './style.css'
import TeamIcon from 'components/TeamIcon'
import { periodToString, gameStartTimeToString } from 'util'

class GameCard extends Component {
  onClick() {
    const { index, onClick } = this.props

    if (onClick) onClick(index)
  }

  renderGameMatchup(game) {
    return (
      <div className={style.gameMatchup}>
        {`${game.awayTeamTriCode} at ${game.homeTeamTriCode}`}
      </div>
    )
  }

  renderTeamScore(game, isHome) {
    const score = isHome ? game.homeTeamScore : game.awayTeamScore
    const triCode = isHome ? game.homeTeamTriCode : game.awayTeamTriCode

    return (
      <div className={style.teamScore}>
        <div className={style.teamScoreTriCode}>{triCode}</div>
        <div className={style.teamScoreNumber}>{score}</div>
      </div>
    )
  }

  renderTBDGameInfo(game) {
    return (
      <div className={style.gameInfo}>
        TBD
      </div>
    )
  }

  renderFinishedGameInfo(game) {
    return (
      <div className={style.gameInfo}>
        {this.renderTeamScore(game, true)}
        <div className={style.gameStatus}>
          <div className={style.gameFinal}>FINAL</div>
          {this.renderGameMatchup(game)}
        </div>
        {this.renderTeamScore(game, false)}
      </div>
    )
  }

  renderInProgressGameInfo(game) {
    return (
      <div className={style.gameInfo}>
        {this.renderTeamScore(game, true)}
        <div className={style.gameStatus}>
          <div className={style.gamePeriod}>
            {periodToString(game.liveGameStats.period)}
          </div>
          <div className={style.gameClock}>
            {game.liveGameStats.timeRemaining}
          </div>
        </div>
        {this.renderTeamScore(game, false)}
      </div>
    )
  }

  renderFutureGameInfo(game) {
    return (
      <div className={style.gameInfo}>
        {this.renderTeamScore(game, true)}
        <div className={style.gameStatus}>
          <div className={style.gameStartTime}>
            {gameStartTimeToString(game.startTime)}
          </div>
          {this.renderGameMatchup(game)}
        </div>
        {this.renderTeamScore(game, false)}
      </div>
    )
  }

  renderGameInfo(game) {
    return game.startTimeTBD
      ? this.renderTBDGameInfo(game)
      : game.finished
        ? this.renderFinishedGameInfo(game)
        : game.startTime && (game.startTime < Date.now())
          ? this.renderInProgressGameInfo(game)
          : this.renderFutureGameInfo(game)
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
          {this.renderGameInfo(game)}
          {this.renderTeamInfo(game, false)}
        </div>
      </div>
    )
  }
}

export default GameCard
