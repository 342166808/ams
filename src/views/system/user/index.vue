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
          <el-input v-model="query.blurry" clearable placeholder="输入工号或者姓名搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </div>
        <!--表格渲染-->
        <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
          <el-table-column prop="jobNumber" label="工号" style="width: 80px"/>
          <el-table-column prop="staffName" label="姓名" style="width: 90px"/>
          <el-table-column prop="postName" label="岗位" style="width: 90px"/>
          <el-table-column prop="dptName" label="部门" style="width: 110px"/>
          <el-table-column prop="telephone" label="电话" style="width: 110px"/>
          <el-table-column prop="email" label="邮箱" style="width: 120px"/>
          <el-table-column prop="baseSalary" label="底薪" style="width: 60px"/>
          <el-table-column prop="perf" label="绩效" style="width: 60px"/>
          <el-table-column prop="remark" label="备注"/>
          <el-table-column v-if="checkPermission(['admin','user:edit','user:del'])" label="操作" width="125" align="center" fixed="right">
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
import eForm from './form'
export default {
  name: 'User',
  components: { eForm },
  mixins: [initData],
  // 设置数据字典
  data() {
    return {
      isAdd: false,
      deptName: '',
      height: document.documentElement.clientHeight - 180 + 'px;',
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
      this.url = 'api/CrewManage/SearchCrewInfo'
      const sort = 'id,desc'
      const query = this.query
      const blurry = query.blurry
      this.params = { page: this.page, size: this.size, sort: sort, deptId: this.deptId }
      if (blurry) { this.params['blurryStr'] = blurry }
      if (this.deptName) { this.params['dptName'] = this.deptName }
      if (query.date) {
        this.params['startTime'] = query.date[0]
        this.params['endTime'] = query.date[1]
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
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getDepts(function() {
        _this.form = {
          id: data.id,
          staffName: data.staffName,
          jobNumber: data.jobNumber,
          postName: data.postName,
          dptName: data.dptName,
          dptCode: data.dptCode,
          telephone: data.telephone,
          baseSalary: data.baseSalary,
          perf: data.perf,
          email: data.email,
          remark: data.remark
        }
        _this.dialog = true
      })
    }
  }
}
</script>

<style scoped>
</style>
