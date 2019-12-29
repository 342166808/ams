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
          <el-date-picker
            v-model="year"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
            style="top:-3px;"/>
          <el-select v-model="month" placeholder="选择月" style="top:-3px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="doQuery">搜索</el-button>
        </div>
        <el-tabs type="border-card" @tab-click="test">
          <el-tab-pane label="列表模式">
            <!--表格渲染-->
            <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
              <el-table-column prop="deptName" label="部门名称" fix width="120"/>
              <el-table-column prop="overtimeHours" label="加班时长"/>
              <el-table-column prop="leaveEarlyTimes" label="早退次数"/>
              <el-table-column prop="convertOvertimeHours" label="折算后加班时长"/>
              <el-table-column prop="summaryDate" label="汇总时间"/>
              <el-table-column prop="attendanceStaffCount" label="实际出勤人数"/>
              <el-table-column prop="deptStaffCount" label="部门人员数量"/>
              <el-table-column prop="missingCardTimes" label="缺卡次数"/>
              <el-table-column prop="lateTimes" label="迟到次数"/>
              <el-table-column prop="leaveTimes" label="请假次数"/>
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
            <div v-for="(item,index) in echartDataList" :id="'myChart'+index" :key="index" :style="{width: ''+ barWith +'px', height: '300px'}" style=" float: left; margin-right: 10px; margin-bottom: 5px;"/>
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
import BarChart from '../../dashboard/BarChart'
import { getDepts } from '@/api/dept'

const animationDuration = 4000

export default {
  name: 'ReportDept',
  components: {
    BarChart
  },
  mixins: [initData],
  // 设置数据字典
  data() {
    return {
      year: '2019',
      month: '12',
      barWith: 500,
      deptName: '',
      height: document.documentElement.clientHeight - 180 + 'px;', isAdd: false,
      delLoading: false,
      depts: [],
      deptId: null,
      defaultProps: {
        children: 'children',
        label: 'dptName'
      },
      options: [{
        value: 0,
        label: '请选择月份'
      }, {
        value: 1,
        label: '1月份'
      }, {
        value: 2,
        label: '2月份'
      }, {
        value: 3,
        label: '3月份'
      }, {
        value: 4,
        label: '4月份'
      }, {
        value: 5,
        label: '5月份'
      }, {
        value: 6,
        label: '6月份'
      }, {
        value: 7,
        label: '7月份'
      }, {
        value: 8,
        label: '8月份'
      }, {
        value: 9,
        label: '9月份'
      }, {
        value: 10,
        label: '10月份'
      }, {
        value: 11,
        label: '11月份'
      }, {
        value: 12,
        label: '12月份'
      }],
      echartDataList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      echartDataDic: {}
    }
  },
  async created() {
    this.getDeptDatas()
    this.$nextTick(() => {
      this.init(function(that) {
        const dicDept = {}
        for (let i = 0; i < that.data.length; i++) {
          if (dicDept[that.data[i].deptName]) {
            const arr = dicDept[that.data[i].deptName]
            arr.push(that.data[i])
          } else {
            dicDept[that.data[i].deptName] = [that.data[i]]
          }
        }
        that.echartDataDic = dicDept
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
      this.url = 'api/attendanceManage/getAttendanceDeptSummaryList'
      const sort = 'deptName desc'
      let searchType = 1
      const deptName = this.deptName
      this.params = { page: this.page, size: this.size, sort: sort, deptId: this.deptId }
      if (deptName) {
        this.params['deptName'] = deptName
      }
      if (this.year) {
        this.params['year'] = this.year
      }
      if (this.month) {
        this.params['month'] = this.month
        searchType = 2
        if (!this.year || this.year === '') {
          this.$notify({
            title: '请先选择年份',
            type: 'error',
            duration: 2500
          })
          return
        }
      }
      this.params['searchType'] = searchType
      return true
    },
    getDeptDatas() {
      const sort = 'id,desc'
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
      const yAxisOvertimeHours = []
      const yAxisLeaveEarlyTimes = []
      const yAxisConvertOvertimeHours = []
      const yAxisDeptStaffCount = []
      const yAxisAttendanceStaffCount = []
      const yAxisMissingCardTimes = []
      const yAxisLateTimes = []
      const yAxisLeaveTimes = []
      const yAxisOvertimePay = []

      // TODO: 图表动态宽度

      for (let i = 0; i < list.length; i++) {
        xAxisData.push(list[i].summaryDate)
        yAxisOvertimeHours.push(list[i].overtimeHours)
        yAxisLeaveEarlyTimes.push(list[i].leaveEarlyTimes)
        yAxisConvertOvertimeHours.push(list[i].convertOvertimeHours)
        yAxisDeptStaffCount.push(list[i].deptStaffCount)
        yAxisAttendanceStaffCount.push(list[i].attendanceStaffCount)
        yAxisMissingCardTimes.push(list[i].missingCardTimes)
        yAxisLateTimes.push(list[i].lateTimes)
        yAxisLeaveTimes.push(list[i].leaveTimes)
        yAxisOvertimePay.push(list[i].overtimePay)
      }

      // 绘制图表
      myChart.setOption({
        title: { text: title },
        tooltip: {},
        legend: {
          orient: 'vertical',
          x: 'left',
          padding: [10, 10, 0, 290],
          selectedMode: false,
          itemWidth: 5,
          itemHeight: 5,
          icon: 'circle',
          data: [
            { value: yAxisOvertimeHours, name: '加班时长' },
            { value: yAxisLeaveEarlyTimes, name: '早退次数' },
            { value: yAxisMissingCardTimes, name: '折算后加班时长' },
            { value: yAxisAttendanceStaffCount, name: '实际出勤人数' },
            { value: yAxisDeptStaffCount, name: '部门人员数量' },
            { value: yAxisMissingCardTimes, name: '缺卡次数' },
            { value: yAxisLateTimes, name: '迟到次数' },
            { value: yAxisLeaveTimes, name: '请假次数' },
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
          name: '加班时长',
          type: 'bar',
          stack: 'vistors',
          color: 'green',
          barWidth: '60%',
          data: yAxisOvertimeHours,
          animationDuration
        }, {
          name: '早退次数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisLeaveEarlyTimes,
          animationDuration
        }, {
          name: '折算后加班时长',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisConvertOvertimeHours,
          animationDuration
        }, {
          name: '实际出勤人数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisAttendanceStaffCount,
          animationDuration
        }, {
          name: '部门人员数量',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisDeptStaffCount,
          animationDuration
        }, {
          name: '缺卡次数',
          type: 'bar',
          color: 'red',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisMissingCardTimes,
          animationDuration
        }, {
          name: '迟到次数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisLateTimes,
          animationDuration
        }, {
          name: '请假次数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: yAxisLeaveTimes,
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
      this.page = 0
      this.init(function(that) {
        const dicDept = {}
        for (let i = 0; i < that.data.length; i++) {
          if (dicDept[that.data[i].deptName]) {
            const arr = dicDept[that.data[i].deptName]
            arr.push(that.data[i])
          } else {
            dicDept[that.data[i].deptName] = [that.data[i]]
          }
        }
        that.echartDataDic = dicDept
        let i = 0
        for (const key in dicDept) {
          that.drawLine(i, key, dicDept[key])
          i++
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
