<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增班次设置' : '编辑班次设置'" width="750px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
      <el-row>
        <el-col :span="20">
          <el-form-item label="班次类型">
            <el-input v-model="form.workShiftType" style="width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="上班有效时间">
            <el-time-select
              v-model="form.onTime"
              :picker-options="{
                step: '00:01',
                start: '00:00',
                end: '23:59'
              }"
              placeholder="选择时间"
              style=" width: 170px;" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="下班有效时间">
            <el-time-select
              v-model="form.offTime"
              :picker-options="{
                step: '00:01',
                start: '00:00',
                end: '23:59'
              }"
              placeholder="选择时间"
              style=" width: 170px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="第一段上班卡">
            <el-time-select
              v-model="form.firstOnTime"
              :picker-options="{
                step: '00:01',
                start: '00:00',
                end: '23:59'
              }"
              placeholder="选择时间"
              style=" width: 170px;" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="第一段下班卡">
            <el-time-select
              v-model="form.firstOffTime"
              :picker-options="{
                step: '00:01',
                start: '00:00',
                end: '23:59'
              }"
              placeholder="选择时间"
              style=" width: 170px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="第二段上班卡">
            <el-time-select
              v-model="form.secondOnTime"
              :picker-options="{
                step: '00:01',
                start: '00:00',
                end: '23:59'
              }"
              placeholder="选择时间"
              style=" width: 170px;" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="第二段下班卡">
            <el-time-select
              v-model="form.secondOffTime"
              :picker-options="{
                step: '00:01',
                start: '00:00',
                end: '23:59'
              }"
              placeholder="选择时间"
              style=" width: 170px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="加班类型">
            <el-select v-model="form.overtimeType" placeholder="选择加班类型" style=" width: 170px;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="加班最小值">
            <el-input-number v-model="form.minOvertime" :min="60" :step="30" :max="180" style=" width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="工作日加班倍率">
            <el-input-number v-model="form.workingDayOvertimeRate" :min="1" :max="10" :step="0.1" style=" width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="周末加班倍率">
            <el-input-number v-model="form.playdayOvertimeRate" :min="1" :max="10" :step="0.1" style=" width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="节假日加班倍率">
            <el-input-number v-model="form.holidayOvertimeRate" :min="1" :max="10" :step="0.1" style=" width: 170px;"/>
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
import { updateWorkShifts } from '@/api/workShifts'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        workShiftType: '',
        onTime: '08:00',
        offTime: '16:30',
        firstOnTime: '08:00',
        firstOffTime: '12:00',
        secondOnTime: '13:30',
        secondOffTime: '16:30',
        overtimeType: 1,
        minOvertime: 1,
        workingDayOvertimeRate: 1,
        playdayOvertimeRate: 1,
        holidayOvertimeRate: 1
      },
      options: [{
        value: 1,
        label: '加班计调休'
      }, {
        value: 2,
        label: '加班计加班费'
      }],
      rules: {
        workShiftType: [
          { required: true, message: '班次类型', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.EffectiveStartHour = this.form.onTime.split(':')[0]
          this.form.EffectiveStartMin = this.form.onTime.split(':')[1]
          this.form.EffectiveEndHour = this.form.offTime.split(':')[0]
          this.form.EffectiveEndMin = this.form.offTime.split(':')[1]
          this.form.FirstStartHour = this.form.firstOnTime.split(':')[0]
          this.form.FirstStartMin = this.form.firstOnTime.split(':')[1]
          this.form.FirstEndHour = this.form.firstOffTime.split(':')[0]
          this.form.FirstEndMin = this.form.firstOffTime.split(':')[1]
          this.form.SecondStartHour = this.form.secondOnTime.split(':')[0]
          this.form.SecondStartMin = this.form.secondOnTime.split(':')[1]
          this.form.SecondEndHour = this.form.secondOffTime.split(':')[0]
          this.form.SecondEndMin = this.form.secondOffTime.split(':')[1]
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else {
            this.doEdit()
          }
        }
      })
    },
    doAdd() {
      updateWorkShifts(this.form).then(res => {
        if (!res.executeState) {
          alert(res.tipMessage)
          return
        }
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
      updateWorkShifts(this.form).then(res => {
        if (!res.executeState) {
          alert(res.tipMessage)
          return
        }
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
        workShiftType: '',
        onTime: '08:00',
        offTime: '16:30',
        firstOnTime: '08:00',
        firstOffTime: '12:00',
        secondOnTime: '13:30',
        secondOffTime: '16:30',
        overtimeType: 1,
        minOvertime: 1,
        workingDayOvertimeRate: 1,
        playdayOvertimeRate: 1,
        holidayOvertimeRate: 1
      }
    }
  }
}
</script>

<style scoped>

</style>
