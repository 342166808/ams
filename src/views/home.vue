<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <panel-group/>

      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart/>
      </el-row>

      <!--<el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <raddar-chart/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <pie-chart/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <bar-chart/>
          </div>
        </el-col>
      </el-row>-->

      <el-row :gutter="1" style="background:#fff; height: 200px;">
        <el-table v-loading="loading" :data="tableData" size="small" style="width: 100%;" stripe>
          <el-table-column prop="workerNo" label="工号" fixed width="80"/>
          <el-table-column prop="name" label="姓名" fixed width="100"/>
          <el-table-column prop="depName" label="部门" />
          <el-table-column prop="position" label="岗位"/>
          <el-table-column prop="scheduleName" label="班次"/>
          <el-table-column prop="workerDateStr" label="工作日" />
          <el-table-column prop="dayOfTheWeekStr" label="星期" />
          <el-table-column prop="checkInTime" label="上班刷卡时间" >
            <template slot-scope="scope">
              <span v-if="!scope.row.checkInTime || scope.row.checkInTime===''">--</span>
              <span v-else>{{ scope.row.checkInTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="checkOutTime" label="下班刷卡时间">
            <template slot-scope="scope">
              <span v-if="!scope.row.checkOutTime || scope.row.checkOutTime===''">--</span>
              <span v-else>{{ scope.row.checkOutTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="checkInStatusStr" label="上班刷卡状态">
            <template slot-scope="scope">
              <span v-if="scope.row.checkInStatus === 1" style="color: blue">迟到</span>
              <span v-else-if="scope.row.checkInStatus === 2" style="color: red">缺卡</span>
              <span v-else>正常</span>
            </template>
          </el-table-column>
          <el-table-column prop="checkOutStatusStr" label="下班刷卡状态">
            <template slot-scope="scope">
              <span v-if="scope.row.checkOutStatus === 1" style="color: blue">迟到</span>
              <span v-else-if="scope.row.checkOutStatus === 2" style="color: red">缺卡</span>
              <span v-else>正常</span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import { count } from '@/api/visits'
import { getAttendanceDailyInfoList } from '@/api/attendance'

/**
 * 记录访问，只有页面刷新或者第一次加载才会记录
 */
count().then(res => {})

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      loading: false,
      tableData: []
    }
  },
  created() {

  },
  mounted: function() {
    const params = {
      page: 1,
      size: 7,
      sort: 'workerdate desc',
      blurry: '92595'
    }
    getAttendanceDailyInfoList(params).then(res => {
      this.tableData = res.data.data
    }).catch(() => {

    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 18px 22px 22px 22px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
