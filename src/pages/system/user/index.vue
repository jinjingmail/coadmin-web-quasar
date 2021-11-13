<!--
  部门
-->
<template>
  <div >
    <co-dialog title="查找" no-max ref="search" @before-hide="filterTable=''" @show="$refs.findInCurrentPage.focus()">
      <co-input ref="findInCurrentPage" style="width:180px" placeholder="在当前页查找" outlined v-model="filterTable" clearable class="q-mx-sm q-mt-none q-mb-sm"/>
    </co-dialog>
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
        :label-width="$q.screen.lt.sm?'xsmall':'small'"
        label-align="right"
        class="q-px-lg q-my-none row q-col-gutter-x-md q-col-gutter-y-md">
          <co-field class="col-12" form-label="ID" :value="form.id" borderless v-if="form.id" />
          <co-input class="col-12" form-label="用户名" v-model="form.username" :disable="!!crud.status.view" :rules="[
              val => (!!val) || '必填'
              ]"/>
          <co-input class="col-12 col-sm-6" form-label="电话" v-model.number="form.phone" :disable="!!crud.status.view"/>
          <co-input class="col-12 col-sm-6" form-label="邮箱" v-model.number="form.email" :disable="!!crud.status.view"/>
          <co-field class="col-12 col-sm-6" form-label="性别" :disable="!!crud.status.view" :value="form.gender" :rules="[
              val => (!!val) || '必填'
              ]">
            <template v-slot:control>
              <co-option-group
                v-model="form.gender"
                :options="dict.gender"
                :disable="!!crud.status.view"
                type="radio"
                inline
              />
            </template>
          </co-field>

          <co-field class="col-12 col-sm-6" form-label="状态" :disable="!!crud.status.view" :value="form.enabled" :rules="[
              val => required(val) || '必填'
              ]">
            <template v-slot:control>
              <co-toggle v-model="form.enabled" :disable="!!crud.status.view"/>
            </template>
          </co-field>

          <co-select
            class="col-12"
            form-label="岗位"
            option-value="id"
            option-label="name"
            v-model="form.jobs"
            no-filter
            :options="jobDatas"
            :disable="!!crud.status.view"
            use-chips
            multiple
            emit-value
            map-options
            :rules="[
              val => (val && val.length > 0) || '必填'
              ]"
          />
          <co-tree-select
            class="col-12"
            tree-class="q-pa-sm"
            form-label="机构"
            :nodes="deptDatas"
            :ticked.sync="form.depts"
            :expended="form.depts"
            node-key="id"
            label-key="name"
            tick-strategy="leaf-all-only-parent"
            filter-key-like="nameLetter"
            filter-key-equal="id"
            filter-placeholder="名称、拼音首字母"
            :disable="!!crud.status.view"
            :rules="[
              val => (!!val) || '必填'
              ]"
          />
          <co-select
            class="col-12"
            form-label="角色"
            option-value="id"
            option-label="name"
            use-input
            fill-input
            use-chips
            v-model="form.roles"
            no-filter
            :options="roleDatas"
            :disable="!!crud.status.view"
            :rules="[
              val => (val && val.length > 0) || '必填'
              ]"
            multiple
            emit-value
            map-options
          />
      </co-form>
      <q-card-actions class="q-px-lg q-pt-lg q-pb-md" align="right">
        <co-btn label="取消" flat v-close-popup/>
        <co-btn label="保存" color="primary" v-if="!crud.status.view" @click="crud.submitCU"
          :loading="crud.status.cu === crud.STATUS_PROCESSING" :disable="crud.status.cu === crud.STATUS_PROCESSING"/>
      </q-card-actions>
    </co-dialog>

    <q-splitter
      v-model="splitter"
      unit="px"
      before-class="q-pa-xs"
      after-class="q-pa-xs"
      :horizontal="$q.screen.xs"
    >
      <template v-slot:before>
        <co-tree
          ref="tree"
          :class="$q.screen.gt.xs?'q-mr-xs':''"
          node-key="id"
          label-key="label"
          :nodes="deptDatas"
          filter-key-like="nameLetter"
          filter-key-equal="id"
          filter-placeholder="ID、名称、拼音首字母"
          selected-color="primary"
          selectable
          @update:selected="handleTreeNodeClick"
          @selected-label="label => deptSelectedLabel=label"
        >
          <template v-slot:toolbar-end>
            <q-btn
              dense
              flat
              icon="refresh"
              @click="() => { init();}"
            >
              <q-tooltip :delay="800">刷新列表</q-tooltip>
            </q-btn>
          </template>
        </co-tree>
      </template>

      <template v-if="$q.screen.xs" v-slot:separator>
        <q-avatar color="primary" text-color="white" size="35px" icon="height" />
      </template>

      <template v-slot:after>
        <co-table
          ref="table"
          row-key="id"
          :class="$q.screen.gt.xs?'q-ml-xs':''"
          :data="crud.data"
          :columns="crud.columns"
          :visible-columns="crud.visibleColumns"
          :title="deptSelectedLabel"
          :loading="crud.loading"
          selection="multiple"
          :selected.sync="crud.selections"
          :filter="filterTable"
          @row-click="(evt, row, index) => crud.selections = [row]"
          @row-dblclick="(evt, row, index) => crud.toView(row)"
        >
          <template v-slot:top-right="props">
            <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>
              <co-toggle label="状态" v-model="query.enabled" toggle-indeterminate @input="crud.toQuery()"/>
              <co-input class='col-auto'
                label-slot
                v-model="query.blurry" content-style="width:200px"
                clearable
                @change="crud.toQuery()"
                @clear="crud.toQuery()"
              >
                <template v-slot:label>
                  <span style="color: var(--q-color-primary)">ID/用户名/电话/邮箱</span>
                </template>
              </co-input>
              <role-selector class="col-auto"
                v-model="query.inRoleId"
                content-style="width:200px"
                label="所属角色"
                @input="crud.toQuery()"
              />
              <div class='col-auto'>
                <co-btn color="primary" icon="search" @click="crud.toQuery()" />
              </div>
              <q-space/>
              <crud-operation :permission="permission" no-label no-view no-edit has-download/>
              <div class="col-auto">
                <co-btn-dropdown color="primary" class="btn-dropdown-hide-droparrow" icon="apps" auto-close>
                  <crud-more :tableSlotTopProps="props">
                    <template v-slot:start>
                      <co-btn flat align="left" label="在当前页查找" icon="find_in_page" @click.native="$refs.search.show()" />
                      <q-separator/>
                    </template>
                  </crud-more>
                </co-btn-dropdown>
              </div>
            </div>
          </template>

          <template v-slot:body-cell-enabled="props">
            <q-td key="enabled" :props="props">
              <co-chip color="green" text-color="white" v-if="props.row.enabled">
                {{props.value}}
              </co-chip>
              <co-chip color="red" text-color="white" v-else>
                {{props.value}}
              </co-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td key="action" :props="props">
              <crud-row flat no-icon
                :type="$q.screen.gt.xs?'button':'menu'"
                :data="props.row"
                no-add
                :permission="permission"
              />
            </q-td>
          </template>

          <template v-slot:pagination>
            <crud-pagination
              no-page-if-only-one-page/>
          </template>

        </co-table>
      </template>
    </q-splitter>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { required } from '@/utils/vuelidate'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import CrudOperation from '@crud/crud-operation'
