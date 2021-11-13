<!--
  岗位
-->
<template>
  <div >
    <co-dialog title="查找" no-max ref="search" @before-hide="filterTable=''" @show="$refs.findInCurrentPage.focus()">
      <co-input ref="findInCurrentPage" placeholder="在当前页查找" style="width:180px" outlined v-model="filterTable" clearable class="q-mx-sm q-mt-none q-mb-sm"/>
    </co-dialog>
    <co-dialog
      ref="formDialog"
      :value="crud.status.cu > 0"
      :title="crud.status.title"
      no-backdrop-dismiss
      @before-hide="crud.cancelCU"
      card-style="width:600px; max-width:95vw;"
      :loading="crud.status.cu === crud.STATUS_PROCESSING"
      :loading-delay="300"
    >
      <co-form
        ref="form"
        label-width="small"
        label-align="right"
        class="q-px-lg q-my-none row q-col-gutter-x-xl q-col-gutter-y-md">
          <co-field class="col-12" form-label="ID" :value="form.id" borderless v-if="form.id" />
          <co-input class="col-12" form-label="角色名称" v-model="form.name" :disable="!!crud.status.view" :rules="[
              val => required(val) || '必填'
              ]"/>
          <co-input class="col-12" form-label="级别" v-model.number="form.level" type="number" :disable="!!crud.status.view" :rules="[
              val => required(val) || '必填',
              val => between(val, 1, 9) || '1-9'
              ]"/>
          <!--
          <co-field class="col-12" form-label="数据范围">
            <template v-slot:control>
              <co-option-group
                v-model="form.dataScope"
                :disable="!!crud.status.view"
                inline
                :options="[{label: '全部', value: '全部'}, { label: '本级', value: '本级'}, { label: '自定义', value: '自定义' }]"
                type="radio"
              />
            </template>
          </co-field>
          -->
          <co-input autogrow class="col-12" form-label="描述" v-model="form.description" :disable="!!crud.status.view"/>

      </co-form>
      <q-card-actions class="q-px-lg q-pt-lg q-pb-md" align="right">
        <co-btn label="取消" flat v-close-popup/>
        <co-btn label="保存" color="primary" v-if="!crud.status.view" @click="crud.submitCU"
          :loading="crud.status.cu === crud.STATUS_PROCESSING" :disable="crud.status.cu === crud.STATUS_PROCESSING"/>
      </q-card-actions>
    </co-dialog>

    <q-splitter
      v-model="splitter"
      unit="%"
      before-class="q-pa-xs"
      after-class="q-pa-xs"
      :horizontal="$q.screen.xs"
    >
      <template v-slot:before>
        <co-table
          ref="table"
          row-key="id"
          :class="$q.screen.gt.xs?'q-mr-xs':''"
          :data="crud.data"
          :columns="crud.columns"
          :visible-columns="crud.visibleColumns"
          :title="crud.title"
          :filter="filterTable"
          :loading="crud.loading || loadingSaveRoleMenu"
          selection="none"
          :selected.sync="crud.selections"
          @update:selected="_tableRowSelected"
          @row-click="_tableRowClick"
          @row-dblclick="(evt, row, index) => crud.toView(row)"
        >
          <template v-slot:top-right="props">
            <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>
              <co-input class='col-auto'
                label="ID、名称、描述"
                v-model="query.blurry" content-style="width:180px"
                clearable
                @change="crud.toQuery()"
                @clear="crud.toQuery()"
                />
              <div class='col-auto'>
                <co-btn color="primary" icon="search" @click="crud.toQuery()" />
              </div>
              <q-space/>
              <crud-operation :permission="permission" no-del has-download/>
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

          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <crud-row no-add
                :type="$q.screen.gt.xs?'button':'menu'"
                :data="props.row"
                :data-add="{sort: props.row.sort+10}"
                :permission="permission"
              />
            </q-td>
          </template>

          <template v-slot:pagination>
            <crud-pagination />
          </template>

        </co-table>
      </template>
      <template v-if="$q.screen.xs" v-slot:separator>
        <q-avatar color="primary" text-color="white" size="35px" icon="height" />
      </template>

      <template v-slot:after>
        <co-tree
          ref="tree"
          :class="$q.screen.gt.xs?'q-ml-xs':''"
          accordion
          node-key="id"
          label-key="title"
          tick-strategy="leaf-any-with-parent"
          :nodes="menuDatas"
          filter-key-like="titleLetter"
          filter-key-equal="id"
          filter-placeholder="ID、名称、拼音首字母"
          :ticked.sync="treeMenuTicked"
          :loading="loadingSaveRoleMenu"
          :loading-delay="10"
        >
          <template v-slot:toolbar-end>
            <q-btn dense class="q-my-sm" flat icon="refresh" @click="init()" >
              <q-tooltip :delay="800">刷新列表</q-tooltip>
            </q-btn>
            <co-btn class="q-my-sm q-ml-sm " color="primary" padding="xs md" dense @click="_saveRoleMenu()" v-if="checkPermission(['admin', 'roles:edit','roles:add'])" label="保存"/>
          </template>
        </co-tree>
      </template>
    </q-splitter>
  </div>
