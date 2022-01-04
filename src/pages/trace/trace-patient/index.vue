<template>
  <div>
    <co-dialog title="查找当前表格" seamless no-max ref="search" @before-hide="filterTable=''">
      <co-input autofocus clearable style="width:180px" placeholder="" v-model="filterTable" class="q-mx-sm q-mt-none q-mb-sm" @keyup.escape.native="$refs.search.hide()"/>
    </co-dialog>

    <!-- 编辑表单对话框 -->
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
        :label-width="$q.screen.lt.sm?'xsmall':'medium'"
        label-align="right"
        class="q-px-lg q-my-none row q-col-gutter-x-md q-col-gutter-y-md">
        <co-field class="col-12" form-label="ID" :value="form.id" readonly borderless/>
        <co-field class="col-12" form-label="登记号" :value="form.no" readonly borderless/>
        <co-field class="col-12" form-label="姓名" :value="form.name" readonly borderless/>
        <co-field class="col-12" form-label="性别" :value="form.gender" readonly borderless/>
        <co-field class="col-12" form-label="出生日期" :value="parseTime(form.birthday, '{y}-{m}-{d}')" readonly borderless/>
        <co-field class="col-12" form-label="身份证号" :value="form.idNo" readonly borderless/>
        <co-field class="col-12" form-label="保健号" :value="form.healthNo" readonly borderless/>
        <co-field class="col-12" form-label="联系方式" :value="form.contactNo" readonly borderless/>
        <co-field class="col-12" form-label="备注" :value="form.remarks" readonly borderless/>
        <co-field class="col-12" form-label="创建时间" :value="parseTime(form.createTime, '{y}-{m}-{d} {h}:{i}:{s}')" readonly borderless/>
        <co-field class="col-12" form-label="创建人" :value="form.createUser" readonly borderless/>
        <co-field class="col-12" form-label="更新时间" :value="parseTime(form.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')" readonly borderless/>
        <co-field class="col-12" form-label="更新人" :value="form.updateUser" readonly borderless/>
      </co-form>
      <q-card-actions class="q-px-lg q-pt-lg q-pb-md" align="right">
        <co-btn label="取消" flat v-close-popup/>
        <co-btn label="保存" color="primary"
                v-if="!crud.status.view"
                @click="crud.submitCU"
               :loading="crud.status.cu === crud.STATUS_PROCESSING"
               :disable="crud.status.cu === crud.STATUS_PROCESSING"/>
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
        :filter="filterTable"
        :selected.sync="crud.selections"
        selection="none"
        @row-click="(evt, row, index) => crud.selections = [row]"
        @row-dblclick="(evt, row, index) => crud.toView(row)"
    >
      <template v-slot:top-left>
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>
          <co-input
              v-model="query.no"
              label="登记号"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.name"
              label="姓名/首字母"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.gender"
              label="性别"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.contactNo"
              label="联系方式"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <!-- 点击“更多..”才显示的搜索项 -->
          <template v-if="crud.props.queryMore">
          <co-input
              v-model="query.idNo"
              label="身份证号"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.healthNo"
              label="保健号"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.id"
              label="ID"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-date-select
              v-model="query.createTime"
              label="创建时间"
              content-style="width:230px"
              range
              edit-time
              with-seconds
              :default-time="['00:00:00', '23:59:59']"
              date-mask="YYYY-MM-DD"
              @input="crud.toQuery()"
              clearable
          />
          </template>
          <div>
            <co-btn :label="crud.props.queryMore?'«更少':'更多»'" flat @click="crud.props.queryMore = !crud.props.queryMore"/>
            <co-btn label="重置" flat @click="crud.resetQuery()" />
            <co-btn icon="search" color="primary" @click="crud.toQuery()" />
          </div>
          <q-space/>
        </div>
      </template>
      <template v-slot:top-right="props">
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>
          <!--如果想在工具栏加入更多按钮，可以使用插槽方式， 'start' or 'end'-->
          <crud-operation :permission="permission" no-label no-view no-edit/>
          <div>
            <co-btn-dropdown color="primary" class="btn-dropdown-hide-droparrow" icon="apps" auto-close>
              <crud-more :tableSlotTopProps="props">
                <template v-slot:start>
                  <co-btn flat align="left" label="查找当前页" icon="find_in_page" @click.native="$refs.search.show()" />
                  <q-separator/>
                </template>
              </crud-more>
            </co-btn-dropdown>
          </div>
        </div>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td key="action" :props="props">
          <crud-row
              type="button"
              :data="props.row"
              :permission="permission"
              flat
              no-add
              no-icon
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
import { formatTime } from '@/utils/index'
import { required, integer, between } from '@/utils/vuelidate'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import CrudOperation from '@crud/crud-operation'
import CrudPagination from '@crud/crud-pagination'
import CrudRow from '@crud/crud-row'
import CrudMore from '@crud/crud-more'
import CrudTracePatient from '@/api/trace/trace-patient'

const defaultForm = { id: null, no: null, name: null, nameLetter: null, gender: null, birthday: null, idNo: null, healthNo: null, contactNo: null, remarks: null, createTime: null, createUser: null, updateTime: null, updateUser: null }

const visibleColumns = ['no', 'name', 'gender', 'birthday', 'idNo', 'healthNo', 'contactNo', 'remarks', 'createTime', 'updateTime', 'action']
// 参考：https://quasar.dev/vue-components/table#Defining-the-columns
const columns = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  { name: 'no', field: 'no', label: '登记号', align: 'left' },
  { name: 'name', field: 'name', label: '姓名', align: 'left' },
  { name: 'nameLetter', field: 'nameLetter', label: '首字母', align: 'left' },
  { name: 'gender', field: 'gender', label: '性别', align: 'left' },
  { name: 'birthday', field: 'birthday', label: '出生日期', align: 'left', format: val => formatTime(val, '{y}-{m}-{d}') },
  { name: 'idNo', field: 'idNo', label: '身份证号', align: 'left' },
  { name: 'healthNo', field: 'healthNo', label: '保健号', align: 'left' },
  { name: 'contactNo', field: 'contactNo', label: '联系方式', align: 'left' },
  { name: 'remarks', field: 'remarks', label: '备注', align: 'left' },
  { name: 'createTime', field: 'createTime', label: '创建时间', align: 'left', format: val => formatTime(val) },
  { name: 'createUser', field: 'createUser', label: '创建人', align: 'left' },
  { name: 'updateTime', field: 'updateTime', label: '更新时间', align: 'left', format: val => formatTime(val) },
  { name: 'updateUser', field: 'updateUser', label: '更新人', align: 'left' },
  { name: 'action', label: '操作', align: 'center', required: false, sortable: false }
]

export default {
  name: 'TracePatient',
  components: { CrudOperation, CrudMore, CrudPagination, CrudRow },
  cruds() {
    return CRUD({ columns, visibleColumns, title: '就诊人', idField: 'id', sort: ['id,desc'], url: 'api/trace/trace-patient', crudMethod: { ...CrudTracePatient } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data () {
    return {
      permission: {
        view: ['admin', 'tracePatient:list'],
        add: ['admin', 'tracePatient:add'],
        edit: ['admin', 'tracePatient:edit'],
        del: ['admin', 'tracePatient:del']
      },
      filterTable: ''
    }
  },
  created () {
    this.crud.updateProp('queryMore', false)
  },
  mounted () {
  },
  methods: {
    required,
    integer,
    between,
    [CRUD.HOOK.beforeRefresh] () {
      console.log('tracePatient CRUD.HOOK.beforeRefresh')
    }
  }
}
</script>

<style scoped>

</style>
