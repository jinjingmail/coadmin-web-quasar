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
      @before-hide="crud.cancelCU"
      card-style="width:800px; max-width:95vw;"
    >
      <co-form
        ref="form"
        :label-width="$q.screen.lt.sm?'xsmall':'medium'"
        label-align="right"
        class="q-px-lg q-my-none row q-col-gutter-x-md q-col-gutter-y-md">
        <co-field class="col-12 col-sm-6" form-label="ID" :value="form.id" readonly/>
        <co-field class="col-12 col-sm-6" form-label="登记号" :value="form.no" readonly/>
        <co-field class="col-12 col-sm-6" form-label="姓名" :value="form.name" readonly/>
        <co-field class="col-12 col-sm-6" form-label="性别" :value="form.gender" readonly/>
        <co-field class="col-12 col-sm-6" form-label="出生日期" :value="parseTime(form.birthday, '{y}-{m}-{d}')" readonly/>
        <co-field class="col-12 col-sm-6" form-label="身份证号" :value="form.idNo" readonly/>
        <co-field class="col-12 col-sm-6" form-label="保健号" :value="form.healthNo" readonly/>
        <co-field class="col-12 col-sm-6" form-label="联系方式" :value="form.contactNo" readonly/>
        <co-field class="col-12 col-sm-6" form-label="创建时间" :value="parseTime(form.createTime, '{y}-{m}-{d} {h}:{i}:{s}')" readonly/>
        <co-field class="col-12 col-sm-6" form-label="创建人" :value="form.createUser" readonly/>
        <co-field class="col-12 col-sm-6" form-label="更新时间" :value="parseTime(form.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')" readonly/>
        <co-field class="col-12 col-sm-6" form-label="更新人" :value="form.updateUser" readonly/>
        <co-input autogrow class="col-12" form-label="备注" maxlength="400" counter v-model="form.remarks" :disable="!!crud.status.view"/>
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
      <template v-slot:top-left v-if="!simplify">
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
          <crud-operation :permission="permission" no-label no-view no-add no-del no-edit has-download/>
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

      <template v-slot:body-cell-name="props" v-if="!simplify">
        <q-td key="name" :props="props">
          <router-link :to="{name:'Trace', query: {patientNo: props.row.no}}">{{props.row.name}}</router-link>
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td key="action" :props="props">
          <crud-row
              type="button"
              :data="props.row"
              :permission="permission"
              flat
              no-add
              no-del
              no-icon
              label-edit="备注"
          />
        </q-td>
      </template>

      <template v-slot:pagination>
        <crud-pagination no-page-if-only-one-page input />
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

const visibleColumns = ['no', 'name', 'gender', 'birthday', 'contactNo', 'remarks', 'createTime', 'updateTime', 'action']
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
  props: {
    simplify: Boolean,
    patientNo: String
  },
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
    this.query.no = this.patientNo
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
