import { LoadingBar } from 'quasar'
// import store from '@/store'
import Setting from '@/default-setting'
import { getToken } from '@/utils/auth' // getToken from cookie
import { buildMenus } from '@/api/system/menu'
import { filterAsyncRouter } from '@/store/module-permission'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default ({ app, router, store, Vue }) => {
  // Check for protected and guest routes and perform checks
  router.beforeEach((to, from, next) => {
    if (to.meta.title) {
      document.title = to.meta.title + ' - ' + Setting.title
    }
    LoadingBar.start()
    if (getToken()) {
      // 已登录且要跳转的页面是登录页
      if (to.path === '/login') {
        next({ path: '/' })
        LoadingBar.stop()
      } else {
        if (store.getters['user/roles'].length === 0) { // 判断当前用户是否已拉取完user_info信息
          store.dispatch('user/GetInfo').then(() => { // 拉取user_info
            // 动态路由，拉取菜单
            loadMenus(next, to)
          }).catch(() => {
            store.dispatch('user/LogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          })
        } else if (store.getters['user/loadMenus']) { // 登录时未拉取 菜单，在此处拉取
          // 修改成false，防止死循环
          store.dispatch('user/updateLoadMenus')
          loadMenus(next, to)
        } else {
          next()
          LoadingBar.stop()
        }
      }
    } else {
      /* has no token*/
      if (!to.meta.auth) { // 在免登录白名单，直接进入
        next()
        LoadingBar.stop()
      } else {
        next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
        LoadingBar.stop()
      }
    }
    /*
    const protectedRoute = to.matched.some(route => route.meta.auth)
    // Allow guest routes
    if (!protectedRoute) return next()

    // If auth is required and the user is logged in, verify the token...
    if (store.getters['user/isAuthed']) {
      return store.dispatch('user/validate').then(user => {
        user ? next() : next({ name: 'user-login', query: { redirect: to.fullPath } })
        LoadingBar.stop()
      })
    }
    next({ name: 'user-login', query: { redirect: to.fullPath } })
    LoadingBar.stop()
    */
  })

  const loadMenus = (next, to) => {
    buildMenus().then(res => {
      const asyncRouter = filterAsyncRouter(res)
      asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
      store.dispatch('permission/GenerateRoutes', asyncRouter).then(() => { // 存储路由
        router.addRoutes(asyncRouter) // 动态添加可访问路由表
        next({ ...to, replace: true })
        LoadingBar.stop()
      })
    })
  }

  router.afterEach(() => {
    LoadingBar.stop()
  })
}
