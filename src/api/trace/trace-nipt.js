import request from '@/utils/request'

/*
 * 无创产前筛查
 */

export function add(data) {
  return request({
    url: 'api/trace/trace-nipt',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/trace/trace-nipt',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/trace/trace-nipt',
    method: 'put',
    data
  })
}

export default { add, edit, del }
