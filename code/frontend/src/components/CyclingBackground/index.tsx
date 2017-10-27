import bind from 'bind-decorator'
import * as classNames from 'classnames'
import { h, Component } from 'preact'

import Loader from 'components/Loader'
import { setStateAndWait, setTimeoutAndWait } from 'util/asyncUI'

import * as style from './style.css'

// Amount of time to wait before the image in the cache is visible on the page.
const imageLoadDelay = 300 /* ms */

// How long the shield fading animation takes to finish.
const fadeAnimationDuration = 500 /* ms */

// How long to wait after the `src` changes before taking it seriously.
const srcChangeEventDebounceInterval = 1000 /* ms */

/** Represents an image layer of this component. */
type Layer = {
  /** Natural height of the image in this layer. */
  height?: number
  /** True if this layer is visible in an animation currently. */
  isAnimating: boolean
  /** URL of the image to load & render. */
  src?: string
  /** Natural width of the image in this layer. */
  width?: number
}

/** Input type of this component. */
type Props = {
  /** Called when an image is loaded. */
  onLoad?: (src: string) => void
  /** True if the blurred left section shuld be visible. */
  shouldShowBlurredLeftSection: boolean
  /** URL of the image to load & render. */
  src?: string
}

/** Internal state type of this component. */
type State = {
  /** Layer currently being loaded. */
  currentlyLoadingLayer?: Layer
  /** The next layer to load. */
  nextLayerToLoad?: Layer
  /** Height of the root element for this component. */
  rootElementHeight?: number
  /** Width of the root element for this component. */
  rootElementWidth?: number
  /** Layer hiding the layer being loaded. */
  shieldingLayer?: Layer
}

/** Transitions the background image when the `src` property changes. */
class CyclingBackground extends Component<Props, State> {
  private srcChangeDebounceTimeoutRef: number | null = null
  private rootElement: Element
  public state: State = {}

  public componentWillMount(): void {
    // Start listening for the window resizing.
    window.addEventListener('resize', this.handleWindowResizeEvent)
  }

  public componentWillReceiveProps(nextProps: Props): void {
    const nextSrc = nextProps.src

    // Only pay attention if the `src` changes.
    if (nextSrc && nextSrc !== this.props.src) {
      this.debounceSrcChangeEvent(nextSrc)
    }
  }

  public componentWillUnmount(): void {
    // Stop listening for the window resizing since this component is going
    // away.
    window.removeEventListener('resize', this.handleWindowResizeEvent)
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    return (
      this.state.currentlyLoadingLayer !== nextState.currentlyLoadingLayer ||
      this.state.rootElementHeight !== nextState.rootElementHeight ||
      this.state.rootElementWidth !== nextState.rootElementWidth ||
      this.state.shieldingLayer !== nextState.shieldingLayer ||
      this.props.shouldShowBlurredLeftSection !==
        nextProps.shouldShowBlurredLeftSection
    )
  }

  /**
   * Calculates the styles of the background image for a layer.
   * @param layerImageHeight height of the layer image.
   * @param layerImageWidth width of the layer image.
   * @param rootElementHeight height of the root element.
   * @param rootElementWidth width of the root element.
   * @return the calculated size of the background image for a layer.
   */
  private calculateLayerBackgroundStyles(
    layerImageSrc: string | undefined,
    layerImageHeight: number | undefined,
    layerImageWidth: number | undefined,
    rootElementHeight: number | undefined,
    rootElementWidth: number | undefined
  ): {
    backgroundHeight?: string
    backgroundImage?: string
    backgroundPositionX?: string
    backgroundPositionY?: string
    backgroundWidth?: string
  } {
    // Exit early if any of the numbers aren't available.
    if (
      !layerImageHeight ||
      !layerImageWidth ||
      !rootElementHeight ||
      !rootElementWidth
    ) {
      return {}
    }

    // Calculate the minimum scaling ratio for which the image occupies all the
    // available space in the root element.
    const scalingRatio = Math.max(
      rootElementHeight / layerImageHeight,
      rootElementWidth / layerImageWidth
    )

    // Scale the layer image dimenions.
    const scaledLayerImageHeight = layerImageHeight * scalingRatio
    const scaledLayerImageWidth = layerImageWidth * scalingRatio

    // Use the numbers that we just calculated to compose styles.
    const backgroundHeight = `${1.2 * scaledLayerImageHeight}px`
    const backgroundImage = layerImageSrc ? `url(${layerImageSrc})` : undefined
    const backgroundPositionX = `${-0.1 * scaledLayerImageWidth}px`
    const backgroundPositionY = `${-0.1 * scaledLayerImageHeight}px`
    const backgroundSize = `${1.2 * scaledLayerImageWidth}px ${1.2 *
      scaledLayerImageHeight}px`
    const backgroundWidth = `${1.2 * scaledLayerImageWidth}px`

    return {
      backgroundHeight,
      backgroundImage,
      backgroundPositionX,
      backgroundPositionY,
      backgroundWidth,
    }
  }

