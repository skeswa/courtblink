
import { h, Component } from 'preact'
import { EventEmitter } from 'fbemitter'

class Store {
  constructor(initialStoreData = {}) {
    this.storeData_ = new Map()
    this.storeEmitter_ = new EventEmitter()

    Object.keys(initialStoreData)
      .forEach(key => this.storeData_.set(key, initialStoreData[key]))
  }

  update(key, value) {
    this.storeData_.set(key, value)
    this.storeEmitter_.emit(key, value)
  }
}

export default Store
