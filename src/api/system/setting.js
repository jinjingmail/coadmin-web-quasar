import request from '@/utils/request'

/*
 * 系统参数
 */

export function add(data) {
  return request({
    url: 'api/setting',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/setting',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/setting',
    method: 'put',
    data
  })
}

export default { add, edit, del }
