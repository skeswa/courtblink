
import classNames from 'classnames'
import { h, Component } from 'preact'

import style from './index.css'

class FadeInImage extends Component {
  constructor(props) {
    super(props)

    this.state = { loaded: false }
  }

  onLoad() {
    if (!this.state.loaded) this.setState({ loaded: true })
  }

  render({ src }, { loaded }) {
    const mainClassName = classNames(style.main, {
      [style.main__visible]: loaded,
    })
    const backgroundImage = `url(${src})`

    return (
      <div className={mainClassName} style={{ backgroundImage }}>
        {
          !loaded
            ? <img
                src={src}
                onLoad={::this.onLoad}
                className={style.loader} />
            : null
        }
      </div>
    )
  }
}

export default FadeInImage
