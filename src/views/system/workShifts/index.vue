<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <el-row :gutter="20">
      <el-col :xs="15" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <!-- 搜索 -->
          <el-input v-model="workShiftType" clearable placeholder="输入班次类型搜索" style="width: 200px;" class="filter-item" />
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-setting" @click="add">新增</el-button>
        </div>
        <!--表格渲染-->
        <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
          <el-table-column prop="workShiftType" width="150" fixed label="班次类型"/>
          <el-table-column prop="firstStartTime" label="上班时间"/>
          <el-table-column prop="secondEndTime" label="下班时间"/>
          <el-table-column prop="overtimeType" width="100" label="加班类型"/>
          <el-table-column prop="minOvertime" width="150" label="加班最少时间(分钟)"/>
          <el-table-column prop="workingDayOvertimeRate" width="150" label="工作日加班倍率"/>
          <el-table-column prop="playdayOvertimeRate" width="150" label="周末加班倍率"/>
          <el-table-column prop="holidayOvertimeRate" width="150" label="节假日加班倍率"/>
          <el-table-column v-if="checkPermission(['admin','user:edit','user:del'])" label="操作" width="125" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-permission="['admin','user:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
              <el-popover
                v-permission="['admin','user:del']"
                :ref="scope.row.id"
                placement="top"
                width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
              </el-popover>
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
import eForm from './form'
import { deleteWorkShifts } from '@/api/workShifts'

export default {
  name: 'WorkShifts',
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      workShiftType: '',
      height: document.documentElement.clientHeight - 180 + 'px;', isAdd: false,
      delLoading: false,
      depts: [],
      deptId: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      options: [{
        value: 0,
        label: '请选择加班类型'
      }, {
        value: 1,
        label: '加班计调休'
      }, {
        value: 2,
        label: '加班计加班费'
      }]
    }
  },
  created() {
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
      this.url = 'api/ShiftsManagement/GetWorkShiftsList'
      const sort = 'workShiftType asc'
      const workShiftType = this.workShiftType
      this.params = { page: this.page, size: this.size, sort: sort, deptId: this.deptId }
      if (workShiftType) { this.params['workShiftType'] = workShiftType }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      deleteWorkShifts({
        id: id
      }).then(res => {
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
    handleNodeClick(data) {
      this.deptName = data.dptName
      this.init()
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        onTime: data.firstStartTime,
        offTime: data.secondEndTime,
        firstOnTime: data.firstStartTime,
        firstOffTime: data.firstEndTime,
        secondOnTime: data.secondStartTime,
        secondOffTime: data.secondEndTime,
        workShiftType: data.workShiftType,
        overtimeType: data.overtimeType,
        minOvertime: data.minOvertime,
        workingDayOvertimeRate: data.workingDayOvertimeRate,
        playdayOvertimeRate: data.playdayOvertimeRate,
        holidayOvertimeRate: data.holidayOvertimeRate
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>
</style>
