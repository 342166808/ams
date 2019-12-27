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
