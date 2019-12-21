<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增班次设置' : '编辑班次设置'" width="750px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
      <el-row>
        <el-col span="20">
          <el-form-item label="部门名称">
            <el-input style="width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col span="10">
          <el-form-item label="上班有效时间">
            <el-time-select
              v-model="onTime"
              :picker-options="{
                step: '00:10',
                start: '08:00',
                end: '12:00'
              }"
              placeholder="选择时间"
              style=" width: 170px;" />
          </el-form-item>
        </el-col>
        <el-col span="10">
          <el-form-item label="下班有效时间">
            <el-time-select
              v-model="offTime"
              :picker-options="{
                step: '00:10',
                start: '08:00',
                end: '12:00'
              }"
              placeholder="选择时间"
              style=" width: 170px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col span="10">
          <el-form-item label="第一段上班卡">
            <el-time-select
              v-model="firstOnTime"
              :picker-options="{
                step: '00:10',
                start: '08:00',
                end: '12:00'
              }"
              placeholder="选择时间"
              style=" width: 170px;" />
          </el-form-item>
        </el-col>
        <el-col span="10">
          <el-form-item label="第一段下班卡">
            <el-time-select
              v-model="firstOffTime"
              :picker-options="{
                step: '00:10',
                start: '08:00',
                end: '12:00'
              }"
              placeholder="选择时间"
              style=" width: 170px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col span="10">
          <el-form-item label="第二段上班卡">
            <el-time-select
              v-model="secondOnTime"
              :picker-options="{
                step: '00:10',
                start: '08:00',
                end: '12:00'
              }"
              placeholder="选择时间"
              style=" width: 170px;" />
          </el-form-item>
        </el-col>
        <el-col span="10">
          <el-form-item label="第二段下班卡">
            <el-time-select
              v-model="secondOffTime"
              :picker-options="{
                step: '00:10',
                start: '08:00',
                end: '12:00'
              }"
              placeholder="选择时间"
              style=" width: 170px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col span="10">
          <el-form-item label="加班类型">
            <el-select v-model="overtimeType" placeholder="选择加班类型" style=" width: 170px;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col span="10">
          <el-form-item label="加班最小值">
            <el-input-number v-model="overtimeHour" :min="1" :max="10" label="单位小时" style=" width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/dict'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      onTime: '08:00',
      offTime: '16:30',
      firstOnTime: '08:00',
      firstOffTime: '12:00',
      secondOnTime: '13:30',
      secondOffTime: '16:30',
      overtimeType: 1,
      overtimeHour: 1,
      loading: false,
      dialog: false,
      form: {
        id: '',
        name: '',
        remark: ''
      },
      options: [{
        value: 1,
        label: '加班计调休'
      }, {
        value: 2,
        label: '加班费'
      }]
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        }
      })
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        name: '',
        remark: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
