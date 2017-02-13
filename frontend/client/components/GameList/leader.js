
import classNames from 'classnames'
import { h, Component } from 'preact'

import style from './leader.css'
import NBAImage from 'components/NBAImage'

class Leader extends Component {
  render({ playerId, statValue, statType }) {
    return (
      <div className={style.main}>
        <div className={style.picture}>
          <NBAImage type="player" id={playerId} />
        </div>
        <div className={style.stat}>
          <div className={style.statValue}>{statValue}</div>
          <div className={style.statType}>{statType}</div>
        </div>
      </div>
    )
  }
}

export default Leader
