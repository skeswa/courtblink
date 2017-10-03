import { BoxScore } from '../schema/box-score'
import { AllPlayerDetails } from '../schema/player-details'
import { Scoreboard } from '../schema/scoreboard'
import { AllTeamDetails } from '../schema/team-details'

export default interface NBAAPIClient {
  fetchAllTeamDetails(date: Date): Promise<AllTeamDetails>
  fetchAllPlayerDetails(date: Date): Promise<AllPlayerDetails>
  fetchScoreboard(date: Date): Promise<Scoreboard>
  fetchBoxScore(date: Date, gameId: string): Promise<BoxScore>
}