import CrudPagination from '@crud/crud-pagination'
import CrudRow from '@crud/crud-row'
import CrudMore from '@crud/crud-more'
import crudUser from '@/api/system/user'
import { getDepts } from '@/api/system/dept'
import { getAll, getLevel } from '@/api/system/role'
import { getAllJob } from '@/api/system/job'
import { formatTime } from '@/utils/index'
import RoleSelector from '@/pages/components/RoleSelector'

const defaultForm = { id: null, username: null, nickName: null, gender: null, email: null, phone: null, enabled: 'false', roles: [], jobs: [], depts: [] }
const visibleColumns = ['username', 'gender', 'enabled', 'phone', 'email', 'updateTime', 'action']
const columns = [
  { name: 'id', field: 'id', label: 'ID' },
  { name: 'username', field: 'username', label: '用户名', required: true, align: 'left' },
  { name: 'gender', field: 'gender', label: '性别', align: 'center' },
  { name: 'enabled', field: 'enabled', label: '状态', align: 'center', format: val => val ? '启用' : '禁用' },
  { name: 'phone', field: 'phone', label: '电话', align: 'left' },
  { name: 'email', field: 'email', label: '邮箱', align: 'left' },
  { name: 'createTime', field: 'createTime', label: '创建时间', align: 'left', format: val => formatTime(val) },
  { name: 'createBy', field: 'createBy', label: '创建人', align: 'left' },
  { name: 'updateTime', field: 'updateTime', label: '更新时间', align: 'left', format: val => formatTime(val) },
  { name: 'updateBy', field: 'updateBy', label: '更新人', align: 'left' },
  { name: 'action', label: '操作', align: 'center' }
]

export default {
  name: 'User',
  components: { CrudOperation, CrudMore, CrudRow, CrudPagination, RoleSelector },
  cruds() {
    return CRUD({ columns, visibleColumns, idField: 'id', title: '用户', query: { deptId: null }, url: 'api/users', crudMethod: { ...crudUser } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data () {
    return {
      splitter: 250,
      filterTable: '',
      permission: {
        add: ['admin', 'user:add'],
        edit: ['admin', 'user:edit'],
        del: ['admin', 'user:del']
      },
      deptSelectedLabel: null,
      deptDatas: [],
      jobDatas: [],
      roleDatas: [],
      level: 3
    }
  },
  created () {
    this.init()
  },
  computed: {
    ...mapGetters('permission', [
      'dict'
    ])
  },
  methods: {
    required,
    init () {
      // TODO 这些数据只有修改或新增用户才用到，所以考虑延迟加载或异步加载
      this.getDeptDatas()
      this.getRoleDatas()
      this.getJobDatas()
      this.getRoleLevel()
    },
    getRoleLevel() {
      getLevel().then(res => {
        this.level = res.data
      }).catch(err => {
        console.error('getRoleLevel:', err)
      })
    },
    getRoleDatas () {
      getAll().then(res => {
        this.roleDatas = res.data
      }).catch(err => {
        console.error('getRoleDatas:', err)
        this.crud.notifyError('获取角色失败：', err)
      })
    },
    getJobDatas () {
      getAllJob().then(res => {
        this.jobDatas = res.data.content
      }).catch(err => {
        console.error('getJobDatas:', err)
        this.crud.notifyError('获取岗位失败：', err)
      })
    },
    getDeptDatas() {
      const sort = 'sort,asc'
      const params = { sort: sort }
      getDepts(params).then(res => {
        this.deptDatas = res.data.content
      }).catch(err => {
        console.error('getDeptDatas:', err)
        this.crud.notifyError('获取部门失败：', err)
      })
    },
    // 切换机构
    handleTreeNodeClick(deptId) {
      this.query.deptId = deptId
      this.crud.toQuery()
    }
  }
}
</script>