</template>

<script>
import { required, integer, between } from '@/utils/vuelidate'
import { mapGetters } from 'vuex'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import CrudOperation from '@crud/crud-operation'
import CrudPagination from '@crud/crud-pagination'
import CrudRow from '@crud/crud-row'
import CrudMore from '@crud/crud-more'

import crudRoles from '@/api/system/role'
import { getMenus } from '@/api/system/menu'

import checkPermission from '@/utils/permission'

const defaultForm = { id: null, name: null, depts: [], description: null, dataScope: '全部', level: 3 }
const visibleColumns = ['name', 'level', 'description', 'action']
const columns = [
  { name: 'id', field: 'id', label: 'ID' },
  { name: 'name', field: 'name', label: '名称', required: true, align: 'left', sortable: true },
  { name: 'level', field: 'level', label: '级别' },
  { name: 'dataScope', field: 'dataScope', label: '数据范围', align: 'left', sortable: true },
  { name: 'description', field: 'description', label: '描述' },
  { name: 'action', label: '操作', align: 'center' }
]

export default {
  name: 'Role',
  components: { CrudOperation, CrudMore, CrudPagination, CrudRow },
  cruds() {
    return CRUD({ columns, visibleColumns, idField: 'id', sort: ['name,asc'], title: '角色', url: 'api/roles', crudMethod: { ...crudRoles } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data () {
    return {
      splitter: 75,
      filterTable: '',
      permission: {
        add: ['admin', 'roles:add'],
        edit: ['admin', 'roles:edit'],
        del: ['admin', 'roles:del']
      },
      menuDatas: [],
      treeMenuTicked: [],
      loadingSaveRoleMenu: false
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
    integer,
    between,
    checkPermission,
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
        this.crud.notifyWarning('获取菜单失败')
      })
    },
    _saveRoleMenu() {
      if (!this.crud.selections || this.crud.selections.length === 0) {
        return
      }
      this.loadingSaveRoleMenu = true
      const selectedId = this.crud.selections[0].id
      const tickedArray = [...this.treeMenuTicked]
      const role = { id: selectedId, menus: [] }
      for (const ticked of tickedArray) {
        role.menus.push(ticked)
      }
      crudRoles.editMenu(role).then(() => {
        this.loadingSaveRoleMenu = false
        this.crud.notifySuccess('保存成功')
        for (const row of this.crud.data) {
          if (row.id === selectedId) {
            row.menus = role.menus
            break
          }
        }
      }).catch(err => {
        this.loadingSaveRoleMenu = false
        console.log('editMenu fail', err)
        this.crud.notifyError('保存失败：', err)
      })
    },
    _tableRowSelected(newSelected) {
      if (newSelected.length === 0 || newSelected.length > 1) {
        this.treeMenuTicked = []
      } else {
        this.treeMenuTicked = []
        newSelected[0].menus.forEach(menu => {
          this.treeMenuTicked.push(menu)
        })
      }
    },
    _tableRowClick(evt, row, index) {
      if (row) {
        this.crud.selections = [row]
        this.treeMenuTicked = []
        row.menus.forEach(menu => {
          this.treeMenuTicked.push(menu)
        })
      } else {
        this.crud.selections = []
        this.treeMenuTicked = []
      }
    }
  }
}
</script>
