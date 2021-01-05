<!--
  代码生成
-->
<template>
  <div >
    <preview ref="preview"/>
    <config ref="config"/>
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
      </coadmin-form>
      <q-card-actions class="q-pa-md" align="right">
        <q-btn label="取消" flat v-close-popup/>
        <q-btn label="保存" icon="check" color="primary" v-if="!crud.status.view" @click="crud.submitCU"
          :loading="crud.status.cu === crud.STATUS_PROCESSING" :disable="crud.status.cu === crud.STATUS_PROCESSING"/>
      </q-card-actions>
    </coadmin-dialog>

    <coadmin-table
      ref="table"
      row-key="tableName"
      dense
      :data="crud.data"
      :columns="crud.columns"
      :visible-columns="crud.visibleColumns"
      :title="crud.title"
      :loading="crud.loading"
      :filter="filterTable"
      :selected.sync="crud.selections"
      selection="multiple"
    >
      <template v-slot:top-right="props">
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-px-xs q-py-xs full-width'>
          <coadmin-input class='col-auto'
            placeholder="表名"
            v-model="query.name" content-style="width:180px"
            clearable
            @keyup.enter.native="crud.toQuery()"
            @clear="crud.toQuery()"
            />
          <div class='col-auto'>
            <q-btn dense padding="xs sm" color="primary" icon="search" @click="crud.toQuery()" />
          </div>
          <div class='col-auto'>
            <q-btn dense label="同步" color="primary"
              :loading="syncLoading"
              :disable="crud.selections.length === 0"
              @click="doSync"/>
          </div>
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
          <q-btn dense label="修改" flat color="primary" @click="$refs.config.show(props.row.tableName)"/>
          <q-btn dense label="预览" flat color="primary" @click="$refs.preview.show(props.row.tableName)"/>
          <q-btn dense label="下载" flat color="primary" @click="toDownload(props.row.tableName)"/>
          <q-btn dense label="生成" flat color="primary" @click="toGen(props.row.tableName)"/>
        </q-td>
      </template>

      <template v-slot:pagination>
        <crud-pagination />
      </template>

    </coadmin-table>
  </div>
</template>

<script>
import CRUD, { presenter, header } from '@crud/crud'
import crudPagination from '@crud/CRUD.pagination'
import crudMore from '@crud/CRUD.more'
import Preview from './preview'
import Config from './config'
import { generator, sync } from '@/api/generator/generator'
import { downloadFile } from '@/utils/index'

const visibleColumns = ['tableName', 'engine', 'coding', 'remark', 'createTime', 'action']
const columns = [
  { name: 'tableName', field: 'tableName', label: '表名', required: true, align: 'left' },
  { name: 'engine', field: 'engine', label: '数据库引擎' },
  { name: 'coding', field: 'coding', label: '字符编码集' },
  { name: 'remark', field: 'remark', label: '备注' },
  { name: 'createTime', field: 'createTime', label: '创建日期' },
  { name: 'action', label: '操作', align: 'center' }
]

export default {
  name: 'GeneratorIndex',
  components: { crudMore, crudPagination, Preview, Config },
  cruds() {
    return CRUD({ columns, visibleColumns, idField: 'tableName', title: '代码生成', url: 'api/generator/tables' })
  },
  mixins: [presenter(), header()],
  data () {
    return {
      filterTable: '',
      syncLoading: false
    }
  },
  methods: {
    toGen(tableName) {
      generator(tableName, 0).then(data => {
        this.crud.notifySuccess('生成成功')
      }).catch(err => {
        this.crud.notifyFailure('失败', err)
      })
    },
    toDownload(tableName) {
      generator(tableName, 2).then(data => {
        downloadFile(data, tableName, 'zip')
      })
    },
    doSync() {
      const tables = []
      this.crud.selections.forEach(val => {
        tables.push(val.tableName)
      })
      this.syncLoading = true
      sync(tables).then(() => {
        this.syncLoading = false
        this.crud.refresh()
        this.crud.notifySuccess('同步成功')
      }).catch(() => {
        this.syncLoading = false
      })
    }
  }
}
</script>
