<!--
  部门
-->
<template>
  <div >
    <coadmin-dialog
      ref="formDialog"
      :value="crud.status.cu > 0"
      :title="crud.status.title"
      no-backdrop-dismiss
      @before-hide="crud.cancelCU"
      content-style="width:600px; max-width:95vw;"
    >
      <coadmin-form ref="form" label-width="large" label-position="right" class="q-pa-md">
        <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
          <coadmin-form-item class="col-12" form-label="ID" v-if="form.id">
            <q-field dense borderless>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{form.id}} pid={{form.pid}} enabled={{form.enabled}}</div>
              </template>
            </q-field>
          </coadmin-form-item>
          <coadmin-input class="col-12" form-label="机构名称" v-model="form.name" :disable="!!crud.status.view" :rules="[
              val => (!!val) || '必填'
              ]"/>
          <coadmin-input class="col-12" form-label="排序" v-model.number="form.sort" type="number" :disable="!!crud.status.view" :rules="[
              val => (!!val) || '必填'
              ]"/>
          <coadmin-option-group
            class="col-12"
            form-label="状态"
            v-model="form.enabled"
            :disable="!!crud.status.view"
            inline
            :options="dict.dept_status"
            type="radio"
          />
          <coadmin-tree-select
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
            selectable
            clearable
            :disable="!!crud.status.view"
          />
        </div>
      </coadmin-form>
      <q-card-actions class="q-pa-md" align="right">
        <q-btn label="取消" flat v-close-popup/>
        <q-btn label="保存" icon="check" color="primary" v-if="!crud.status.view" @click="crud.submitCU"
          :loading="crud.status.cu === crud.STATUS_PROCESSING" :disable="crud.status.cu === crud.STATUS_PROCESSING"/>
      </q-card-actions>
    </coadmin-dialog>

    <q-splitter
      v-model="splitter"
      unit="%"
      :horizontal="$q.screen.xs"
      emit-immediately
    >
      <template v-slot:before>
        <coadmin-tree
          ref="tree"
          class="q-pt-sm q-ma-sm"
          node-key="id"
          label-key="label"
          :nodes="treeDatas"
          filter-key-like="nameLetter"
          filter-key-equal="id"
          selected-color="purple"
          selectable
          @update:selected="handleTreeDeptNodeClick"
        />
      </template>

      <template v-if="$q.screen.xs" v-slot:separator>
        <q-avatar color="primary" text-color="white" size="35px" icon="height" />
      </template>

      <template v-slot:after>
        <coadmin-table
          ref="table"
          row-key="id"
          dense
          flat
          class="q-pt-sm q-ma-sm"
          :data="crud.data"
          :columns="crud.columns"
          :visible-columns="crud.visibleColumns"
          :title="crud.title"
          :loading="crud.loading"
          :selected.sync="crud.selections"
          @row-click="(evt, row, index) => crud.selections = [row]"
        >
          <template v-slot:top-right="props">
            <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-px-sm q-py-sm full-width'>
              <coadmin-input class='col-auto' placeholder="ID、名称" v-model="query.blurry" content-style="width:200px" clearable @keyup.enter.native="crud.toQuery"/>
              <div class='col-auto'>
                <q-btn dense padding="xs sm" color="primary" icon="search" @click="crud.toQuery" />
              </div>
              <q-space/>
              <crud-operation :permission="permission" />
              <div class="col-auto">
                <q-btn-dropdown dense color="primary" class="btn-dropdown-hide-droparrow" icon="apps" auto-close>
                  <crud-more :tableSlotTopProps="props" />
                </q-btn-dropdown>
              </div>
            </div>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <crud-row
                flat
                :type="$q.screen.gt.xs?'button':'menu'"
                :data="props.row"
                :data-add="{sort: props.row.sort+10, pid: props.row.pid}"
                :permission="permission"
              />
            </q-td>
          </template>

          <template v-slot:pagination>
            <crud-pagination />
          </template>

        </coadmin-table>
      </template>
    </q-splitter>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import crudPagination from '@crud/CRUD.pagination'
import crudRow from '@crud/CRUD.row'
import crudMore from '@crud/CRUD.more'
import crudDept, { getDepts } from '@/api/system/dept'

const defaultForm = { id: null, name: null, isTop: '0', pid: null, sort: 10, enabled: 'true' }
const visibleColumns = ['name', 'sort', 'enabled', 'treeNames', 'action']
const columns = [
  { name: 'id', field: 'id', label: 'ID' },
  {
    name: 'name',
    field: 'name',
    label: '名称',
    required: true,
    align: 'left',
    sortable: true
  },
  { name: 'pid', label: 'PID', field: 'pid', align: 'left' },
  { name: 'sort', label: '排序', field: 'sort', align: 'left', sortable: true },
  { name: 'enabled', label: 'enabled', field: 'enabled', align: 'left' },
  { name: 'treeNames', label: 'names', field: 'treeNames', align: 'left' },
  { name: 'action', label: '操作', align: 'center' }
]

export default {
  name: 'Dept',
  components: { crudOperation, crudMore, crudPagination, crudRow },
  cruds() {
    return CRUD({ columns, visibleColumns, idField: 'id', title: '机构', query: { pid: null }, url: 'api/dept', crudMethod: { ...crudDept } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data () {
    return {
      splitter: 30,
      treeNodeSelected: null,
      treeDatas: [],
      permission: {
        add: ['admin', 'dept:add'],
        edit: ['admin', 'dept:edit'],
        del: ['admin', 'dept:del']
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getDeptDatas()
    })
  },
  computed: {
    ...mapGetters('permission', [
      'dict'
    ])
  },
  methods: {
    getDeptDatas() {
      const sort = 'id,desc'
      const params = { sort: sort }
      getDepts(params).then(res => {
        this.treeDatas = res.content
      }).catch(err => {
        console.log('getDepts', err)
      })
    },
    // 切换机构
    handleTreeDeptNodeClick(data) {
      console.log('handleTreeDeptNodeClick', data)
      if (data.pid === 0) {
        this.query.pids = data
        this.query.treeId = data
      } else {
        this.query.pids = data
        this.query.treeId = data
      }
      this.crud.toQuery()
    }
  }
}
</script>
