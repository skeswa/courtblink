import { h } from 'preact'

import * as style from './style.css'

export default function GameBoxPlaceholder(props: { key: number }) {
  return (
    <div className={style.main}>
      <div className={style.statuses}>
        <div className={style.status}>
          <div className={style.logo} />
          <div className={style.triCode} />
          <div className={style.score} />
        </div>
        <div className={style.status}>
          <div className={style.logo} />
          <div className={style.triCode} />
          <div className={style.score} />
        </div>
      </div>
      <div className={style.clock}>
      <div className={style.time} />
      <div className={style.channel} />
      </div>
    </div>
  )
}
