<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入部门名称搜索" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" :data="data" row-key="id" size="small">
      <el-table-column label="编号" prop="dptCode" width="120px"/>
      <el-table-column label="部门名称" prop="dptName" width="220px"/>
      <el-table-column label="班次类型" prop="workShiftType" width="220px"/>
      <el-table-column label="备注" prop="remark" width="210px"/>
      <el-table-column v-if=" checkPermission(['admin','dept:edit','dept:del'])" label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','dept:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import eForm from './form'
import { getDepts } from '@/api/dept'
export default {
  name: 'DepartmentInfo',
  components: { eForm },
  mixins: [initData],
  data() {
    return {

    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/DepartmentManage/SearchDepartmentInfo'
      const sort = 'dptCode, dptName'
      this.params = { value: this.dptName, page: this.page, size: this.size, sort: sort }
      const query = this.query
      const value = query.value
      if (value) { this.params['dptName'] = value }
      if (query.date) {
        this.params['startTime'] = query.date[0]
        this.params['endTime'] = query.date[1]
      }
      return true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      getDepts({ dptName: data.dptName }).then(res => {
        if (res.data.length === 0) {
          alert('未找到部门数据')
          return
        }
        if (res.data.length !== 1) {
          alert('找到多笔部门数据，未能执行更新')
          return
        }
        _this.getWorkShifts()
        _this.form = {
          id: res.data[0].id,
          dptCode: res.data[0].dptCode,
          dptName: res.data[0].dptName,
          workShiftsId: res.data[0].workShiftsId,
          remark: res.data[0].remark
        }
        _this.dialog = true
      }).catch(err => {
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
