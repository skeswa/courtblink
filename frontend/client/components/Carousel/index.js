
import classNames from 'classnames'
import { h, Component } from 'preact'

import style from './style.css'
import GameCard from 'components/GameCard'
import { arraysEqual } from 'util'

class Carousel extends Component {
  constructor() {
    super()

    this.state = { selectedGameIndex: -1 }
  }

  componentDidMount() {
    setTimeout(() => this.setState({ visible: true }), 500)
  }

  componentWillReceiveProps(nextProps) {
    const { games: nextGames } = nextProps
    const { selectedGameIndex } = this.state

    if (selectedGameIndex < 0 && nextGames.length > 0) {
      this.setState({ selectedGameIndex: 0 })
    } else if (selectedGameIndex >= nextGames.length) {
      this.setState({ selectedGameIndex: nextGames.length - 1 })
    }
  }

  onGameCardClicked(selectedGameIndex) {
    this.setState({ selectedGameIndex })
  }

  render({ games, visible }, { selectedGameIndex }) {
    const mainClassName = classNames(style.main, {
      [style.main__visible]: visible,
    })

    return (
      <div className={mainClassName}>
        <div className={style.cards}>
          {
            games.map((game, i) => (
              <GameCard
                key={i}
                game={game}
                index={i}
                onClick={::this.onGameCardClicked}
                selected={i === selectedGameIndex}
                offsetLeft={i < selectedGameIndex}
                offsetRight={i > selectedGameIndex} />
            ))
          }
        </div>
      </div>
    )
  }
}

export default Carousel
