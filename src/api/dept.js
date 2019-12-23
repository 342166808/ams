import request from '@/utils/request'

export function getDepts(params) {
  return request({
    url: '/api/departmentManage/getDepartmentInfo',
    method: 'get',
    params
  })
}

export function searchDepts(params) {
  return request({
    url: '/api/departmentManage/searchDepartmentInfo',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/dept',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/dept/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/dept',
    method: 'put',
    data
  })
}

export function downloadDept(params) {
  return request({
    url: '/api/departmentInfo',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
