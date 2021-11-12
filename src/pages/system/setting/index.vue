<template>
  <div>
    <co-dialog title="查找当前页" seamless no-max ref="search" @before-hide="filterTable=''">
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
        label-width="small"
        label-align="right"
        class="q-pa-md row q-col-gutter-x-md q-col-gutter-y-md">
        <co-field class="col-12" form-label="ID" :value="form.id" readonly borderless v-show="form.id"/>
        <co-input class="col-12" form-label="键" v-model="form.key" :disable="!!crud.status.view"
                  :rules="[ val => required(val) || '必填' ]"/>
        <co-input class="col-12" form-label="值" v-model="form.value" :disable="!!crud.status.view"
                  :rules="[ val => required(val) || '必填' ]"/>
        <co-input class="col-12 col-sm-6" form-label="角色级别" v-model.number="form.roleLevel" type="number" :disable="!!crud.status.view" :rules="[
              val => required(val) || '必填',
              val => between(val, 1, 9) || '1-9'
              ]"/>
        <co-input class="col-12 col-sm-6" form-label="排序" v-model="form.sort" :disable="!!crud.status.view"
                  :rules="[ val => required(val) || '必填' ]"/>
        <co-field class="col-12 col-sm-6" form-label="创建时间" :value="parseTime(form.createTime, '{y}-{m}-{d} {h}:{i}:{s}')" readonly borderless v-show="form.createTime"/>
        <co-field class="col-12 col-sm-6" form-label="创建人" :value="form.createBy" readonly borderless v-show="form.createBy"/>
        <co-field class="col-12 col-sm-6" form-label="修改时间" :value="parseTime(form.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')" readonly borderless v-show="form.updateTime"/>
        <co-field class="col-12 col-sm-6" form-label="修改人" :value="form.updateBy" readonly borderless v-show="form.updateBy"/>
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
        selection="single"
        @row-click="(evt, row, index) => crud.selections = [row]"
        @row-dblclick="(evt, row, index) => crud.toView(row)"
    >
      <template v-slot:top-left>
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>
          <co-input
              v-model="query.id"
              label="ID"
              content-style="width:160px"
              @change="crud.toQuery()"
              clearable
          />
          <!-- 点击“更多..”才显示的搜索项 -->
          <template v-if="crud.props.queryMore">
          </template>
          <div>
            <co-btn icon="search" color="primary" @click="crud.toQuery()" />
            <co-btn label="重置" flat @click="crud.resetQuery()" />
            <co-btn :label="crud.props.queryMore?'«更少':'更多»'" flat @click="crud.props.queryMore = !crud.props.queryMore"/>
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
import CrudSetting from '@/api/system/setting'

const defaultForm = { id: null, key: null, value: null, createTime: null, createBy: null, updateTime: null, updateBy: null }

const visibleColumns = ['key', 'value', 'roleLevel', 'sort', 'action']
// 参考：https://quasar.dev/vue-components/table#Defining-the-columns
const columns = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  { name: 'key', field: 'key', label: '键', align: 'left' },
  { name: 'value', field: 'value', label: '值', align: 'left' },
  { name: 'roleLevel', field: 'roleLevel', label: '级别', align: 'left' },
  { name: 'sort', field: 'sort', label: '排序', align: 'left' },
  { name: 'createTime', field: 'createTime', label: '创建时间', align: 'left', format: val => formatTime(val) },
  { name: 'createBy', field: 'createBy', label: '创建人', align: 'left' },
  { name: 'updateTime', field: 'updateTime', label: '修改时间', align: 'left', format: val => formatTime(val) },
  { name: 'updateBy', field: 'updateBy', label: '修改人', align: 'left' },
  { name: 'action', label: '操作', align: 'center', required: false, sortable: false }
]

export default {
  name: 'Setting',
  components: { CrudOperation, CrudMore, CrudPagination, CrudRow },
  cruds() {
    return CRUD({ columns, visibleColumns, title: '系统参数', idField: 'id', sort: ['sort,asc'], url: 'api/setting', crudMethod: { ...CrudSetting } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data () {
    return {
      permission: {
        view: ['admin', 'setting:list'],
        add: ['admin', 'setting:add'],
        edit: ['admin', 'setting:edit'],
        del: ['admin', 'setting:del']
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
      console.log('setting CRUD.HOOK.beforeRefresh')
    }
  }
}
</script>

<style scoped>

</style>
