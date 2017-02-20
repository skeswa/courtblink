
import LiveGameStats from './live-game-stats'
import GameTeamStatus from './game-team-status'
import { Num, Bool, Text, DTO } from 'services/util/types'

export default DTO({
  id:               Text('1'),
  liveGameStats:    LiveGameStats('2'),
  gameStartTime:    Num('3'),
  gameStartTimeTBD: Bool('4'),
  finished:         Bool('5'),
  notStarted:       Bool('6'),
  homeTeamStatus:   GameTeamStatus('7'),
  awayTeamStatus:   GameTeamStatus('8'),
})
