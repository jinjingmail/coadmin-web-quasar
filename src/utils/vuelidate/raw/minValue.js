import { req } from './core'
import { unwrap } from '../utils/common'

/**
 * Check if a value is above a threshold.
 * @param {String | Number | Ref<Number> | Ref<String>} min
 * @returns {function(*=): boolean}
 */
export default function (value, min) {
  return !req(value) ||
    ((!/\s/.test(value) || value instanceof Date) && +value >= +unwrap(min))
}
