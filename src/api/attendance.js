import request from '@/utils/request'

/**
 * 考勤数据明细
 * @param params
 */
export function getAttendanceDailyInfoList(params) {
  return request({
    url: '/api/attendanceManage/getAttendanceDailyInfoList',
    method: 'get',
    params
  })
}

/**
 * 部门考勤数据汇总
 * @param params
 */
export function getAttendanceDeptSummaryList(params) {
  return request({
    url: '/api/attendanceManage/getAttendanceDeptSummaryList',
    method: 'get',
    params
  })
}

/**
 * 员工考勤数据汇总
 * @param params
 */
export function getAttendanceSummaryList(params) {
  return request({
    url: '/api/attendanceManage/getAttendanceSummaryList',
    method: 'get',
    params
  })
}

/**
 * 员工考勤数据同步
 * @param params
 */
export function syncAttendanceData(params) {
  return request({
    url: '/api/attendanceManage/syncAttendanceData',
    method: 'get',
    params
  })
}

/**
 * 获取昨日考勤数据
 * @param params
 */
export function getYesterdayAttendanceInfo(params) {
  return request({
    url: '/api/attendanceManage/getYesterdayAttendanceInfo',
    method: 'get',
    params
  })
}

/**
 * 获取昨日考勤数据
 * @param params
 */
export function getAttendanceStatisticsList(params) {
  return request({
    url: '/api/attendanceManage/getAttendanceStatisticsList',
    method: 'get',
    params
  })
}
