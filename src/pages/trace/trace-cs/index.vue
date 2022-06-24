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
      card-style="width:600px; max-width:95vw;"
    >
      <co-form
        ref="form"
        :label-width="$q.screen.lt.sm?'xsmall':'large'"
        label-align="right"
        class="q-px-lg q-my-none row q-col-gutter-x-md q-col-gutter-y-md">
        <co-field class="col-12" form-label="ID" :value="form.id" readonly/>
        <co-field class="col-12" form-label="报告时间" :value="parseTime(form.reportTime, '{y}-{m}-{d} {h}:{i}')" readonly/>
        <co-field class="col-12" form-label="流水号" :value="form.reportNo" readonly/>
        <co-field class="col-12" form-label="就诊人" :value="`${form.patientNo} - ${form.patientName} - ${form.patientGender} - ${form.patientAge}`" readonly/>
        <co-field class="col-12" form-label="姓名" :value="form.patientName" readonly/>
        <co-field class="col-12" form-label="科室" :value="form.departmentName" readonly/>
        <co-field class="col-12" form-label="医嘱" :value="form.doctorAdvice" readonly/>
        <co-field class="col-12" form-label="标本类型" :value="form.specimanType" readonly/>
        <co-field class="col-12" form-label="诊断" :value="form.diagnosis" readonly/>
        <co-field class="col-12" form-label="染色体核型结果" :value="form.karyotypeResult" readonly/>
        <co-field class="col-12" form-label="早筛报告时间" :value="parseTime(form.firstPregencyReportTime, '{y}-{m}-{d} {h}:{i}')" readonly/>
        <co-field class="col-12" form-label="PAPPMOM(早筛)" :value="form.firstPappmom" readonly/>
        <co-field class="col-12" form-label="FHCGMOM(早筛)" :value="form.firstFhcgmom" readonly/>
        <co-field class="col-12" form-label="T21风险值(早筛)" :value="form.firstT21Risk" readonly/>
        <co-field class="col-12" form-label="T18风险值(早筛)" :value="form.firstT18Risk" readonly/>
        <co-field class="col-12" form-label="中筛报告时间" :value="parseTime(form.secondPregencyReportTime, '{y}-{m}-{d} {h}:{i}')" readonly/>
        <co-field class="col-12" form-label="AFPMOM(中筛)" :value="form.secondAfpmom" readonly/>
        <co-field class="col-12" form-label="FHCGMOM(中筛)" :value="form.secondFhcgmom" readonly/>
        <co-field class="col-12" form-label="E3MOM(中筛)" :value="form.secondE3mom" readonly/>
        <co-field class="col-12" form-label="T21风险值(中筛)" :value="form.secondT21Risk" readonly/>
        <co-field class="col-12" form-label="T18风险值(中筛)" :value="form.secondT18Risk" readonly/>
        <co-field class="col-12" form-label="无创报告时间" :value="parseTime(form.niptReportTime, '{y}-{m}-{d} {h}:{i}')" readonly/>
        <co-field class="col-12" form-label="无创筛查" :value="form.niptScreening" readonly/>
        <co-field class="col-12" form-label="无创补充报告时间" :value="parseTime(form.niptReplenishReportTime, '{y}-{m}-{d} {h}:{i}')" readonly/>
        <co-field class="col-12" form-label="无创筛查补充" :value="form.niptScreeningReplenish" readonly/>
        <co-field class="col-12" form-label="备注" :value="form.remarks" readonly/>
        <co-field class="col-12" form-label="创建时间" :value="parseTime(form.createTime, '{y}-{m}-{d} {h}:{i}:{s}')" readonly/>
        <co-field class="col-12" form-label="创建人" :value="form.createUser" readonly/>
        <co-field class="col-12" form-label="修改时间" :value="parseTime(form.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')" readonly/>
        <co-field class="col-12" form-label="修改人" :value="form.updateUser" readonly/>
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

    <co-dialog
      ref="uploadDialog"
      :title="'导入 ' + crud.status.title"
      no-backdrop-dismiss
      card-style="max-width:95vw;"
    >
      <q-uploader
        class="q-pa-lg"
        :factory="factoryFn"
        field-name="files"
        label="请选择文件"
        @uploaded="uploaderUploaded"
        @failed="uploaderFailed"
        accept=".xlsx,.xls"
      />
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
          <co-toggle
             label="已看"
             v-model="query.viewed"
             toggle-indeterminate
             @input="crud.toQuery()"/>
          <co-input
              v-model="query.patientName"
              label="姓名/首字母"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.patientNo"
              label="登记号"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.reportNo"
              label="流水号"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <!-- 点击“更多..”才显示的搜索项 -->
          <template v-if="crud.props.queryMore">
          <co-date-select
              v-model="query.reportTime"
              label="报告时间"
              content-style="width:230px"
              range
              edit-time
              with-seconds
              :default-time="['00:00:00', '23:59:59']"
              date-mask="YYYY-MM-DD"
              @input="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.patientGender"
              label="性别"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.patientAge"
              label="年龄"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.departmentName"
              label="科室"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.specimanType"
              label="标本类型"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.diagnosis"
              label="诊断"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.karyotypeResult"
              label="染色体核型结果"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.niptScreening"
              label="无创筛查"
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
          <co-input
              v-model="query.id"
              label="ID"
              content-style="width:160px"
              @change="crud.toQuery()"
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
          <crud-operation :permission="permission" no-label no-view no-add no-del no-edit has-download>
            <co-btn slot="start" icon="vertical_align_top" color="secondary" @click="$refs.uploadDialog.show()" v-if="!simplify"/>
          </crud-operation>
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

      <template v-slot:body-cell-patientName="props" v-if="!simplify">
        <q-td key="patientName" :props="props">
          <router-link :to="{name:'Trace', query: {patientNo: props.row.patientNo}}">{{props.row.patientName}}</router-link>
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
              no-edit
              no-del
              no-icon
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
import { mapState } from 'vuex'
import { getToken } from '@/utils/auth'
import { formatTime } from '@/utils/index'
import { required, integer, between } from '@/utils/vuelidate'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import CrudOperation from '@crud/crud-operation'
import CrudPagination from '@crud/crud-pagination'
import CrudRow from '@crud/crud-row'
import CrudMore from '@crud/crud-more'
import CrudTraceCs from '@/api/trace/trace-cs'

