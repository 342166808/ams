import request from '@/utils/request'

export function getAttendanceDailyInfoList(params) {
  return request({
    url: '/api/attendanceManage/getAttendanceDailyInfoList',
    method: 'get',
    params
  })
}
