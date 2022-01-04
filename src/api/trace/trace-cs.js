import request from '@/utils/request'

/*
 * 染色体核型结果
 */

export function add(data) {
  return request({
    url: 'api/trace/trace-cs',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/trace/trace-cs',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/trace/trace-cs',
    method: 'put',
    data
  })
}

export default { add, edit, del }
