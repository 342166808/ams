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

export function editDepts(data) {
  return request({
    url: '/api/departmentManage/editDepartmentInfo',
    method: 'post',
    data
  })
}
