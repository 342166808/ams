import request from '@/utils/request'

/**
 * 获取班次设置列表
 * @param params
 * @constructor
 */
export function getWorkShiftsList(params) {
  return request({
    url: '/api/shiftsManagement/getWorkshiftsList',
    method: 'get',
    params
  })
}

/**
 * 获取班次详情
 * @param params
 * @constructor
 */
export function getWorkShiftsInfo(params) {
  return request({
    url: '/api/shiftsManagement/getWorkShiftsInfo',
    method: 'get',
    params
  })
}

/**
 * 新增/更新班次配置
 * @param data
 * @constructor
 */
export function updateWorkShifts(params) {
  return request({
    url: '/api/shiftsManagement/updateWorkshifts',
    method: 'get',
    params
  })
}

/**
 * 删除班次配置
 * @param data
 * @constructor
 */
export function deleteWorkShifts(params) {
  return request({
    url: '/api/shiftsManagement/deleteWorkshifts',
    method: 'get',
    params
  })
}
