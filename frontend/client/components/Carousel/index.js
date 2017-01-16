
import { h, Component } from 'preact'

import style from './style.css'
import GameCard from 'components/GameCard'

class Carousel extends Component {
  constructor() {
    super()

    this.state = {
      games: [ 1, 2, 3, 4, 5, 6 ],
      selectedGameIndex: 0,
    }
  }

  onGameCardClicked(selectedGameIndex) {
    this.setState({ selectedGameIndex })
  }

  render(props, { games, selectedGameIndex }) {
    return (
      <div className={style.main}>
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
