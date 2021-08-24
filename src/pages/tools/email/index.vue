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
      <q-tab name="first" label="邮箱配置" />
      <q-tab name="second" label="发送邮件" />
      <q-tab name="third" label="使用说明" />
    </co-tabs>

    <q-separator />

    <q-tab-panels v-model="tab">
      <q-tab-panel name="first">
        <config/>
      </q-tab-panel>

      <q-tab-panel name="second">
        <send/>
      </q-tab-panel>

      <q-tab-panel name="third">
        <div>
          <blockquote class="my-blockquote"> 邮件服务器配置</blockquote>
          <pre class="my-code">
  # 邮件服务器的SMTP地址，可选，默认为smtp
  # 邮件服务器的SMTP端口，可选，默认465或者25
  # 发件人（必须正确，否则发送失败）
  # 用户名，默认为发件人邮箱前缀
  # 密码（注意，某些邮箱需要为SMTP服务单独设置密码，如QQ和163等等）
  # 是否开启ssl，默认开启</pre>
          <blockquote class="my-blockquote">更多帮助</blockquote>
          <pre class="my-code">更多帮助请查看文档：<a style="color:#009688" href="http://hutool.mydoc.io/#text_319499" target="_black">hutool工具包</a></pre>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </co-card>
</template>

<script>
import Config from './config'
import Send from './send'
export default {
  name: 'Email',
  components: { Config, Send },
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
