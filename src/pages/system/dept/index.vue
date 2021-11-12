<!--
  部门
-->
<template>
  <div >
    <co-dialog title="查找" no-max seamless ref="search" @before-hide="filterTable=''">
      <co-input placeholder="在当前页查找" outlined v-model="filterTable" clearable class="q-mx-sm q-mt-none q-mb-sm"/>
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
        label-width="medium"
        label-align="right"
        class="q-px-lg q-my-none row q-col-gutter-x-xl q-col-gutter-y-md">
          <co-field class="col-12" form-label="ID" :value="form.id" v-if="form.id" borderless>
          </co-field>
          <co-input class="col-12" form-label="机构名称" v-model="form.name" :disable="!!crud.status.view" :rules="[
              val => (!!val) || '必填'
              ]"/>
          <co-input class="col-12" form-label="排序" v-model.number="form.sort" type="number" :disable="!!crud.status.view" :rules="[
              val => (!!val) || '必填'
              ]"/>
          <co-field class="col-12" form-label="状态" :disable="!!crud.status.view">
            <template v-slot:control>
              <co-toggle v-model="form.enabled" :disable="!!crud.status.view"/>
            </template>
          </co-field>
          <co-tree-select
            class="col-12"
            tree-class="q-pa-sm"
            form-label="选择上级机构"
            :selected.sync="form.pid"
            :expended="form.pid"
            node-key="id"
            label-key="name"
            :nodes="treeDatas"
            filter-key-like="nameLetter"
            filter-key-equal="id"
            filter-placeholder="名称、拼音首字母"
            selectable
            clearable
            :disable="!!crud.status.view"
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
          :nodes="treeDatas"
          filter-key-like="nameLetter"
          filter-key-equal="id"
          filter-placeholder="ID、名称、拼音首字母"
          selected-color="primary"
          selectable
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
          :class="$q.screen.gt.xs?'q-ml-xs':''"
          tree-table
          tree-children-key="children"
          expand-size="sm"
          expand-style="margin-right:5px; color: red; "
          :expand-width="3"
          :data="crud.data"
          :columns="crud.columns"
          :visible-columns="crud.visibleColumns"
          :title="treeSelectedLabel"
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
              <q-space/>
              <crud-operation :permission="permission" />
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
            <q-td key="action" :props="props">
              <crud-row flat no-icon
                :type="$q.screen.gt.xs?'button':'menu'"
                :data="props.row"
                :data-add="{sort: props.row.sort+10, pid: props.row.pid}"
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
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import CrudOperation from '@crud/crud-operation'
import CrudPagination from '@crud/crud-pagination'
import CrudRow from '@crud/crud-row'
import CrudMore from '@crud/crud-more'
import crudDept, { getDepts } from '@/api/system/dept'

const defaultForm = { id: null, name: null, isTop: '0', pid: null, sort: 10, enabled: true }
const visibleColumns = ['name', 'sort', 'enabled', 'treeNames', 'action']
const columns = [
  { name: 'id', field: 'id', label: 'ID' },
  { name: 'name', field: 'name', label: '名称', required: true, align: 'left' },
  { name: 'sort', field: 'sort', label: '排序' },
  { name: 'pid', field: 'pid', label: 'PID' },
  { name: 'enabled', field: 'enabled', label: '状态', align: 'left', format: val => val ? '启用' : '禁用' },
  { name: 'treeNames', field: 'treeNames', label: '全部层级', align: 'left' },
  { name: 'action', label: '操作', align: 'center' }
]

export default {
  name: 'Dept',
  components: { CrudOperation, CrudMore, CrudRow, CrudPagination },
  cruds() {
    return CRUD({ columns, visibleColumns, idField: 'id', title: '机构', sort: ['sort,desc'], query: { pid: null }, url: 'api/dept', crudMethod: { ...crudDept } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data () {
    return {
      splitter: 250,
      treeSelectedLabel: null,
      treeDatas: [],
      permission: {
        add: ['admin', 'dept:add'],
        edit: ['admin', 'dept:edit'],
        del: ['admin', 'dept:del']
      },
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
      this.getDeptDatas()
    },
    getDeptDatas() {
      const sort = 'sort,asc'
      const params = { sort: sort }
      getDepts(params).then(res => {
        this.treeDatas = res.data.content
      }).catch(err => {
        console.log('getDepts', err)
      })
    },
    // 切换机构
    handleTreeNodeClick(id) {
      if (id == null) {
        id = 0
      }
      if (id === 0) {
        this.query.pids = null
        this.query.treeId = id
      } else {
        this.query.pids = id
        this.query.treeId = id
      }
      this.crud.toQuery()
    }
  }
}
</script>
