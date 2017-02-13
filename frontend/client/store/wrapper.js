
import { h, Component } from 'preact'

class StoreWrapper extends Component {
  constructor(wrappedComponent, boundKeys) {
    super()

    this.boundKeys_ = boundKeys
    this.subscriptions_ = []
    this.wrappedComponent_ = wrappedComponent
    this.revisionOfLastUpdate_ = -1
  }

  componentDidMount() {
    if (!this || !this.context || !this.context.store) {
      throw new Error(
        'could not subscribe to the Store: the Store was not available from ' +
        'the component context')
    }

    const store = this.context.store
    const boundKeys = this.boundKeys_
    const forceUpdate = this.forceUpdate.bind(this)
    const subscriptions = []
    for (let i = 0; i < boundKeys.length; i++) {
      subscriptions.push(store.storeEmitter_.addListener(
        boundKeys[i],
        ::this.onStoreDataChanged_))
    }

    this.subscriptions_ = subscriptions
  }

  componentWillUnmount() {
    if (this.subscriptions_) {
      for (let i = 0; i < this.subscriptions_.length; i++) {
        this.subscriptions_[i].remove()
      }

      this.subscriptions_ = null
    }
  }

  onStoreDataChanged_() {
    const currentRevision = this.context.store.revision_
    const revisionOfLastUpdate = this.revisionOfLastUpdate_

    if (revisionOfLastUpdate >= currentRevision) {
      console.log('skip', revisionOfLastUpdate, currentRevision)
      return
    }
    console.log('no skip', revisionOfLastUpdate, currentRevision)

    this.revisionOfLastUpdate_ = currentRevision
    this.forceUpdate()
  }

  render() {
    const store = this.context.store
    const boundKeys = this.boundKeys_
    const WrappedComponent = this.wrappedComponent_

    const storeData = {}
    for (let i = 0; i < this.boundKeys_.length; i++) {
      const boundKey = boundKeys[i]
      storeData[boundKey] = store.storeData_.get(boundKey)
    }

    const wrappedComponentProps = Object.assign({}, this.props)
    wrappedComponentProps.storeData = storeData

    return <WrappedComponent {...wrappedComponentProps} />
  }
}

export default StoreWrapper
