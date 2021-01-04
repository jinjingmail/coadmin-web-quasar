<!--
  定时任务日志
-->
<template>
  <coadmin-dialog
    ref="dialog"
    :title="crud.title"
    card-style="width:1000px; max-width:95vw"
  >
    <coadmin-table
      ref="table"
      row-key="id"
      dense
      :data="crud.data"
      :columns="crud.columns"
      :visible-columns="crud.visibleColumns"
      :loading="crud.loading"
      card-class="custom-other-bg"
    >
      <template v-slot:top-right>
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-px-xs q-py-xs full-width'>
          <coadmin-input
            v-model="query.blurry"
            placeholder="ID、任务名、执行方法"
            content-style="width:250px"
            clearable
            @keyup.enter.native="crud.toQuery()"
            @clear="crud.toQuery()"
          />
          <coadmin-date-select
            class="col-auto"
            placeholder="创建时间"
            v-model="query.createTime"
            content-style="width:200px"
            :default-time="[' 00:00:00', ' 23:59:59']"
            clearable
            @input="crud.toQuery()"
            range
          />
          <coadmin-select
            class="col-auto"
            placeholder="执行结果"
            content-style="width:150px"
            use-input
            hide-selected
            fill-input
            outlined
            v-model="query.isSuccess"
            no-filter
            :options="[{label: '失败', value: false}, {label: '成功', value: true}]"
            @input="crud.toQuery()"
            clearable
            emit-value
            map-options
          />

        </div>
      </template>

      <template v-slot:body-cell-exceptionDetail="props">
        <q-td key="exceptionDetail" :props="props">
          <q-btn v-if="!props.row.isSuccess" label="查看" padding="xs md" dense color="primary"
            @click="$refs.exceptionLogDialog.show()"
          >
            <coadmin-dialog
              ref="exceptionLogDialog"
              title="异常详情"
              card-style="width:1100px; max-width:95vw;"
              >
              <q-card-section>
                <div class="text-body2">{{props.row.exceptionDetail}}</div>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn dense label="关闭" flat v-close-popup />
              </q-card-actions>
            </coadmin-dialog>

          </q-btn>
        </q-td>
      </template>

      <template v-slot:pagination>
        <crud-pagination no-persistence-page-size/>
      </template>

    </coadmin-table>
  </coadmin-dialog>
</template>

<script>
import CRUD, { presenter, header, crud } from '@crud/crud'
import crudPagination from '@crud/CRUD.pagination'

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
  components: { crudPagination },
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
