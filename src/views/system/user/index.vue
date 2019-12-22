<template>
  <div class="app-container">
    <!--form 组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dict.user_status"/>
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
          <el-input v-model="query.blurry" clearable placeholder="输入工号或者姓名搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </div>
        <!--表格渲染-->
        <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
          <el-table-column prop="jobNumber" label="工号"/>
          <el-table-column prop="staffName" label="姓名"/>
          <el-table-column prop="dptName" label="部门"/>
          <el-table-column prop="telephone" label="电话"/>
          <el-table-column prop="email" label="邮箱"/>
          <el-table-column prop="baseSalary" label="底薪"/>
          <el-table-column prop="perf" label="绩效"/>
          <el-table-column prop="remark" label="备注"/>
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
import { del, downloadUser, edit } from '@/api/user'
import { getDepts } from '@/api/dept'
import { parseTime, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  name: 'User',
  components: { eForm },
  mixins: [initData],
  // 设置数据字典
  dicts: ['user_status'],
  data() {
    return {
      deptName: '',
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
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/CrewManage/SearchCrewInfo'
      const sort = 'id,desc'
      const query = this.query
      const deptName = this.deptName
      const blurry = query.blurry
      const enabled = query.enabled
      this.params = { page: this.page, size: this.size, sort: sort, deptId: this.deptId }
      if (blurry) { this.params['blurryStr'] = blurry }
      if (deptName) { this.params['deptName'] = deptName }
      if (query.date) {
        this.params['startTime'] = query.date[0]
        this.params['endTime'] = query.date[1]
      }
      if (enabled !== '' && enabled !== null) { this.params['enabled'] = enabled }
      return true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadUser(this.params).then(result => {
        downloadFile(result, '用户列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
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
      if (data.pid === 0) {
        this.deptId = null
      } else {
        this.deptId = data.id
      }
      this.init()
    },
    add() {
      this.isAdd = true
      this.$refs.form.getDepts()
      this.$refs.form.getRoles()
      this.$refs.form.getRoleLevel()
      this.$refs.form.dialog = true
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime' || j === 'lastPasswordResetTime') {
          return parseTime(v[j])
        } else if (j === 'enabled') {
          return parseTime(v[j]) ? '启用' : '禁用'
        } else {
          return v[j]
        }
      }))
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getRoles()
      _this.getDepts()
      _this.getRoleLevel()
      _this.roleIds = []
      _this.form = { id: data.id, username: data.username, phone: data.phone, email: data.email, enabled: data.enabled.toString(), roles: [], dept: { id: data.dept.id }, job: { id: data.job.id }}
      data.roles.forEach(function(data, index) {
        _this.roleIds.push(data.id)
      })
      _this.deptId = data.dept.id
      _this.jobId = data.job.id
      _this.getJobs(_this.deptId)
      _this.dialog = true
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.user_status[val] + '" ' + data.username + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        edit(data).then(res => {
          this.$notify({
            title: this.dict.label.user_status[val] + '成功',
            type: 'success',
            duration: 2500
          })
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.response.data.message)
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    }
  }
}
</script>

<style scoped>
</style>
