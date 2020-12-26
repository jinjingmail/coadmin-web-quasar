import request from '@/utils/request'

export function get(dictName) {
  const params = {
    dictName,
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/dictDetail',
    method: 'get',
    params
  })
}

export function getDictMap(dictName) {
  const params = {
    dictName,
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/dictDetail/map',
    method: 'get',
    params
  })
}

export function getDictMapAll() {
  return request({
    url: 'api/dictDetail/map/all',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/dictDetail',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/dictDetail/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/dictDetail',
    method: 'put',
    data
  })
}

export default { add, edit, del }
