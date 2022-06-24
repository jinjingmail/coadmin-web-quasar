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
        :label-width="$q.screen.lt.sm?'xsmall':'medium'"
        label-align="right"
        class="q-px-lg q-my-none row q-col-gutter-x-md q-col-gutter-y-md">
        <co-field class="col-12" form-label="ID" :value="form.id" readonly/>
        <co-field class="col-12" form-label="核收日期" :value="parseTime(form.receiptDate, '{y}-{m}-{d}')" readonly/>
        <co-field class="col-12" form-label="报告状态" :value="form.reportStatus" readonly/>
        <co-field class="col-12" form-label="报告日期" :value="parseTime(form.reportDate, '{y}-{m}-{d}')" readonly/>
        <co-field class="col-12" form-label="流水号" :value="form.reportNo" readonly/>
        <co-field class="col-12" form-label="就诊人" :value="`${form.patientNo} - ${form.patientName} - ${form.patientGender} - ${form.patientAge}`" readonly/>
        <co-field class="col-12" form-label="联系电话" :value="form.contactTel" readonly/>
        <co-field class="col-12" form-label="标本号" :value="form.specimanNo" readonly/>
        <co-field class="col-12" form-label="标本类型" :value="form.specimanType" readonly/>
        <co-field class="col-12" form-label="科室" :value="form.departmentName" readonly/>
        <co-field class="col-12" form-label="诊断" :value="form.diagnosis" readonly/>
        <co-field class="col-12" form-label="医嘱" :value="form.doctorAdvice" readonly/>
        <co-field class="col-12" form-label="芯片ID" :value="form.chipId" readonly/>
        <co-field class="col-12" form-label="报告提示" :value="form.reportTip" readonly/>
        <co-field class="col-12" form-label="结果" :value="form.result" readonly/>
        <co-field class="col-12" form-label="分析意见" :value="form.reportAnalysisOpinion" readonly/>
        <co-field class="col-12" form-label="结论" :value="form.conclusion" readonly/>
        <co-field class="col-12" form-label="提示" :value="form.conclusionDetails" readonly/>
        <co-field class="col-12" form-label="建议" :value="form.suggest" readonly/>
        <co-field class="col-12" form-label="染色体区域" :value="form.chromosomeRegion" readonly/>
        <co-field class="col-12" form-label="DNA CHip" :value="form.dnaChip" readonly/>
        <co-field class="col-12" form-label="结果2" :value="form.result2" readonly/>
        <co-field class="col-12" form-label="染色体区域2" :value="form.chromosomeRegion2" readonly/>
        <co-field class="col-12" form-label="结论2" :value="form.conclusion2" readonly/>
        <co-field class="col-12" form-label="结果3" :value="form.result3" readonly/>
        <co-field class="col-12" form-label="染色体区域3" :value="form.chromosomeRegion3" readonly/>
        <co-field class="col-12" form-label="结论3" :value="form.conclusion3" readonly/>
        <co-field class="col-12" form-label="结果4" :value="form.result4" readonly/>
        <co-field class="col-12" form-label="染色体区域4" :value="form.chromosomeRegion4" readonly/>
        <co-field class="col-12" form-label="结论4" :value="form.conclusion4" readonly/>
        <co-field class="col-12" form-label="检验时间" :value="parseTime(form.inspectionTime, '{y}-{m}-{d} {h}:{i}')" readonly/>
        <co-field class="col-12" form-label="孕次" :value="form.timesOfPregnancy" readonly/>
        <co-field class="col-12" form-label="产次" :value="form.timesOfBirth" readonly/>
        <co-field class="col-12" form-label="签署同意书" :value="form.signConsent" readonly/>
        <co-field class="col-12" form-label="申请医生" :value="form.applyDoctor" readonly/>
        <co-field class="col-12" form-label="申请日期" :value="parseTime(form.applyDate, '{y}-{m}-{d}')" readonly/>
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
          <co-input
              v-model="query.specimanNo"
              label="标本号"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.chipId"
              label="芯片ID"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <!-- 点击“更多..”才显示的搜索项 -->
          <template v-if="crud.props.queryMore">
          <co-date-select
              v-model="query.receiptDate"
              label="核收日期"
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
              v-model="query.reportStatus"
              label="报告状态"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-date-select
              v-model="query.reportDate"
              label="报告日期"
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
              v-model="query.specimanType"
              label="标本类型"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.contactTel"
              label="联系电话"
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
              v-model="query.diagnosis"
              label="诊断"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.reportTip"
              label="报告提示"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.chromosomeRegion"
              label="染色体区域"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.chromosomeRegion2"
              label="染色体区域2"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.chromosomeRegion3"
              label="染色体区域3"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.chromosomeRegion4"
              label="染色体区域4"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.applyDoctor"
              label="申请医生"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-date-select
              v-model="query.applyDate"
              label="申请日期"
              content-style="width:230px"
              range
              edit-time
              with-seconds
              :default-time="['00:00:00', '23:59:59']"
              date-mask="YYYY-MM-DD"
              @input="crud.toQuery()"
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
import CrudTraceCma from '@/api/trace/trace-cma'

