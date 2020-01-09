<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
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
          <el-select v-model="checkInStatus" placeholder="请选择上班状态" style="top: -3px; width: 150px;">
            <el-option
              v-for="item in checkInOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-select v-model="checkOutStatus" placeholder="请选择下班状态" style="top: -3px; width: 150px;">
            <el-option
              v-for="item in checkOutOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-date-picker
            v-model="startDate"
            :picker-options="pickerOptions"
            align="right"
            type="date"
            style="top: -3px; width: 150px;"
            placeholder="选择开始时间"/>
          <el-date-picker
            v-model="endDate"
            :picker-options="pickerOptions"
            align="right"
            type="date"
            style="top: -3px; width: 150px;"
            placeholder="选择结束时间"/>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-sort" @click="doSyncData">数据同步</el-button>
          <!-- 导出 -->
          <el-button
            :loading="downloadLoading"
            size="mini"
            class="filter-item"
            type="warning"
            icon="el-icon-download"
            @click="download">导出</el-button>
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
          <el-table-column prop="checkInTime" label="上班刷卡时间" width="100">
            <template slot-scope="scope">
              <span v-if="!scope.row.checkInTime || scope.row.checkInTime===''">--</span>
              <span v-else>{{ scope.row.checkInTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="checkOutTime" label="下班刷卡时间" width="100">
            <template slot-scope="scope">
              <span v-if="!scope.row.checkOutTime || scope.row.checkOutTime===''">--</span>
              <span v-else>{{ scope.row.checkOutTime }}</span>
            </template>
          </el-table-column>
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
          <el-table-column v-if="checkPermission(['admin','user:edit','user:del'])" label="操作" width="125" align="center">
            <template slot-scope="scope">
              <el-button v-permission="['admin','user:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
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
import { syncAttendanceData, getModel } from '@/api/attendance'
import eForm from './form'

export default {
  name: 'Attendance',
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      isAdd: false,
      deptName: '',
      workerNo: '',
      startDate: '',
      endDate: '',
      height: document.documentElement.clientHeight - 180 + 'px;', isAdd: false,
      delLoading: false,
      depts: [],
      deptId: null,
      checkInStatus: -1,
      checkOutStatus: -1,
      defaultProps: {
        children: 'children',
        label: 'dptName'
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      checkInOptions: [{
        value: -1,
        label: '请选择上班状态'
      }, {
        value: 0,
        label: '上班异常'
      }, {
        value: 1,
        label: '正常'
      }, {
        value: 2,
        label: '迟到'
      }, {
        value: 3,
        label: '缺卡'
      }],
      checkOutOptions: [{
        value: -1,
        label: '请选择下班状态'
      }, {
        value: 0,
        label: '下班异常'
      }, {
        value: 1,
        label: '正常'
      }, {
        value: 2,
        label: '早退'
      }, {
        value: 3,
        label: '缺卡'
      }, {
        value: 4,
        label: '加班'
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
      const sort = 'workerNo, workerdate asc'
      this.params = { page: this.page, size: this.size, sort: sort, deptId: this.deptId }
      if (this.deptName) {
        this.params['deptName'] = this.deptName
      }
      if (this.workerNo) {
        this.params['blurry'] = this.workerNo
      }
      if (this.startDate) {
        this.params['startDate'] = this.startDate
      }
      if (this.endDate) {
        this.params['endDate'] = this.endDate
      }
      if (this.checkInStatus > -1) {
        this.params['checkInStatus'] = this.checkInStatus
      }
      if (this.checkOutStatus > -1) {
        this.params['checkOutStatus'] = this.checkOutStatus
      }
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
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      let checkInTime = data.checkInTime
      let checkOutTime = data.checkOutTime
      if (!checkInTime || checkInTime === '') {
        checkInTime = '00:00'
      }
      if (!checkOutTime || checkOutTime === '') {
        checkOutTime = '23:59'
      }
      // const checkInDT = new Date(2020, 1, 1, Number(checkInTime.split(':')[0]), Number(checkInTime.split(':')[1]))
      // const checkOutDT = new Date(2020, 1, 1, Number(checkOutTime.split(':')[0]), Number(checkOutTime.split(':')[1]))

      getModel({ id: data.id }).then(res => {
        _this.form = {
          id: data.id,
          name: data.name,
          workerNo: data.workerNo,
          depName: data.depName,
          workerDate: data.workerDate,
          checkInStatusStr: data.checkInStatusStr,
          checkOutStatusStr: data.checkOutStatusStr,
          checkInTime: checkInTime,
          checkOutTime: checkOutTime
        }
        _this.dialog = true
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    download() {
      this.$notify({
        title: '敬请期待',
        type: 'success',
        duration: 2500
      })
    }
  }
}
</script>

<style scoped>
</style>
