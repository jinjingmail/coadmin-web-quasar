<!--
  字典详情
-->
<template>
  <div >
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
        class="q-pa-md row q-col-gutter-x-xl q-col-gutter-y-md">
          <co-form-item dense class="col-12" form-label="ID" v-if="form.id">
            <div class="q-pt-sm">{{form.id}}</div>
          </co-form-item>
          <co-input dense outlined class="col-12" form-label="标签" v-model="form.label" :disable="!!crud.status.view" :rules="[
              val => (!!val) || '必填'
              ]"/>
          <co-input dense outlined class="col-12" form-label="值" v-model="form.value" :disable="!!crud.status.view" :rules="[
              val => (!!val) || '必填'
              ]"/>
          <co-input dense outlined class="col-12" form-label="排序" v-model="form.sort" :disable="!!crud.status.view" />
      </co-form>
      <q-card-actions class="q-pa-md" align="right">
        <q-btn label="取消" flat v-close-popup/>
        <q-btn label="保存" icon="check" color="primary" v-if="!crud.status.view" @click="crud.submitCU"
          :loading="crud.status.cu === crud.STATUS_PROCESSING" :disable="crud.status.cu === crud.STATUS_PROCESSING"/>
      </q-card-actions>
    </co-dialog>

    <co-table
      ref="table"
      row-key="id"
      dense
      :data="crud.data"
      :columns="crud.columns"
      :visible-columns="crud.visibleColumns"
      :title="query.dictName"
      :loading="crud.loading"
      selection="multiple"
      :selected.sync="crud.selections"
      @row-click="(evt, row, index) => crud.selections = [row]"
    >
      <template v-slot:top-right="props">
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>
          <co-input dense class='col-auto' label="ID、标签、值" filled v-model="query.blurry" content-style="width:140px" clearable @keyup.enter.native="crud.toQuery"/>
          <div class='col-auto'>
            <q-btn dense padding="xs sm" color="primary" icon="search" @click="crud.toQuery" />
          </div>
          <q-space/>
          <crud-operation dense :permission="permission" v-if="dictId" no-view no-edit no-label/>
          <div class="col-auto">
            <q-btn-dropdown dense color="primary" class="btn-dropdown-hide-droparrow" icon="apps" auto-close>
              <crud-more dense :tableSlotTopProps="props" />
            </q-btn-dropdown>
          </div>
        </div>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <crud-row dense flat no-icon :data="props.row" :data-add="{sort: props.row.sort+10}"  :permission="permission" :type="$q.screen.gt.xs?'button':'menu'"/>
        </q-td>
      </template>

      <template v-slot:pagination>
        <crud-pagination
          no-persistence-page-size
          no-page-if-only-one-page/>
      </template>

    </co-table>
  </div>
</template>

<script>
import CRUD, { presenter, header, form } from '@crud/crud'
import CrudOperation from '@crud/crud-operation'
import CrudPagination from '@crud/crud-pagination'
import CrudRow from '@crud/crud-row'
import CrudMore from '@crud/crud-more'
import crudDictDetail from '@/api/system/dictDetail'

const defaultForm = { id: null, label: null, value: null, sort: 10 }
const visibleColumns = ['label', 'value', 'sort', 'action']
const columns = [
  { name: 'id', field: 'id', label: 'ID' },
  {
    name: 'label',
    field: 'label',
    label: '标签',
    required: true,
    align: 'left',
    sortable: true
  },
  { name: 'value', label: '值', field: 'value', align: 'left' },
  { name: 'sort', label: '排序', field: 'sort', sortable: true },
  { name: 'action', label: '操作', align: 'center' }
]

export default {
  name: 'DictDetail',
  components: { CrudOperation, CrudMore, CrudPagination, CrudRow },
  cruds() {
    return CRUD({
      columns,
      visibleColumns,
      idField: 'id',
      query: { dictName: '', dictId: null },
      title: '字典详情',
      sort: ['sort,asc', 'id,desc'],
      url: 'api/dictDetail',
      crudMethod: { ...crudDictDetail },
      queryOnPresenterCreated: false
    })
  },
  mixins: [
    presenter(),
    header(),
    form(function () {
      return Object.assign({ dict: { id: this.dictId } }, defaultForm)
    })
  ],
  data () {
    return {
      permission: {
        add: ['admin', 'dict:add'],
        edit: ['admin', 'dict:edit'],
        del: ['admin', 'dict:del']
      },
      dictId: null
    }
  }
}
</script>
