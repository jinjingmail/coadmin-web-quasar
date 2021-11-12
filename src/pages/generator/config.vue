<template>
  <co-dialog
    ref="dialog"
    :title="tableName"
    no-backdrop-dismiss
    card-style="width:90vw; max-width:95vw;"
  >
    <co-table
      ref="table"
      row-key="columnName"
      :flat="false"
      title="字段配置"
      :data="dataColumn"
      :columns="columns"
      :visible-columns="visibleColumns"
      :loading="loading"
      card-style="background-color:var(--q-color-table-bg) !important"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="columnName" :props="props">
            {{props.row.columnName}}
          </q-td>
          <q-td key="columnType" :props="props">
            {{props.row.columnType}}
          </q-td>
          <q-td key="remark" :props="props">
            <co-input v-model="props.row.remark"/>
          </q-td>
          <q-td key="notNull" :props="props">
            <co-checkbox v-model="props.row.notNull" />
          </q-td>
          <q-td key="listShow" :props="props">
            <co-checkbox v-model="props.row.listShow" />
          </q-td>
          <q-td key="formShow" :props="props">
            <co-checkbox v-model="props.row.formShow" />
          </q-td>
          <q-td key="formType" :props="props">
            <co-select
              v-model="props.row.formType"
              clearable
              emit-value
              map-options
              :options="[
                {label:'文本框', value:'Input'},
                {label:'文本域', value:'Textarea'},
                {label:'单选框', value:'Radio'},
                {label:'复选框', value:'Checkbox'},
                {label:'下拉框', value:'Select'},
                {label:'开关', value:'Toggle'},
                {label:'日期框', value:'Date'},
                {label:'日期范围', value:'DateRange'},
                {label:'纯显示', value:'showOnly'}
              ]"
            />
          </q-td>
          <q-td key="queryType" :props="props">
            <co-select
              v-model="props.row.queryType"
              clearable
              emit-value
              map-options
              :options="[
                {label:'=', value:'='},
                {label:'!=', value:'!='},
                {label:'>=', value:'>='},
                {label:'<=', value:'<='},
                {label:'Like', value:'Like'},
                {label:'NotNull', value:'NotNull'},
                {label:'BetWeen', value:'BetWeen'}
              ]"
            />
          </q-td>
          <q-td key="dateAnnotation" :props="props">
            <co-select
              v-model="props.row.dateAnnotation"
              clearable
              emit-value
              map-options
              :options="[
                {label:'创建时自动填充', value:'CreationTimestamp'},
                {label:'更新时自动填充', value:'UpdateTimestamp'},
                {label:'创建或更新时自动填充', value:'CreationUpdate'}
              ]"
            />
          </q-td>
          <q-td key="dictName" :props="props">
            <co-select
              v-model="props.row.dictName"
              clearable
              option-value="name"
              option-label="description"
              emit-value
              map-options
              :options="dicts"
            />
          </q-td>
        </q-tr>
      </template>

      <template v-slot:top-right>
        <div class='row q-gutter-sm q-pa-xs full-width'>
          <co-btn label="同步" color="primary"
            padding="xs md"
            class='col-auto'
            @click="doSync"/>
          <co-btn label="保存" color="primary"
            padding="xs md"
            class='col-auto'
            @click="saveColumnConfig"/>
          <co-btn label="保存&生成" color="primary"
            padding="xs md"
            class='col-auto'
            @click="doSaveAndGen"/>
        </div>
      </template>
    </co-table>

    <co-card bordered rounded>
      <q-card-actions class="q-pa-md" >
        <div class="text-h6">生成配置</div>
        <q-space/>
        <co-btn label="保存" color="primary" padding="xs md" @click="saveTableConfig"/>
      </q-card-actions>
      <co-form
        ref="form"
        label-width="xlarge"
        :label-align="$q.screen.gt.xs?'right':'auto'"
        :label-top="!$q.screen.gt.xs"
        class="q-pa-md row q-col-gutter-x-sm q-col-gutter-y-md">
        <co-input class="col-12 col-sm-6" form-label="作者" v-model="formTable.author" :rules="[
          val => (!!val) || '必填'
          ]"/>
        <co-field class="col-12 col-sm-6" readonly borderless value="类上面的作者名称"/>

        <co-input class="col-12 col-sm-6" form-label="子模块名称" v-model="formTable.subModuleName" :rules="[
          val => (!!val) || '必填'
          ]"/>
        <co-field class="col-12 col-sm-6" readonly borderless value="比如 api/{子模块名称}/xxx"/>

        <co-input class="col-12 col-sm-6" form-label="JAVA Module名称" v-model="formTable.moduleName" :rules="[
          val => (!!val) || '必填'
          ]"/>
        <co-field class="col-12 col-sm-6" readonly borderless value="Java项目模块的名称，请选择项目中已存在的模块(module)"/>

        <co-input class="col-12 col-sm-6" form-label="JAVA包名" v-model="formTable.pack" :rules="[
          val => (!!val) || '必填'
          ]"/>
        <co-field class="col-12 col-sm-6" readonly borderless value="Java项目包的名称，生成的代码放到哪个包里面"/>

        <co-input class="col-12 col-sm-6" form-label="接口名称" v-model="formTable.apiAlias" :rules="[
          val => (!!val) || '必填'
          ]"/>
        <co-field class="col-12 col-sm-6" readonly borderless value="接口的名称，用于控制器与接口文档中"/>

        <co-input class="col-12 col-sm-6" form-label="前端Vue存放路径" v-model="formTable.path" :rules="[
          val => (!!val) || '必填'
          ]"/>
        <co-field class="col-12 col-sm-6" readonly borderless value="示例[d:\src\pages]，不存在会自动创建"/>

        <co-input class="col-12 col-sm-6" form-label="前端Api接口目录" v-model="formTable.apiPath" :rules="[
          val => (!!val) || '必填'
          ]"/>
        <co-field class="col-12 col-sm-6" readonly borderless value="示例[d:\src\api]，不存在会自动创建"/>

        <co-input class="col-12 col-sm-6" form-label="去表前缀" v-model="formTable.prefix" />
        <co-field class="col-12 col-sm-6" readonly borderless value="留空不去除表前缀"/>

        <co-tree-select
          ref="menu"
          class="col-12 col-sm-6"
          tree-class="q-pa-sm"
          form-label="上级菜单"
          :nodes="menuDatas"
          :selected.sync="formTable.menuPid"
          :expanded.sync="treeSelectExpanded"
          selectable
          node-key="id"
          label-key="title"
          filter-key-like="titleLetter"
          filter-key-equal="id"
          filter-placeholder="名称、拼音首字母"
          clearable
        />
        <co-field class="col-12 col-sm-6" readonly borderless value="用于得到创建菜单的sql，请在XxxController.java中查看SQL"/>

        <co-field class="col-12 col-sm-6" form-label="是否覆盖">
          <template v-slot:control>
            <co-option-group v-model="formTable.cover" inline
              :options="[
                {label: '是', value: true},
                {label: '否', value: false}
              ]"
            />
          </template>
        </co-field>
        <co-field class="col-12 col-sm-6" readonly borderless value="谨防误操作，请慎重选择"/>

      </co-form>
    </co-card>
  </co-dialog>
