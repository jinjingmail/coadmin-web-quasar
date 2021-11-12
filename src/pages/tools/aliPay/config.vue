<template>
  <co-form
    ref="form"
    label-width="small"
    label-align="right"
    class="q-px-lg q-my-none row q-col-gutter-x-xl q-col-gutter-y-md">
    <co-input class="col-12" form-label="appID" v-model="form.appId" :rules="[
      val => (!!val) || '必填'
      ]"
      placeholder="应用APPID,收款账号既是APPID对应支付宝账号"/>
    <co-input class="col-12" form-label="商家账号" v-model="form.sysServiceProviderId" :rules="[
      val => (!!val) || '必填'
      ]"
      placeholder=""/>
    <co-input autogrow class="col-12" form-label="商户私钥" v-model="form.privateKey" :rules="[
      val => (!!val) || '必填'
      ]"
      placeholder="商户私钥，你的PKCS8格式RSA2私钥"/>
    <co-input autogrow class="col-12" form-label="支付宝公钥" v-model="form.publicKey" :rules="[
      val => (!!val) || '必填'
      ]"
      placeholder=""/>
    <co-input class="col-12" form-label="回调地址" v-model="form.returnUrl" :rules="[
      val => (!!val) || '必填'
      ]"
      placeholder="订单完成后返回的地址"/>
    <co-input class="col-12" form-label="异步通知" v-model="form.notifyUrl" :rules="[
      val => (!!val) || '必填'
      ]"
      placeholder="支付结果异步通知地址"/>
    <co-field class="col-12" form-label=" " readonly borderless>
      <template v-slot:control>
        <co-btn :loading="loading" label="保存配置" icon="check" color="primary" @click="doSubmit"/>
      </template>
    </co-field>

  </co-form>
</template>

<script>
import { get, update } from '@/api/tools/alipay'
export default {
  name: 'Config',
  data() {
    return {
      loading: false,
      form: { appId: '', sysServiceProviderId: '', privateKey: '', publicKey: '', returnUrl: '', notifyUrl: '' },
      rules: {
        appId: [
          { required: true, message: '请输入appID', trigger: 'blur' }
        ],
        sysServiceProviderId: [
          { required: true, message: '请输入商家账号', trigger: 'blur' }
        ],
        privateKey: [
          { required: true, message: '商户私钥不能为空', trigger: 'blur' }
        ],
        publicKey: [
          { required: true, message: '支付宝公钥不能为空', trigger: 'blur' }
        ],
        returnUrl: [
          { required: true, message: '回调地址不能为空', trigger: 'blur' }
        ],
        notifyUrl: [
          { required: true, message: '回调地址不能为空', trigger: 'blur' }
        ]
      }
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
            this.$q.notify('修改成功')
            this.loading = false
          }).catch(err => {
            this.loading = false
            this.$q.notify('修改失败：' + err.response.data.message)
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
