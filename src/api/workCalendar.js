import request from '@/utils/request'

/**
 * 查询工作日历
 * @param params
 * @constructor
 */
export function getWorkCalendar(params) {
  return request({
    url: '/api/SystemConfig/GetWorkCalendar',
    method: 'get',
    params
  })
}

/**
 * 批量或单条设置日期类型
 * @param data
 * @constructor
 */
export function setWorkDateType(data) {
  return request({
    url: '/api/SystemConfig/SetWorkDateType',
    method: 'post',
    data
  })
}

/**
 * 生成选择日期范围内的工作日历
 * @param data
 * @constructor
 */
export function createWorkCalendar(data) {
  return request({
    url: '/api/CreateWorkCalendar',
    method: 'post',
    data
  })
}
