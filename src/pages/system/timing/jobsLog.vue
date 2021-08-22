<!--
  定时任务日志
-->
<template>
  <co-dialog
    ref="dialog"
    :title="crud.title"
    card-style="width:80vw; max-width:95vw; min-height:90vh;"
  >
    <co-table
      ref="table"
      row-key="id"
      :data="crud.data"
      :columns="crud.columns"
      :visible-columns="crud.visibleColumns"
      :loading="crud.loading"
      card-class="custom-other-bg"
    >
      <template v-slot:top-right>
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>
          <co-input
            v-model="query.blurry"
            placeholder="ID、任务名、执行方法"
            content-style="width:250px"
            clearable
            @change="crud.toQuery()"
            @clear="crud.toQuery()"
          />
          <co-date-select
            class="col-auto"
            placeholder="创建时间"
            v-model="query.createTime"
            content-style="width:230px"
            :default-time="['00:00:00', '23:59:59']"
            clearable
            @input="crud.toQuery()"
            range
          />
          <co-select
            class="col-auto"
            placeholder="执行结果"
            content-style="width:120px"
            use-input
            hide-selected
            fill-input
            v-model="query.isSuccess"
            no-filter
            :options="[{label: '成功', value: true}, {label: '失败', value: false}]"
            @input="crud.toQuery()"
            clearable
            emit-value
            map-options
          />
          <div class='col-auto'>
            <co-btn color="primary" icon="search" @click="crud.toQuery()" />
          </div>
        </div>
      </template>

      <template v-slot:body-cell-exceptionDetail="props">
        <q-td key="exceptionDetail" :props="props">
          <co-btn v-if="!props.row.isSuccess" label="查看" padding="xs sm" size="sm" color="primary"
            @click="$refs.exceptionLogDialog.show()"
          >
            <co-dialog
              ref="exceptionLogDialog"
              title="异常详情"
              card-style="width:1100px; max-width:95vw;"
              >
              <q-card-section>
                <div class="text-body2">{{props.row.exceptionDetail}}</div>
              </q-card-section>
              <q-card-actions align="right">
                <co-btn label="关闭" flat v-close-popup />
              </q-card-actions>
            </co-dialog>

          </co-btn>
        </q-td>
      </template>

      <template v-slot:body-cell-createTime="props">
        <q-td key="createTime" :props="props">
          {{formatTime(props.row.createTime)}}
        </q-td>
      </template>

      <template v-slot:pagination>
        <crud-pagination  no-persistence-page-size/>
      </template>

    </co-table>
  </co-dialog>
</template>

<script>
import CRUD, { presenter, header, crud } from '@crud/crud'
import CrudPagination from '@crud/crud-pagination'

const visibleColumns = ['id', 'jobName', 'beanName', 'methodName', 'cronExpression', 'exceptionDetail', 'time', 'isSuccess', 'params', 'createTime']
const columns = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  { name: 'jobName', field: 'jobName', label: '任务名称', required: true, align: 'left' },
  { name: 'beanName', field: 'beanName', label: 'Bean名称', sortable: true },
  { name: 'methodName', field: 'methodName', label: '执行方法', sortable: true },
  { name: 'cronExpression', field: 'cronExpression', label: 'Corn表达式' },
  { name: 'exceptionDetail', label: '异常详情', align: 'center' },
  { name: 'time', field: 'time', label: '耗时(毫秒)' },
  { name: 'isSuccess', field: 'isSuccess', label: '执行结果', format: val => val ? '成功' : '失败' },
  { name: 'params', field: 'params', label: '参数内容' },
  { name: 'createTime', field: 'createTime', label: '创建日期' }
]

export default {
  name: 'TimingLogs',
  components: { CrudPagination },
  cruds() {
    return CRUD({ columns, visibleColumns, title: '定时任务运行日志', url: 'api/jobs/logs' })
  },
  mixins: [presenter(), header(), crud()],
  data () {
    return {
      permission: {
        add: ['admin', 'timing:add'],
        edit: ['admin', 'timing:edit'],
        del: ['admin', 'timing:del']
      }
    }
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    }
  }
}
</script>
