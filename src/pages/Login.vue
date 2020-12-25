<template>
  <q-page class="row items-center justify-center">
    <q-card
      class="login-wrapper shadow-24"
      :bordered="false"
    >
      <!-- https://placeimg.com/430/500/nature -->
      <q-card-section horizontal>
        <q-img
          class="col-6"
          :src="imgsrc"
          v-if="$q.screen.gt.xs"
        >
          <div class="absolute-bottom-left text-subtitle2 text-center">
            Based on Quasar {{$q.version}}
          </div>
        </q-img>

        <q-card-section :class="`${$q.screen.gt.xs?'col-6':'col'} q-mt-xs q-px-xl q-py-md`">
          <div class="flex flex-center">
            <q-avatar :size="$q.screen.gt.xs?'100px':'80px'">
              <q-img src="~assets/logo.svg" />
            </q-avatar>
          </div>
          <div class="text-h5 text-primary q-mb-xs">登录</div>
          <coadmin-form
            ref="loginForm"
            class="login-form my-form q-mt-lg"
          >
            <coadmin-input
              class="q-mb-md"
              outlined
              dense
              no-error-icon
              v-model.trim="loginForm.username"
              placeholder="账号 demo"
              :rules="[ val => val && val.length > 0 || '请输入用户账号']"
            />
            <coadmin-input
              class="q-mb-md"
              outlined
              dense
              no-error-icon
              type="password"
              v-model.trim="loginForm.password"
              placeholder="密码 123456"
              :rules="[ val => val && val.length > 0 || '请输入登录密码']"
            />
            <coadmin-input
              class="q-mb-md"
              outlined
              dense
              no-error-icon
              v-model.trim="loginForm.code"
              placeholder="验证码"
              :rules="[ val => val && val.length > 0 || '请输入验证码']"
            >
              <template v-slot:append>
                <img :src="codeUrl" @click="getCode"/>
              </template>
            </coadmin-input>
            <div class="column q-gutter-y-sm q-mt-none">
              <q-checkbox
                v-model="loginForm.rememberMe"
                label="记住账号"
                dense
              />
            </div>
            <div class="q-mt-md column items-center">
              <q-btn
                label="登录"
                type="submit"
                color="primary"
                class="full-width"
                @click.native.prevent="handleLogin"
              />
              <!--
              <div class="q-mt-md">如果还没有账号？<router-link
                  to="/register"
                  class="text-primary"
                >点击注册</router-link>
              </div>
              -->
            </div>
          </coadmin-form>

          <q-toolbar class="no-padding">
            <q-toggle :value="$q.dark.isActive" :val="true" label="DARK" @click.native="changeSetting({key:'darkMode', value: !$q.dark.isActive})"/>
          </q-toolbar>
          <q-toolbar class="no-padding">
            <brand-color />
          </q-toolbar>
        </q-card-section>
      </q-card-section>

      <q-inner-loading :showing="loading">
        <q-spinner-hourglass
          size="sm"
          color="primary"
        />
      </q-inner-loading>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import BrandColor from 'components/BrandColor.vue'
import { random } from '@/utils/index'
import { encrypt } from '@/utils/rsaEncrypt'
import { getCodeImg } from '@/api/login'
import Setting from '@/default-setting'
import Cookies from 'js-cookie'

export default {
  components: {
    BrandColor
  },
  name: 'UserLogin',
  data () {
    return {
      imgsrc: '',
      loading: false,
      redirect: undefined,
      codeUrl: '',
      cookiePass: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: ''
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created () {
    this.imgsrc = 'img/nature-' + (random() % 8) + '.jpg'
    // token 过期提示
    this.point()
    // 获取验证码
    this.getCode()
    // 获取用户名密码等Cookie
    this.getCookie()
    // token 过期提示
  },
  methods: {
    ...mapActions('settings', [
      'changeSetting'
    ]),
    ...mapActions('user', [
      'Login'
    ]),
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = res.img
        this.loginForm.uuid = res.uuid
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      let password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      // 保存cookie里面的加密后的密码
      this.cookiePass = password === undefined ? '' : password
      password = password === undefined ? this.loginForm.password : password
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        code: ''
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate().then(valid => {
        const user = {
          username: this.loginForm.username,
          password: this.loginForm.password,
          rememberMe: this.loginForm.rememberMe,
          code: this.loginForm.code,
          uuid: this.loginForm.uuid
        }
        if (user.password !== this.cookiePass) {
          user.password = encrypt(user.password)
        }
        if (valid) {
          this.loading = true
          if (user.rememberMe) {
            Cookies.set('username', user.username, { expires: Setting.passCookieExpires })
            Cookies.set('password', user.password, { expires: Setting.passCookieExpires })
            Cookies.set('rememberMe', user.rememberMe, { expires: Setting.passCookieExpires })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.Login(user).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
            this.getCode()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    point() {
      const point = Cookies.get('point') !== undefined
      if (point) {
        this.$q.notify({
          type: 'warning',
          message: '当前登录状态已过期，请重新登录！',
          timeout: 5000,
          position: 'top'
        })
        Cookies.remove('point')
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.login-wrapper, login-form
  width: 840px
  min-width: 260px
@media (max-width: 1023px)
  .login-wrapper, login-form
    width: 94%
@media (max-width: 599px)
  .q-pa-xl
    padding: 15px
</style>