  /**
   * Buffer the `src` property change event so that too many don't happen at
   * once.
   * @param nextSrc the next value for the `src` property.
   */
  private debounceSrcChangeEvent(nextSrc: string): void {
    // It is clear that the `src` prop has changed at this point, so handle it.
    if (this.srcChangeDebounceTimeoutRef !== null) {
      clearTimeout(this.srcChangeDebounceTimeoutRef)
      this.srcChangeDebounceTimeoutRef = null
    }

    // Schedule the source change event to fire if there isn't another one in
    // the next quarter of a second.
    this.srcChangeDebounceTimeoutRef = window.setTimeout(
      () => this.onSrcChanged(nextSrc),
      srcChangeEventDebounceInterval
    )
  }

  /**
   * Loades an image with the specified URL.
   * @param src URL of the image to load.
   */
  private loadImage(src: string) {
    // Wait for the image to load.
    const loadingImage = new Image()
    loadingImage.onload = () =>
      this.onImageLoaded(src, loadingImage.width, loadingImage.height)
    loadingImage.src = src
  }

  /** Handles and debounces window resize events for the `onResize` handler. */
  @bind
  private handleWindowResizeEvent(): void {
    window.requestAnimationFrame(this.onResize)
  }

  /**
   * Called when an image is loaded via `this.loadImage`.
   * @param src URL of the image that got loaded.
   */
  private async onImageLoaded(
    src: string,
    width: number,
    height: number
  ): Promise<void> {
    let { currentlyLoadingLayer, shieldingLayer } = this.state

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
    await setTimeoutAndWait(imageLoadDelay)

    // Kick off the animation that fades the shielding layer. Also, give the
    // next layer up some dimensions.
    await setStateAndWait(this, {
      currentlyLoadingLayer: {
        ...currentlyLoadingLayer,
        height,
        isAnimating: true,
        width,
      },
      shieldingLayer: { ...shieldingLayer, isAnimating: true },
    })

    // Wait for the animation to finish.
    await setTimeoutAndWait(fadeAnimationDuration)

    // Get the next layer up, and get started with it.
    let {
      currentlyLoadingLayer: newCurrentlyLoadingLayer,
      nextLayerToLoad,
    } = this.state

    // Make the loading layer into the new shield.
    await this.setState({
      currentlyLoadingLayer: nextLayerToLoad,
      nextLayerToLoad: undefined,
      shieldingLayer: { ...newCurrentlyLoadingLayer, isAnimating: false },
    })

    // Wait for the next layer image to load.
    if (nextLayerToLoad && nextLayerToLoad.src) {
      this.loadImage(nextLayerToLoad.src)
    }
  }

  /** Called when the window gets resized. */
  @bind
  private onResize(): void {
    // Exit early if there is not root element.
    if (!this.rootElement) return

    // Get the size of the root element.
    const {
      height: rootElementHeight,
      width: rootElementWidth,
    } = this.rootElement.getBoundingClientRect()

    // Update the the root element dimensions in component state.
    this.setState({ rootElementHeight, rootElementWidth })
  }

  /**
   * Called when the root element is mounted in the DOM.
   * @param rootElement root element of this component.
   */
  @bind
  private onRootElementMounted(rootElement: Element): void {
    this.rootElement = rootElement

    // Since the root element has changed, re-measure its dimensions.
    this.handleWindowResizeEvent()
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
      await setStateAndWait(this, {
        nextLayerToLoad: { src: nextSrc, isAnimating: false },
      })

      // Wait for the image to load.
      return this.loadImage(nextSrc)
    }

