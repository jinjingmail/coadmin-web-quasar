<template>
  <co-card>
    <co-tabs
      v-model="tab"
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="first" label="参数配置" />
      <q-tab name="second" label="支付测试" />
      <q-tab name="third" label="使用说明" />
    </co-tabs>

    <q-separator />

    <q-tab-panels v-model="tab">
      <q-tab-panel name="first">
        <config/>
      </q-tab-panel>

      <q-tab-panel name="second">
        <to-pay/>
      </q-tab-panel>

      <q-tab-panel name="third">
        <div>
          <blockquote class="my-blockquote">注意</blockquote>
          <pre class="my-code">
  测试所用参数都是沙箱环境，仅供测试使用，申请地址：<a style="color: #00a0e9" href="https://openhome.alipay.com/platform/appDaily.htm?tab=info" target="_blank">支付宝开发平台</a>
  如需付款测试，请使用
  账号：uuxesw9745@sandbox.com
  密码与支付密码：111111</pre>
          <blockquote class="my-blockquote"> 支付设置</blockquote>
          <pre class="my-code">
  // 支付提供两个接口，
  // PC端与手机端，并且在前端使用代码识别
  if (/(Android)/i.test(navigator.userAgent)){     // 判断是否为Android手机
      url = "/aliPay/toPayAsWeb"
  }else if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){  // 判断是否为苹果手机
      url = "/aliPay/toPayAsWeb"
  } else {
      url = "/aliPay/toPayAsPC"
  }</pre>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </co-card>
</template>

<script>
import Config from './config'
import ToPay from './toPay'
export default {
  name: 'AliPay',
  components: { Config, ToPay },
  data() {
    return {
      tab: 'second'
    }
  }
}
</script>

<style scoped>
.my-blockquote{
  margin: 0 0 10px;
  padding: 15px;
  line-height: 22px;
  border-left: 5px solid #00437B;
  border-radius: 0 2px 2px 0;
  background-color: #f2f2f2;
}
.my-code{
  position: relative;
  padding: 15px;
  line-height: 20px;
  border-left: 5px solid #ddd;
  color: #333;
  font-family: Courier New, serif;
  font-size: 12px
}
</style>