</template>

<script>
import { update, get } from '@/api/generator/genConfig'
import { save, sync, generator } from '@/api/generator/generator'
import { initData } from '@/api/data'
import coField from 'src/components/form/co-field.vue'

const visibleColumns = ['columnName', 'columnType', 'remark', 'notNull', 'listShow', 'formShow',
  'formType', 'queryType', 'dateAnnotation', 'dictName']
const columns = [
  { name: 'columnName', field: 'columnName', label: '字段名', required: true, align: 'left' },
  { name: 'columnType', field: 'columnType', label: '字段类型' },
  { name: 'remark', field: 'remark', label: '备注', align: 'left', style: 'min-width: 150px' },
  { name: 'notNull', field: 'notNull', label: '必填', align: 'center' },
  { name: 'listShow', field: 'listShow', label: '列表', align: 'center' },
  { name: 'formShow', field: 'formShow', label: '表单', align: 'center' },
  { name: 'formType', field: 'formType', label: '表单类型', align: 'left', style: 'min-width: 160px' },
  { name: 'queryType', field: 'queryType', label: '查询方式', align: 'left', style: 'min-width: 160px' },
  { name: 'dateAnnotation', field: 'dateAnnotation', label: '自动填充', align: 'left', style: 'min-width: 160px' },
  { name: 'dictName', field: 'dictName', label: '关联字典', align: 'left', style: 'min-width: 160px' }
]

const defaultFormTable = { id: null, tableName: '', author: '', pack: '', path: '', moduleName: '', cover: 'false', apiPath: '', prefix: '', apiAlias: null, menuPid: null }

export default {
  components: { coField },
  name: 'GeneratorConfig',
  props: {
    menuDatas: Array,
    dicts: Array
  },
  data() {
    return {
      columns,
      visibleColumns,
      tableName: '',
      dataColumn: [],
      formTable: { },
      loading: false,
      treeSelectExpanded: []
    }
  },
  methods: {
    init () {
      this.formTable = { ...defaultFormTable }
      initData('api/generator/columns', { tableName: this.tableName }).then(data => {
        this.dataColumn = data.content
      }).catch(err => {
        console.log('get table columns failure', err)
        this.$q.notify('获取表Columns失败')
      })
    },
    show(tableName) {
      this.tableName = tableName
      this.init()
      this.$q.loading = true
      get(tableName).then(data => {
        this.formTable = data
        this.$refs.dialog.show()
      }).catch(err => {
        console.log('get table config failure', err)
        this.$q.notify('获取表配置失败')
        //this.$refs.dialog.show()
      })
    },
    saveColumnConfig() {
      this.loading = true
      save(this.dataColumn).then(res => {
        this.$q.notify('保存成功')
        this.loading = false
      }).catch(err => {
        this.loading = false
        if (err && err.response && err.response.data && err.response.data.message) {
          console.log(err.response.data.message)
          this.$q.notify('保存失败：' + err.response.data.message)
        } else {
          this.$q.notify('保存失败：' + JSON.stringify(err))
        }
      })
    },
    saveTableConfig() {
      this.$refs['form'].validate().then((valid) => {
        if (valid) {
          this.loading = true
          update(this.formTable).then(res => {
            this.$q.notify('保存成功')
            this.formTable = res
            this.loading = false
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        }
      })
    },
    doSync() {
      this.loading = true
      sync([this.tableName]).then(() => {
        this.init()
        this.$q.notify('同步成功')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    doSaveAndGen() {
      this.loading = true
      save(this.dataColumn).then(res => {
        this.$q.notify('保存成功')
        // 生成代码
        generator(this.tableName, 0).then(data => {
          this.loading = false
          this.$q.notify({ message: '生成成功', type: 'success' })
        }).catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    }
  }
}
</script>
