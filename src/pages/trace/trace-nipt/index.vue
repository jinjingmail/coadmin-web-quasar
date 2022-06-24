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
        <co-field class="col-12" form-label="接收日期" :value="parseTime(form.receiptDate, '{y}-{m}-{d}')" readonly/>
        <co-field class="col-12" form-label="报告状态" :value="form.reportStatus" readonly/>
        <co-field class="col-12" form-label="报告日期" :value="parseTime(form.reportDate, '{y}-{m}-{d}')" readonly/>
        <co-field class="col-12" form-label="流水号" :value="form.reportNo" readonly/>
        <co-field class="col-12" form-label="就诊人" :value="`${form.patientNo} - ${form.patientName} - ${form.patientGender} - ${form.patientAge}`" readonly/>
        <co-field class="col-12" form-label="联系电话" :value="form.contactTel" readonly/>
        <co-field class="col-12" form-label="身份证" :value="form.patientIdNo" readonly/>
        <co-field class="col-12" form-label="保健号" :value="form.patientHealthNo" readonly/>
        <co-field class="col-12" form-label="病案号" :value="form.caseNo" readonly/>
        <co-field class="col-12" form-label="标本号" :value="form.specimanNo" readonly/>
        <co-field class="col-12" form-label="标本类型" :value="form.specimanType" readonly/>
        <co-field class="col-12" form-label="科室" :value="form.departmentName" readonly/>
        <co-field class="col-12" form-label="诊断" :value="form.diagnosis" readonly/>
        <co-field class="col-12" form-label="医嘱" :value="form.doctorAdvice" readonly/>
        <co-field class="col-12" form-label="13-三体" :value="form.t13" readonly/>
        <co-field class="col-12" form-label="18-三体" :value="form.t18" readonly/>
        <co-field class="col-12" form-label="21-三体" :value="form.t21" readonly/>
        <co-field class="col-12" form-label="结果描述" :value="form.reportDetails" readonly/>
        <co-field class="col-12" form-label="补充内容1" :value="form.addition1" readonly/>
        <co-field class="col-12" form-label="补充内容1说明" :value="form.addition1Remark" readonly/>
        <co-field class="col-12" form-label="补充内容2" :value="form.addition2" readonly/>
        <co-field class="col-12" form-label="补充内容2说明" :value="form.addition2Remark" readonly/>
        <co-field class="col-12" form-label="T13风险" :value="form.t13Risk" readonly/>
        <co-field class="col-12" form-label="T18风险" :value="form.t18Risk" readonly/>
        <co-field class="col-12" form-label="T21风险" :value="form.t21Risk" readonly/>
        <co-field class="col-12" form-label="报告评价" :value="form.reportEvaluation" readonly/>
        <co-field class="col-12" form-label="孕次" :value="form.timesOfPregnancy" readonly/>
        <co-field class="col-12" form-label="产次" :value="form.timesOfBirth" readonly/>
        <co-field class="col-12" form-label="体重(Kg)" :value="form.patientWeight" readonly/>
        <co-field class="col-12" form-label="身高(cm)" :value="form.patientHeight" readonly/>
        <co-field class="col-12" form-label="体重指数" :value="form.weightIndex" readonly/>
        <co-field class="col-12" form-label="末次月经" :value="parseTime(form.lastMenstruation, '{y}-{m}-{d} {h}:{i}:{s}')" readonly/>
        <co-field class="col-12" form-label="月经计算孕周" :value="form.mcgw" readonly/>
        <co-field class="col-12" form-label="抽血当天孕周" :value="form.bdgw" readonly/>
        <co-field class="col-12" form-label="自然受孕" :value="form.natureConceived" readonly/>
        <co-field class="col-12" form-label="促排卵" :value="form.ovulationInduction" readonly/>
        <co-field class="col-12" form-label="IUI" :value="form.iui" readonly/>
        <co-field class="col-12" form-label="IVF" :value="form.ivf" readonly/>
        <co-field class="col-12" form-label="异体输血" :value="form.allogeneticTransfusion" readonly/>
        <co-field class="col-12" form-label="家族史" :value="form.familyDiseases" readonly/>
        <co-field class="col-12" form-label="筛查模式" :value="form.screeningModel" readonly/>
        <co-field class="col-12" form-label="超声NT测定孕周" :value="form.ntGw" readonly/>
        <co-field class="col-12" form-label="NT测定值(mm)" :value="form.ntMm" readonly/>
        <co-field class="col-12" form-label="母体血清筛查风险" :value="form.mssr" readonly/>
        <co-field class="col-12" form-label="21三体综合征" :value="form.t21Syndrome" readonly/>
        <co-field class="col-12" form-label="18三体综合征" :value="form.t18Syndrome" readonly/>
        <co-field class="col-12" form-label="13三体综合征" :value="form.t13Syndrome" readonly/>
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
          <!-- 点击“更多..”才显示的搜索项 -->
          <template v-if="crud.props.queryMore">
          <co-input
              v-model="query.reportStatus"
              label="报告状态"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
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
              v-model="query.patientGender"
              label="性别"
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
              v-model="query.patientAge"
              label="年龄"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.patientIdNo"
              label="身份证"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.patientHealthNo"
              label="保健号"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.caseNo"
              label="病案号"
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
              v-model="query.reportDetails"
              label="结果描述"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.t13Risk"
              label="T13风险"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.t18Risk"
              label="T18风险"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.t21Risk"
              label="T21风险"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.natureConceived"
              label="自然受孕"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <co-input
              v-model="query.screeningModel"
              label="筛查模式"
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
import CrudMore from '@crud/crud-more'
import CrudRow from '@crud/crud-row'
import CrudTraceNipt from '@/api/trace/trace-nipt'

