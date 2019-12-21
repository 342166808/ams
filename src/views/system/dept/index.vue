<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入部门名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 导出 -->
      <!--<div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出</el-button>
      </div>-->
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dict.dept_status"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" :default-expand-all="expand" :data="data" row-key="id" size="small">
      <el-table-column label="编号" prop="dptNumber" width="120px"/>
      <el-table-column label="名称" prop="dptName" width="220px"/>
      <el-table-column label="备注" prop="remark"/>
      <el-table-column v-if=" false /*checkPermission(['admin','dept:edit','dept:del'])*/" label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['admin','dept:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','dept:del']"
            :ref="scope.row.dptNumber"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.dptNumber].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.dptNumber)">确定</el-button>
            </div>
            <el-button slot="reference" :disabled="scope.row.dptNumber === 1" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, edit, downloadDept } from '@/api/dept'
import { parseTime, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  name: 'Dept',
  components: { eForm },
  mixins: [initData],
  // 设置数据字典
  dicts: ['dept_status'],
  data() {
    return {
      enabledTypeOptions: [
        { key: 'true', display_name: '正常' },
        { key: 'false', display_name: '禁用' }
      ],
      delLoading: false, expand: true
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/departmentInfo'
      const sort = 'dptNumber,dptName'
      this.params = { value: this.dptName, page: this.page, size: this.size, sort: sort }
      const query = this.query
      const value = query.value
      const enabled = query.enabled
      if (value) { this.params['dptName'] = value }
      if (query.date) {
        this.params['startTime'] = query.date[0]
        this.params['endTime'] = query.date[1]
      }
      if (enabled !== '' && enabled !== null) { this.params['enabled'] = enabled }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
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
    add() {
      this.isAdd = true
      const _this = this.$refs.form
      _this.getDepts()
      _this.dialog = true
    },
    changeExpand() {
      this.expand = !this.expand
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getDepts()
      _this.form = {
        dptNumber: data.dptNumber,
        dptName: data.dptName,
        remark: data.remark
      }
      _this.dialog = true
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.dept_status[val] + '" ' + data.name + '部门, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        edit(data).then(res => {
          this.$notify({
            title: this.dict.label.dept_status[val] + '成功',
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
    },
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadDept(this.params).then(result => {
        downloadFile(result, '部门列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
