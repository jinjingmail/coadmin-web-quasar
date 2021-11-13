<template>
  <co-select
    v-bind="$attrs"
    v-on="$listeners"
    use-input
    fill-input
    hide-selected
    :options='roleList'
    emit-value
    map-options
    filter-key-equal="id"
    filter-key-like="nameLetter"
    option-label="name"
    option-value="id"
  />
</template>

<script>
import { getAll } from '@/api/system/role'

export default {
  name: 'RoleSelector',
  inheritAttrs: false,
  data () {
    return {
      roleList: []
    }
  },
  created() {
    getAll().then(res => {
      console.log('res=', res)
      this.roleList = res.data
    }).catch(err => {
      console.log('err', err)
      this.roleList = []
    })
  },
  methods: {
  }
}
</script>
