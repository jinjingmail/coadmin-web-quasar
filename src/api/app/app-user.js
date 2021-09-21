import request from '@/utils/request'

/*
 * APP用户
 */

export function add(data) {
  return request({
    url: 'api/app/app-user',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/app/app-user',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/app/app-user',
    method: 'put',
    data
  })
}

export default { add, edit, del }
