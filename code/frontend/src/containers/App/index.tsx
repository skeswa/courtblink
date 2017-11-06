import bind from 'bind-decorator'
import * as classNames from 'classnames'
import * as debug from 'debug'
import { h, Component } from 'preact'

import { ApiClient, createApiClient } from 'network/ApiClient'
import { IGameSummary } from 'common/api/schema/generated'
import GameBoxList from 'components/GameBoxList'
import CyclingBackground from 'components/CyclingBackground'

import * as style from './style.css'

// How long to wait before the initially highlighted game box appears to be
// selected.
const gameBoxSelectionDelay = 400 /* ms */

type Props = {}

type State = {
  highlightedGame?: IGameSummary
  didFailToLoadSplashData: boolean
  games: IGameSummary[]
  isBackgroundLoaded: boolean
  isSplashDataLoading: boolean
  selectedGame?: IGameSummary
}

class App extends Component<Props, State> {
  private apiClient: ApiClient = createApiClient()
  private log: debug.IDebugger = debug('courtblink:app')
  public state: State = {
    didFailToLoadSplashData: false,
    games: [] as IGameSummary[],
    isBackgroundLoaded: false,
    isSplashDataLoading: false,
  }

  public componentDidMount() {
    this.log('Loading initial splash data')

    // Fetch the initial splash data.
    const rightNow = new Date()
    this.loadSplashData(rightNow)
  }

  /**
   * Loads splash data for the specified date.
   * @param date date for which the splash data is being fetched,
   */
  private async loadSplashData(date: Date): Promise<void> {
    // Before we begin, make sure that app state represents that data is in
    // flux.
    this.setState({ didFailToLoadSplashData: false, isSplashDataLoading: true })

    try {
      // Attempt to fetch splash data from the backend.
      const games = (await this.apiClient.fetchSplashData(date)).games || []

      // Auto-select the very first game once loaded.
      let highlightedGame: IGameSummary | undefined
      let selectedGame: IGameSummary | undefined
      if (games && games.length > 0) {
        highlightedGame = games[0]
        // selectedGame = games[0]
      }

      // Update the app state to reflect the loaded splash data.
      this.setState({ highlightedGame, selectedGame, games })
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
  private onBackgroundLoaded(srcOfLoadedImage: string): void {
    // Exit early if the background is already loaded.
    if (this.state.isBackgroundLoaded) return

    // Make sure that the backgroudn registers as loaded.
    this.setState({ isBackgroundLoaded: true })

    // Check to see if there is a highlighted game without a selected game. If
    // so, the initially highlighted game must become the selected game.
    // This happens when the page is first loaded.
    const hasHighlightedGameNotYetBeenSelected =
      !this.state.selectedGame && this.state.highlightedGame

    // Exit early if there is nothing left to do.
    if (!hasHighlightedGameNotYetBeenSelected) return

    // Schedule the highlighted game selection for later to make it look as
    // though it has been selected.
    requestAnimationFrame(() =>
      setTimeout(
        () =>
          this.setState({
            selectedGame: this.state.highlightedGame,
          }),
        gameBoxSelectionDelay
      )
    )
  }

  @bind
  private onGameSelected(selectedGame: IGameSummary): void {
    this.setState({ selectedGame })
  }

  @bind
  private onSelectedGameHighlighted(highlightedGame: IGameSummary): void {
    this.setState({ highlightedGame })
  }

  public render(
    props: Props,
    {
      highlightedGame,
      games,
      isBackgroundLoaded,
      isSplashDataLoading,
      selectedGame,
    }: State
  ) {
    const isReady =
      !isSplashDataLoading && games && games.length > 0 && isBackgroundLoaded
    const splashUrl =
      highlightedGame && highlightedGame.homeTeamStatus
        ? highlightedGame.homeTeamStatus.splashUrl
        : undefined

    return (
      <div className={style.main}>
        <div className={style.back}>
          <CyclingBackground
            shouldShowBlurredLeftSection={true}
            onLoad={this.onBackgroundLoaded}
            src={splashUrl}
          />
        </div>
        <div className={style.front}>
          <div className={style.left}>
            <GameBoxList
              games={games}
              isLoading={!isReady}
              onSelectedGameHighlighted={this.onSelectedGameHighlighted}
              onGameSelected={this.onGameSelected}
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