const defaultForm = { id: null, reportTime: null, reportNo: null, patientNo: null, patientName: null, patientGender: null, patientAge: null, departmentName: null, doctorAdvice: null, specimanType: null, diagnosis: null, karyotypeResult: null, firstPregencyReportTime: null, firstPappmom: null, firstFhcgmom: null, firstT21Risk: null, firstT18Risk: null, secondPregencyReportTime: null, secondAfpmom: null, secondFhcgmom: null, secondE3mom: null, secondT21Risk: null, secondT18Risk: null, niptReportTime: null, niptScreening: null, niptReplenishReportTime: null, niptScreeningReplenish: null, remarks: null, createTime: null, createUser: null, updateTime: null, updateUser: null, patientNameLetter: null }

const visibleColumns = ['viewed', 'reportTime', 'reportNo', 'patientName', 'specimanType', 'diagnosis', 'karyotypeResult', 'firstPregencyReportTime', 'firstPappmom', 'firstFhcgmom', 'firstT21Risk', 'firstT18Risk', 'secondPregencyReportTime', 'secondAfpmom', 'secondFhcgmom', 'secondE3mom', 'secondT21Risk', 'secondT18Risk', 'remarks', 'action']
// 参考：https://quasar.dev/vue-components/table#Defining-the-columns
const columns = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  { name: 'viewed', field: 'viewed', label: '已看', align: 'center', format: val => val ? 'T' : 'F' },
  { name: 'reportTime', field: 'reportTime', label: '报告时间', align: 'left', format: val => formatTime(val, '{y}-{m}-{d} {h}:{i}') },
  { name: 'reportNo', field: 'reportNo', label: '流水号', align: 'left' },
  { name: 'patientNo', field: 'patientNo', label: '登记号', align: 'left' },
  { name: 'patientName', field: 'patientName', label: '姓名', align: 'left' },
  { name: 'patientGender', field: 'patientGender', label: '性别', align: 'left' },
  { name: 'patientAge', field: 'patientAge', label: '年龄', align: 'left' },
  { name: 'departmentName', field: 'departmentName', label: '科室', align: 'left' },
  { name: 'doctorAdvice', field: 'doctorAdvice', label: '医嘱', align: 'left' },
  { name: 'specimanType', field: 'specimanType', label: '标本类型', align: 'left' },
  { name: 'diagnosis', field: 'diagnosis', label: '诊断', align: 'left' },
  { name: 'karyotypeResult', field: 'karyotypeResult', label: '染色体核型结果', align: 'left' },
  { name: 'firstPregencyReportTime', field: 'firstPregencyReportTime', label: '早筛报告时间', align: 'left', format: val => formatTime(val, '{y}-{m}-{d} {h}:{i}') },
  { name: 'firstPappmom', field: 'firstPappmom', label: 'PAPPMOM(早筛)', align: 'left' },
  { name: 'firstFhcgmom', field: 'firstFhcgmom', label: 'FHCGMOM(早筛)', align: 'left' },
  { name: 'firstT21Risk', field: 'firstT21Risk', label: 'T21风险值(早筛)', align: 'left' },
  { name: 'firstT18Risk', field: 'firstT18Risk', label: 'T18风险值(早筛)', align: 'left' },
  { name: 'secondPregencyReportTime', field: 'secondPregencyReportTime', label: '中筛报告时间', align: 'left', format: val => formatTime(val, '{y}-{m}-{d} {h}:{i}') },
  { name: 'secondAfpmom', field: 'secondAfpmom', label: 'AFPMOM(中筛)', align: 'left' },
  { name: 'secondFhcgmom', field: 'secondFhcgmom', label: 'FHCGMOM(中筛)', align: 'left' },
  { name: 'secondE3mom', field: 'secondE3mom', label: 'E3MOM(中筛)', align: 'left' },
  { name: 'secondT21Risk', field: 'secondT21Risk', label: 'T21风险值(中筛)', align: 'left' },
  { name: 'secondT18Risk', field: 'secondT18Risk', label: 'T18风险值(中筛)', align: 'left' },
  { name: 'niptReportTime', field: 'niptReportTime', label: '无创报告时间', align: 'left', format: val => formatTime(val, '{y}-{m}-{d} {h}:{i}') },
  { name: 'niptScreening', field: 'niptScreening', label: '无创筛查', align: 'left' },
  { name: 'niptReplenishReportTime', field: 'niptReplenishReportTime', label: '无创补充报告时间', align: 'left', format: val => formatTime(val, '{y}-{m}-{d} {h}:{i}') },
  { name: 'niptScreeningReplenish', field: 'niptScreeningReplenish', label: '无创筛查补充', align: 'left' },
  { name: 'remarks', field: 'remarks', label: '备注', align: 'left' },
  { name: 'createTime', field: 'createTime', label: '创建时间', align: 'left', format: val => formatTime(val, '{y}-{m}-{d} {h}:{i}:{s}') },
  { name: 'createUser', field: 'createUser', label: '创建人', align: 'left' },
  { name: 'updateTime', field: 'updateTime', label: '修改时间', align: 'left', format: val => formatTime(val, '{y}-{m}-{d} {h}:{i}:{s}') },
  { name: 'updateUser', field: 'updateUser', label: '修改人', align: 'left' },
  { name: 'patientNameLetter', field: 'patientNameLetter', label: '姓名首字母', align: 'left' },
  { name: 'action', label: '操作', align: 'center', required: false, sortable: false }
]

