import { h, Component } from 'preact'

import { IGameSummary, IGameTeamStatus } from 'common/api/schema/generated'

import * as style from './style.css'

type Props = {
  game: IGameSummary
}

type State = {}

class PregameInfo extends Component<Props, State> {
  /**
   * Turns `1`, `2`, `3` into `"1st"`, `"2nd"`, `"3rd"` respectively.
   * @param n number to ordinalize.
   * @return ordinal of the provided number.
   */
  private ordinalOf(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'],
      v = n % 100
    return s[(v - 20) % 10] || s[v] || s[0]
  }

  public renderNumberWithOrdinal(num: number) {
    if (num === undefined || num === null) {
      return null
    }

    return (
      <div className={style.numberWithOrdinal}>
        <div>{num.toLocaleString()}</div>
        <div className={style.ordinal}>{this.ordinalOf(num)}</div>
      </div>
    )
  }

  public renderTeamInfo({
    defensiveRank,
    defensiveRating,
    offensiveRank,
    offensiveRating,
    overallRank,
    splashPrimaryColor,
    tricode,
  }: IGameTeamStatus): JSX.Element {
    const textStyle = {
      color: splashPrimaryColor,
    }

    const formattedDefensiveRank = defensiveRank
      ? this.renderNumberWithOrdinal(defensiveRank)
      : undefined
    const formattedOffensiveRank = offensiveRank
      ? this.renderNumberWithOrdinal(offensiveRank)
      : undefined
    const formattedOverallRank = overallRank
      ? this.renderNumberWithOrdinal(overallRank)
      : undefined

    return (
      <div className={style.teamInfo}>
        <div className={style.triCode}>{tricode}</div>
        <div className={style.ratings}>
          <div className={style.rating}>
            <div style={textStyle} className={style.value}>
              {formattedOverallRank}
            </div>
            <div className={style.label}>Overall</div>
          </div>
          <div className={style.rating}>
            <div className={style.numbers}>
              <div style={textStyle} className={style.value}>
                {formattedOffensiveRank}
              </div>
            </div>
            <div className={style.label}>Offense</div>
          </div>
          <div className={style.rating}>
            <div className={style.numbers}>
              <div style={textStyle} className={style.value}>
                {formattedDefensiveRank}
              </div>
            </div>
            <div className={style.label}>Defense</div>
          </div>
        </div>
      </div>
    )
  }

  public render({
    game: { homeTeamStatus, awayTeamStatus },
  }: Props): JSX.Element {
    return (
      <div className={style.main}>
        <div className={style.top}>
          {awayTeamStatus ? this.renderTeamInfo(awayTeamStatus) : null}
        </div>
        <div className={style.middle}>
          <div className={style.separator} />
          <div className={style.vs}>VS</div>
          <div className={style.separator} />
        </div>
        <div className={style.bottom}>
          {homeTeamStatus ? this.renderTeamInfo(homeTeamStatus) : null}
        </div>
      </div>
    )
  }
}

export default PregameInfo
