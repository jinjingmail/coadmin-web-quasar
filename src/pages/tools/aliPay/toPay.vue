<template>
  <co-form
    ref="form"
    label-width="small"
    label-align="right"
    class="q-px-lg q-my-none row q-col-gutter-x-xl q-col-gutter-y-md">
    <co-input class="col-12" form-label="商品名称" v-model="form.subject" :rules="[
      val => (!!val) || '必填'
      ]"/>
    <co-input class="col-12" form-label="商品价格" v-model="form.totalAmount" :rules="[
      val => (!!val) || '必填'
      ]"/>
    <co-input class="col-12" form-label="商品描述" v-model="form.body" :rules="[
      val => (!!val) || '必填'
      ]"/>
    <co-field class="col-12" form-label=" " readonly borderless>
      <template v-slot:control>
        <co-btn :loading="loading" label="去支付" icon="check" color="primary" @click="doSubmit"/>
      </template>
    </co-field>
  </co-form>
</template>

<script>
import { toAliPay } from '@/api/tools/alipay'
export default {
  data() {
    return {
      url: '',
      // 新窗口的引用
      newWin: null,
      loading: false,
      form: { subject: '', totalAmount: '', body: '' }
    }
  },
  watch: {
    url(newVal, oldVal) {
      if (newVal && this.newWin) {
        this.newWin.sessionStorage.clear()
        this.newWin.location.href = newVal
        // 重定向后把url和newWin重置
        this.url = ''
        this.newWin = null
      }
    }
  },
  methods: {
    doSubmit() {
      this.$refs['form'].validate().then((valid) => {
        if (valid) {
          this.loading = true
          // 先打开一个空的新窗口，再请求
          this.newWin = window.open()
          let url = ''
          if (/(Android)/i.test(navigator.userAgent)) { // 判断是否为Android手机
            url = 'aliPay/toPayAsWeb'
          } else if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { // 判断是否为苹果手机
            url = 'aliPay/toPayAsWeb'
          } else {
            url = 'aliPay/toPayAsPC'
          }
          toAliPay(url, this.form).then(res => {
            this.loading = false
            this.url = res
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
