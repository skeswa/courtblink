import bind from 'bind-decorator'
import * as classNames from 'classnames'
import { h, Component } from 'preact'

import Loader from 'components/Loader'

import * as style from './style.css'

// Used to prevent DOM thrash.
const DOM_ADJUSTMENT_PADDING_MS = 100
const FADE_ANIMATION_DURATION_MS = 400

type Layer = {
  hideTime: number
  shielding: boolean
  src: string
  visible: boolean
}

type Props = {
  blurred: boolean
  onFirstBackgroundLoaded?: () => void
  src: string
}

type State = {
  layers: Layer[]
  onFirstBackgroundLoadedInvoked: boolean
}

class CyclingBackground extends Component<Props, State> {
  state: State = { layers: [], onFirstBackgroundLoadedInvoked: false }

  componentWillReceiveProps(nextProps: Props): void {
    const { src: nextSrc } = nextProps
    const { src: currentSrc } = this.props

    // If the image source changes, cycle the background.
    if (nextSrc && nextSrc !== currentSrc) {
      this.onSrcChanged(nextSrc)
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    return (
      this.state.layers !== nextState.layers ||
      this.props.blurred !== nextProps.blurred ||
      this.props.onFirstBackgroundLoaded !== nextProps.onFirstBackgroundLoaded
    )
  }

  @bind
  clearHiddenShieldLayers(): void {
    const now = Date.now()

    // Filter out no-longer-visible shields.
    const layers = this.state.layers.filter(
      ({ visible, hideTime, shielding }) =>
        !shielding ||
        visible ||
        !hideTime ||
        now - hideTime < FADE_ANIMATION_DURATION_MS
    )

    // Push the update to layers.
    this.setState({ layers })
  }

  cycleBackground(nextSrc: string): void {
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
    this.setState({ layers }, () => this.loadImage(nextSrc, this.onImageLoaded))
  }

  loadImage(src: string, callback: () => void): void {
    const img = new Image()
    img.onload = () => setTimeout(callback, DOM_ADJUSTMENT_PADDING_MS)
    img.src = src
  }

  @bind
  onImageLoaded(): void {
    // Call props.onFirstBackgroundLoaded if not called yet.
    if (
      !this.state.onFirstBackgroundLoadedInvoked &&
      this.props.onFirstBackgroundLoaded
    ) {
      this.props.onFirstBackgroundLoaded()
      this.setState({ onFirstBackgroundLoadedInvoked: true })
    }

    // Keep track of all the shield layers we're hiding.
    const newlyHiddenLayers: Layer[] = []

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
      newlyHiddenLayers.forEach(layer => (layer.hideTime = now))

      // It is now safe to clear the hidden shields.
      setTimeout(this.clearHiddenShieldLayers, FADE_ANIMATION_DURATION_MS)
    })
  }

  @bind
  onSrcChanged(newSrc: string) {
    setTimeout(() => this.cycleBackground(newSrc), FADE_ANIMATION_DURATION_MS)
  }

  renderLayer(
    { src, visible }: Layer,
    blurred: boolean,
    i: number
  ): JSX.Element {
    const className = classNames(style.layer, {
      [style.layer__visible]: visible,
      [style.layer__blurred]: blurred,
      [style.layer__loading]: !src,
    })
    const style_ = src ? { backgroundImage: `url(${src})` } : null

    return <div key={i.toString()} style={style_} className={className} />
  }

  render({ blurred }: Props, { layers }: State): JSX.Element {
    return (
      <div className={style.main}>
        {layers.map((layer, i) => this.renderLayer(layer, blurred, i))}
      </div>
    )
  }
}

export default CyclingBackground
