import bind from 'bind-decorator'
import * as classNames from 'classnames'
import { h, Component } from 'preact'

import Loader from 'components/Loader'

import * as style from './style.css'

// Amount of time to wait before the image in the cache is visible on the page.
const imageLoadDelay = 300 /* ms */

// How long the shield fading animation takes to finish.
const fadeAnimationDuration = 500 /* ms */

type Layer = {
  isAnimating: boolean
  src?: string
}

type Props = {
  blurred: boolean
  onLoad?: (src: string) => void
  src?: string
}

type State = {
  currentlyLoadingLayer?: Layer
  nextLayerToLoad?: Layer
  shieldingLayer?: Layer
}

class CyclingBackground extends Component<Props, State> {
  public state: State = {}

  public componentWillReceiveProps(nextProps: Props): void {
    // Only pay attention if the `src` changes.
    if (!nextProps.src || nextProps.src === this.props.src) return

    this.onSrcChanged(nextProps.src)
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    return (
      this.state.currentlyLoadingLayer !== nextState.currentlyLoadingLayer ||
      this.state.shieldingLayer !== nextState.shieldingLayer ||
      this.props.blurred !== nextProps.blurred
    )
  }

  /**
   * Loades an image with the specified URL.
   * @param src URL of the image to load.
   */
  private loadImage(src: string) {
    // Wait for the image to load.
    const loadingImage = new Image()
    loadingImage.onload = () => this.onImageLoaded(src)
    loadingImage.src = src
  }

  /**
   * Called when an image is loaded via `this.loadImage`.
   * @param src URL of the image that got loaded.
   */
  private async onImageLoaded(src: string): Promise<void> {
    const { currentlyLoadingLayer, shieldingLayer } = this.state

    // Fire the event listener if its defined.
    if (this.props.onLoad) {
      this.props.onLoad(src)
    }

    // Exit early if the `src` doesn't line up.
    if (
      !shieldingLayer ||
      !currentlyLoadingLayer ||
      currentlyLoadingLayer.src != src
    ) {
      return
    }

    // Give the DOM some time to reflect the image now loaded into the cache.
    await this.setTimeoutAndWait(imageLoadDelay)

    // Kick off the animation that fades the shielding layer.
    await this.setStateAndWait({
      currentlyLoadingLayer: { ...currentlyLoadingLayer, isAnimating: true },
      shieldingLayer: { ...shieldingLayer, isAnimating: true },
    })

    // Wait for the animation to finish.
    await this.setTimeoutAndWait(fadeAnimationDuration)

    // Get the next layer up, and get started with it.
    const { nextLayerToLoad } = this.state

    // Make the loading layer into the new shield.
    await this.setState({
      currentlyLoadingLayer: nextLayerToLoad,
      nextLayerToLoad: undefined,
      shieldingLayer: { ...currentlyLoadingLayer, isAnimating: false },
    })

    // Wait for the next layer image to load.
    if (nextLayerToLoad && nextLayerToLoad.src) {
      this.loadImage(nextLayerToLoad.src)
    }
  }

  /**
   * Called then `this.props.src` changes.
   * @param nextSrc the new value of `this.props.src`.
   */
  private async onSrcChanged(nextSrc: string): Promise<void> {
    const { currentlyLoadingLayer, shieldingLayer } = this.state

    if (currentlyLoadingLayer && currentlyLoadingLayer.isAnimating) {
      // If the current loading layer is animating, don't update anything. Just
      // add this layer as the next one up.
      await this.setStateAndWait({
        nextLayerToLoad: { src: nextSrc, isAnimating: false },
      })

      // Wait for the image to load.
      return this.loadImage(nextSrc)
    }

    // Simply set the `currentlyLoadingLayer` since it has not been set. Also,
    // add a blank shielding layer if one doesn't exist already.
    await this.setStateAndWait({
      currentlyLoadingLayer: { src: nextSrc, isAnimating: false },
      shieldingLayer: shieldingLayer || { isAnimating: false },
    })

    // Wait for the image to load.
    return this.loadImage(nextSrc)
  }

  /**
   * Wrapper for `requestAnimationFrame` that returns a `Promise` instead of
   * accepting a callback.
   */
  private requestAnimationFrameAndWait(): Promise<void> {
    return new Promise(resolve => window.requestAnimationFrame(() => resolve()))
  }

  /**
   * Wrapper for `this.setState` that returns a `Promise` instead of accepting a
   * callback.
   * @param stateDiff diff object used to change `this.state`.
   */
  private setStateAndWait<K extends keyof State>(
    stateDiff: Pick<State, K>
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.setState(stateDiff, resolve)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * Wrapper for `setTimeout` that returns a `Promise` instead of accepting a
   * callback.
   * @param duration how long to wait for.
   */
  private setTimeoutAndWait(duration: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        window.setTimeout(resolve, duration)
      } catch (err) {
        reject(err)
      }
    })
  }

  render(
    { blurred }: Props,
    { currentlyLoadingLayer, shieldingLayer }: State
  ): JSX.Element {
    return (
      <div className={style.main}>
        {currentlyLoadingLayer
          ? this.renderLayer(currentlyLoadingLayer, blurred, false)
          : null}
        {shieldingLayer
          ? this.renderLayer(shieldingLayer, blurred, true)
          : null}
      </div>
    )
  }

  renderLayer(
    layer: Layer,
    blurred: boolean,
    isShieldLayer: boolean
  ): JSX.Element {
    const { isAnimating, src } = layer

    const className = classNames(style.layer, {
      [style.layer__blurred]: blurred,
      [style.layer__loading]: !src,
      [style.layer__visible]: !isShieldLayer || !isAnimating,
    })
    const layerStyle = src ? { backgroundImage: `url(${src})` } : null

    return <div key={src} style={layerStyle} className={className} />
  }
}

export default CyclingBackground
