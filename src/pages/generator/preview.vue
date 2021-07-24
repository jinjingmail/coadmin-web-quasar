<template>
  <co-dialog
    ref="dialog"
    :title="tableName"
    card-style="width:95vw; max-width:95vw; height:95vh; max-height:95vh"
  >
    <q-tabs
      v-model="tab"
      dense
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab v-for="item in data" :key="item.name" :name="item.name" :label="item.name" />
    </q-tabs>

    <q-separator />
    <q-tab-panels v-model="tab" animated class="custom-other-bg">
      <q-tab-panel v-for="item in data" :key="item.name" :name="item.name">
        <pre>{{item.content}}</pre>
      </q-tab-panel>
    </q-tab-panels>
  </co-dialog>
</template>

<script>
import { generator } from '@/api/generator/generator'
export default {
  name: 'GeneratorPreview',
  data() {
    return {
      tab: 'Entity',
      data: null,
      tableName: ''
    }
  },
  methods: {
    show(tableName) {
      this.tableName = tableName
      this.data = null
      generator(tableName, 1).then(data => {
        this.data = data
      }).catch((err) => {
        console.log('error', err)
        this.$q.notify('预览失败')
      })
      this.$refs.dialog.show()
    }
  }
}
</script>
