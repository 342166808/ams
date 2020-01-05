<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="isAdd ? '新增用户' : '编辑用户'" append-to-body width="570px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
      <el-form-item label="姓名" prop="staffName">
        <el-input v-model="form.staffName" disabled="disabled"/>
      </el-form-item>
      <el-form-item label="工号" prop="jobNumber">
        <el-input v-model="form.jobNumber" disabled="disabled"/>
      </el-form-item>
      <el-form-item label="部门" prop="dptName">
        <el-select v-model="form.dptCode" placeholder="请选择" style=" width: 184px;">
          <el-option
            v-for="item in depts"
            :key="item.dptCode"
            :label="item.dptName"
            :value="item.dptCode"/>
        </el-select>
      </el-form-item>
      <el-form-item label="电话" prop="telephone">
        <el-input v-model="form.telephone" />
      </el-form-item>
      <el-form-item label="底薪">
        <el-input v-model="form.baseSalary" />
      </el-form-item>
      <el-form-item label="绩效">
        <el-input v-model="form.perf" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { editUser } from '@/api/user'
import { getDepts } from '@/api/dept'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      dialog: false,
      loading: false,
      form: {
        staffName: '',
        jobNumber: '',
        dptCode: '',
        dptName: '',
        telephone: '',
        email: '',
        baseSalary: 0,
        perf: 0,
        remark: '',
        id: 0
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ],
        enabled: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      if (!this.isvalidPhone(this.form.telephone)) {
        this.$notify({
          title: '请输入有效的电话号码',
          type: 'error',
          duration: 2500
        })
        return
      }
      if (!this.isvalidNumber(this.form.baseSalary)) {
        this.$notify({
          title: '请输入有效的底薪',
          type: 'error',
          duration: 2500
        })
        return
      }
      if (!this.isvalidNumber(this.form.perf)) {
        this.$notify({
          title: '请输入有效的绩效',
          type: 'error',
          duration: 2500
        })
        return
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            // this.doAdd()
          } else {
            this.doEdit()
          }
        } else {
          return false
        }
      })
    },
    doEdit() {
      editUser(this.form).then(res => {
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
      this.deptId = null
      this.jobId = null
      this.roleIds = []
      this.form = {
        staffName: '',
        jobNumber: '',
        dptCode: '',
        dptName: '',
        telephone: '',
        email: '',
        baseSalary: 0,
        perf: 0,
        remark: '',
        id: 0
      }
    },
    getDepts(callback) {
      getDepts({}).then(res => {
        this.depts = res.data
        callback()
      })
    },
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      return reg.test(str)
    },
    isvalidNumber(str) {
      const reg = /^[0-9]*$/
      return reg.test(str)
    }
  }
}
</script>

<style scoped>

</style>
