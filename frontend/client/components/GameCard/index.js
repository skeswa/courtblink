
import classNames from 'classnames'
import { h, Component } from 'preact'

import style from './style.css'

class GameCard extends Component {
  onClick() {
    const { index, onClick } = this.props

    if (onClick) onClick(index)
  }

  render({ selected, offsetLeft, offsetRight }) {
    const mainClassName = classNames(style.main, {
      [style.main__selected]: selected,
      [style.main__offsetLeft]: offsetLeft,
      [style.main__offsetRight]: offsetRight,
    })

    return (
      <div className={mainClassName} onClick={::this.onClick}>
      </div>
    )
  }
}

export default GameCard
