<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入部门名称搜索" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" :data="data" row-key="id" size="small">
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
export default {
  name: 'Dept',
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
      const sort = 'dptNumber,dptName'
      this.params = { value: this.dptName, page: this.page, size: this.size, sort: sort }
      const query = this.query
      const value = query.value
      if (value) { this.params['dptName'] = value }
      if (query.date) {
        this.params['startTime'] = query.date[0]
        this.params['endTime'] = query.date[1]
      }
      return true
    }
  }
}
</script>

<style scoped>

</style>
