<template>
  <coadmin-dialog
    ref="dialog"
    title="修改密码"
    no-max
    card-style="width:400px; max-width:95vw;"
    :loading="loading"
  >
    <coadmin-form
      ref="form"
      label-width="small"
      label-align="right"
      class="q-pa-md row q-col-gutter-x-xl q-col-gutter-y-md">
        <coadmin-input class="col-12" form-label="新邮箱" v-model="form.email" key="email"/>
        <coadmin-input class="col-12" form-label="验证码" v-model="form.code" key="code">
          <template v-slot:after>
            <q-btn flat dense label="获取验证码"/>
          </template>
        </coadmin-input>
        <coadmin-input class="col-12" form-label="当前密码" type="password" v-model="form.pass" key="pass"/>
    </coadmin-form>
    <q-card-actions class="q-pa-md" align="right">
      <q-btn label="取消" flat v-close-popup/>
      <q-btn label="确认" icon="check" color="primary" @click="doSubmit"/>
    </q-card-actions>
  </coadmin-dialog>

</template>

<script>
import { updateEmail } from '@/api/system/user'
import { resetEmail } from '@/api/system/code'
export default {
  data() {
    return {
      email: '',
      loading: false,
      form: { pass: '', email: '', code: '' }
    }
  },
  methods: {
    show(email) {
      this.email = email
      this.$refs.dialog.show()
    },
    sendCode() {
      if (this.form.email && this.form.email !== this.email) {
        this.codeLoading = true
        this.buttonName = '验证码发送中'
        const _this = this
        resetEmail(this.form.email).then(res => {
          this.$message({
            showClose: true,
            message: '发送成功，验证码有效期5分钟',
            type: 'success'
          })
          this.codeLoading = false
          this.isDisabled = true
          this.buttonName = this.time-- + '秒后重新发送'
          this.timer = window.setInterval(function() {
            _this.buttonName = _this.time + '秒后重新发送'
            --_this.time
            if (_this.time < 0) {
              _this.buttonName = '重新发送'
              _this.time = 60
              _this.isDisabled = false
              window.clearInterval(_this.timer)
            }
          }, 1000)
        }).catch(err => {
          this.codeLoading = false
          console.log(err.response.data.message)
        })
      }
    },
    doSubmit() {
      this.$refs['form'].validate().then((valid) => {
        if (valid) {
          this.loading = true
          updateEmail(this.form).then(res => {
            this.loading = false
            this.$q.notify({
              title: '邮箱修改成功',
              type: 'success',
              timeout: 1500
            })
            this.$store.dispatch('user/GetInfo').then(() => {})
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
