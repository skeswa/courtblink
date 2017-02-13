
import classNames from 'classnames'
import { h, Component } from 'preact'

import style from './index.css'

class CyclingBackground extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      foregroundSrc: null,
      backgroundSrc: null,
      lastLoadedSrc: null,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { src: nextSrc } = nextProps
    const { src: currentSrc } = this.props

    if (nextSrc && nextSrc !== currentSrc) {
      this.loadImageURL(nextSrc)
    }
  }

  loadImageURL(imageURL) {
    this.setState(
      {
        loading: true,
        foregroundSrc: this.state.lastLoadedSrc,
        backgroundSrc: imageURL,
      },
      () => {
        const img = new Image()
        img.onload = () => {
          this.setState({ loading: false, lastLoadedSrc: imageURL })
        }
        img.src = imageURL
      })
  }

  render({ blurred }, { loading, foregroundSrc, backgroundSrc }) {
    return (
      <div className={style.main}>
        <div
          className={
            classNames(style.background, {
              [style.background__visible]: !loading,
              [style.background__blurred]: blurred,
            })
          }
          style={
            backgroundSrc
              ? { backgroundImage: `url(${backgroundSrc})` }
              : null
          } />
        <div
          className={
            classNames(style.foreground, {
              [style.foreground__visible]: loading && foregroundSrc,
              [style.foreground__blurred]: blurred,
            })
          }
          style={
            foregroundSrc
              ? { backgroundImage: `url(${foregroundSrc})` }
              : null
          } />
        <div
          className={
            classNames(style.shade, { [style.shade__visible]: loading })
          } />
      </div>
    )
  }
}

export default CyclingBackground
