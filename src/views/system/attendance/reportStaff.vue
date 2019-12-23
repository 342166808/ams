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
          <el-input v-model="query.blurry" clearable placeholder="输入工号或者姓名搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
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
              <el-table-column prop="workerNo" label="工号"/>
              <el-table-column prop="name" label="姓名"/>
              <el-table-column prop="depName" label="部门" width="120"/>
              <el-table-column prop="position" label="岗位"/>
              <el-table-column prop="scheduleName" label="班次"/>
              <el-table-column prop="workerDateStr" label="工作日"/>
              <el-table-column prop="checkInTime" label="上班刷卡时间"/>
              <el-table-column prop="checkOutTime" label="下班刷卡时间"/>
              <el-table-column prop="checkInStatusStr" label="上班刷卡状态"/>
              <el-table-column prop="checkOutStatusStr" label="下班刷卡状态"/>
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
  name: 'ReportStaff',
  mixins: [initData],
  data() {
    return {
      year: '',
      month: '',
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
      this.url = 'api/attendanceManage/getAttendanceDailyInfoList'
      const sort = 'id,desc'
      const query = this.query
      const deptName = this.deptName
      const blurry = query.blurry
      this.params = { page: this.page, size: this.size, sort: sort, deptId: this.deptId }
      if (blurry) { this.params['blurry'] = blurry }
      if (deptName) { this.params['deptName'] = deptName }
      if (query.date) {
        this.params['startDate'] = query.date[0]
        this.params['endDate'] = query.date[1]
      }
      return true
    },
    getDeptDatas() {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (this.deptName) { params['name'] = this.deptName }
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