const defaultForm = { id: null, receiptDate: null, reportStatus: null, reportDate: null, reportNo: null, patientName: null, patientGender: null, patientAge: null, patientNo: null, specimanNo: null, specimanType: null, contactTel: null, departmentName: null, diagnosis: null, doctorAdvice: null, chipId: null, reportTip: null, result: null, reportAnalysisOpinion: null, conclusion: null, conclusionDetails: null, suggest: null, chromosomeRegion: null, dnaChip: null, result2: null, chromosomeRegion2: null, conclusion2: null, result3: null, chromosomeRegion3: null, conclusion3: null, result4: null, chromosomeRegion4: null, conclusion4: null, inspectionTime: null, timesOfPregnancy: null, timesOfBirth: null, signConsent: null, applyDoctor: null, applyDate: null, remarks: null, createTime: null, createUser: null, updateTime: null, updateUser: null, patientNameLetter: null }

const visibleColumns = ['viewed', 'receiptDate', 'patientName', 'specimanType', 'contactTel', 'diagnosis', 'chipId', 'conclusion', 'conclusionDetails', 'chromosomeRegion', 'chromosomeRegion2', 'chromosomeRegion3', 'chromosomeRegion4', 'inspectionTime', 'applyDoctor', 'remarks', 'action']
// 参考：https://quasar.dev/vue-components/table#Defining-the-columns
const columns = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  { name: 'viewed', field: 'viewed', label: '已看', align: 'center', format: val => val ? 'T' : 'F' },
  { name: 'receiptDate', field: 'receiptDate', label: '核收日期', align: 'left', format: val => formatTime(val, '{y}-{m}-{d}') },
  { name: 'reportStatus', field: 'reportStatus', label: '报告状态', align: 'left' },
  { name: 'reportDate', field: 'reportDate', label: '报告日期', align: 'left', format: val => formatTime(val, '{y}-{m}-{d}') },
  { name: 'reportNo', field: 'reportNo', label: '流水号', align: 'left' },
  { name: 'patientName', field: 'patientName', label: '姓名', align: 'left' },
  { name: 'patientGender', field: 'patientGender', label: '性别', align: 'left' },
  { name: 'patientAge', field: 'patientAge', label: '年龄', align: 'left' },
  { name: 'patientNo', field: 'patientNo', label: '登记号', align: 'left' },
  { name: 'specimanNo', field: 'specimanNo', label: '标本号', align: 'left' },
  { name: 'specimanType', field: 'specimanType', label: '标本类型', align: 'left' },
  { name: 'contactTel', field: 'contactTel', label: '联系电话', align: 'left' },
  { name: 'departmentName', field: 'departmentName', label: '科室', align: 'left' },
  { name: 'diagnosis', field: 'diagnosis', label: '诊断', align: 'left' },
  { name: 'doctorAdvice', field: 'doctorAdvice', label: '医嘱', align: 'left' },
  { name: 'chipId', field: 'chipId', label: '芯片ID', align: 'left' },
  { name: 'reportTip', field: 'reportTip', label: '报告提示', align: 'left' },
  { name: 'result', field: 'result', label: '结果', align: 'left' },
  { name: 'reportAnalysisOpinion', field: 'reportAnalysisOpinion', label: '分析意见', align: 'left' },
  { name: 'conclusion', field: 'conclusion', label: '结论', align: 'left' },
  { name: 'conclusionDetails', field: 'conclusionDetails', label: '提示', align: 'left' },
  { name: 'suggest', field: 'suggest', label: '建议', align: 'left' },
  { name: 'chromosomeRegion', field: 'chromosomeRegion', label: '染色体区域', align: 'left' },
  { name: 'dnaChip', field: 'dnaChip', label: 'DNA CHip', align: 'left' },
  { name: 'result2', field: 'result2', label: '结果2', align: 'left' },
  { name: 'chromosomeRegion2', field: 'chromosomeRegion2', label: '染色体区域2', align: 'left' },
  { name: 'conclusion2', field: 'conclusion2', label: '结论2', align: 'left' },
  { name: 'result3', field: 'result3', label: '结果3', align: 'left' },
  { name: 'chromosomeRegion3', field: 'chromosomeRegion3', label: '染色体区域3', align: 'left' },
  { name: 'conclusion3', field: 'conclusion3', label: '结论3', align: 'left' },
  { name: 'result4', field: 'result4', label: '结果4', align: 'left' },
  { name: 'chromosomeRegion4', field: 'chromosomeRegion4', label: '染色体区域4', align: 'left' },
  { name: 'conclusion4', field: 'conclusion4', label: '结论4', align: 'left' },
  { name: 'inspectionTime', field: 'inspectionTime', label: '检验时间', align: 'left', format: val => formatTime(val, '{y}-{m}-{d} {h}:{i}') },
  { name: 'timesOfPregnancy', field: 'timesOfPregnancy', label: '孕次', align: 'left' },
  { name: 'timesOfBirth', field: 'timesOfBirth', label: '产次', align: 'left' },
  { name: 'signConsent', field: 'signConsent', label: '签署同意书', align: 'left' },
  { name: 'applyDoctor', field: 'applyDoctor', label: '申请医生', align: 'left' },
  { name: 'applyDate', field: 'applyDate', label: '申请日期', align: 'left', format: val => formatTime(val, '{y}-{m}-{d}') },
  { name: 'remarks', field: 'remarks', label: '备注', align: 'left' },
  { name: 'createTime', field: 'createTime', label: '创建时间', align: 'left', format: val => formatTime(val, '{y}-{m}-{d} {h}:{i}:{s}') },
  { name: 'createUser', field: 'createUser', label: '创建人', align: 'left' },
  { name: 'updateTime', field: 'updateTime', label: '修改时间', align: 'left', format: val => formatTime(val, '{y}-{m}-{d} {h}:{i}:{s}') },
  { name: 'updateUser', field: 'updateUser', label: '修改人', align: 'left' },
  { name: 'patientNameLetter', field: 'patientNameLetter', label: '姓名首字母', align: 'left' },
  { name: 'action', label: '操作', align: 'center', required: false, sortable: false }
]

export default {
  name: 'TraceCma',
  components: { CrudOperation, CrudMore, CrudPagination, CrudRow },
  cruds() {
    return CRUD({ columns, visibleColumns, title: '染色体微整列分析', idField: 'id', sort: ['id,desc'], url: 'api/trace/trace-cma', crudMethod: { ...CrudTraceCma } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  props: {
    simplify: Boolean,
    patientNo: String
  },
  data () {
    return {
      permission: {
        view: ['admin', 'traceCma:list'],
        add: ['admin', 'traceCma:add'],
        edit: ['admin', 'traceCma:edit'],
        del: ['admin', 'traceCma:del']
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
      console.log('traceCma CRUD.HOOK.beforeRefresh')
    },
    factoryFn (files) {
      return new Promise((resolve, reject) => {
        const token = getToken()
        resolve({
          url: this.baseApi + '/api/trace/trace-cma/upload',
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
