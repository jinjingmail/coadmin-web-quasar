import Vue from 'vue'
import Vuex from 'vuex'

import tagviews from './module-tagviews'
import settings from './module-settings'
import permission from './module-permission'
import user from './module-user'
import api from './module-api'

Vue.use(Vuex)

const modules = {
  tagviews,
  settings,
  permission,
  user,
  api
}

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

console.log('create store')
const Store = new Vuex.Store({
  modules,

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.NODE_ENV !== 'production'
})

export default function (/* { ssrContext } */) {
  console.log('init store')
  // Automatically run the `init` action if available for every module.
  for (const moduleName of Object.keys(modules)) {
    if (modules[moduleName].actions.init) {
      Store.dispatch(`${moduleName}/init`)
    }
  }

  return Store
}
export { Store }
