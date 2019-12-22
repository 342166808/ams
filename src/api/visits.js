import request from '@/utils/request'

export function count() {
  return request({
    url: 'auth/visits',
    method: 'post'
  })
}

export function get() {
  return request({
    url: 'auth/visits',
    method: 'get'
  })
}

export function getChartData() {
  return request({
    url: 'auth/visits/chartData',
    method: 'get'
  })
}
