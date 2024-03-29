import request from '@/utils/request'

/*
 * 就诊人
 */

export function add(data) {
  return request({
    url: 'api/trace/trace-patient',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/trace/trace-patient',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/trace/trace-patient',
    method: 'put',
    data
  })
}

export function updateTraceViewed(patientNo) {
  return request({
    url: `api/trace/trace-patient/update-trace-viewed/${patientNo}`,
    method: 'post'
  })
}

export default { add, edit, del }
