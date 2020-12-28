<!--
  岗位
-->
<template>
  <div >
    <coadmin-dialog title="查找" no-max seamless ref="search" @before-hide="filterTable=''">
      <q-input placeholder="在当前页查找" dense outlined v-model="filterTable" clearable class="q-ml-sm q-mr-sm q-mt-none q-mb-sm"/>
    </coadmin-dialog>
    <coadmin-dialog
      ref="formDialog"
      :value="crud.status.cu > 0"
      :title="crud.status.title"
      no-backdrop-dismiss
      @before-hide="crud.cancelCU"
      card-style="width:600px; max-width:95vw;"
    >
      <coadmin-form
        ref="form"
        label-width="small"
        label-align="right"
        class="q-pa-md row q-col-gutter-x-xl q-col-gutter-y-md">
          <coadmin-form-item class="col-12" form-label="ID" v-if="form.id">
            <div class="q-pt-xs">{{form.id}}</div>
          </coadmin-form-item>
          <coadmin-input class="col-12" form-label="岗位名称" v-model="form.name" :disable="!!crud.status.view" :rules="[
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
      </coadmin-form>
      <q-card-actions class="q-pa-md" align="right">
        <q-btn label="取消" flat v-close-popup/>
        <q-btn label="保存" icon="check" color="primary" v-if="!crud.status.view" @click="crud.submitCU"
          :loading="crud.status.cu === crud.STATUS_PROCESSING" :disable="crud.status.cu === crud.STATUS_PROCESSING"/>
      </q-card-actions>
    </coadmin-dialog>

    <coadmin-table
      ref="table"
      row-key="id"
      dense
      sticky-header
      :data="crud.data"
      :columns="crud.columns"
      :visible-columns="crud.visibleColumns"
      :title="crud.title"
      :loading="crud.loading"
      selection="single"
      :selected.sync="crud.selections"
      :filter="filterTable"
      @row-click="(evt, row, index) => crud.selections = [row]"
    >
      <template v-slot:top-right="props">
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-px-sm q-py-sm full-width'>
          <coadmin-select
            class="col-auto"
            placeholder="状态"
            form-label="状态"
            label-style="margin-top:10px"
            content-style="width:120px"
            outlined
            v-model="query.enabled"
            no-filter
            :options="dict.job_status"
            @input="crud.toQuery()"
            clearable
            emit-value
            map-options
          />
          <q-space/>
          <crud-operation :permission="permission" />
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

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <crud-row
            flat
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

    </coadmin-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import crudPagination from '@crud/CRUD.pagination'
import crudRow from '@crud/CRUD.row'
import crudMore from '@crud/CRUD.more'
import crudJob from '@/api/system/job'

const defaultForm = { id: null, name: null, sort: 10, enabled: true }
const visibleColumns = ['name', 'sort', 'enabled', 'action']
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
  { name: 'sort', label: '排序', field: 'sort', sortable: true },
  { name: 'enabled', label: 'enabled', field: 'enabled' },
  { name: 'action', label: '操作', align: 'center' }
]

export default {
  name: 'Job',
  components: { crudOperation, crudMore, crudPagination, crudRow },
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
      },
      filterTable: ''
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
