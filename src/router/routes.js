/* Layout */
import MainLayout from 'layouts/main-layout.vue'
import LoginLayout from 'layouts/login-layout.vue'
// import BlankLayout from 'layouts/blank-layout.vue'

/**
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu(default is false)
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if set noredirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)（必须跟'page.vue'中的name完全一致，包括大小写，才能正确keep-alive）
 * meta : {
    （不支持）roles: ['admin','editor']    control the page roles (you can set multiple roles)
    auth: boolean                 true=need auth, default is false
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    caption: '副标题'             optional
    icon: 'name|img:path|base64' the icon show in the sidebar
    iconColor: 'text-gray'       不填默认primary
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view (default is false)
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

const routes = [
  {
    path: '/login',
    component: LoginLayout,
    children: [
      {
        path: '',
        name: 'user-login',
        hidden: true,
        component: () => import('pages/Login.vue'),
        meta: { title: '登录', icon: 'add', noCache: true }
      }
    ]
  }, {
    path: '/register',
    component: LoginLayout,
    children: [
      {
        path: '',
        name: 'user-register',
        hidden: true,
        component: () => import('pages/Register.vue'),
        meta: { title: '注册', icon: 'add', noCache: true }
      }
    ]
  }, {
    path: '/user',
    component: MainLayout,
    children: [
      {
        path: 'center',
        name: 'user-center',
        hidden: true,
        component: () => import('pages/system/user/center.vue'),
        meta: { title: '用户设置', icon: 'add', noCache: true }
      }
    ]
  }, {
    path: '/redirect',
    component: MainLayout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('pages/redirect.vue'),
        meta: { title: 'jump', icon: 'add', noCache: true }
      }
    ]
  }, {
    path: '/',
    component: MainLayout,
    redirect: '/',
    children: [
      {
        path: '',
        name: 'Index',
        component: () => import('pages/Index.vue'),
        meta: { title: '首页', icon: 'home', affix: true, noCache: true, auth: true }
      }
    ]
  }, {
    path: '/pageIcon',
    component: MainLayout,
    name: 'PageIcon',
    alwaysShow: false,
    redirect: 'noredirect',
    meta: { title: '应用图标' },
    children: [
      {
        path: 'index',
        name: 'PageIconShow',
        component: () => import('pages/PageIcons.vue'),
        meta: { title: '图标', icon: 'insert_emoticon' }
      }
    ]
  }, {
    path: '/401',
    component: MainLayout,
    hidden: true,
    children: [
      { path: '', component: () => import('pages/Error401.vue') }
    ]
  }, {
    path: '/404',
    component: MainLayout,
    hidden: true,
    children: [
      { path: '', component: () => import('pages/Error404.vue') }
    ]
  }

  /*
  }, {
    path: 'http://baidu.com',
    component: MainLayout,
    meta: { title: '百度', icon: 'link' }
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: MainLayout,
    hidden: true,
    children: [
      { path: '', component: () => import('pages/Error404.vue') }
    ]
  }*/
]

export default routes
