import request from '@/utils/request'

/*
 * 染色体微整列分析
 */

export function add(data) {
  return request({
    url: 'api/trace/trace-cma',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/trace/trace-cma',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/trace/trace-cma',
    method: 'put',
    data
  })
}

export default { add, edit, del }
