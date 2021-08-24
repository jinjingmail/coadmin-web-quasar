<template>
  <co-card>
    <co-tabs
      v-model="tab"
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="local" label="本地存储" />
      <q-tab name="qiniu" label="七牛云存储" />
    </co-tabs>

    <q-separator />

    <q-tab-panels v-model="tab">
      <q-tab-panel name="local">
        <local ref="local"/>
      </q-tab-panel>

      <q-tab-panel name="qiniu">
        <qi-niu ref="qiniu"/>
      </q-tab-panel>
    </q-tab-panels>
  </co-card>
</template>

<script>
import QiNiu from './qiniu'
import Local from './local'
export default {
  name: 'Storage',
  components: { QiNiu, Local },
  data() {
    return {
      tab: 'local'
    }
  },
  methods: {
    tabClick(name) {
      this.$refs[name].crud.toQuery()
    }
  }
}
</script>
