<template>
  <div>
    <coadmin-dialog title="查找" no-max seamless ref="search" @before-hide="crud.props.filterTable=''">
      <q-input style="width:180px" placeholder="在当前页查找" dense outlined v-model="crud.props.filterTable" clearable class="q-mx-sm q-mt-none q-mb-sm"/>
    </coadmin-dialog>

    <!-- 编辑表单对话框 -->
    <coadmin-dialog
      ref="formDialog"
      :value="crud.status.cu > 0"
      :title="crud.status.title"
      no-backdrop-dismiss
      @before-hide="crud.cancelCU"
      card-style="width:600px; max-width:95vw;"
    >
      <coadmin-form
        ref="form"
        label-width="small"
        label-align="right"
        class="q-pa-md row q-col-gutter-x-xl q-col-gutter-y-md">
        <coadmin-form-item class="col-12" form-label="ID">
          <div class="q-pt-xs">{{form.id}}</div>
        </coadmin-form-item>
        <coadmin-input class="col-12" form-label="姓名" v-model="form.name" :disable="!!crud.status.view"
              :rules="[ val => (!!val) || '必填' ]"/>
        <coadmin-option-group
            class="col-12"
            form-label="性别"
            v-model="form.gender"
            value-to-string
            :disable="!!crud.status.view"
            inline
            :options='dict.gender'
            type="radio"
            />
        <coadmin-date-select
            class="col-12"
            form-label="出生日期"
            :value="parseTime(form.birthday, '{y}-{m}-{d}')"
            clearable
            :disable="!!crud.status.view"
            @input="val => form.birthday=val"
            >
          <template v-slot:append>
            <q-icon name="event" />
          </template>
        </coadmin-date-select>
        <coadmin-form-item class="col-12" form-label="创建人">
          <div class="q-pt-xs">{{form.createBy}}</div>
        </coadmin-form-item>
        <coadmin-form-item class="col-12" form-label="修改时间">
          <div class="q-pt-xs">{{parseTime(form.updateTime)}}</div>
        </coadmin-form-item>
        <coadmin-form-item class="col-12" form-label="修改人">
          <div class="q-pt-xs">{{form.updateBy}}</div>
        </coadmin-form-item>
        <coadmin-form-item class="col-12" form-label="备注">
          <div class="q-pt-xs">{{form.remarks}}</div>
        </coadmin-form-item>
      </coadmin-form>
      <q-card-actions class="q-pa-md" align="right">
        <q-btn label="取消" flat v-close-popup/>
        <q-btn label="保存" icon="check" color="primary" v-if="!crud.status.view" @click="crud.submitCU"
               :loading="crud.status.cu === crud.STATUS_PROCESSING" :disable="crud.status.cu === crud.STATUS_PROCESSING"/>
      </q-card-actions>
    </coadmin-dialog>

    <coadmin-table
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
      <template v-slot:top-right="props">
        <div class='row q-col-gutter-x-sm q-col-gutter-y-xs q-pa-xs full-width'>

          <coadmin-input
              v-model="query.id"
              placeholder="ID"
              content-style="width:120px"
          />

          <coadmin-select
              v-model="query.gender"
              placeholder="性别"
              content-style="width:120px"
              outlined
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

          <coadmin-date-select
              v-model="query.birthday"
              placeholder="出生日期"
              content-style="width:120px"
              @input="crud.toQuery()"
              clearable
          />

          <coadmin-date-select
              v-model="query.createTime"
              placeholder="创建时间"
              content-style="width:200px"
              range
              :default-time="[' 00:00:00', ' 23:59:59']"
              @input="crud.toQuery()"
              clearable
          />
          <div>
            <q-btn dense padding="xs sm" color="primary" icon="search" @click="crud.toQuery()" />
          </div>
          <q-space/>
          <!--如果想在工具栏加入更多按钮，可以使用插槽方式， 'start' or 'end'-->
          <crud-operation :permission="permission" />
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
      <template v-slot:body-cell-birthday="props">
        <q-td key="birthday" :props="props">
          {{formatTime(props.row.birthday, '{y}-{m}-{d}')}}
        </q-td>
      </template>
      <template v-slot:body-cell-createTime="props">
        <q-td key="createTime" :props="props">
          {{formatTime(props.row.createTime)}}
        </q-td>
      </template>
      <template v-slot:body-cell-updateTime="props">
        <q-td key="updateTime" :props="props">
          {{formatTime(props.row.updateTime)}}
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td key="action" :props="props">
          <crud-row
              flat
              :type="$q.screen.gt.xs?'button':'menu'"
              :data="props.row"
              :permission="permission"
              no-add
          />
        </q-td>
      </template>

      <template v-slot:pagination>
        <crud-pagination />
      </template>

    </coadmin-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import crudPagination from '@crud/CRUD.pagination'
import crudRow from '@crud/CRUD.row'
import crudMore from '@crud/CRUD.more'
import crudTestPerson from '@/api/testPerson'

const defaultForm = { id: null, name: null, gender: null, birthday: null, createTime: null, createBy: null, updateTime: null, updateBy: null, remarks: null }

const visibleColumns = ['name', 'gender', 'birthday', 'createTime', 'updateBy', 'remarks', 'action']
// 参考：https://quasar.dev/vue-components/table#Defining-the-columns
const columns = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  { name: 'name', field: 'name', label: '姓名', align: 'left' },
  { name: 'gender', field: 'gender', label: '性别', align: 'left' },
  { name: 'birthday', field: 'birthday', label: '出生日期', align: 'left' },
  { name: 'createTime', field: 'createTime', label: '创建时间', align: 'left' },
  { name: 'createBy', field: 'createBy', label: '创建人', align: 'left' },
  { name: 'updateTime', field: 'updateTime', label: '修改时间', align: 'left' },
  { name: 'updateBy', field: 'updateBy', label: '修改人', align: 'left' },
  { name: 'remarks', field: 'remarks', label: '备注', align: 'left' },
  { name: 'action', label: '操作', align: 'center', required: false, sortable: false }
]

export default {
  name: 'TestPerson',
  components: { crudOperation, crudMore, crudPagination, crudRow },
  cruds() {
    return CRUD({ columns, visibleColumns, title: '演示', idField: 'id', sort: ['id,desc'], url: 'api/testPerson', crudMethod: { ...crudTestPerson } })
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
  methods: {
  }
}
</script>

<style scoped>

</style>
