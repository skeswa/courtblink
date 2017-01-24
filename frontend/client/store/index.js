
import { h, Component } from 'preact'
import { EventEmitter } from 'fbemitter'

import Binder from './binder'

const storeData = new Map()
const storeEmitter = new EventEmitter()

// update changes a value in the Store.
export function update(key, value) {
  storeData.set(key, value)
  storeEmitter.emit(key, value)
}

// bind binds a component type to the store.
export function bind() {
  if (arguments.length < 2) {
    throw new Error('bind(...) requires at least 2 arguments')
  }
  if (!arguments[0]) {
    throw new Error(
      'the first argument of bind(...) should be a component type')
  }

  const boundKeys = []
  const componentType = arguments[0]
  for (let i = 1; i < arguments.length; i++) {
    const boundKey = arguments[i]
    if (typeof boundKey !== 'string' && !(boundKey instanceof String)) {
      throw new Error(
        `argument #${i} of bind(...) was not a valid store key since it was ` +
        `not a valid string`)
    }
    boundKeys.add(boundKey)
  }

  return new Binder(
    componentType,
    boundKeys,
    storeData,
    storeEmitter)
}
