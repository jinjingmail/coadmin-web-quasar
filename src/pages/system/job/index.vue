<!--
  岗位
-->
<template>
  <div >
    <co-dialog title="查找" no-max seamless ref="search" @before-hide="crud.props.filterTable=''">
      <co-input style="width:180px" placeholder="在当前页查找" dense outlined v-model="crud.props.filterTable" clearable class="q-mx-sm q-mt-none q-mb-sm"/>
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
        label-width="small"
        label-align="right"
        class="q-px-lg q-my-none row q-col-gutter-x-xl q-col-gutter-y-md">
          <co-field class="col-12" form-label="ID" :value="form.id" readonly borderless v-show="form.id"/>
          <co-input class="col-12" form-label="岗位名称" v-model="form.name" :disable="!!crud.status.view" :rules="[
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
      </co-form>
      <q-card-actions class="q-px-lg q-pt-lg q-pb-md" align="right">
        <co-btn label="取消" flat v-close-popup/>
        <co-btn label="保存" color="primary" v-if="!crud.status.view" @click="crud.submitCU"
          :loading="crud.status.cu === crud.STATUS_PROCESSING" :disable="crud.status.cu === crud.STATUS_PROCESSING"/>
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
      selection="single"
      :selected.sync="crud.selections"
      :filter="crud.props.filterTable"
      @row-click="(evt, row, index) => crud.selections = [row]"
        @row-dblclick="(evt, row, index) => crud.toView(row)"
    >
      <template v-slot:top-right="props">
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>
          <co-toggle label="状态" v-model="query.enabled" toggle-indeterminate @input="crud.toQuery()"/>
          <q-space/>

          <crud-operation :permission="permission" />
          <div>
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
          {{props.row.enabled?'启用':'禁用'}}
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td key="action" :props="props">
          <crud-row flat no-icon
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import CrudOperation from '@crud/crud-operation'
import CrudPagination from '@crud/crud-pagination'
import CrudRow from '@crud/crud-row'
import CrudMore from '@crud/crud-more'
import crudJob from '@/api/system/job'

const defaultForm = { id: null, name: null, sort: 10, enabled: true }
const visibleColumns = ['id', 'name', 'sort', 'enabled', 'action']
const columns = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  { name: 'name', field: 'name', label: '名称', required: true, align: 'left' },
  { name: 'sort', field: 'sort', label: '排序', sortable: true },
  { name: 'enabled', field: 'enabled', label: '状态' },
  { name: 'action', label: '操作', align: 'center' }
]

export default {
  name: 'Job',
  components: { CrudOperation, CrudMore, CrudPagination, CrudRow },
  cruds() {
    return CRUD({ columns, visibleColumns, idField: 'id', sort: ['sort,asc', 'id,desc'], title: '岗位', url: 'api/job', crudMethod: { ...crudJob } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data () {
    return {
      permission: {
        add: ['admin', 'job:add'],
        edit: ['admin', 'job:edit'],
        del: ['admin', 'job:del']
      }
    }
  },
  computed: {
    ...mapGetters('permission', [
      'dict'
    ])
  },
  methods: {
  }
}
</script>
