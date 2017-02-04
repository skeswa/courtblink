
import { h, Component } from 'preact'

class Provider extends Component {
  getChildContext() {
    return { store: this.store_ }
  }

  constructor(props, context) {
    super(props, context)
    this.store_ = props.store
  }

  render(props) {
    return props.children[0]
  }
}

export default Provider
