import { Component } from 'preact'

/**
 * Wrapper for `requestAnimationFrame` that returns a promise instead of
 * accepting a callback.
 */
export function requestAnimationFrameAndWait(): Promise<void> {
  return new Promise(function(resolve, reject) {
    try {
      window.requestAnimationFrame(function() {
        resolve()
      })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Wrapper for `component.setState` that returns a `Promise` instead of
 * accepting a callback.
 * @param component the component for which `setState` will be called.
 * @param state diff object used to change `component.state`.
 */
export function setStateAndWait<StateType, K extends keyof StateType>(
  component: Component<any, StateType>,
  state: Pick<StateType, K>
): Promise<void> {
  return new Promise(function(resolve, reject) {
    try {
      component.setState.call(component, state, resolve)
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
export function setTimeoutAndWait(duration: number): Promise<void> {
  return new Promise(function(resolve, reject) {
    try {
      window.setTimeout(resolve, duration)
    } catch (err) {
      reject(err)
    }
  })
}
