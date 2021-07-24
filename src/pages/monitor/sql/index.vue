<template>
  <my-iframe :src="sqlApi" />
</template>
<script>
import { mapState } from 'vuex'
import MyIframe from 'components/iframe'
export default {
  name: 'Sql',
  components: { MyIframe },
  computed: {
    ...mapState('api', [
      'sqlApi'
    ])
  }
}
</script>
