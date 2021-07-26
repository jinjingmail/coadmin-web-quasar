<!--
  本地存储
-->
<template>
  <div >
    <co-dialog title="查找" no-max seamless ref="search" @before-hide="filterTable=''">
      <q-input placeholder="在当前页查找" dense outlined v-model="filterTable" clearable class="q-mx-sm q-mt-none q-mb-sm"/>
    </co-dialog>

    <co-dialog
      ref="addDialog"
      :value="crud.status.add > 0"
      title="上传文件"
      no-backdrop-dismiss
      @before-show="rejectedReason=''"
      @before-hide="crud.cancelCU"
      @hide="crud.toQuery()"
      card-style="width:600px; max-width:95vw;"
    >
      <div class="q-ma-md">
        <q-uploader
          :url="fileUploadApi"
          :headers="headers"
          field-name="file"
          label="选择文件（请勿上传违法文件，且文件不能大于50K）"
          max-files="3"
          :multiple="true"
          :filter="checkFileSize"
          @rejected="_rejected"
          @finish="$q.notify('上传结束')"
        />
        <pre class="text-negative">{{rejectedReason}}</pre>
      </div>
      <q-card-actions class="q-pa-md" align="right">
        <q-btn label="取消" flat v-close-popup/>
      </q-card-actions>
    </co-dialog>

    <co-dialog
      ref="editDialog"
      :value="crud.status.view>0 || crud.status.edit>0"
      :title="crud.status.title"
      no-backdrop-dismiss
      @before-hide="crud.cancelCU"
      card-style="width:500px; max-width:95vw;"
    >
      <co-form
        ref="form"
        label-width="small"
        label-align="right"
        class="q-pa-md row q-col-gutter-x-xl q-col-gutter-y-md">
          <co-form-item class="col-12" form-label="ID" v-if="form.id">
            <div class="q-pt-xs">{{form.id}}</div>
          </co-form-item>
          <co-input
            class="col-12" form-label="文件名称" v-model="form.name" :disable="!!crud.status.view" :rules="[
              val => (!!val) || '必填'
              ]"/>
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
      flat
      :data="crud.data"
      :columns="crud.columns"
      :visible-columns="crud.visibleColumns"
      :title="crud.title"
      :loading="crud.loading"
      selection="multiple"
      :selected.sync="crud.selections"
      :filter="filterTable"
      @row-click="(evt, row, index) => crud.selections = [row]"
    >
      <template v-slot:top-right="props">
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>

          <co-input
            dense
            v-model="query.blurry"
            placeholder="模糊搜索"
            content-style="width:200px"
            clearable
            @keyup.enter.native="crud.toQuery()"
            @clear="crud.toQuery()"
          />
          <co-date-select
            dense
            class="col-auto"
            placeholder="创建时间"
            v-model="query.createTime"
            content-style="width:200px"
            :default-time="[' 00:00:00', ' 23:59:59']"
            clearable
            @input="crud.toQuery()"
            range
          />
          <div>
            <q-btn dense padding="xs sm" color="primary" icon="search" @click="crud.toQuery()" />
          </div>
          <q-space/>

          <crud-operation dense :permission="permission" no-view label-add="上传" icon-add="file_upload"/>
          <div>
            <q-btn-dropdown dense color="primary" class="btn-dropdown-hide-droparrow" icon="apps" auto-close>
              <crud-more dense :tableSlotTopProps="props">
                <template v-slot:start>
                  <q-btn dense flat align="left" label="在当前页查找" icon="find_in_page" @click.native="$refs.search.show()" />
                  <q-separator/>
                </template>
              </crud-more>
            </q-btn-dropdown>
          </div>
        </div>
      </template>

      <template v-slot:body-cell-name="props">
        <q-td key="name" :props="props">
          <a target="_blank" :href="baseApi + '/file/' + props.row.type + '/' + props.row.realName">
            {{props.row.name}}
          </a>
        </q-td>
      </template>

      <template v-slot:body-cell-path="props">
        <q-td key="path" :props="props">
          <a target="_blank" :href="baseApi + '/file/' + props.row.type + '/' + props.row.realName">
            <q-img :src="baseApi + '/file/' + props.row.type + '/' + props.row.realName"
              :ratio="1" basic style="max-width:40px; text-align:center;"/>
          </a>
        </q-td>
      </template>

      <template v-slot:body-cell-createTime="props">
        <q-td key="createTime" :props="props">
          {{formatTime(props.row.createTime)}}
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <crud-row dense flat no-icon
            :type="$q.screen.gt.xs?'button':'menu'"
            :data="props.row"
            no-add
            :permission="permission"
          />
        </q-td>
      </template>

      <template v-slot:pagination>
        <crud-pagination dense/>
      </template>

    </co-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import CrudOperation from '@crud/crud-operation'
import CrudPagination from '@crud/crud-pagination'
import CrudRow from '@crud/crud-row'
import CrudMore from '@crud/crud-more'
import { getToken } from '@/utils/auth'
import crudFile from '@/api/tools/localStorage'

const defaultForm = { id: null, name: null }
const visibleColumns = ['name', 'path', 'suffix', 'type', 'size', 'createTime', 'action']
const columns = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  { name: 'name', field: 'name', label: '文件名', required: true, align: 'left' },
  { name: 'path', field: 'path', label: '预览图', align: 'center' },
  { name: 'suffix', field: 'suffix', label: '文件类型' },
  { name: 'type', field: 'type', label: '类别' },
  { name: 'size', field: 'size', label: '大小' },
  { name: 'createBy', field: 'createBy', label: '创建人' },
  { name: 'createTime', field: 'createTime', label: '创建时间' },
  { name: 'action', label: '操作', align: 'center' }
]

export default {
  name: 'LocalStorage',
  components: { CrudOperation, CrudMore, CrudPagination, CrudRow },
  cruds() {
    return CRUD({ columns, visibleColumns, idField: 'id', title: '本地存储', url: 'api/localStorage', crudMethod: { ...crudFile } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data () {
    return {
      rejectedReason: '',
      headers: [{ name: 'Authorization', value: getToken() }],
      permission: {
        add: ['admin', 'storage:add'],
        edit: ['admin', 'storage:edit'],
        del: ['admin', 'storage:del']
      },
      filterTable: ''
    }
  },
  computed: {
    ...mapState('api', [
      'baseApi',
      'fileUploadApi'
    ])

  },
  methods: {
    checkFileSize (files) {
      return files.filter(file => file.size <= 50 * 1024)
    },
    _rejected (rejectedEntries) {
      this.rejectedReason = '超过规定大小:\n'
      for (const entity of rejectedEntries) {
        this.rejectedReason = this.rejectedReason + entity.file.name + '\n'
      }
    }
  }
}
</script>
