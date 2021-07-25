<template>
  <div>
    <co-dialog title="查找" no-max seamless ref="search" @before-hide="crud.props.filterTable=''">
      <q-input dense style="width:180px" placeholder="在当前页查找" outlined v-model="crud.props.filterTable" clearable class="q-mx-sm q-mt-none q-mb-sm"/>
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
        label-width="medium"
        label-align="right"
        class="q-pa-md row q-col-gutter-x-xl q-col-gutter-y-md">
        <co-input dense class="col-12" form-label="ID" :value="form.id" readonly borderless/>
        <co-input dense class="col-12" form-label="姓名" v-model="form.name" :disable="!!crud.status.view"
              :rules="[ val => (!!val) || '必填' ]"/>
        <co-option-group
            dense
            class="col-12"
            form-label="性别"
            v-model="form.gender"
            value-to-string
            :disable="!!crud.status.view"
            inline
            :options='dict.gender'
            type="radio"
            />
        <co-date-select
            dense
            class="col-12"
            form-label="出生日期"
            :value="formatTime(form.birthday, '{y}-{m}-{d}')"
            @input="val => form.birthday=val"
            clearable
            :disable="!!crud.status.view"
            >
          <template v-slot:append>
            <q-icon name="event" />
          </template>
        </co-date-select>
        <co-input dense class="col-12" form-label="创建时间" :value="parseTime(form.createTime, '{y}-{m}-{d} {h}:{i}:{s}')" readonly borderless/>
        <co-input dense class="col-12" form-label="创建人" :value="form.createBy" readonly borderless/>
        <co-input dense class="col-12" form-label="修改时间" :value="parseTime(form.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')" readonly borderless/>
        <co-input dense class="col-12" form-label="修改人" :value="form.updateBy" readonly borderless/>
        <co-input dense class="col-12" form-label="备注" v-model="form.remarks" :disable="!!crud.status.view" autogrow
              />
      </co-form>
      <q-card-actions class="q-pa-md" align="right">
        <q-btn dense label="取消" flat v-close-popup/>
        <q-btn dense label="保存" color="primary"
                v-if="!crud.status.view"
                @click="crud.submitCU"
               :loading="crud.status.cu === crud.STATUS_PROCESSING"
               :disable="crud.status.cu === crud.STATUS_PROCESSING"/>
      </q-card-actions>
    </co-dialog>

    <co-table
        ref="table"
        row-key="id"
        dense
        :data="crud.data"
        :columns="crud.columns"
        :visible-columns="crud.visibleColumns"
        :title="crud.title"
        :loading="crud.loading"
        selection="single"
        :selected.sync="crud.selections"
        :filter="crud.props.filterTable"
        @row-click="(evt, row, index) => crud.selections = [row]"
    >
      <template v-slot:top-left>
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>
          <co-input
              v-model="query.id"
              dense
              filled
              label="ID"
              content-style="width:120px"
          />
          <co-select
              v-model="query.gender"
              dense
              filled
              options-dense
              label="性别"
              content-style="width:120px"
              no-filter
              use-input
              fill-input
              hide-selected
              :options='dict.gender'
              @input="crud.toQuery()"
              clearable
              emit-value
              map-options
          />
          <co-date-select
              v-model="query.birthday"
              dense
              filled
              label="出生日期"
              content-style="width:120px"
              @input="crud.toQuery()"
              clearable
          />
          <co-date-select
              v-model="query.createTime"
              dense
              filled
              label="创建时间"
              content-style="width:200px"
              range
              :default-time="[' 00:00:00', ' 23:59:59']"
              @input="crud.toQuery()"
              clearable
          />
          <!-- 点击“更多..”才显示的搜索项 -->
          <template v-if="crud.props.queryMore">
          </template>
          <div>
            <q-btn dense label="查询" padding="xs sm" color="primary" @click="crud.toQuery()" />
            <q-btn dense label="重置" flat @click="crud.resetQuery()" />
            <q-btn dense :label="crud.props.queryMore?'更少«':'更多»'" flat @click="crud.props.queryMore = !crud.props.queryMore"/>
          </div>
          <q-space/>
        </div>
      </template>
      <template v-slot:top-right="props">
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>
          <!--如果想在工具栏加入更多按钮，可以使用插槽方式， 'start' or 'end'-->
          <crud-operation dense :permission="permission" />
          <div>
            <q-btn-dropdown dense color="primary" class="btn-dropdown-hide-droparrow" icon="apps" auto-close>
              <crud-more :tableSlotTopProps="props">
                <template v-slot:start>
                  <q-btn flat align="left" label="在当前页查找" icon="find_in_page" @click.native="$refs.search.show()" />
                  <q-separator/>
                </template>
              </crud-more>
            </q-btn-dropdown>
          </div>
        </div>
      </template>

      <template v-slot:body-cell-gender="props">
        <q-td key="gender" :props="props">
          {{dict.label.gender[props.row.gender]}}
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td key="action" :props="props">
          <crud-row
              flat
              dense
              :type="$q.screen.gt.xs?'button':'menu'"
              :data="props.row"
              :permission="permission"
              no-add
              no-icon
          />
        </q-td>
      </template>

      <template v-slot:pagination>
        <crud-pagination dense />
      </template>

    </co-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatTime } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import CrudOperation from '@crud/crud-operation'
import CrudPagination from '@crud/crud-pagination'
import CrudRow from '@crud/crud-row'
import CrudMore from '@crud/crud-more'
import CrudTestPerson from '@/api/test-person'

const defaultForm = { id: null, name: null, gender: null, birthday: null, createTime: null, createBy: null, updateTime: null, updateBy: null, remarks: null }

const visibleColumns = ['name', 'gender', 'birthday', 'createTime', 'updateBy', 'remarks', 'action']
// 参考：https://quasar.dev/vue-components/table#Defining-the-columns
const columns = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  { name: 'name', field: 'name', label: '姓名', align: 'left' },
  { name: 'gender', field: 'gender', label: '性别', align: 'left' },
  { name: 'birthday', field: 'birthday', label: '出生日期', align: 'left', format: val => formatTime(val) },
  { name: 'createTime', field: 'createTime', label: '创建时间', align: 'left', format: val => formatTime(val) },
  { name: 'createBy', field: 'createBy', label: '创建人', align: 'left' },
  { name: 'updateTime', field: 'updateTime', label: '修改时间', align: 'left', format: val => formatTime(val) },
  { name: 'updateBy', field: 'updateBy', label: '修改人', align: 'left' },
  { name: 'remarks', field: 'remarks', label: '备注', align: 'left' },
  { name: 'action', label: '操作', align: 'center', required: false, sortable: false }
]

export default {
  name: 'TestPerson',
  components: { CrudOperation, CrudMore, CrudPagination, CrudRow },
  cruds() {
    return CRUD({ columns, visibleColumns, title: '演示', idField: 'id', sort: ['id,desc'], url: 'api/test-person', crudMethod: { ...CrudTestPerson } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data () {
    return {
      /*
      rules: {
        id: [
          { required: true, message: 'ID不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' }
        ]
      },*/
      permission: {
        view: ['admin', 'testPerson:list'],
        add: ['admin', 'testPerson:add'],
        edit: ['admin', 'testPerson:edit'],
        del: ['admin', 'testPerson:del']
      }
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
    [CRUD.HOOK.beforeRefresh] () {
      console.log('testPerson CRUD.HOOK.beforeRefresh')
    }
  }
}
</script>

<style scoped>

</style>
