<!--
  七牛存储
-->
<template>
  <div >
    <co-dialog title="查找" no-max seamless ref="search" @before-hide="filterTable=''">
      <co-input placeholder="在当前页查找" outlined v-model="filterTable" clearable class="q-mx-sm q-mt-none q-mb-sm"/>
    </co-dialog>

    <co-dialog
      ref="configDialog"
      title="七牛云配置"
      no-backdrop-dismiss
      card-style="width:600px; max-width:95vw;"
      :loading="configLoading"
      @before-show="configDialogBeforeShow"
    >
      <co-form
        ref="configForm"
        label-width="medium"
        label-align="right"
        class="q-px-lg q-my-none row q-col-gutter-x-xl q-col-gutter-y-md">
        <co-input class="col-12" form-label="Access Key" v-model="configForm.accessKey" :rules="[
          val => (!!val) || '必填'
          ]"/>
        <co-input class="col-12" form-label="Secret Key" v-model="configForm.secretKey" :rules="[
          val => (!!val) || '必填'
          ]"/>
        <co-input class="col-12" form-label="空间名称" v-model="configForm.bucket" :rules="[
          val => (!!val) || '必填'
          ]"/>
        <co-input class="col-12" form-label="外链域名" v-model="configForm.host" :rules="[
          val => (!!val) || '必填'
          ]"/>
        <co-select
          class="col-12"
          form-label="存储区域"
          v-model="configForm.zone"
          no-filter
          :options="['华东', '华北', '华南', '北美', '东南亚']"
        />
        <co-field class="col-12" form-label="空间类型" >
          <template v-slot:control>
            <co-option-group v-model="configForm.type" inline
              :options="[
                {label: '公开', value: '公开'},
                {label: '私有', value: '私有'}
              ]"
            />
          </template>
        </co-field>
      </co-form>
      <q-card-actions class="q-px-lg q-pt-lg q-pb-md" align="right">
        <co-btn label="取消" flat v-close-popup/>
        <co-btn label="保存" color="primary" @click="doSaveConfig"/>
      </q-card-actions>
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
          :url="qiNiuUploadApi"
          :headers="headers"
          field-name="file"
          label="选择文件（请勿上传违法文件，且文件不能大于1K）"
          max-files="3"
          :multiple="true"
          :filter="checkFileSize"
          @rejected="_rejected"
          @finish="$q.notify('上传结束')"
        />
        <pre class="text-negative">{{rejectedReason}}</pre>
      </div>
      <q-card-actions class="q-px-lg q-pt-lg q-pb-md" align="right">
        <co-btn label="取消" flat v-close-popup/>
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
        class="q-px-lg q-my-none row q-col-gutter-x-xl q-col-gutter-y-md">
          <co-field class="col-12" form-label="ID" :value="form.id" readonly borderless v-show="form.id"/>
          <co-input
            class="col-12" form-label="文件名称" v-model="form.name" :disable="!!crud.status.view" :rules="[
              val => (!!val) || '必填'
              ]"/>
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
      selection="multiple"
      :selected.sync="crud.selections"
      :filter="filterTable"
      @row-click="(evt, row, index) => crud.selections = [row]"
        @row-dblclick="(evt, row, index) => crud.toView(row)"
    >
      <template v-slot:top-right="props">
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>

          <co-input
            v-model="query.blurry"
            placeholder="模糊搜索"
            content-style="width:200px"
            clearable
            @change="crud.toQuery()"
            @clear="crud.toQuery()"
          />
          <co-date-select
            class="col-auto"
            placeholder="更新时间"
            v-model="query.updateTime"
            content-style="width:230px"
            :default-time="['00:00:00', '23:59:59']"
            clearable
            @input="crud.toQuery()"
            range
          />
          <div>
            <co-btn color="primary" icon="search" @click="crud.toQuery()" />
          </div>
          <q-space/>

          <crud-operation :permission="permission" no-view label-add="上传" icon-add="cloud_upload">
            <template v-slot:start>
              <co-btn color="secondary" label="同步" icon="search" @click="synchronize"/>
              <co-btn color="secondary" label="配置" icon="search" @click="$refs.configDialog.show()"/>
            </template>
          </crud-operation>
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

      <template v-slot:body-cell-name="props">
        <q-td key="name" :props="props">
          <a target="_blank" href="JavaScript:" @click="download(props.row.id)">
            {{props.row.name}}
          </a>
        </q-td>
      </template>

      <template v-slot:body-cell-updatetime="props">
        <q-td key="updatetime" :props="props">
          {{formatTime(props.row.updatetime)}}
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <crud-row flat no-icon
            :type="$q.screen.gt.xs?'button':'menu'"
            :data="props.row"
            no-add
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
import { mapState } from 'vuex'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import CrudOperation from '@crud/crud-operation'
import CrudPagination from '@crud/crud-pagination'
import CrudRow from '@crud/crud-row'
import CrudMore from '@crud/crud-more'
import { getToken } from '@/utils/auth'
import crudQiNiu, { get, update } from '@/api/tools/qiniu'

