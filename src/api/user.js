import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/users',
    method: 'post',
    data
  })
}

export function getUser(params) {
  return request({
    url: 'CrewManage/SearchCrewInfo',
    method: 'get',
    params
  })
}

export function editUser(data) {
  return request({
    url: 'api/CrewManage/EditCrewInfo',
    method: 'post',
    data
  })
}


export function downloadUser(params) {
  return request({
    url: 'api/users/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function del(id) {
  return request({
    url: 'api/users/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/users',
    method: 'put',
    data
  })
}

export function updatePass(user) {
  const data = {
    oldPass: user.oldPass,
    newPass: user.newPass
  }
  return request({
    url: 'api/users/updatePass/',
    method: 'post',
    data
  })
}

export function updateEmail(code, data) {
  return request({
    url: 'api/users/updateEmail/' + code,
    method: 'post',
    data
  })
}
