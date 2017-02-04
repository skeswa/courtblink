
import classNames from 'classnames'
import { h, Component } from 'preact'

import style from './style.css'

const TEAM_ICON_URL_PREFIX = '//i.cdn.turner.com/nba/nba/assets/logos/teams/secondary/web'

class TeamIcon extends Component {
  constructor(props) {
    super(props)

    this.state = { loaded: false }
  }

  onLoad() {
    if (!this.state.loaded) this.setState({ loaded: true })
  }

  render({ triCode }, { loaded }) {
    const iconURL = `${TEAM_ICON_URL_PREFIX}/${triCode}.svg`
    const mainClassName = classNames(style.main, {
      [style.main__visible]: loaded,
    })
    const backgroundImage = `url(${iconURL})`

    return (
      <div className={mainClassName} style={{ backgroundImage }}>
        {
          !loaded
            ? <img
                src={iconURL}
                onLoad={::this.onLoad}
                className={style.loader} />
            : null
        }
      </div>
    )
  }
}

export default TeamIcon
