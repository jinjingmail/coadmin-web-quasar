<!--
  定时任务
-->
<template>
  <div >
    <co-dialog title="查找" no-max seamless ref="search" @before-hide="filterTable=''">
      <q-input placeholder="在当前页查找" dense outlined v-model="filterTable" clearable class="q-mx-sm q-mt-none q-mb-sm"/>
    </co-dialog>
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
        label-width="medium"
        label-align="right"
        class="q-pa-md row q-col-gutter-x-xl q-col-gutter-y-md">
          <co-form-item dense class="col-12" form-label="ID" v-if="form.id">
            <div class="q-pt-sm">{{form.id}}</div>
          </co-form-item>
          <co-input dense class="col-12" form-label="任务名称" v-model="form.jobName" :disable="!!crud.status.view" :rules="[
              val => (!!val) || '必填'
              ]"/>
          <co-input dense class="col-12" form-label="任务描述" v-model="form.description" :disable="!!crud.status.view"/>
          <co-input dense class="col-12" form-label="Bean名称" v-model="form.beanName" :disable="!!crud.status.view" :rules="[
              val => (!!val) || '必填'
              ]"/>
          <co-input dense class="col-12" form-label="执行方法" v-model="form.methodName" :disable="!!crud.status.view" :rules="[
              val => (!!val) || '必填'
              ]"/>
          <co-input dense class="col-12" form-label="Cron表达式" v-model="form.cronExpression" :disable="!!crud.status.view" :rules="[
              val => (!!val) || '必填'
              ]"/>
          <co-input dense class="col-12" form-label="子任务ID" v-model="form.subTask" placeholder="多个用逗号隔开，按顺序执行" :disable="!!crud.status.view"/>
          <co-input dense class="col-12" form-label="任务负责人" v-model="form.personInCharge" :disable="!!crud.status.view"/>
          <co-input dense class="col-12" form-label="告警邮箱" v-model="form.email" :disable="!!crud.status.view"/>
          <co-option-group
            class="col-12"
            dense
            form-label="失败后暂停"
            v-model="form.pauseAfterFailure"
            :disable="!!crud.status.view"
            inline
            :options="[{label:'是', value: true}, {label: '否', value: false}]"
            type="radio"
          />
          <co-option-group
            class="col-12"
            dense
            form-label="任务状态"
            v-model="form.isPause"
            value-to-string
            :disable="!!crud.status.view"
            inline
            :options="dict.jobs_status"
            type="radio"
          />
          <co-input dense class="col-12" form-label="参数内容" v-model="form.params" :disable="!!crud.status.view"/>
      </co-form>
      <q-card-actions class="q-pa-md" align="right">
        <q-btn dense label="取消" flat v-close-popup/>
        <q-btn dense label="保存" color="primary" v-if="!crud.status.view" @click="crud.submitCU"
          :loading="crud.status.cu === crud.STATUS_PROCESSING" :disable="crud.status.cu === crud.STATUS_PROCESSING"/>
      </q-card-actions>
    </co-dialog>

    <jobs-log ref="jobsLog"/>

    <co-table
      ref="table"
      row-key="id"
      dense
      sticky-header
      :data="crud.data"
      :columns="crud.columns"
      :visible-columns="crud.visibleColumns"
      :title="crud.title"
      :loading="crud.loading"
      selection="single"
      :selected.sync="crud.selections"
      :filter="filterTable"
    >
      <template v-slot:top-right="props">
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-px-xs q-py-xs full-width'>
          <co-select
            class="col-auto"
            dense
            label="状态"
            filled
            content-style="width:120px"
            v-model="query.isPause"
            no-filter
            :options="dict.jobs_status"
            @input="crud.toQuery()"
            clearable
            emit-value
            map-options
          />
          <co-input
            v-model="query.blurry"
            dense
            label="ID、任务名、执行方法"
            filled
            content-style="width:200px"
            clearable
            @keyup.enter.native="crud.toQuery()"
            @clear="crud.toQuery()"
          />
          <div>
            <q-btn dense padding="xs sm" color="primary" icon="search" @click="crud.toQuery()" />
          </div>
          <q-space/>
          <crud-operation dense :permission="permission">
            <template v-slot:end>
              <!-- 任务日志 -->
              <q-btn dense label="任务日志" color="info" padding="xs sm" @click="$refs.jobsLog.show()"/>
            </template>
          </crud-operation>
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

      <template v-slot:body-cell-isPause="props">
        <q-td key="isPause" :props="props">
          {{dict.label.jobs_status[props.row.isPause]}}
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <crud-row dense flat no-icon
            no-add
            :type="$q.screen.gt.xs?'button':'menu'"
            :data="props.row"
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
import { mapGetters } from 'vuex'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import CrudOperation from '@crud/crud-operation'
import CrudPagination from '@crud/crud-pagination'
import CrudRow from '@crud/crud-row'
import CrudMore from '@crud/crud-more'
import crudTiming from '@/api/system/timing'
import JobsLog from './jobsLog.vue'

const defaultForm = { id: null, jobName: null, subTask: null, beanName: null, methodName: null, params: null, cronExpression: null, pauseAfterFailure: true, isPause: false, personInCharge: null, email: null, description: null }
const visibleColumns = ['jobName', 'beanName', 'methodName', 'cronExpression', 'isPause', 'subTask', 'params', 'action']
const columns = [
  { name: 'id', field: 'id', label: 'ID' },
  { name: 'jobName', field: 'jobName', label: '名称', required: true, align: 'left' },
  { name: 'beanName', field: 'beanName', label: 'Bean名称', sortable: true },
  { name: 'methodName', field: 'methodName', label: '执行方法', sortable: true },
  { name: 'cronExpression', field: 'cronExpression', label: 'Corn表达式' },
  { name: 'isPause', field: 'isPause', label: '状态' },
  { name: 'subTask', field: 'subTask', label: '子任务' },
  { name: 'params', field: 'params', label: '参数内容' },
  { name: 'action', label: '操作', align: 'center' }
]

export default {
  name: 'Timing',
  components: { CrudOperation, CrudMore, CrudPagination, CrudRow, JobsLog },
  cruds() {
    return CRUD({ columns, visibleColumns, idField: 'id', sort: ['id,desc'], title: '定时任务', url: 'api/jobs', crudMethod: { ...crudTiming } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data () {
    return {
      permission: {
        add: ['admin', 'timing:add'],
        edit: ['admin', 'timing:edit'],
        del: ['admin', 'timing:del']
      },
      filterTable: ''
    }
  },
  computed: {
    ...mapGetters('permission', [
      'dict'
    ])
  }
}
</script>
