<template>
  <div>
    <co-form
      ref="form"
      label-width="small"
      label-align="right"
      class="q-px-lg q-my-none row q-col-gutter-x-xl q-col-gutter-y-md">
      <co-input class="col-12" form-label="邮件标题" v-model="form.subject" :rules="[
        val => (!!val) || '必填'
        ]"/>
      <co-input class="col-12" form-label="收件人" v-model="form.tos[0]" :rules="[
        val => (!!val) || '必填'
        ]"/>
      <co-input class="col-12" form-label="内容" v-model="form.content" :rules="[
        val => (!!val) || '必填'
        ]"/>
      <co-field class="col-12" form-label=" " :value="form.id" readonly borderless>
        <template v-slot:control>
          <co-btn :loading="loading" label="发送邮件" icon="check" color="primary" @click="doSubmit"/>
        </template>
      </co-field>
    </co-form>
  </div>
</template>

<script>
import { send } from '@/api/tools/email'
export default {
  name: 'EmailSend',
  data() {
    return {
      loading: false,
      form: { subject: '', tos: [], content: '' }
    }
  },
  methods: {
    doSubmit() {
      this.$refs['form'].validate().then((valid) => {
        if (valid) {
          this.loading = true
          send(this.form).then(res => {
            this.$q.notify({
              title: '发送成功',
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
