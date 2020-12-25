import constantRouterMap from '@/router/routes'
import MainLayout from '@/layouts/MainLayout'

const state = {
  routers: constantRouterMap,
  addRouters: []
}

const getters = {
  permission_routers: state => state.routers,
  addRouters: state => state.addRouters
}

const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.addRouters = routers
    state.routers = constantRouterMap.concat(routers)
  }
}

const actions = {
  GenerateRoutes({ commit }, asyncRouter) {
    commit('SET_ROUTERS', asyncRouter)
  }
}

export const filterAsyncRouter = (routers) => { // 遍历后台传来的路由字符串，转换为组件对象
  return routers.filter(router => {
    if (router.component) {
      console.log('router.component =', router.component)
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
