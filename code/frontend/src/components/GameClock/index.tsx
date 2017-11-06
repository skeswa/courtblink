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
  /** Tricode of the team that won. */
  winnerTriCode?: string
}


export default function GameClock({
  channel,
  currentQuarter,
  timeRemaining,
  isSelected,
  winnerTriCode,
}: Props): JSX.Element {

  const isHalftime = currentQuarter === 2 && !timeRemaining
  const isFinished = !!winnerTriCode
  const isPregame = currentQuarter === 0 && !timeRemaining
  const shouldShowChannel = !isFinished && !!channel
  const shouldShowClock = !isFinished && !isPregame && !isHalftime
  const shouldShowClockText = isFinished || isHalftime || isPregame

  const clockText = isPregame
    ? 'Pregame'
    : isHalftime ? 'Halftime' : isFinished ? `${winnerTriCode} wins` : undefined
  const statusText = isFinished ? 'Finished' : 'In Progress'

  const className = classNames(style.main, {
    [style.main__selected]: isSelected,
    [style.main__live]: !isFinished,
  })

  return (
    <div className={className}>
      {shouldShowClock ? (
        <div className={style.clock}>
          <span className={style.quarter}>{`Q${currentQuarter}`}</span>
          <span>{timeRemaining}</span>
        </div>
      ) : null}

      {shouldShowClockText ? (
        <div className={style.clockText}>{clockText}</div>
      ) : null}

      <div className={style.status}>{statusText}</div>
    </div>
  )
}