export default {
  name: 'TraceCs',
  components: { CrudOperation, CrudMore, CrudPagination, CrudRow },
  cruds() {
    return CRUD({ columns, visibleColumns, title: '染色体核型结果', idField: 'id', sort: ['id,desc'], url: 'api/trace/trace-cs', crudMethod: { ...CrudTraceCs } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  props: {
    simplify: Boolean,
    patientNo: String
  },
  data () {
    return {
      permission: {
        view: ['admin', 'traceCs:list'],
        add: ['admin', 'traceCs:add'],
        edit: ['admin', 'traceCs:edit'],
        del: ['admin', 'traceCs:del']
      },
      filterTable: ''
    }
  },
  created () {
    this.crud.updateProp('queryMore', false)
    this.query.patientNo = this.patientNo
  },
  mounted () {
  },
  computed: {
    ...mapState('api', [
      'baseApi'
    ])
  },
  methods: {
    required,
    integer,
    between,
    [CRUD.HOOK.beforeRefresh] () {
      console.log('traceCs CRUD.HOOK.beforeRefresh')
    },
    factoryFn (files) {
      return new Promise((resolve, reject) => {
        const token = getToken()
        resolve({
          url: this.baseApi + '/api/trace/trace-cs/upload',
          method: 'POST',
          headers: [
            { name: 'Authorization', value: `Bearer ${token}` }
          ]
        })
      })
    },
    uploaderUploaded (info) {
      this.crud.notifyInfo(`导入【${info.files[0].name}】结束：` + info.xhr.responseText)
    },
    uploaderFailed (info) {
      console.log('uploaderFailed', info)
      this.crud.notifyError(`导入【${info.files[0].name}】失败：` + info.xhr.responseText)
    }
  }
}
</script>

<style scoped>

</style>
