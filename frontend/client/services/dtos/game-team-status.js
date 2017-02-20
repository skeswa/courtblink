
import GameLeader from './game-leader'
import { Num, Text, DTO } from 'services/util/types'

export default DTO({
  wins:           Num('1'),
  score:          Num('2'),
  losses:         Num('3'),
  teamId:         Text('4'),
  triCode:        Text('5'),
  name:           Text('6'),
  city:           Text('7'),
  splashUrl:      Text('8'),
  primaryColor:   Text('9'),
  secondaryColor: Text('10'),
  pointsLeader:   GameLeader('11'),
  assistsLeader:  GameLeader('12'),
  reboundsLeader: GameLeader('13'),
})
