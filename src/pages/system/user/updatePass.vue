<template>
  <co-dialog
    ref="dialog"
    title="修改密码"
    no-max
    card-style="width:400px; max-width:95vw;"
    :loading="loading"
  >
    <co-form
      ref="form"
      label-width="small"
      label-align="right"
      class="q-px-lg q-my-none row q-col-gutter-x-xl q-col-gutter-y-md">
        <co-input class="col-12" form-label="旧密码" type="password" v-model="form.oldPass" :rules="[
              val => (!!val) || '必填'
              ]"/>
        <co-input class="col-12" form-label="新密码" type="password" v-model="form.newPass" :rules="[
              val => (!!val && val.length >= 6) || '长度不少于6个字符'
              ]"/>
        <co-input class="col-12" form-label="确认密码" type="password" v-model="form.confirmPass" :rules="[
              val => (!!val && val.length >= 6) || '长度不少于6个字符'
              ]"/>
    </co-form>
    <q-card-actions class="q-px-lg q-pt-lg q-pb-md" align="right">
      <co-btn label="取消" flat v-close-popup/>
      <co-btn label="确认" icon="check" color="primary" @click="doSubmit"/>
    </q-card-actions>
  </co-dialog>
</template>

<script>
import { updatePass } from '@/api/system/user'
export default {
  data() {
    return {
      loading: false,
      form: { oldPass: '', newPass: '', confirmPass: '' }
    }
  },
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    doSubmit() {
      this.$refs['form'].validate().then((valid) => {
        if (valid) {
          if (this.form.newPass !== this.form.confirmPass) {
            this.$q.notify('两次输入的密码不一致')
            return false
          }
          this.loading = true
          updatePass(this.form).then(res => {
            this.$q.notify({
              title: '密码修改成功，请重新登录',
              type: 'success',
              timeout: 1500
            })
            setTimeout(() => {
              this.$store.dispatch('user/LogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            }, 1500)
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
