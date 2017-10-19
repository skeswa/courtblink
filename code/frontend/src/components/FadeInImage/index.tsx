import * as classNames from 'classnames'
import { h, Component } from 'preact'

import * as style from './style.css'

type Props = {
  src: string
}

type State = {
  loaded: boolean
}

class FadeInImage extends Component<Props, State> {
  state = { loaded: false }

  onLoad() {
    if (!this.state.loaded) this.setState({ loaded: true })
  }

  render({ src }: Props, { loaded }: State) {
    const mainClassName = classNames(style.main, {
      [style.main__visible]: loaded,
    })

    return (
      <div className={mainClassName} style={{ backgroundImage: `url(${src})` }}>
        {!loaded ? (
          <img
            src={src}
            onLoad={() => this.onLoad()}
            className={style.loader}
          />
        ) : null}
      </div>
    )
  }
}

export default FadeInImage
