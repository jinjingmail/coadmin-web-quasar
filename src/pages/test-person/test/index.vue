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
        <co-input class="col-12" form-label="姓名" v-model="form.name" :disable="!!crud.status.view"
                  :rules="[ val => required(val) || '必填' ]"/>
        <co-field class="col-12" form-label="性别" :disable="!!crud.status.view" :value="form.gender" :rules="[ val => required(val) || '必填' ]">
          <template v-slot:control>
            <co-option-group
                v-model="form.gender"
                value-to-string
                :disable="!!crud.status.view"
                inline
                :options='dict.gender'
                type="radio"
            />
          </template>
        </co-field>
        <co-date-select
            class="col-12"
            form-label="出生日期"
            :value="formatTime(form.birthday, '{y}-{m}-{d}')"
            date-mask="YYYY-MM-DD"
            @input="val => form.birthday=val"
            :disable="!!crud.status.view"
           :rules="[ val => required(val) || '必填' ]" />
        <co-field class="col-12" form-label="创建时间" :value="parseTime(form.createTime, '{y}-{m}-{d} {h}:{i}:{s}')" readonly borderless v-show="form.createTime"/>
        <co-field class="col-12" form-label="创建人" :value="form.createBy" readonly borderless v-show="form.createBy"/>
        <co-field class="col-12" form-label="修改时间" :value="parseTime(form.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')" readonly borderless v-show="form.updateTime"/>
        <co-field class="col-12" form-label="修改人" :value="form.updateBy" readonly borderless v-show="form.updateBy"/>
        <co-input class="col-12" form-label="备注" v-model="form.remarks" :disable="!!crud.status.view" autogrow
                  />
        <co-select
            v-model="form.mysqlEngine"
            class="col-12"
            form-label="测试enum"
            :options='dict.mysql_engine'
            :disable="!!crud.status.view"
            value-to-string
            no-filter
            emit-value
            map-options
            />
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
        selection="none"
        :selected.sync="crud.selections"
        :filter="filterTable"
        @row-click="(evt, row, index) => crud.selections = [row]"
        @row-dblclick="(evt, row, index) => crud.toView(row)"
    >
      <template v-slot:top-left>
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs'>
          <co-input
              v-model="query.name"
              label="姓名"
              content-style="width:160px"
              @change="crud.toQuery()"
              autogrow
          />
          <co-select
              v-model="query.gender"
              label="性别"
              content-style="width:160px"
              value-to-string
              no-filter
              use-input
              fill-input
              hide-selected
              :options='dict.gender'
              @input="crud.toQuery()"
              emit-value
              map-options
              clearable
          />
          <co-date-select
              v-model="query.birthday"
              label="出生日期"
              content-style="width:160px"
              @input="crud.toQuery()"
              date-mask="YYYY-MM-DD"
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
              clearable
              @input="crud.toQuery()"
          />
          <co-select
              v-model="query.mysqlEngine"
              label="测试enum"
              content-style="width:160px"
              value-to-string
              no-filter
              use-input
              fill-input
              hide-selected
              :options='dict.mysql_engine'
              @input="crud.toQuery()"
              emit-value
              map-options
              clearable
          />
          <!-- 点击“更多..”才显示的搜索项 -->
          <template v-if="crud.props.queryMore">
          <co-input
              v-model="query.id"
              label="ID"
              content-style="width:160px"
              @change="crud.toQuery()"
          />
          </template>
          <div>
            <co-btn :label="crud.props.queryMore?'«更少':'更多»'" flat @click="crud.props.queryMore = !crud.props.queryMore"/>
            <co-btn label="重置" flat @click="crud.resetQuery()" />
            <co-btn icon="search" color="primary" @click="crud.toQuery()" />
          </div>
        </div>
      </template>
      <template v-slot:top-right="props">
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs'>
          <!--如果想在工具栏加入更多按钮，可以使用插槽方式， 'start' or 'end'-->
          <crud-operation :permission="permission" no-icon no-view no-edit/>
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
import { mapGetters } from 'vuex'
import { required, integer, between } from '@/utils/vuelidate'
import { getDictLabel } from '@/utils/store'
import { formatTime } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import CrudOperation from '@crud/crud-operation'
import CrudPagination from '@crud/crud-pagination'
import CrudRow from '@crud/crud-row'
import CrudMore from '@crud/crud-more'
import CrudTestPerson from '@/api/test/test-person'

const defaultForm = { id: null, name: null, gender: null, birthday: null, createTime: null, createBy: null, updateTime: null, updateBy: null, remarks: null, mysqlEngine: null }

const visibleColumns = ['name', 'gender', 'birthday', 'createTime', 'updateBy', 'remarks', 'mysqlEngine', 'action']
// 参考：https://quasar.dev/vue-components/table#Defining-the-columns
const columns = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  { name: 'name', field: 'name', label: '姓名', align: 'left' },
  { name: 'gender', field: 'gender', label: '性别', align: 'left', format: val => getDictLabel('gender', val) },
  { name: 'birthday', field: 'birthday', label: '出生日期', align: 'left', format: val => formatTime(val) },
  { name: 'createTime', field: 'createTime', label: '创建时间', align: 'left', format: val => formatTime(val) },
  { name: 'createBy', field: 'createBy', label: '创建人', align: 'left' },
  { name: 'updateTime', field: 'updateTime', label: '修改时间', align: 'left', format: val => formatTime(val) },
  { name: 'updateBy', field: 'updateBy', label: '修改人', align: 'left' },
  { name: 'remarks', field: 'remarks', label: '备注', align: 'left' },
  { name: 'mysqlEngine', field: 'mysqlEngine', label: '测试enum', align: 'left', format: val => getDictLabel('mysql_engine', val) },
  { name: 'action', label: '操作', align: 'center', required: false, sortable: false }
]

export default {
  name: 'TestPerson',
  components: { CrudOperation, CrudMore, CrudPagination, CrudRow },
  cruds() {
    return CRUD({ columns, visibleColumns, title: '演示', idField: 'id', sort: ['id,desc'], url: 'api/test/test-person', crudMethod: { ...CrudTestPerson } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data () {
    return {
      permission: {
        view: ['admin', 'testPerson:list'],
        add: ['admin', 'testPerson:add'],
        edit: ['admin', 'testPerson:edit'],
        del: ['admin', 'testPerson:del']
      },
      filterTable: ''
    }
  },
  computed: {
    ...mapGetters('permission', [
      'dict'
    ])
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
      console.log('testPerson CRUD.HOOK.beforeRefresh')
    }
  }
}
</script>

<style scoped>

</style>
