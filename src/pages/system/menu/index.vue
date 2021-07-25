<!--
  岗位
-->
<template>
  <div >
    <co-dialog title="查找" no-max seamless ref="search" @before-hide="filterTable=''">
      <q-input placeholder="在当前页查找" dense outlined v-model="filterTable" clearable class="q-mx-sm q-mt-none q-mb-sm"/>
    </co-dialog>
    <co-dialog
      ref="formDialog"
      :value="crud.status.cu > 0"
      :title="crud.status.title"
      no-backdrop-dismiss
      @before-hide="crud.cancelCU"
      card-style="width:800px; max-width:95vw;"
    >
      <co-form
        ref="form"
        label-width="small"
        label-align="right"
        class="q-pa-md row q-col-gutter-x-xl q-col-gutter-y-md">
          <co-tree-select class="col-12 col-sm-6" form-label="上级菜单" :disable="!!crud.status.view"
            :nodes="menuDatas"
            :selected.sync="form.pid"
            :expanded.sync="treeSelectExpanded"
            dense
            node-key="id"
            label-key="title"
            filter-key-like="titleLetter"
            filter-key-equal="id"
            filter-placeholder="名称、拼音首字母"
            tree-class="q-pa-sm"
            clearable
            selectable
          >
            <template v-slot:append><q-icon name="keyboard_arrow_down"/></template>
          </co-tree-select>
          <co-field dense class="col-12 col-sm-6" form-label="ID" readonly>
            <template v-slot:control>{{form.id}}</template>
          </co-field>
          <co-option-group class="col-12 col-sm-6" form-label="菜单类型" v-model="form.type" inline
            dense
            :disable="!!crud.status.view"
            :options="[
              {label: '目录', value: 0},
              {label: '菜单', value: 1},
              {label: '按钮', value: 2}
            ]"
          />
          <co-input dense class="col-12 col-sm-6" form-label="排序" v-model.number="form.sort" type="number" :disable="!!crud.status.view" :rules="[
              val => (!!val) || '必填'
              ]"/>
          <co-input dense class="col-12 col-sm-6" form-label="图标" v-model="form.icon" key="icon"
            v-if="form.type===0 || form.type===1"
            :disable="!!crud.status.view">
            <template v-slot:prepend><q-icon :name="form.icon" /></template>
            <template v-slot:append>
              <q-btn icon="search" dense flat />
            </template>
          </co-input>
          <co-input dense class="col-12 col-sm-6" form-label="菜单名称" v-model="form.title" key="title"
            :disable="!!crud.status.view"
            :rules="[
              val => (!!val) || '必填'
              ]"/>
          <co-option-group class="col-12 col-md-4" form-label="外链菜单" v-model="form.iframe" inline
            v-if="form.type===0 || form.type===1"
            dense
            :disable="!!crud.status.view"
            :options="[
              {label: '是', value: true},
              {label: '否', value: false}
            ]"
            />
          <co-option-group class="col-12 col-md-4" form-label="菜单缓存" v-model="form.cache" inline
            v-if="form.type===0 || form.type===1"
            dense
            :disable="!!crud.status.view"
            :options="[
              {label: '是', value: true},
              {label: '否', value: false}
            ]"
            />
          <co-option-group class="col-12 col-md-4" form-label="菜单可见" v-model="form.hidden" inline
            v-if="form.type===0 || form.type===1"
            dense
            :disable="!!crud.status.view"
            :options="[
              {label: '是', value: false},
              {label: '否', value: true}
            ]"
            />
          <co-input dense class="col-12 col-sm-6" form-label="权限标识" v-model="form.permission" :disable="!!crud.status.view"/>
          <co-input dense class="col-12 col-sm-6" form-label="路由地址" v-model="form.path" :disable="!!crud.status.view" v-if="form.type===0 || form.type===1"/>
          <co-input dense class="col-12 col-sm-6" form-label="组件名称" v-model="form.componentName" :disable="!!crud.status.view" v-if="form.type===1"/>
          <co-input dense class="col-12 col-sm-6" form-label="组件路径" v-model="form.component" :disable="!!crud.status.view" v-if="form.type===1"/>

      </co-form>
      <q-card-actions class="q-pa-md" align="right">
        <q-btn label="取消" flat v-close-popup/>
        <q-btn label="保存" icon="check" color="primary" v-if="!crud.status.view" @click="crud.submitCU"
          :loading="crud.status.cu === crud.STATUS_PROCESSING" :disable="crud.status.cu === crud.STATUS_PROCESSING"/>
      </q-card-actions>
    </co-dialog>

    <q-splitter
      v-model="splitter"
      unit="px"
      :horizontal="$q.screen.xs"
      emit-immediately
    >
      <template v-slot:before>
        <co-tree
          ref="tree"
          :class="$q.screen.gt.xs?'q-mr-sm':''"
          node-key="id"
          label-key="title"
          :nodes="menuDatas"
          filter-key-like="titleLetter"
          filter-key-equal="id"
          selected-color="primary"
          selectable
          filter-placeholder="ID、名称、拼音首字母"
          @update:selected="handleTreeNodeClick"
          @selected-label="label => treeSelectedLabel=label"
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
          dense
          :class="$q.screen.gt.xs?'q-ml-sm':''"
          tree-table
          expand-key="title"
          expand-size="sm"
          expand-flat
          :data="crud.data"
          :columns="crud.columns"
          :visible-columns="crud.visibleColumns"
          :title="crud.title"
          :loading="crud.loading"
          :selected.sync="crud.selections"
          :filter="filterTable"
          @row-click="(evt, row, index) => crud.selections = [row]"
        >
          <template v-slot:top-right="props">
            <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>
              <crud-operation dense :permission="permission" />
              <div class="col-auto">
                <q-btn-dropdown dense color="primary" class="btn-dropdown-hide-droparrow" icon="apps" auto-close>
                  <crud-more :tableSlotTopProps="props">
                    <template v-slot:start>
                      <q-btn flat align="left" label="在当前页查找" icon="find_in_page" @click.native="$refs.search.show()" />
                      <q-separator/>
                    </template>
                  </crud-more>
                </q-btn-dropdown>
              </div>
            </div>
          </template>

          <template v-slot:body-cell-icon="props">
            <q-td key="icon" :props="props">
              <q-icon :name="props.row.icon" size="sm"/>
            </q-td>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td key="action" :props="props">
              <crud-row dense
                flat
                :type="$q.screen.gt.xs?'button':'menu'"
                :data="props.row"
                :data-add="{pid: props.row.pid, sort: props.row.sort+10}"
                :permission="permission"
              />
            </q-td>
          </template>

          <template v-slot:pagination>
            <crud-pagination dense no-page-if-only-one-page />
          </template>

        </co-table>
      </template>
    </q-splitter>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import CrudOperation from '@crud/crud-operation'
