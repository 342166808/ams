<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="15" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <!-- 搜索 -->
          <el-date-picker
            v-model="query.date"
            type="daterange"
            range-separator=":"
            class="el-range-editor--small filter-item"
            style="height: 30.5px;width: 220px"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
          <el-select v-model="dateType" placeholder="选择日期类型" style="top:-3px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-setting" @click="toSetting">设置</el-button>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-edit-outline" @click="toCreate">生成</el-button>
          <!--<el-button class="filter-item" size="mini" type="success" icon="el-icon-document-add" @click="toSave">保存</el-button>-->
        </div>
        <!--表格渲染-->
        <el-table v-loading="loading" :data="data" size="small" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="workDateStr" width="120px" label="日期"/>
          <el-table-column prop="weekday" width="120px" label="星期"/>
          <el-table-column prop="weekdayTypeStr" label="日期类型"/>
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
import { setWorkDateType, createWorkCalendar } from '@/api/workCalendar'

export default {
  name: 'WorkCalendar',
  mixins: [initData],
  data() {
    return {
      dateType: 0,
      deptName: '',
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
        label: '请选择日期类型'
      }, {
        value: 1,
        label: '工作日'
      }, {
        value: 2,
        label: '休息日'
      }, {
        value: 3,
        label: '节假日'
      }],
      multipleSelection: []
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
      this.url = 'api/SystemConfig/GetWorkCalendar'
      const sort = 'workDate asc'
      const query = this.query
      const enabled = query.enabled
      this.params = { page: this.page, size: this.size, sort: sort, deptId: this.deptId }
      if (this.dateType > 0) { this.params['WorkDateType'] = this.dateType }
      if (query.date) {
        this.params['startDate'] = query.date[0]
        this.params['endDate'] = query.date[1]
      }
      if (enabled !== '' && enabled !== null) { this.params['enabled'] = enabled }
      return true
    },
    toSetting() {
      if (this.dateType === 0) {
        this.$notify({
          title: '请选择日期类型',
          type: 'error',
          duration: 2500
        })
        return
      }
      if (this.multipleSelection.length === 0) {
        this.$notify({
          title: '请选择数据行',
          type: 'error',
          duration: 2500
        })
        return
      }
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.multipleSelection[i].weekdayType = this.dateType
      }
      setWorkDateType({
        WorkDateList: this.multipleSelection
      }).then(res => {
        if (res.executeState) {
          this.$notify({
            title: '设置成功',
            type: 'success',
            duration: 2500
          })
          this.dateType = 0
          this.init()
        } else {
          alert(res.tipMessage)
        }
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    toCreate() {
      if (!this.query.date || !this.query.date[0]) {
        this.$notify({
          title: '请选择开始日期',
          type: 'error',
          duration: 2500
        })
        return
      }
      if (!this.query.date || !this.query.date[1]) {
        this.$notify({
          title: '请选择结束日期',
          type: 'error',
          duration: 2500
        })
        return
      }
      createWorkCalendar({
        startDate: this.query.date[0],
        endDate: this.query.date[1]
      }).then(res => {
        if (res.executeState) {
          this.$notify({
            title: '生成成功',
            type: 'success',
            duration: 2500
          })
          this.dateType = 0
          this.init()
        } else {
          alert(res.tipMessage)
        }
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>
</style>
