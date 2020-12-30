import request from '@/utils/request'

export function getMenusTree(pid) {
  return request({
    url: 'api/menu/lazy?pid=' + pid,
    method: 'get'
  })
}

export function getMenus(params) {
  return request({
    url: 'api/menu',
    method: 'get',
    params
  })
}

export function getMenuSuperior(ids) {
  const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
  return request({
    url: 'api/menu/superior',
    method: 'post',
    data
  })
}

export function buildMenus() {
  return request({
    url: 'api/menu/build',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/menu',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/menu',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/menu',
    method: 'put',
    data
  })
}

export default { add, edit, del, getMenusTree, getMenuSuperior, getMenus }