import CrudPagination from '@crud/crud-pagination'
import CrudRow from '@crud/crud-row'
import CrudMore from '@crud/crud-more'
import crudMenu, { getMenus } from '@/api/system/menu'

const defaultForm = { id: null, title: null, sort: 10, path: null, component: null, componentName: null, roles: [], pid: null, icon: null, iframe: false, cache: false, hidden: false, type: 0, permission: null }
const visibleColumns = ['title', 'icon', 'sort', 'permission', 'path', 'createTime', 'action']
const columns = [
  { name: 'id', field: 'id', label: 'ID' },
  { name: 'pid', field: 'pid', label: 'PID' },
  { name: 'title', field: 'title', label: '名称', required: true, align: 'left' },
  { name: 'icon', field: 'icon', label: '图标', align: 'center' },
  { name: 'sort', field: 'sort', label: '排序' },
  { name: 'permission', field: 'permission', label: '权限', align: 'left' },
  { name: 'component', field: 'component', label: '组件路径', align: 'left' },
  { name: 'componentName', field: 'componentName', label: '组件名称', align: 'left' },
  { name: 'path', field: 'path', label: 'path', align: 'left' },
  { name: 'createTime', field: 'createTime', label: '创建时间' },
  { name: 'action', label: '操作', align: 'center' }
]

export default {
  name: 'Menu',
  components: { CrudOperation, CrudMore, CrudPagination, CrudRow },
  cruds() {
    return CRUD({ columns, visibleColumns, idField: 'id', query: { pid: null }, sort: ['sort,asc'], title: '菜单', url: 'api/menu', crudMethod: { ...crudMenu } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data () {
    return {
      splitter: 250,
      permission: {
        add: ['admin', 'menu:add'],
        edit: ['admin', 'menu:edit'],
        del: ['admin', 'menu:del']
      },
      menuDatas: [],
      treeSelectExpanded: [],
      filterTable: ''
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
    init () {
      this.getMenuDatas()
    },
    getMenuDatas() {
      const sort = 'sort,asc'
      const params = { sort: sort }
      getMenus(params).then(res => {
        this.menuDatas = res.data.content
      }).catch(err => {
        console.log('getMenuDatas', err)
      })
    },
    handleTreeNodeClick (id) {
      this.query.pid = id
      this.crud.toQuery()
    }
  }
}
</script>
