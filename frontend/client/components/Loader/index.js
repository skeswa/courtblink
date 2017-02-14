
import { h, Component } from 'preact'

import style from './style.css'

class Loader extends Component {
  render() {
    return (
      <div className={style.main}>
        <svg class={style.circle} viewBox="25 25 50 50">
          <circle
            class={style.circlePath}
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke-width="2"
            stroke-miterlimit="10" />
        </svg>
      </div>
    )
  }
}

export default Loader
