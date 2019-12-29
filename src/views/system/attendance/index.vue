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
      <!--用户数据-->
      <el-col :xs="15" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <!-- 搜索 -->
          <el-input v-model="workerNo" clearable placeholder="输入工号或者姓名搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-date-picker
            v-model="query.date"
            type="daterange"
            range-separator=":"
            class="el-range-editor--small filter-item"
            style="height: 30.5px;width: 220px"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <el-button class="filter-item" size="mini" type="warning" icon="el-icon-sort" @click="doSyncData">数据同步</el-button>
        </div>
        <!--表格渲染-->
        <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
          <el-table-column prop="workerNo" label="工号" width="80" fixed/>
          <el-table-column prop="name" label="姓名" width="90" fixed/>
          <el-table-column prop="depName" label="部门" width="140"/>
          <el-table-column prop="position" label="岗位" width="100"/>
          <el-table-column prop="scheduleName" label="班次" width="140"/>
          <el-table-column prop="workerDateStr" label="工作日" width="100"/>
          <el-table-column prop="dayOfTheWeekStr" label="星期" width="90"/>
          <el-table-column prop="checkInTime" label="上班刷卡时间" width="100"/>
          <el-table-column prop="checkOutTime" label="下班刷卡时间" width="100"/>
          <el-table-column prop="checkInStatusStr" label="上班刷卡状态" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.checkInStatus === 1" style="color: blue">迟到</span>
              <span v-else-if="scope.row.checkInStatus === 2" style="color: red">缺卡</span>
              <span v-else>正常</span>
            </template>
          </el-table-column>
          <el-table-column prop="checkOutStatusStr" label="下班刷卡状态" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.checkOutStatus === 1" style="color: blue">迟到</span>
              <span v-else-if="scope.row.checkOutStatus === 2" style="color: red">缺卡</span>
              <span v-else>正常</span>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <el-pagination
          :total="total"
          :current-page="page + 1"
          style="margin-top: 8px;"
          layout="total, prev, pager, next, sizes"
          @size-change="sizeChange"
          @current-change="pageChange"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { getDepts } from '@/api/dept'
import { syncAttendanceData } from '@/api/attendance'

export default {
  name: 'Attendance',
  mixins: [initData],
  data() {
    return {
      deptName: '',
      workerNo: '',
      startDate: '',
      endDate: '',
      height: document.documentElement.clientHeight - 180 + 'px;', isAdd: false,
      delLoading: false,
      depts: [],
      deptId: null,
      defaultProps: {
        children: 'children',
        label: 'dptName'
      }
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
      const sort = 'workerNo, workerdate asc'
      const query = this.query
      this.params = { page: this.page, size: this.size, sort: sort, deptId: this.deptId }
      if (this.deptName) { this.params['deptName'] = this.deptName }
      if (this.worker) {
        this.params['blurry'] = this.worker
      }
      if (query.date) {
        this.params['startDate'] = query.date[0]
        this.params['endDate'] = query.date[1]
      }
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
    doSyncData() {
      const query = this.query
      if (query.date) {
        this.startDate = query.date[0]
        this.endDate = query.date[1]
      }
      this.$confirm('此操作将会覆盖原来数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        syncAttendanceData({
          deptName: this.deptName,
          workerNo: this.workerNo,
          startDate: this.startDate,
          endDate: this.endDate
        }).then(res => {
          this.$message({
            type: 'success',
            message: '数据同步' + res.data + '笔成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消同步'
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
