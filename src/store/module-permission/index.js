import constantRouterMap from '@/router/routes'
import MainLayout from '@/layouts/main-layout'
import { getDictMapAll } from '@/api/system/dictDetail'
import Vue from 'vue'

/*
 state.dict 结构示例：
      dict.label.user_status = {'true': '激活', 'false': '禁用'}      // value映射到标签
      dict.dict.user_status  = {'true': {'激活':true, id:1}, 'false':  {'禁用':false, id:2}} // 值
      dict.user_status = [{'激活':true, id:1}, {'禁用':false, id:2}]  // 字典数组
 */
const state = {
  routers: constantRouterMap,
  addRouters: [],
  dict: { dict: {}, label: {} }
}

const getters = {
  permission_routers: state => state.routers,
  addRouters: state => state.addRouters,
  dict: state => state.dict
}

const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.addRouters = routers
    state.routers = constantRouterMap.concat(routers)
  },
  SET_DICT_ALL: (state, dictMapAll) => {
    for (const n of Object.keys(dictMapAll)) {
      Vue.set(state.dict.dict, n, {})
      Vue.set(state.dict.label, n, {})
      Vue.set(state.dict, n, dictMapAll[n])
      dictMapAll[n].forEach(d => {
        Vue.set(state.dict.dict[n], d.value, d)
        Vue.set(state.dict.label[n], d.value, d.label)
      })
    }
  }
}

const actions = {
  GenerateRoutes({ commit }, asyncRouter) {
    commit('SET_ROUTERS', asyncRouter)
  },
  LoadDictAll({ commit }) {
    return new Promise((resolve, reject) => {
      getDictMapAll().then(res => {
        commit('SET_DICT_ALL', res.data)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export const filterAsyncRouter = (routers) => { // 遍历后台传来的路由字符串，转换为组件对象
  return routers.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = MainLayout
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }
    /*
    if (router.meta) {
      router.meta.auth = true
    } else {
      router.meta = { auth: true }
    }*/
    return true
  })
}

export const loadView = (view) => {
  return (resolve) => require([`@/pages/${view}`], resolve)
  // return () => import(`pages/${view}`)
}

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions
}
