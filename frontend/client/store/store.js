
import { h, Component } from 'preact'
import { EventEmitter } from 'fbemitter'

class Store {
  constructor(initialStoreData = {}) {
    this.revision_ = 0
    this.storeData_ = new Map()
    this.storeEmitter_ = new EventEmitter()

    Object.keys(initialStoreData)
      .forEach(key => this.storeData_.set(key, initialStoreData[key]))
  }

  update(key, value) {
    if (typeof key === 'string' || key instanceof String) {
      this.storeData_.set(key, value)
      ++this.revision_
      this.storeEmitter_.emit(key)
    } else if (key) {
      const keyValueMap = key
      const keys = Object.keys(keyValueMap)

      keys.forEach(key => this.storeData_.set(key, keyValueMap[key]))
      ++this.revision_
      keys.forEach(key => this.storeEmitter_.emit(key))
    }
  }
}

export default Store
