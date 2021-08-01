<template>
  <div>
    <my-upload
      v-model="show"
      :headers="headers"
      :url="updateAvatarApi"
      :no-rotate="false"
      @crop-upload-success="cropUploadSuccess"
    />

    <update-email ref="updateEmail"/>
    <update-pass ref="updatePass"/>

    <q-splitter
      v-model="splitter"
      unit="px"
      :horizontal="$q.screen.xs"
      separator-style="background-color: transparent"
    >
      <template v-slot:before>
        <q-card :class="$q.screen.gt.xs?'q-mr-xs':''">
          <q-card-section>
            <div class="text-h6">个人信息 </div>
          </q-card-section>
          <q-card-section class="text-center">
            <q-avatar rounded size="120px" class="cursor-pointer">
              <img :src="user.avatarName ? baseApi + '/avatar/' + user.avatarName : Avatar" title="点击上传头像" class="avatar" @click="toggleShow">
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <q-list bordered separator>
              <q-item>
                <q-item-section>ID</q-item-section>
                <q-item-section side>{{user.id}}</q-item-section>
              </q-item>

              <q-item>
                <q-item-section>登录账号</q-item-section>
                <q-item-section side>{{user.username}}</q-item-section>
              </q-item>

              <q-item>
                <q-item-section>用户昵称</q-item-section>
                <q-item-section side>{{user.nickName}}</q-item-section>
              </q-item>

              <q-item>
                <q-item-section>手机号码</q-item-section>
                <q-item-section side>{{user.phone}}</q-item-section>
              </q-item>

              <q-item>
                <q-item-section>电子邮箱</q-item-section>
                <q-item-section side>{{user.email}}</q-item-section>
              </q-item>

              <q-item>
                <q-item-section>安全设置</q-item-section>
                <q-item-section side>
                  <div class="row">
                    <co-btn flat class="col-auto" label="修改密码" color="primary" @click="$refs.updatePass.show()"/>
                    <co-btn flat class="col-auto" label="修改邮箱" color="primary" @click="$refs.updateEmail.show(user.email)"/>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </template>

      <template v-if="$q.screen.xs" v-slot:separator>
        <q-avatar color="primary" text-color="white" size="35px" icon="height" />
      </template>

      <template v-slot:after>
        <co-table
          title="用户操作日志"
          ref="table"
          row-key="id"
          :class="$q.screen.gt.xs?'q-ml-xs':''"
          :data="crud.data"
          :columns="crud.columns"
          :loading="crud.loading"
        >
          <template v-slot:body-cell-createTime="props">
            <q-td key="createTime" :props="props">
              {{formatTime(props.row.createTime)}}
            </q-td>
          </template>

          <template v-slot:pagination>
            <crud-pagination />
          </template>
        </co-table>
      </template>
    </q-splitter>
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import { mapGetters, mapState } from 'vuex'
import { getToken } from '@/utils/auth'
import updatePass from './updatePass'
import updateEmail from './updateEmail'
//import { validPhone } from '@/utils/validate'
//import { editUser } from '@/api/system/user'

import CRUD, { presenter, header } from '@crud/crud'
import CrudPagination from '@crud/crud-pagination'
import Avatar from '@/assets/boy-avatar.jpg'

const columns = [
  { name: 'description', field: 'description', label: '行为', required: true, align: 'left' },
  { name: 'requestIp', field: 'requestIp', label: 'IP', align: 'left' },
  { name: 'address', field: 'address', label: 'IP来源', align: 'left' },
  { name: 'browser', field: 'browser', label: '浏览器', align: 'left' },
  { name: 'time', field: 'time', label: '请求耗时' },
  { name: 'createTime', field: 'createTime', label: '创建时间', align: 'right' }
]

export default {
  name: 'Center',
  components: { CrudPagination, myUpload, updatePass, updateEmail },
  cruds() {
    return CRUD({ columns, idField: 'id', title: '用户设置', url: 'api/logs/user' })
  },
  mixins: [presenter(), header()],
  data () {
    return {
      splitter: 350,
      show: false,
      Avatar: Avatar,
      headers: {
        Authorization: getToken()
      }
    }
  },
  created() {
    this.form = { id: this.user.id, gender: this.user.gender, phone: this.user.phone }
    this.$store.dispatch('user/GetInfo').then(() => {})
  },
  computed: {
    ...mapState('api', [
      'updateAvatarApi',
      'baseApi'
    ]),
    ...mapGetters('user', [
      'user'
    ])
  },
  methods: {
    toggleShow() {
      this.show = !this.show
    },
    cropUploadSuccess(jsonData, field) {
      console.log('cropUploadSuccess')
      this.$store.dispatch('user/GetInfo').then(() => {})
    }
  }
}
</script>
