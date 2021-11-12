<!--
  日志
-->
<template>
  <div >
    <co-dialog title="查找" no-max seamless ref="search" @before-hide="filterTable=''">
      <co-input placeholder="在当前页查找" outlined v-model="filterTable" clearable class="q-mx-sm q-mt-none q-mb-sm"/>
    </co-dialog>

    <co-table
      ref="table"
      row-key="userName"
      dense
      sticky-header
      :data="crud.data"
      :columns="crud.columns"
      :visible-columns="crud.visibleColumns"
      :title="crud.title"
      :loading="crud.loading"
      :loading-delay="0"
      selection="multiple"
      :selected.sync="crud.selections"
      @row-click="(evt, row, index) => crud.selections = [row]"
        @row-dblclick="(evt, row, index) => crud.toView(row)"
      :filter="filterTable"
    >
      <template v-slot:top-right="props">
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>
          <co-input
            dense
            v-model="query.filter"
            placeholder="全表模糊搜索"
            content-style="width:200px"
            clearable
            @change="crud.toQuery()"
            @clear="crud.toQuery()"
          />
          <div>
            <co-btn color="primary" icon="search" @click="crud.toQuery()" />
          </div>

          <q-space/>
          <crud-operation :permission="permission" no-add no-view no-edit label-del="强退" icon-del="exit_to_app"
            msg-del="强制退出登录这些用户？"/>
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

      <template v-slot:body-cell-loginTime="props">
        <q-td key="loginTime" :props="props">
          {{formatTime(props.row.loginTime)}}
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td key="action" :props="props">
          <crud-row flat no-icon
            type="button"
            :data="props.row"
            no-add no-edit no-view
            label-del="强退"
            icon-del="exit_to_app"
            :msg-del="'确定强制退出登录 ' + props.row.userName + ' ?'"
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
import CRUD, { presenter, header } from '@crud/crud'
import CrudOperation from '@crud/crud-operation'
import CrudPagination from '@crud/crud-pagination'
import CrudRow from '@crud/crud-row'
import CrudMore from '@crud/crud-more'
import delOnline from '@/api/monitor/online'

const visibleColumns = ['userName', 'nickName', 'ip', 'browser', 'loginTime', 'action']
const columns = [
  { name: 'userName', field: 'userName', label: '用户名', required: true, align: 'left', sortable: true },
  { name: 'nickName', field: 'nickName', label: '用户昵称', align: 'left' },
  { name: 'ip', field: 'ip', label: '登录IP', align: 'left', sortable: true },
  { name: 'address', field: 'address', label: '登录地点', align: 'left' },
  { name: 'browser', field: 'browser', label: '浏览器', align: 'left' },
  { name: 'loginTime', field: 'loginTime', label: '登录时间', sortable: true },
  { name: 'action', label: '操作', align: 'center' }
]

export default {
  name: 'OnlineUser',
  components: { CrudOperation, CrudMore, CrudRow, CrudPagination },
  cruds() {
    return CRUD({ columns, visibleColumns, idField: 'key', title: '在线用户', url: 'auth/online', crudMethod: { ...delOnline } })
  },
  mixins: [presenter(), header()],
  data () {
    return {
      permission: {
        add: ['admin'],
        edit: ['admin'],
        del: ['admin']
      },
      filterTable: ''
    }
  }
}
</script>
