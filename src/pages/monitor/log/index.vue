<!--
  日志
-->
<template>
  <div >
    <co-dialog title="查找" no-max seamless ref="search" @before-hide="filterTable=''">
      <q-input placeholder="在当前页查找" dense outlined v-model="filterTable" clearable class="q-mx-sm q-mt-none q-mb-sm"/>
    </co-dialog>

    <co-dialog
      ref="detailDialog"
      card-style="width: 90vw; max-width: 95vw;"
      card-class="q-px-sm"
    >
      <div>
        <b>请求方法：</b>
        <pre>{{requestMethod}}</pre>
      </div>
      <div>
        <b>请求参数：</b>
        <pre>{{requestParams}}</pre>
      </div>
    </co-dialog>

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
      :loading-delay="0"
      :selected.sync="crud.selections"
      @row-click="(evt, row, index) => crud.selections = [row]"
      :filter="filterTable"
    >
      <template v-slot:top-right="props">
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>
          <co-input
            dense
            v-model="query.blurry"
            placeholder="用户名、描述、地址、IP、请求方法、参数"
            content-style="width:300px"
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
          <div class='col-auto'>
            <q-btn dense padding="xs sm" color="primary" icon="search" @click="crud.toQuery()" />
          </div>
          <q-space/>

          <div class='col-auto'>
            <q-btn dense label="清空日志" color="negative" :loading="crud.delAllLoading">
              <q-popup-proxy>
                <co-card style="min-width: 160px;">
                  <q-card-section class="bg-primary text-white">
                    <div class="text-subtitle1 text-no-wrap">
                      确认要删除全部日志？
                    </div>
                  </q-card-section>
                  <q-separator />
                  <q-card-actions align="right" class="q-pa-md">
                    <q-btn v-close-popup flat>取消</q-btn>
                    <q-btn v-close-popup color="primary" icon="check" @click="doDeleteAllLog">是的</q-btn>
                  </q-card-actions>
                </co-card>
              </q-popup-proxy>
            </q-btn>
          </div>
          <div class="col-auto">
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

      <template v-slot:body-cell-expand="props">
        <q-td key="expand" :props="props">
          <q-btn flat dense label="详情" color="primary" @click="_showLogDetail(props.row.method, props.row.params)"/>
        </q-td>
      </template>

      <template v-slot:body-cell-createTime="props">
        <q-td key="createTime" :props="props">
          {{formatTime(props.row.createTime)}}
        </q-td>
      </template>

      <template v-slot:pagination>
        <crud-pagination dense outline/>
      </template>

    </co-table>
  </div>
</template>

<script>
import CRUD, { presenter, header } from '@crud/crud'
import CrudPagination from '@crud/crud-pagination'
import CrudMore from '@crud/crud-more'
import { delAllInfo } from '@/api/monitor/log'

const visibleColumns = ['expand', 'username', 'requestIp', 'description', 'browser', 'time', 'createTime']
const columns = [
  { name: 'expand', label: '详情', align: 'center' },
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  { name: 'username', field: 'username', label: '用户名', required: true, align: 'left', sortable: true },
  { name: 'description', field: 'description', label: '描述', align: 'left' },
  { name: 'requestIp', field: 'requestIp', label: 'IP', align: 'left', sortable: true },
  { name: 'address', field: 'address', label: 'IP来源', align: 'left' },
  { name: 'browser', field: 'browser', label: '浏览器', align: 'left' },
  { name: 'time', field: 'time', label: '请求耗时(ms)', sortable: true },
  { name: 'createTime', field: 'createTime', label: '创建日期' }
]

export default {
  name: 'Log',
  components: { CrudMore, CrudPagination },
  cruds() {
    return CRUD({ columns, visibleColumns, idField: 'id', title: '日志', url: 'api/logs' })
  },
  mixins: [presenter(), header()],
  data () {
    return {
      filterTable: '',
      requestParams: '',
      requestMethod: ''
    }
  },
  methods: {
    _showLogDetail(method, params) {
      this.requestMethod = method
      this.requestParams = params
      this.$refs.detailDialog.show()
    },
    doDeleteAllLog () {
      this.crud.delAllLoading = true
      delAllInfo().then(res => {
        this.crud.delAllLoading = false
        this.crud.notifySuccess('删除成功')
        this.crud.toQuery()
      }).catch(err => {
        this.crud.delAllLoading = false
        this.crud.notifyFailure('删除失败:', err)
        console.log('doDeleteAllLog', err)
      })
    }
  }
}
</script>
