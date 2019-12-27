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
            placeholder="选择年"
            style="top:-3px;"/>
          <el-select v-model="month" placeholder="选择月" style="top:-3px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </div>
        <el-tabs type="border-card">
          <el-tab-pane label="列表模式">
            <!--表格渲染-->
            <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
              <el-table-column prop="deptName" label="部门名称"/>
              <el-table-column prop="overtimeHours" label="加班时长"/>
              <el-table-column prop="leaveEarlyTimes" label="早退次数"/>
              <el-table-column prop="convertOvertimeHours" label="折算后加班时长"/>
              <el-table-column prop="totalPlayDays" label="总休息天数"/>
              <el-table-column prop="summaryDate" label="汇总月份"/>
              <el-table-column prop="deptStaffCount" label="部门人员数量"/>
              <el-table-column prop="missingCardTimes" label="缺卡次数"/>
              <el-table-column prop="lateTimes" label="迟到次数"/>
              <el-table-column prop="leaveTimes" label="请假次数"/>
              <el-table-column prop="totalWorkingDays" label="总工作日"/>
              <el-table-column prop="totalHolidayDays" label="总节假日"/>
              <el-table-column prop="totalDays" label="总天数"/>
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
            <el-col :xs="15" :sm="18" :md="20" :lg="20" :xl="20">
              123
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { getDepts } from '@/api/dept'

export default {
  name: 'ReportDept',
  mixins: [initData],
  // 设置数据字典
  data() {
    return {
      year: '2019',
      month: '12',
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
      }]
    }
  },
  created() {
    this.getDeptDatas()
    this.$nextTick(() => {
      this.init()
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
    }
  }
}
</script>

<style scoped>
</style>