const defaultConfigForm = { accessKey: '', secretKey: '', bucket: '', host: '', zone: '', type: '' }
const defaultForm = { id: null, name: null }
const visibleColumns = ['name', 'suffix', 'bucket', 'type', 'size', 'updatetime', 'action']
const columns = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  { name: 'name', field: 'name', label: '文件名', required: true, align: 'left' },
  { name: 'suffix', field: 'suffix', label: '文件类型' },
  { name: 'bucket', field: 'bucket', label: '空间名称', align: 'left' },
  { name: 'type', field: 'type', label: '空间类型' },
  { name: 'size', field: 'size', label: '大小' },
  { name: 'updatetime', field: 'updatetime', label: '更新时间' },
  { name: 'action', label: '操作', align: 'center' }
]

export default {
  name: 'QiniuStorage',
  components: { CrudOperation, CrudMore, CrudPagination, CrudRow },
  cruds() {
    return CRUD({ columns, visibleColumns, idField: 'id', title: '七牛云文件', url: 'api/qiNiuContent', crudMethod: { ...crudQiNiu } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data () {
    return {
      rejectedReason: '',
      headers: [{ name: 'Authorization', value: getToken() }],
      configLoading: false,
      configForm: { },
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
      'qiNiuUploadApi'
    ])

  },
  methods: {
    checkFileSize (files) {
      return files.filter(file => file.size <= 1024)
    },
    _rejected (rejectedEntries) {
      this.rejectedReason = '超过规定大小:\n'
      for (const entity of rejectedEntries) {
        this.rejectedReason = this.rejectedReason + entity.file.name + '\n'
      }
    },
    configDialogBeforeShow () {
      this.configForm = { ...defaultConfigForm }
      this.configLoading = true
      get().then(res => {
        this.configLoading = false
        this.configForm = res
      }).catch(err => {
        this.configLoading = false
        this.crud.notifyFailure('载入数据失败：', err)
      })
    },
    doSaveConfig() {
      this.$refs.configForm.validate().then((valid) => {
        if (valid) {
          this.configLoading = true
          update(this.configForm).then(res => {
            this.configLoading = false
            this.crud.notifySuccess('修改成功')
            this.$refs.configDialog.hide()
          }).catch(err => {
            this.configLoading = false
            this.crud.notifyFailure('保存失败：', err)
            this.$refs.configDialog.hide()
          })
        } else {
          return false
        }
      })
    },
    // 下载文件
    download(id) {
      this.downloadLoading = true
      // 先打开一个空的新窗口，再请求
      this.newWin = window.open()
      crudQiNiu.download(id).then(res => {
        this.downloadLoading = false
        this.url = res.url
      }).catch(err => {
        this.downloadLoading = false
        console.log(err.response.data.message)
      })
    },
    // 同步数据
    synchronize() {
      crudQiNiu.sync().then(res => {
        this.crud.notifyInfo('暂未实现')
        this.crud.toQuery()
      }).catch(err => {
        console.log(err.response.data.message)
      })
    }
  }
}
</script>
