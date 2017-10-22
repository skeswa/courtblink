import * as classNames from 'classnames'
import { h, Component } from 'preact'

import * as style from './style.css'
import NbaImage from 'components/NbaImage'

type Props = {
  playerId?: string
  statValue?: string
  statType?: string
}

class LeaderPortrait extends Component<Props, {}> {
  render({ playerId, statValue, statType }: Props) {
    return (
      <div className={style.main}>
        <div className={style.picture}>
          <NbaImage type="player" id={playerId} />
        </div>
        <div className={style.stat}>
          <div className={style.statValue}>{statValue}</div>
          <div className={style.statType}>{statType}</div>
        </div>
      </div>
    )
  }
}

export default LeaderPortrait
