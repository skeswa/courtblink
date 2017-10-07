import { Logger } from 'util/Logger'

import { TeamColors, NbaColorService } from './types'

// Logger tag for this class.
const tag = 'nba:colors:static'

/** Color service with hard-coded colors mapped to full team names. */
export class StaticallyDefinedNbaColorService implements NbaColorService {
  private logger: Logger

  /**
   * Creates a new `StaticallyDefinedNbaColorService`.
   * @param logger the logging utility to use.
   */
  constructor(logger: Logger) {
    this.logger = logger
  }

  async fetchTeamColor(fullTeamName: string): Promise<TeamColors> {
    this.logger.debug(tag, `Fetching team colors for "${fullTeamName}"`)

    switch (fullTeamName) {
      case 'Atlanta Hawks':
        return { primaryColor: '#E03A3E', secondaryColor: '#C1D32F' }
      case 'Boston Celtics':
        return { primaryColor: '#008348', secondaryColor: '#BB9753' }
      case 'Brisbane Bullets':
        return { primaryColor: '#0000FF', secondaryColor: '#800000' }
      case 'Brooklyn Nets':
        return { primaryColor: '#000000', secondaryColor: '#888888' }
      case 'Charlotte Hornets':
        return { primaryColor: '#1D1160', secondaryColor: '#00788C' }
      case 'Chicago Bulls':
        return { primaryColor: '#CE1141', secondaryColor: '#000000' }
      case 'Cleveland Cavaliers':
        return { primaryColor: '#6F263D', secondaryColor: '#FFB81C' }
      case 'Dallas Mavericks':
        return { primaryColor: '#0053BC', secondaryColor: '#00285E' }
      case 'Denver Nuggets':
        return { primaryColor: '#00285E', secondaryColor: '#FDB927' }
      case 'Detroit Pistons':
        return { primaryColor: '#006BB6', secondaryColor: '#ED174C' }
      case 'Golden State Warriors':
        return { primaryColor: '#006BB6', secondaryColor: '#FDB927' }
      case 'Guangzhou Long-Lions':
        return { primaryColor: '#DF0534', secondaryColor: '#151F42' }
      case 'Houston Rockets':
        return { primaryColor: '#CE1141', secondaryColor: '#C4CED4' }
      case 'Indiana Pacers':
        return { primaryColor: '#002D62', secondaryColor: '#FDBB30' }
      case 'LA Clippers':
        return { primaryColor: '#ED174C', secondaryColor: '#006BB6' }
      case 'Los Angeles Lakers':
        return { primaryColor: '#552583', secondaryColor: '#FDB927' }
      case 'Maccabi Haifa':
        return { primaryColor: '#135C2F', secondaryColor: '#888888' }
      case 'Melbourne United':
        return { primaryColor: '#110F23', secondaryColor: '#888888' }
      case 'Memphis Grizzlies':
        return { primaryColor: '#00285E', secondaryColor: '#6189B9' }
      case 'Miami Heat':
        return { primaryColor: '#98002E', secondaryColor: '#000000' }
      case 'Milwaukee Bucks':
        return { primaryColor: '#00471B', secondaryColor: '#EEE1C6' }
      case 'Minnesota Timberwolves':
        return { primaryColor: '#0C2340', secondaryColor: '#78BE20' }
      case 'New Orleans Pelicans':
        return { primaryColor: '#002B5C', secondaryColor: '#B4975A' }
      case 'New York Knicks':
        return { primaryColor: '#006BB6', secondaryColor: '#F58426' }
      case 'Oklahoma City Thunder':
        return { primaryColor: '#007AC1', secondaryColor: '#EF3B24' }
      case 'Orlando Magic':
        return { primaryColor: '#0077C0', secondaryColor: '#000000' }
      case 'Philadelphia 76ers':
        return { primaryColor: '#ED174C', secondaryColor: '#006BB6' }
      case 'Phoenix Suns':
        return { primaryColor: '#1D1160', secondaryColor: '#E56020' }
      case 'Portland Trail Blazers':
        return { primaryColor: '#E03A3E', secondaryColor: '#000000' }
      case 'Sacramento Kings':
        return { primaryColor: '#5A2B81', secondaryColor: '#63727A' }
      case 'San Antonio Spurs':
        return { primaryColor: '#000000', secondaryColor: '#C4CED4' }
      case 'Shanghai Sharks':
        return { primaryColor: '#0029A4', secondaryColor: '#EB6715' }
      case 'Sydney Kings':
        return { primaryColor: '#5C2F83', secondaryColor: '#FCB926' }
      case 'Toronto Raptors':
        return { primaryColor: '#CE1141', secondaryColor: '#000000' }
      case 'Utah Jazz':
        return { primaryColor: '#002B5C', secondaryColor: '#00471B' }
      case 'Washington Wizards':
        return { primaryColor: '#E31837', secondaryColor: '#002B5C' }
      default:
        throw new Error(`Failed to fetch unknown team "${fullTeamName}"`)
    }
  }
}
