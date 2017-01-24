
import { h, Component } from 'preact'

class Binder extends Component {
  constructor(type, boundKeys, storeData, storeEmitter) {
    this.type_ = type
    this.boundKeys_ = boundKeys
    this.storeData_ = storeData
    this.storeEmitter_ = storeEmitter
    this.subscriptions_ = null
    this.onStoreUpdated_ = this.forceUpdate.bind(this)
  }

  componentWillMount() {
    this.subscriptions_ = this.boundKeys_.map(
      boundKey => storeEmitter.addListener(boundKey, this.onStoreUpdated_))
  }

  componentWillUnmount() {
    if (this.subscriptions_) this.subscriptions_.forEach(
      subscription => subscription.remove())
  }

  render(props) {
    const SubComponent = this.type_
    const subComponentProps = Object.assign({}, props)
    this.boundKeys_.forEach(
      boundKey => subComponentProps[boundKey] = this.storeData_.get(boundKey))

    return <SubComponent {...subComponentProps} />
  }
}

export default Binder
