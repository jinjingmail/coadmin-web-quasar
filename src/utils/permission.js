import { Store } from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = Store.getters['user/roles']
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    // eslint-disable-next-line quotes
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
