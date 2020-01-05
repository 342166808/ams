<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :xs="9" :sm="6" :md="4" :lg="4" :xl="4">
        <div class="head-container">
          <el-input v-model="deptName" clearable placeholder="输入部门名称搜索" prefix-icon="el-icon-search" style="width: 100%;" class="filter-item" @input="getDeptDatas"/>
        </div>
        <el-tree :data="depts" :props="defaultProps" :expand-on-click-node="false" default-expand-all @node-click="handleNodeClick"/>
      </el-col>
      <el-col :xs="15" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <!-- 搜索 -->
          <el-input v-model="query.blurry" clearable placeholder="输入工号或者姓名搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="doQuery"/>
          <el-date-picker
            v-model="year"
            value-format="yyyy"
            type="year"
            placeholder="选择年"
            style="top:-3px;"/>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="doQuery">搜索</el-button>
        </div>
        <el-tabs type="border-card">
          <el-tab-pane label="列表模式">
            <!--表格渲染-->
            <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
              <el-table-column prop="workerNo" label="工号" fixed/>
              <el-table-column prop="name" label="姓名" fixed/>
              <el-table-column prop="summaryDate" label="汇总月份" fixed/>
              <el-table-column prop="deptName" label="部门" width="120"/>
              <!--<el-table-column prop="postName" label="岗位"/>-->
              <el-table-column prop="lateTimes" label="迟到次数">
                <template slot-scope="scope">
                  <span v-if="scope.row.lateTimes > 0" style="color: #EEEE00">{{ scope.row.lateTimes }}</span>
                  <span v-else>{{ scope.row.lateTimes }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="leaveEarlyTimes" label="早退次数">
                <template slot-scope="scope">
                  <span v-if="scope.row.leaveEarlyTimes > 0" style="color: #FF8C00">{{ scope.row.leaveEarlyTimes }}</span>
                  <span v-else>{{ scope.row.leaveEarlyTimes }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="missingCardTimes" label="缺卡次数">
                <template slot-scope="scope">
                  <span v-if="scope.row.missingCardTimes > 0" style="color: #FF4500">{{ scope.row.missingCardTimes }}</span>
                  <span v-else>{{ scope.row.missingCardTimes }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="leaveTimes" label="请假次数">
                <template slot-scope="scope">
                  <span v-if="scope.row.leaveTimes > 0" style="color: #CD9B1D">{{ scope.row.leaveTimes }}</span>
                  <span v-else>{{ scope.row.leaveTimes }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="leaveDays" label="请假天数">
                <template slot-scope="scope">
                  <span v-if="scope.row.leaveDays > 0" style="color: #8A2BE2">{{ scope.row.leaveDays }}</span>
                  <span v-else>{{ scope.row.leaveDays }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="workingDays" label="出勤天数"/>
              <el-table-column prop="totalPlayDays" label="休息日天数"/>
              <el-table-column prop="totalWorkingDays" label="工作日天数"/>
              <el-table-column prop="totalHolidayDays" label="节假日天数"/>
              <el-table-column prop="overtimeHours" label="加班时长"/>
              <el-table-column prop="convertOvertimeHours" label="折算后加班时长" width="120"/>
              <el-table-column prop="overtimePay" label="加班费"/>
            </el-table>
            <!--分页组件-->
            <el-pagination
              :total="total"
              :current-page="page + 1"
              style="margin-top: 8px;"
              layout="total, prev, pager, next, sizes"
              @size-change="sizeChange"
              @current-change="pageChange"/>
          </el-tab-pane>
          <el-tab-pane label="图表模式">
            <div v-for="(item,index) in echartDataList" :id="'myChart'+index" :key="index" :style="{width: '300px', height: '300px'}" style=" float: left; margin-right: 10px; margin-bottom: 5px;"/>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { getDepts } from '@/api/dept'
const animationDuration = 4000

export default {
  name: 'ReportStaff',
  mixins: [initData],
  data() {
    return {
      year: (new Date()).getFullYear().toString(),
      deptName: '',
      height: document.documentElement.clientHeight - 180 + 'px;', isAdd: false,
      delLoading: false,
      depts: [],
      deptId: null,
      defaultProps: {
        children: 'children',
        label: 'dptName'
      },
      echartDataList: [],
      echartDataDic: {}
    }
  },
  created() {
    this.getDeptDatas()
    this.$nextTick(() => {
      this.init(function(that) {
        const dicDept = {}
        for (let i = 0; i < that.data.length; i++) {
          if (dicDept[that.data[i].name]) {
            const arr = dicDept[that.data[i].name]
            arr.push(that.data[i])
          } else {
            dicDept[that.data[i].name] = [that.data[i]]
          }
        }
        that.echartDataDic = dicDept
        const size = Object.keys(dicDept).length
        that.echartDataList.length = size
        let i = 0
        for (const key in dicDept) {
          that.drawLine(i, key, dicDept[key])
          i++
        }
      })
    })
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/attendanceManage/getAttendanceSummaryList'
      const sort = 'deptName asc, name'
      const searchType = 1
      const query = this.query
      const blurry = query.blurry
      this.params = { page: this.page, size: this.size, sort: sort, deptId: this.deptId }
      if (blurry) { this.params['worker'] = blurry }
      if (this.deptName) { this.params['deptName'] = this.deptName }
      if (this.year) {
        this.params['year'] = this.year
      }
      if (query.date) {
        this.params['startDate'] = query.date[0]
        this.params['endDate'] = query.date[1]
      }
      this.params['searchType'] = searchType
      return true
    },
    getDeptDatas() {
      const sort = 'dptCode'
      const params = { sort: sort }
      if (this.deptName) { params['dptName'] = this.deptName }
      getDepts(params).then(res => {
        this.depts = res.data
      })
    },
    handleNodeClick(data) {
      this.deptName = data.dptName
      this.init()
    },
    drawLine(index, title, list) {
      // 基于准备好的dom，初始化echarts实例
      // TODO:动态div容器
      const myChart = echarts.init(document.getElementById('myChart' + index))
      const xAxisData = []
      const yAxisWorkingDays = []
      const yAxisLateTimes = []
      const yAxisLeaveEarlyTimes = []
      const yAxisMissingCardTimes = []
      const yAxisLeaveTimes = []
      const yAxisOvertimeHours = []
      const yAxisConvertOvertimeHours = []
      const yAxisTotalPlayDays = []
      const yAxisTotalWorkingDays = []
      const yAxisTotalHolidayDays = []
      const yAxisOvertimePay = []
      const yAxisLeaveDays = []

      for (let i = 0; i < list.length; i++) {
        xAxisData.push(list[i].summaryDate)
        yAxisWorkingDays.push(list[i].workingDays)
        yAxisLateTimes.push(list[i].lateTimes)
        yAxisLeaveEarlyTimes.push(list[i].leaveEarlyTimes)
        yAxisMissingCardTimes.push(list[i].missingCardTimes)
        yAxisOvertimeHours.push(list[i].overtimeHours)
        yAxisLeaveTimes.push(list[i].leaveTimes)
        yAxisConvertOvertimeHours.push(list[i].convertOvertimeHours)
        yAxisTotalPlayDays.push(list[i].totalPlayDays)
        yAxisTotalWorkingDays.push(list[i].totalWorkingDays)
        yAxisTotalHolidayDays.push(list[i].totalHolidayDays)
        yAxisOvertimePay.push(list[i].overtimePay)
        yAxisLeaveDays.push(list[i].leaveDays)
      }

      // 绘制图表
      myChart.setOption({
        title: { text: title },
        tooltip: {},
        legend: {
          orient: 'vertical',
          x: 'left',
          padding: [10, 10, 0, 200],
          selectedMode: false,
          itemWidth: 5,
          itemHeight: 5,
          icon: 'circle',
          data: [
            { value: yAxisWorkingDays, name: '出勤天数' },
            { value: yAxisLateTimes, name: '迟到次数' },
            { value: yAxisLeaveEarlyTimes, name: '早退次数' },
            { value: yAxisMissingCardTimes, name: '缺卡次数' },
            { value: yAxisLeaveTimes, name: '请假次数' },
            { value: yAxisLeaveDays, name: '请假天数' },
            { value: yAxisOvertimeHours, name: '加班时长' },
            { value: yAxisConvertOvertimeHours, name: '折算后加班时长' },
            { value: yAxisTotalPlayDays, name: '总休息日天数' },
            { value: yAxisTotalWorkingDays, name: '总工作日天数' },
            { value: yAxisTotalHolidayDays, name: '总节假日天数' },
            { value: yAxisOvertimePay, name: '加班费' }
          ]
        },
        grid: { // 调整图表与容器距离
          left: '4%',
          right: '44%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: xAxisData,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '出勤天数',
          type: 'bar',
          stack: 'vistors',
          color: 'green',
          barWidth: '60%',
          data: yAxisWorkingDays,
          animationDuration
        }, {
          name: '迟到次数',
          type: 'bar',
          color: '#EEEE00',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisLateTimes,
          animationDuration
        }, {
          name: '早退次数',
          type: 'bar',
          color: '#FF8C00',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisLeaveEarlyTimes,
          animationDuration
        }, {
          name: '缺卡次数',
          type: 'bar',
          color: '#FF4500',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisMissingCardTimes,
          animationDuration
        }, {
          name: '请假次数',
          type: 'bar',
          color: '#CD9B1D',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisLeaveTimes,
          animationDuration
        }, {
          name: '请假天数',
          type: 'bar',
          color: '#CD9B1D',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisLeaveDays,
          animationDuration
        }, {
          name: '加班时长',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisOvertimeHours,
          animationDuration
        }, {
          name: '折算后加班时长',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisConvertOvertimeHours,
          animationDuration
        }, {
          name: '总休息日天数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisTotalPlayDays,
          animationDuration
        }, {
          name: '总工作日天数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisTotalWorkingDays,
          animationDuration
        }, {
          name: '总节假日天数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisTotalHolidayDays,
          animationDuration
        }, {
          name: '加班费',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisOvertimePay,
          animationDuration
        }]
      })
    },
    doQuery() {
      this.$nextTick(() => {
        this.page = 0
        this.init(function(that) {
          const dicDept = {}
          for (let i = 0; i < that.data.length; i++) {
            if (dicDept[that.data[i].name]) {
              const arr = dicDept[that.data[i].name]
              arr.push(that.data[i])
            } else {
              dicDept[that.data[i].name] = [that.data[i]]
            }
          }
          that.echartDataDic = dicDept
          const size = Object.keys(dicDept).length
          that.echartDataList.length = size
          let i = 0
          for (const key in dicDept) {
            that.drawLine(i, key, dicDept[key])
            i++
          }
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
