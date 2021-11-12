<template>
  <div>
    <co-dialog title="查找当前页" seamless no-max ref="search" @before-hide="filterTable=''">
      <co-input autofocus clearable style="width:180px" placeholder="" v-model="filterTable" class="q-mx-sm q-mt-none q-mb-sm" @keyup.escape.native="$refs.search.hide()"/>
    </co-dialog>

    <!-- 编辑表单对话框 -->
    <co-dialog
      ref="formDialog"
      :value="crud.status.cu > 0"
      :title="crud.status.title"
      no-backdrop-dismiss
      @before-hide="crud.cancelCU"
      card-style="width:600px; max-width:95vw;"
    >
      <co-form
        ref="form"
        :label-width="$q.screen.lt.sm?'small':'small'"
        label-align="right"
        class="q-px-lg q-my-none row q-col-gutter-x-md q-col-gutter-y-md">
        <co-field class="col-12" form-label="ID" :value="form.id" readonly borderless v-show="form.id"/>
        <co-field class="col-12" form-label="状态" :value="form.isEnabled" readonly borderless
            :rules="[ val => required(val) || '必填' ]">
          <template v-slot:control>
            <co-toggle v-model="form.isEnabled" :disable="!!crud.status.view"/>
          </template>
        </co-field>
        <co-select
            v-model="form.channel"
            class="col-12"
            form-label="渠道"
            :options='dict.app_user_channel'
            :disable="!!crud.status.view"
            value-to-string
            no-filter
            emit-value
            map-options
            :rules="[ val => required(val) || '必填' ]"/>
        <co-field class="col-12" form-label="openid" :value="form.openid" readonly borderless v-show="form.openid"/>
        <co-field class="col-12" form-label="微信unionid" :value="form.unionid" readonly borderless v-show="form.unionid"/>
        <co-input class="col-12" form-label="手机号" v-model="form.mobile" :disable="!!crud.status.view"
                  />
        <co-input class="col-12 col-sm-6" form-label="昵称" v-model="form.nickname" :disable="!!crud.status.view"
                  :rules="[ val => required(val) || '必填' ]"/>
        <co-select
            v-model="form.gender"
            class="col-12 col-sm-6"
            form-label="性别"
            :options='dict.app_user_gender'
            :disable="!!crud.status.view"
            value-to-string
            no-filter
            emit-value
            map-options
            :rules="[ val => required(val) || '必填' ]"/>
        <co-field class="col-12 col-sm-6" form-label="头像" readonly borderless>
          <template v-slot:control>
            <q-avatar square>
              <img :src="form.headimgurl">
            </q-avatar>
          </template>
        </co-field>
        <co-field class="col-12 col-sm-6" form-label="国家" :value="form.country" readonly borderless v-show="form.country"/>
        <co-field class="col-12 col-sm-6" form-label="省份" :value="form.province" readonly borderless v-show="form.province"/>
        <co-field class="col-12 col-sm-6" form-label="城市" :value="form.city" readonly borderless v-show="form.city"/>
        <co-field class="col-12 col-sm-6" form-label="语言版本" :value="form.lang" readonly borderless v-show="form.lang"/>
        <co-field class="col-12 col-sm-6" form-label="创建时间" :value="parseTime(form.createTime, '{y}-{m}-{d} {h}:{i}:{s}')" readonly borderless v-show="form.createTime"/>
        <co-field class="col-12 col-sm-6" form-label="创建人" :value="form.createBy" readonly borderless v-show="form.createBy"/>
        <co-field class="col-12 col-sm-6" form-label="修改时间" :value="parseTime(form.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')" readonly borderless v-show="form.updateTime"/>
        <co-field class="col-12 col-sm-6" form-label="修改人" :value="form.updateBy" readonly borderless v-show="form.updateBy"/>
      </co-form>
      <q-card-actions class="q-px-lg q-pt-lg q-pb-md" align="right">
        <co-btn label="取消" flat v-close-popup/>
        <co-btn label="保存" color="primary"
                v-if="!crud.status.view"
                @click="crud.submitCU"
               :loading="crud.status.cu === crud.STATUS_PROCESSING"
               :disable="crud.status.cu === crud.STATUS_PROCESSING"/>
      </q-card-actions>
    </co-dialog>

    <co-table
        ref="table"
        row-key="id"
        :data="crud.data"
        :columns="crud.columns"
        :visible-columns="crud.visibleColumns"
        :title="crud.title"
        :loading="crud.loading"
        :filter="filterTable"
        :selected.sync="crud.selections"
        selection="single"
        @row-click="(evt, row, index) => crud.selections = [row]"
        @row-dblclick="(evt, row, index) => crud.toView(row)"
    >
      <template v-slot:top-left>
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>
          <co-toggle
             label="状态"
             v-model="query.isEnabled"
             toggle-indeterminate
             @input="crud.toQuery()"/>
          <co-select
              v-model="query.channel"
              label="渠道"
              content-style="width:160px"
              value-to-string
              no-filter
              use-input
              fill-input
              hide-selected
              :options='dict.app_user_channel'
              @input="crud.toQuery()"
              emit-value
              map-options
              clearable
          />
          <co-input
              v-model="query.mobile"
              label="手机号"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.nickname"
              label="昵称"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-select
              v-model="query.gender"
              label="性别"
              content-style="width:160px"
              value-to-string
              no-filter
              use-input
              fill-input
              hide-selected
              :options='dict.app_user_gender'
              @input="crud.toQuery()"
              emit-value
              map-options
              clearable
          />
          <!-- 点击“更多..”才显示的搜索项 -->
          <template v-if="crud.props.queryMore">
            <co-input
                v-model="query.openid"
                label="openid"
                content-style="width:160px"
                @change="crud.toQuery()"
                clearable
            />
            <co-input
                v-model="query.unionid"
                label="微信unionid"
                content-style="width:160px"
                @change="crud.toQuery()"
                clearable
            />
            <co-date-select
                v-model="query.createTime"
                label="创建时间"
                content-style="width:230px"
                range
                edit-time
                with-seconds
                :default-time="['00:00:00', '23:59:59']"
                date-mask="YYYY-MM-DD"
                @input="crud.toQuery()"
                clearable
            />
            <co-input
                v-model="query.id"
                label="ID"
                content-style="width:160px"
                @change="crud.toQuery()"
                clearable
            />
          </template>
          <div>
            <co-btn icon="search" color="primary" @click="crud.toQuery()" />
            <co-btn label="重置" flat @click="crud.resetQuery()" />
            <co-btn :label="crud.props.queryMore?'«更少':'更多»'" flat @click="crud.props.queryMore = !crud.props.queryMore"/>
          </div>
          <q-space/>
        </div>
      </template>
      <template v-slot:top-right="props">
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>
          <!--如果想在工具栏加入更多按钮，可以使用插槽方式， 'start' or 'end'-->
          <crud-operation :permission="permission" no-label no-view no-edit/>
          <div>
            <co-btn-dropdown color="primary" class="btn-dropdown-hide-droparrow" icon="apps" auto-close>
              <crud-more :tableSlotTopProps="props">
                <template v-slot:start>
                  <co-btn flat align="left" label="查找当前页" icon="find_in_page" @click.native="$refs.search.show()" />
                  <q-separator/>
                </template>
              </crud-more>
            </co-btn-dropdown>
          </div>
        </div>
      </template>

      <template v-slot:body-cell-headimgurl="props">
        <q-td key="headimgurl" :props="props">
          <q-avatar square>
            <img :src="props.row.headimgurl"/>
          </q-avatar>
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td key="action" :props="props">
          <crud-row
              type="button"
              :data="props.row"
              :permission="permission"
              flat
              no-add
              no-icon
          />
        </q-td>
      </template>

      <template v-slot:pagination>
        <crud-pagination />
      </template>

    </co-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDictLabel } from '@/utils/store'
