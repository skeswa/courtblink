import { h, Component } from 'preact'

import { IGameSummary, IGameTeamStatus } from 'common/api/schema/generated'
import LeaderPortrait from 'components/LeaderPortrait'
import NbaImage from 'components/NbaImage'

import * as style from './style.css'

type Props = {
  game: IGameSummary
}

type State = {}

class GameLeaders extends Component<Props, State> {
  private renderTeamLeaders({
    splashPrimaryColor,
    pointsLeader,
    assistsLeader,
    reboundsLeader,
  }: IGameTeamStatus): JSX.Element {
    return (
      <div
        style={{ backgroundColor: splashPrimaryColor }}
        className={style.teamLeaders}>
        {pointsLeader ? (
          <LeaderPortrait
            statType="PTS"
            playerId={pointsLeader.id}
            statValue={pointsLeader.statValue}
          />
        ) : null}
        {reboundsLeader ? (
          <LeaderPortrait
            statType="REB"
            playerId={reboundsLeader.id}
            statValue={reboundsLeader.statValue}
          />
        ) : null}
        {assistsLeader ? (
          <LeaderPortrait
            statType="AST"
            playerId={assistsLeader.id}
            statValue={assistsLeader.statValue}
          />
        ) : null}
      </div>
    )
  }

  public render({
    game: { homeTeamStatus, awayTeamStatus },
  }: Props): JSX.Element {
    return (
      <div className={style.main}>
        {awayTeamStatus ? this.renderTeamLeaders(awayTeamStatus) : null}
        {homeTeamStatus ? this.renderTeamLeaders(homeTeamStatus) : null}
      </div>
    )
  }
}

export default GameLeaders