const defaultForm = { id: null, receiptDate: null, reportStatus: null, reportDate: null, reportNo: null, patientName: null, patientGender: null, patientAge: null, patientNo: null, patientIdNo: null, patientHealthNo: null, caseNo: null, specimanNo: null, specimanType: null, contactTel: null, departmentName: null, diagnosis: null, doctorAdvice: null, t13: null, t18: null, t21: null, reportDetails: null, addition1: null, addition1Remark: null, addition2: null, addition2Remark: null, t13Risk: null, t18Risk: null, t21Risk: null, reportEvaluation: null, timesOfPregnancy: null, timesOfBirth: null, patientWeight: null, patientHeight: null, weightIndex: null, lastMenstruation: null, mcgw: null, bdgw: null, natureConceived: null, ovulationInduction: null, iui: null, ivf: null, allogeneticTransfusion: null, familyDiseases: null, screeningModel: null, ntGw: null, ntMm: null, mssr: null, t21Syndrome: null, t18Syndrome: null, t13Syndrome: null, signConsent: null, applyDoctor: null, applyDate: null, remarks: null, createTime: null, createUser: null, updateTime: null, updateUser: null, patientNameLetter: null }

const visibleColumns = ['viewed', 'receiptDate', 'patientName', 'diagnosis', 't13', 't18', 't21', 'reportDetails', 'addition1', 'addition1Remark', 'addition2', 'addition2Remark', 't13Risk', 't18Risk', 't21Risk', 'timesOfPregnancy', 'timesOfBirth', 'patientWeight', 'patientHeight', 'natureConceived', 'remarks', 'action']
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
  { name: 'patientIdNo', field: 'patientIdNo', label: '身份证', align: 'left' },
  { name: 'patientHealthNo', field: 'patientHealthNo', label: '保健号', align: 'left' },
  { name: 'caseNo', field: 'caseNo', label: '病案号', align: 'left' },
  { name: 'specimanNo', field: 'specimanNo', label: '标本号', align: 'left' },
  { name: 'specimanType', field: 'specimanType', label: '标本类型', align: 'left' },
  { name: 'contactTel', field: 'contactTel', label: '联系电话', align: 'left' },
  { name: 'departmentName', field: 'departmentName', label: '科室', align: 'left' },
  { name: 'diagnosis', field: 'diagnosis', label: '诊断', align: 'left' },
  { name: 'doctorAdvice', field: 'doctorAdvice', label: '医嘱', align: 'left' },
  { name: 't13', field: 't13', label: '13-三体', align: 'right' },
  { name: 't18', field: 't18', label: '18-三体', align: 'right' },
  { name: 't21', field: 't21', label: '21-三体', align: 'right' },
  { name: 'reportDetails', field: 'reportDetails', label: '结果描述', align: 'left' },
  { name: 'addition1', field: 'addition1', label: '补充内容1', align: 'left' },
  { name: 'addition1Remark', field: 'addition1Remark', label: '补充内容1说明', align: 'left' },
  { name: 'addition2', field: 'addition2', label: '补充内容2', align: 'left' },
  { name: 'addition2Remark', field: 'addition2Remark', label: '补充内容2说明', align: 'left' },
  { name: 't13Risk', field: 't13Risk', label: 'T13风险', align: 'left' },
  { name: 't18Risk', field: 't18Risk', label: 'T18风险', align: 'left' },
  { name: 't21Risk', field: 't21Risk', label: 'T21风险', align: 'left' },
  { name: 'reportEvaluation', field: 'reportEvaluation', label: '报告评价', align: 'left' },
  { name: 'timesOfPregnancy', field: 'timesOfPregnancy', label: '孕次', align: 'center' },
  { name: 'timesOfBirth', field: 'timesOfBirth', label: '产次', align: 'center' },
  { name: 'patientWeight', field: 'patientWeight', label: '体重(Kg)', align: 'right' },
  { name: 'patientHeight', field: 'patientHeight', label: '身高(cm)', align: 'right' },
  { name: 'weightIndex', field: 'weightIndex', label: '体重指数', align: 'right' },
  { name: 'lastMenstruation', field: 'lastMenstruation', label: '末次月经', align: 'left', format: val => formatTime(val, '{y}-{m}-{d}') },
  { name: 'mcgw', field: 'mcgw', label: '月经计算孕周', align: 'left' },
  { name: 'bdgw', field: 'bdgw', label: '抽血当天孕周', align: 'left' },
  { name: 'natureConceived', field: 'natureConceived', label: '自然受孕', align: 'center' },
  { name: 'ovulationInduction', field: 'ovulationInduction', label: '促排卵', align: 'center' },
  { name: 'iui', field: 'iui', label: 'IUI', align: 'left' },
  { name: 'ivf', field: 'ivf', label: 'IVF', align: 'left' },
  { name: 'allogeneticTransfusion', field: 'allogeneticTransfusion', label: '异体输血', align: 'left' },
  { name: 'familyDiseases', field: 'familyDiseases', label: '家族史', align: 'left' },
  { name: 'screeningModel', field: 'screeningModel', label: '筛查模式', align: 'left' },
  { name: 'ntGw', field: 'ntGw', label: '超声NT测定孕周', align: 'left' },
  { name: 'ntMm', field: 'ntMm', label: 'NT测定值(mm)', align: 'left' },
  { name: 'mssr', field: 'mssr', label: '母体血清筛查风险', align: 'left' },
  { name: 't21Syndrome', field: 't21Syndrome', label: '21三体综合征', align: 'left' },
  { name: 't18Syndrome', field: 't18Syndrome', label: '18三体综合征', align: 'left' },
  { name: 't13Syndrome', field: 't13Syndrome', label: '13三体综合征', align: 'left' },
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
  name: 'TraceNipt',
  components: { CrudOperation, CrudMore, CrudPagination, CrudRow },
  cruds() {
    return CRUD({ columns, visibleColumns, title: '无创产前筛查', idField: 'id', sort: ['id,desc'], url: 'api/trace/trace-nipt', crudMethod: { ...CrudTraceNipt } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  props: {
    simplify: Boolean,
    patientNo: String
  },
  data () {
    return {
      permission: {
        view: ['admin', 'traceNipt:list'],
        add: ['admin', 'traceNipt:add'],
        edit: ['admin', 'traceNipt:edit'],
        del: ['admin', 'traceNipt:del'],
        down: ['admin', 'traceNipt:down']
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
      console.log('traceNipt CRUD.HOOK.beforeRefresh')
    },
    factoryFn (files) {
      return new Promise((resolve, reject) => {
        const token = getToken()
        resolve({
          url: this.baseApi + '/api/trace/trace-nipt/upload',
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