    // Simply set the `currentlyLoadingLayer` since it has not been set. Also,
    // add a blank shielding layer if one doesn't exist already.
    await setStateAndWait(this, {
      currentlyLoadingLayer: { src: nextSrc, isAnimating: false },
      shieldingLayer: shieldingLayer || { isAnimating: false },
    })

    // Wait for the image to load.
    return this.loadImage(nextSrc)
  }

  /**
   * Renders a single layer.
   * @param layer layer to render.
   * @param rootElementHeight height of the root element.
   * @param rootElementWidth width of the root element.
   * @param shouldLayerFadeWhenAnimating true if the `layer` should fade.
   * @param shouldShowBlurredLeftSection true to show the blurred left section.
   * @return the rendered layer.
   */
  private renderLayer(
    layer: Layer,
    rootElementHeight: number | undefined,
    rootElementWidth: number | undefined,
    shouldLayerFadeWhenAnimating: boolean,
    shouldShowBlurredLeftSection: boolean
  ): JSX.Element {
    const { height, isAnimating, src, width } = layer

    // Use layer data to come up with appropriate CSS styling.
    const {
      backgroundHeight,
      backgroundImage,
      backgroundPositionX,
      backgroundPositionY,
      backgroundWidth,
    } = this.calculateLayerBackgroundStyles(
      src,
      height,
      width,
      rootElementHeight,
      rootElementWidth
    )
    const backgroundSize = `${backgroundWidth} ${backgroundHeight}`

    // Create the CSS classes and styles for use in the JSX below.
    const layerClassName = classNames(style.layer, {
      [style.layer__loading]: !height || !src || !width,
      [style.layer__visible]: !(isAnimating && shouldLayerFadeWhenAnimating),
    })
    const layerImageStyle = {
      backgroundImage,
      backgroundPositionX,
      backgroundPositionY,
      backgroundSize,
    }
    const layerLeftSectionStyle = {
      visibility: shouldShowBlurredLeftSection ? 'visible' : 'hidden',
    }
    const layerLeftSectionBlurStyle = {
      backgroundImage,
      backgroundSize,

      height: backgroundHeight,
      left: backgroundPositionX,
      top: backgroundPositionY,
      width: backgroundWidth,
    }

    return (
      <div key={src} className={layerClassName}>
        <div style={layerImageStyle} className={style.layerImage} />
        <div style={layerLeftSectionStyle} className={style.layerLeftSection}>
          <div
            style={layerLeftSectionBlurStyle}
            className={style.layerLeftSectionBlur}
          />
        </div>
      </div>
    )
  }

  /**
   * Renders the layers into an array.
   * @param currentlyLoadingLayer layer currently being shielded.
   * @param rootElementHeight height of the root element.
   * @param rootElementWidth width of the root element.
   * @param shieldingLayer layer hiding the currently loading layer.
   * @param shouldShowBlurredLeftSection true to show the blurred left section.
   * @return array of rendered layers.
   */
  private renderLayers(
    currentlyLoadingLayer: Layer | undefined,
    rootElementHeight: number | undefined,
    rootElementWidth: number | undefined,
    shieldingLayer: Layer | undefined,
    shouldShowBlurredLeftSection: boolean
  ): JSX.Element[] {
    const layers = []

    // Only add the `currentlyLoadingLayer` if its defined.
    if (currentlyLoadingLayer) {
      layers.push(
        this.renderLayer(
          currentlyLoadingLayer,
          rootElementHeight,
          rootElementWidth,
          false /* shouldLayerFadeWhenAnimating */,
          shouldShowBlurredLeftSection
        )
      )
    }

    // Only add the `shieldingLayer` if its defined.
    if (shieldingLayer) {
      layers.push(
        this.renderLayer(
          shieldingLayer,
          rootElementHeight,
          rootElementWidth,
          true /* shouldLayerFadeWhenAnimating */,
          shouldShowBlurredLeftSection
        )
      )
    }

    return layers
  }

  public render(
    { shouldShowBlurredLeftSection }: Props,
    {
      currentlyLoadingLayer,
      rootElementHeight,
      rootElementWidth,
      shieldingLayer,
    }: State
  ): JSX.Element {
    return (
      <div className={style.main} ref={this.onRootElementMounted}>
        {this.renderLayers(
          currentlyLoadingLayer,
          rootElementHeight,
          rootElementWidth,
          shieldingLayer,
          shouldShowBlurredLeftSection
        )}
      </div>
    )
  }
}

export default CyclingBackground
