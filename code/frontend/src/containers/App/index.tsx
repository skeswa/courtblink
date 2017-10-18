import bind from 'bind-decorator'
import * as classNames from 'classnames'
import * as debug from 'debug'
import { h, Component } from 'preact'

import { ApiClient, createApiClient } from 'api/ApiClient'
import { IGameSummary } from 'common/api/schema/generated/schema'
import Loader from 'components/Loader'
import GameBoxList from 'components/GameBoxList'
import CyclingBackground from 'components/CyclingBackground'

import * as style from './style.css'

type Props = {}

type State = {
  didFailToLoadSplashData: boolean
  games: IGameSummary[]
  isBackgroundLoaded: boolean
  isSplashDataLoading: boolean
  selectedGame?: IGameSummary
}

class App extends Component<Props, State> {
  private apiClient: ApiClient = createApiClient()
  private log: debug.IDebugger = debug('app')
  public state = {
    didFailToLoadSplashData: false,
    games: [] as IGameSummary[],
    isBackgroundLoaded: false,
    isSplashDataLoading: false,
  }

  componentDidMount() {
    this.log('Loading initial splash data')

    // Fetch the initial splash data.
    const rightNow = new Date()
    this.loadSplashData(rightNow)
  }

  /**
   * Loads splash data for the specified date.
   * @param date date for which the splash data is being fetched,
   */
  async loadSplashData(date: Date): Promise<void> {
    // Before we begin, make sure that app state represents that data is in
    // flux.
    this.setState({ didFailToLoadSplashData: false, isSplashDataLoading: true })

    try {
      // Attempt to fetch splash data from the backend.
      const { games } = await this.apiClient.fetchSplashData(date)

      // Update the app state to reflect the loaded splash data.
      this.setState({ games })
    } catch (err) {
      this.log('Failed to load splash data', err)

      // Register in app state that there was an issue loading splash data.
      this.setState({ didFailToLoadSplashData: true })
    } finally {
      // Guarantee that the splash isn't loading anymore.
      this.setState({ isSplashDataLoading: false })
    }
  }

  @bind
  onBackgroundLoaded(): void {
    this.setState({ isBackgroundLoaded: true })
  }

  @bind
  onSelectedGameChanged(newlySelectedGame: IGameSummary): void {
    this.setState({ selectedGame: newlySelectedGame })
  }

  render(
    props: Props,
    { games, isBackgroundLoaded, isSplashDataLoading, selectedGame }: State
  ) {
    const isReady =
      !isSplashDataLoading && games && games.length > 0 && isBackgroundLoaded
    const className = classNames(style.main, { [style.main__ready]: isReady })
    const splashUrl =
      selectedGame && selectedGame.homeTeamStatus
        ? selectedGame.homeTeamStatus.splashUrl
        : null

    return (
      <div className={className}>
        <div className={style.loader}>
          <Loader />
        </div>
        <div className={style.back}>
          <CyclingBackground
            blurred={false}
            onFirstBackgroundLoaded={this.onBackgroundLoaded}
            src={splashUrl}
          />
        </div>
        <div className={style.front}>
          <div className={style.left}>
            <GameBoxList
              games={games}
              onSelectedGameChanged={this.onSelectedGameChanged}
              selectedGame={selectedGame}
            />
          </div>
          <div className={style.right} />
        </div>
      </div>
    )
  }
}

export default App
