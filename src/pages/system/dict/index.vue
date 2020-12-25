<!--
  字典
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
      <coadmin-form ref="form" label-width="small" label-position="right" class="q-pa-md">
        <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
          <coadmin-form-item class="col-12" form-label="ID" v-if="form.id">
            <q-field dense borderless>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{form.id}}</div>
              </template>
            </q-field>
          </coadmin-form-item>
          <coadmin-input class="col-12" form-label="名称" v-model="form.name" :disable="!!crud.status.view" :rules="[
              val => (val && val.length >= 1) || '请输入1个以上字符'
              ]">
          </coadmin-input>
          <coadmin-input class="col-12" form-label="描述" v-model="form.description" :disable="!!crud.status.view" :rules="[
              val => (val && val.length >= 1) || '请输入1个以上字符'
              ]">
          </coadmin-input>
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
        <coadmin-table
          ref="table"
          row-key="id"
          dense
          class="q-pt-sm q-ma-sm"
          :data="crud.data"
          :columns="crud.columns"
          :visible-columns="crud.visibleColumns"
          :title="crud.title"
          :loading="crud.loading"
          :selected.sync="crud.selections"
          @row-click="dictRowClick"
        >
          <template v-slot:top-right="props">
            <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-px-sm q-py-sm full-width'>
              <coadmin-input class='col' placeholder="名称、描述" v-model="query.blurry" content-style="width:140px" clearable @keyup.enter.native="crud.toQuery"/>
              <div class='col-auto'>
                <q-btn dense padding="xs sm" color="primary" icon="search" @click="crud.toQuery" />
              </div>
              <q-space/>
              <crud-operation :permission="permission" no-view no-edit no-label/>
              <div class="col-auto">
                <q-btn-dropdown dense color="primary" class="btn-dropdown-hide-droparrow" icon="apps" auto-close>
                  <crud-more :tableSlotTopProps="props" />
                </q-btn-dropdown>
              </div>
            </div>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <crud-row :data="props.row" no-add flat :permission="permission" :type="$q.screen.gt.xs?'button':'menu'"/>
            </q-td>
          </template>

          <template v-slot:pagination>
            <crud-pagination no-persistence-page-size/>
          </template>

        </coadmin-table>
      </template>

      <template v-if="$q.screen.xs" v-slot:separator>
        <q-avatar color="primary" text-color="white" size="35px" icon="height" />
      </template>

      <template v-slot:after>
        <dict-detail ref="dictDetail" />
      </template>
    </q-splitter>
  </div>
</template>

<script>
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import crudPagination from '@crud/CRUD.pagination'
import crudRow from '@crud/CRUD.row'
import crudMore from '@crud/CRUD.more'
import crudDict from '@/api/system/dict'

import dictDetail from './dictDetail'

const columns = [
  { name: 'id', field: 'id', label: 'ID' },
  {
    name: 'name',
    field: 'name',
    label: '名称',
    required: true,
    align: 'left',
    format: val => `${val}`,
    sortable: true
  },
  { name: 'description', label: '描述', field: 'description', align: 'left' },
  { name: 'action', label: '操作', align: 'center' }
]
const visibleColumns = ['name', 'description', 'action']
const defaultForm = { id: null, name: null, description: null, dictDetails: [] }

export default {
  name: 'Dict',
  components: { crudOperation, crudMore, crudPagination, crudRow, dictDetail },
  cruds() {
    return CRUD({ columns, visibleColumns, idField: 'id', title: '字典列表', url: 'api/dict', crudMethod: { ...crudDict } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data () {
    return {
      splitter: 45,
      permission: {
        add: ['admin', 'dict:add'],
        edit: ['admin', 'dict:edit'],
        del: ['admin', 'dict:del']
      }
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      if (this.$refs.dictDetail) {
        this.$refs.dictDetail.dictId = null
        this.$refs.dictDetail.query.dictName = ''
      }
      return true
    },

    dictRowClick (evt, row, index) {
      this.crud.selections = [row]
      this.$refs.dictDetail.dictId = row.id
      this.$refs.dictDetail.query.dictId = row.id
      this.$refs.dictDetail.query.dictName = row.name
      this.$refs.dictDetail.crud.toQuery()
    }
  }
}
</script>