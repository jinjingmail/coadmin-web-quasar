c<template>
  <coadmin-form
    ref="form"
    label-width="small"
    label-align="right"
    class="q-pa-md row q-col-gutter-x-xl q-col-gutter-y-md">
    <coadmin-input class="col-12" form-label="发件人邮箱" v-model="form.fromUser" :rules="[
      val => (!!val) || '必填'
      ]"/>
    <coadmin-input class="col-12" form-label="发件用户名" v-model="form.user" :rules="[
      val => (!!val) || '必填'
      ]"/>
    <coadmin-input class="col-12" form-label="邮箱密码" v-model="form.pass" :rules="[
      val => (!!val) || '必填'
      ]"/>
    <coadmin-input class="col-12" form-label="SMTP地址" v-model="form.host" :rules="[
      val => (!!val) || '必填'
      ]"/>
    <coadmin-input class="col-12" form-label="SMTP端口" v-model="form.port" :rules="[
      val => (!!val) || '必填'
      ]"/>
    <coadmin-form-item class="col-12" form-label=" ">
      <q-btn :loading="loading" dense label="保存配置" icon="check" color="primary" @click="doSubmit"/>
    </coadmin-form-item>
  </coadmin-form>
</template>

<script>
import { get, update } from '@/api/tools/email'
export default {
  name: 'EmailConfig',
  data() {
    return {
      loading: false,
      form: { id: 1, fromUser: '', user: '', pass: '', host: '', port: '', sslEnable: '' }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      get().then(res => {
        this.form = res
      })
    },
    doSubmit() {
      this.$refs['form'].validate().then((valid) => {
        if (valid) {
          this.loading = true
          update(this.form).then(res => {
            this.$q.notify({
              title: '修改成功',
              type: 'success',
              timeout: 2500
            })
            this.loading = false
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
