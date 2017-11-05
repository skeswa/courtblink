import * as classNames from 'classnames'
import { h } from 'preact'

import * as style from './style.css'

/** Properties of the `WhereToWatch` component. */
type Props = {
  /** National TV channel where you can watch the game. */
  channel?: string
  /** Quarter of the game currently in progress. */
  currentQuarter?: number
  /** True if selected. */
  isSelected?: boolean
  /** Time remaining in the current quarter. */
  timeRemaining?: string
}

export default function LiveGameClock({
  channel,
  currentQuarter,
  timeRemaining,
  isSelected,
}: Props): JSX.Element {
  const className = classNames(style.main, {
    [style.main__selected]: isSelected,
  })

  const isHalftime = currentQuarter === 2 && !timeRemaining
  const isPregame = currentQuarter === 0 && !timeRemaining
  const isFinal = currentQuarter ? currentQuarter >= 4 && !timeRemaining : false

  const shouldShowChannel = !!channel
  const shouldShowClock = !isFinal && !isPregame && !isHalftime
  const shouldShowClockText = !isFinal && (isHalftime || isPregame)

  const clockText = isPregame ? 'Pregame' : isHalftime ? 'Halftime' : undefined
  const statusText = isFinal ? 'Final' : 'In Progress'

  return (
    <div className={className}>
      <div className={style.status}>{statusText}</div>

      {shouldShowClock ? (
        <div className={style.clock}>
          <span className={style.quarter}>{`Q${currentQuarter}`}</span>
          <span>{timeRemaining}</span>
        </div>
      ) : null}

      {shouldShowClockText ? (
        <div className={style.clockText}>{clockText}</div>
      ) : null}

      {shouldShowChannel ? (
        <div className={style.channel}>
          <span className={style.on}>on&nbsp;</span>
          <span className={style.text}>{channel}</span>
        </div>
      ) : null}
    </div>
  )
}
