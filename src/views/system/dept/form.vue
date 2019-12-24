<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增部门' : '编辑部门'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.dptName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="班次类型" prop="name">
        <el-select v-model="form.workShiftsId" placeholder="请选择班次类型" style="width: 370px;">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.workShiftType"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="name">
        <el-input v-model="form.remark" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { editDepts } from '@/api/dept'
import { getWorkShiftsList } from '@/api/workShifts'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false, depts: [],
      form: {
        id: 0,
        dptNumber: '',
        dptName: '',
        workShiftsId: 0,
        remark: ''
      },
      options: [],
      rules: {
        dptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        workShiftsId: [
          { required: true, message: '请选择班次类型', trigger: 'blur' }
        ]
      }
    }
  },
  created() {

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
          } else {
            this.doEdit()
          }
        }
      })
    },
    doAdd() {
    },
    doEdit() {
      editDepts(this.form).then(res => {
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
    getWorkShifts() {
      getWorkShiftsList({ page: 0, size: 10000 }).then(res => {
        if (res.data.totalcount === 0) {
          return
        }
        this.options = res.data.data
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
