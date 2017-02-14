
import classNames from 'classnames'
import { h, Component } from 'preact'

import style from './index.css'
import Loader from 'components/Loader'

const FADE_ANIMATION_DURATION_MS = 400

class CyclingBackground extends Component {
  constructor(props) {
    super(props)

    this.state = { layers: [], onFirstBackgroundLoadedInvoked: false }
  }

  componentWillReceiveProps(nextProps) {
    const { src: nextSrc } = nextProps
    const { src: currentSrc } = this.props

    if (nextSrc && nextSrc !== currentSrc) {
      this.cycleBackground(nextSrc)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.layers !== nextState.layers)
      || (this.props.blurred !== nextProps.blurred)
      || (this.props.onFirstBackgroundLoaded !== nextProps.onFirstBackgroundLoaded)
  }

  clearHiddenShieldLayers() {
    const now = Date.now()

    // Filter out no-longer-visible shields.
    const layers = this.state.layers.filter(
      ({ visible, hideTime, shielding}) =>
        !shielding
        || visible
        || !hideTime
        || ((now - hideTime) < FADE_ANIMATION_DURATION_MS))

    // Push the update to layers.
    this.setState({ layers })
  }

  cycleBackground(nextSrc) {
    let layers = this.state.layers.slice(0)

    // Update layers accroding to what it already has.
    if (layers.length > 0) {
      const oldTopLayer = layers[layers.length - 1]
      layers[layers.length - 1] = {
        src: nextSrc,
        shielding: false,
        visible: true,
        hideTime: null,
      }
      layers.push({
        src: oldTopLayer.src,
        shielding: true,
        visible: true,
        hideTime: null,
      })
    } else {
      layers = [
        { src: nextSrc, shielding: false, visible: true, hideTime: null },
        { src: null, shielding: true, visible: true, hideTime: null },
      ]
    }

    // Push the update to layers.
    this.setState({ layers }, () => {
      // Load the image.
      this.loadImage(nextSrc, ::this.hideShieldLayers)
    })
  }

  hideShieldLayers() {
    // Call props.onFirstBackgroundLoaded if not called yet.
    if (!this.state.onFirstBackgroundLoadedInvoked
        && this.props.onFirstBackgroundLoaded) {
      this.props.onFirstBackgroundLoaded()
      this.setState({ onFirstBackgroundLoadedInvoked: true })
    }

    // Keep track of all the shield layers we're hiding.
    const newlyHiddenLayers = []

    // Update layers that need to be hidden.
    const layers = this.state.layers.map(layer => {
      if (layer.shielding && layer.visible) {
        const newLayer = Object.assign({}, layer, { visible: false })
        newlyHiddenLayers.push(newLayer)
        return newLayer
      }

      return layer
    })

    // Push the update to layers.
    this.setState({ layers }, () => {
      const now = Date.now()

      // Set the hide times once we have render confirmation.
      newlyHiddenLayers.forEach(layer => layer.hideTime = now)

      // It is now safe to clear the hidden shields.
      setTimeout(::this.clearHiddenShieldLayers, FADE_ANIMATION_DURATION_MS)
    })
  }

  loadImage(src, callback) {
    const img = new Image()
    img.onload = callback
    img.src = src
  }

  renderLayer({ src, visible }, blurred, i) {
    const className = classNames(style.layer, {
      [style.layer__visible]: visible,
      [style.layer__blurred]: blurred,
      [style.layer__loading]: !src,
    })
    const style_ = src
      ? { backgroundImage: `url(${src})` }
      : null

    return <div key={i} style={style_} className={className} />
  }

  render({ blurred }, { layers }) {
    return (
      <div className={style.main}>
        { layers.map((layer, i) => this.renderLayer(layer, blurred, i)) }
      </div>
    )
  }
}

export default CyclingBackground
