<template>
  <coadmin-dialog
    ref="dialog"
    :title="tableName"
    card-style="width:90vw; max-width:95vw; height:95vh"
  >
    <coadmin-table
      ref="table"
      row-key="columnName"
      dense
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
            <coadmin-input v-model="props.row.remark"/>
          </q-td>
          <q-td key="notNull" :props="props">
            <q-checkbox v-model="props.row.notNull" dense/>
          </q-td>
          <q-td key="listShow" :props="props">
            <q-checkbox v-model="props.row.listShow" dense/>
          </q-td>
          <q-td key="formShow" :props="props">
            <q-checkbox v-model="props.row.formShow" dense/>
          </q-td>
          <q-td key="formType" :props="props">
            <coadmin-select
              v-model="props.row.formType"
              emit-value
              map-options
              :options="[
                {label:'文本框', value:'Input'},
                {label:'文本域', value:'Textarea'},
                {label:'单选框', value:'Radio'},
                {label:'下拉框', value:'Select'},
                {label:'日期框', value:'Date'}
              ]"
            />
          </q-td>
          <q-td key="queryType" :props="props">
            <coadmin-select
              v-model="props.row.queryType"
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
            <coadmin-select
              v-model="props.row.dateAnnotation"
              emit-value
              map-options
              :options="[
                {label:'自动创建时间', value:'CreationTimestamp'},
                {label:'自动更新时间', value:'UpdateTimestamp'}
              ]"
            />
          </q-td>
          <q-td key="dictName" :props="props">
            <coadmin-select
              v-model="props.row.dictName"
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
          <q-btn dense label="同步" color="primary"
            padding="xs md"
            class='col-auto'
            @click="doSync"/>
          <q-btn dense label="保存" color="primary"
            padding="xs md"
            class='col-auto'
            @click="saveColumnConfig"/>
          <q-btn dense label="保存&生成" color="primary"
            padding="xs md"
            class='col-auto'
            @click="doSaveAndGen"/>
        </div>
      </template>
    </coadmin-table>

    <coadmin-card bordered rounded>
      <q-card-actions class="q-pa-md" >
        <div class="text-h6">生成配置</div>
        <q-space/>
        <q-btn dense label="保存" color="primary" padding="xs md" @click="saveTableConfig"/>
      </q-card-actions>
      <coadmin-form
        ref="form"
        label-width="medium"
        :label-align="$q.screen.gt.xs?'right':'auto'"
        :label-top="!$q.screen.gt.xs"
        class="q-pa-md row q-col-gutter-x-sm q-col-gutter-y-md">
        <coadmin-input class="col-12 col-sm-6" form-label="作者" v-model="formTable.author" :rules="[
          val => (!!val) || '必填'
          ]"/>
        <coadmin-form-item class="col-12 col-sm-6" ><div class="q-pt-xs">类上面的作者名称</div></coadmin-form-item>

        <coadmin-input class="col-12 col-sm-6" form-label="模块名称" v-model="formTable.moduleName" :rules="[
          val => (!!val) || '必填'
          ]"/>
        <coadmin-form-item class="col-12 col-sm-6" ><div class="q-pt-xs">模块的名称，请选择项目中已存在的模块</div></coadmin-form-item>

        <coadmin-input class="col-12 col-sm-6" form-label="至于包下" v-model="formTable.pack" :rules="[
          val => (!!val) || '必填'
          ]"/>
        <coadmin-form-item class="col-12 col-sm-6" ><div class="q-pt-xs">项目包的名称，生成的代码放到哪个包里面</div></coadmin-form-item>

        <coadmin-input class="col-12 col-sm-6" form-label="接口名称" v-model="formTable.apiAlias" :rules="[
          val => (!!val) || '必填'
          ]"/>
        <coadmin-form-item class="col-12 col-sm-6" ><div class="q-pt-xs">接口的名称，用于控制器与接口文档中</div></coadmin-form-item>

        <coadmin-input class="col-12 col-sm-6" form-label="前端路径" v-model="formTable.path" :rules="[
          val => (!!val) || '必填'
          ]"/>
        <coadmin-form-item class="col-12 col-sm-6" ><div class="q-pt-xs">输入views文件夹下的目录，不存在即创建</div></coadmin-form-item>

        <!--            <el-form-item label="接口目录">-->
        <!--              <el-input v-model="form.apiPath" style="width: 40%" />-->
        <!--              <span style="color: #C0C0C0;margin-left: 10px;">Api存放路径[src/api]，为空则自动生成路径</span>-->
        <!--            </el-form-item>-->

        <coadmin-input class="col-12 col-sm-6" form-label="去表前缀" v-model="formTable.prefix" :rules="[
          val => (!!val) || '必填'
          ]"/>
        <coadmin-form-item class="col-12 col-sm-6" ><div class="q-pt-xs">默认不去除表前缀，可自定义</div></coadmin-form-item>

        <coadmin-option-group class="col-12 col-sm-6" form-label="是否覆盖" v-model="formTable.cover" inline
          :options="[
            {label: '是', value: true},
            {label: '否', value: false}
          ]"
        />
        <coadmin-form-item class="col-12 col-sm-6" ><div class="q-pt-xs">谨防误操作，请慎重选择</div></coadmin-form-item>

      </coadmin-form>
    </coadmin-card>
  </coadmin-dialog>
</template>

<script>
import { update, get } from '@/api/generator/genConfig'
import { save, sync, generator } from '@/api/generator/generator'
import { getDicts } from '@/api/system/dict'
import { initData } from '@/api/data'
import CoadminFormItem from 'src/components/form/CoadminFormItem.vue'

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
  { name: 'dateAnnotation', field: 'dateAnnotation', label: '日期注解', align: 'left', style: 'min-width: 160px' },
  { name: 'dictName', field: 'dictName', label: '关联字典', align: 'left', style: 'min-width: 160px' }
]

export default {
  components: { CoadminFormItem },
  name: 'GeneratorConfig',
  data() {
    return {
      columns,
      visibleColumns,
      dicts: [],
      tableName: '',
      dataColumn: [],
      formTable: { id: null, tableName: '', author: '', pack: '', path: '', moduleName: '', cover: 'false', apiPath: '', prefix: '', apiAlias: null },
      loading: false
    }
  },
  methods: {
    init () {
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
      get(tableName).then(data => {
        this.formTable = data
      }).catch(err => {
        console.log('get table config failure', err)
        this.$q.notify('获取表配置失败')
      })
      getDicts().then(data => {
        this.dicts = data
      })
      this.$refs.dialog.show()
    },
    saveColumnConfig() {
      this.loading = true
      save(this.dataColumn).then(res => {
        this.$q.notify('保存成功')
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    saveTableConfig() {
      this.$refs['form'].validate().then((valid) => {
        if (valid) {
          this.loading = true
          update(this.formTable).then(res => {
            this.$q.notify('保存成功', 'success')
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
          this.$q.notify('生成成功')
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