import { formatTime } from '@/utils/index'
import { required, integer, between } from '@/utils/vuelidate'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import CrudOperation from '@crud/crud-operation'
import CrudPagination from '@crud/crud-pagination'
import CrudRow from '@crud/crud-row'
import CrudMore from '@crud/crud-more'
import CrudAppUser from '@/api/app/app-user'

const defaultForm = { id: null, isEnabled: null, channel: null, openid: null, unionid: null, mobile: null, nickname: null, nicknameLetter: null, gender: null, headimgurl: null, country: null, province: null, city: null, lang: null, createTime: null, createBy: null, updateTime: null, updateBy: null }

const visibleColumns = ['isEnabled', 'channel', 'mobile', 'nickname', 'gender', 'headimgurl', 'city', 'createTime', 'action']
// 参考：https://quasar.dev/vue-components/table#Defining-the-columns
const columns = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  { name: 'isEnabled', field: 'isEnabled', label: '状态', align: 'left', format: val => val ? '启用' : '禁用' },
  { name: 'channel', field: 'channel', label: '渠道', align: 'left', format: val => getDictLabel('app_user_channel', val) },
  { name: 'openid', field: 'openid', label: 'openid', align: 'left' },
  { name: 'unionid', field: 'unionid', label: 'unionid', align: 'left' },
  { name: 'mobile', field: 'mobile', label: '手机号）', align: 'left' },
  { name: 'nickname', field: 'nickname', label: '昵称', align: 'left' },
  { name: 'gender', field: 'gender', label: '性别', align: 'left', format: val => getDictLabel('app_user_gender', val) },
  { name: 'headimgurl', field: 'headimgurl', label: '头像', align: 'left' },
  { name: 'country', field: 'country', label: '国家', align: 'left' },
  { name: 'province', field: 'province', label: '省份', align: 'left' },
  { name: 'city', field: 'city', label: '城市', align: 'left' },
  { name: 'lang', field: 'lang', label: '语言版本', align: 'left' },
  { name: 'createTime', field: 'createTime', label: '创建时间', align: 'left', format: val => formatTime(val) },
  { name: 'createBy', field: 'createBy', label: '创建人', align: 'left' },
  { name: 'updateTime', field: 'updateTime', label: '修改时间', align: 'left', format: val => formatTime(val) },
  { name: 'updateBy', field: 'updateBy', label: '修改人', align: 'left' },
  { name: 'action', label: '操作', align: 'center', required: false, sortable: false }
]

export default {
  name: 'AppUser',
  components: { CrudOperation, CrudMore, CrudPagination, CrudRow },
  cruds() {
    return CRUD({ columns, visibleColumns, title: 'APP用户', idField: 'id', sort: ['id,desc'], url: 'api/app/app-user', crudMethod: { ...CrudAppUser } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data () {
    return {
      permission: {
        view: ['admin', 'appUser:list'],
        add: ['admin', 'appUser:add'],
        edit: ['admin', 'appUser:edit'],
        del: ['admin', 'appUser:del']
      },
      filterTable: ''
    }
  },
  computed: {
    ...mapGetters('permission', [
      'dict'
    ])
  },
  created () {
    this.crud.updateProp('queryMore', false)
  },
  mounted () {
  },
  methods: {
    required,
    integer,
    between,
    [CRUD.HOOK.beforeRefresh] () {
      console.log('appUser CRUD.HOOK.beforeRefresh')
    }
  }
}
</script>

<style scoped>

</style>
