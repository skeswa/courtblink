
import StoreWrapper from './wrapper'

function subscribe() {
  if (arguments.length < 2) {
    throw new Error('subscribe(...) requires at least 2 arguments')
  }
  if (typeof arguments[0] !== 'function') {
    throw new Error(
      'the first argument of subscribe(...) should be a component type')
  }

  const boundKeys = []
  for (let i = 1; i < arguments.length; i++) {
    const boundKey = arguments[i]
    if (typeof boundKey !== 'string' && !(boundKey instanceof String)) {
      throw new Error(
        `argument #${i} of subscribe(...) was not a valid store key ` +
        `since it was not a valid string`)
    }
    boundKeys.push(boundKey)
  }

  const componentType = arguments[0]
  const wrapper = class LocalStoreWrapper extends StoreWrapper {
    constructor() {
      super(componentType, boundKeys)
    }
  }

  return wrapper
}


export default subscribe
