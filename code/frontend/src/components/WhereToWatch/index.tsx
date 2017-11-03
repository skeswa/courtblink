import * as classNames from 'classnames'
import { h } from 'preact'

import * as style from './style.css'

/** Properties of the `WhereToWatch` component. */
type Props = {
  /** National TV channel where you can watch the game. */
  channel?: string
  /** Time in milliseconds when the game starts. */
  gameStartTime?: number
  /** True if the start time is TBD. */
  isGameStartTimeTbd?: boolean
  /** True if selected. */
  isSelected?: boolean
}

export default function WhereToWatch({
  channel,
  gameStartTime,
  isGameStartTimeTbd,
  isSelected,
}: Props): JSX.Element {
  const className = classNames(style.main, {
    [style.main__selected]: isSelected,
  })

  const startTime =
    !isGameStartTimeTbd && gameStartTime ? formatGameTime(gameStartTime) : 'TBD'

  return (
    <div className={className}>
      <div className={style.startTime}>{startTime}</div>
      {channel ? (
        <div className={style.channel}>
          <span className={style.on}>on&nbsp;</span>
          <span className={style.text}>{channel}</span>
        </div>
      ) : null}
    </div>
  )
}

/**
 * Formats the game start time to look like "8:00 PM".
 * @param gameStartTimeInSeconds how many seconds after the epoch the game
 *     will start.
 * @return a formatted game time string.
 */
function formatGameTime(gameStartTimeInSeconds: number): string {
  // `gameStartTime` is sent over the wire in minutes.
  return new Date(gameStartTimeInSeconds * 60 * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    hour12: true,
    minute: '2-digit',
  })
}
