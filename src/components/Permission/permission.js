import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const roles = store.permission.getters && store.permission.getters.roles
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      // eslint-disable-next-line quotes
      throw new Error(`使用方式： v-permission="['admin','editor']"`)
    }
  }
}
