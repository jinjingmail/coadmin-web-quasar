<template>
  <my-iframe :src="swaggerApi" />
</template>
<script>
import { mapState } from 'vuex'
import MyIframe from 'components/iframe'
export default {
  name: 'Swagger',
  components: { MyIframe },
  computed: {
    ...mapState('api', [
      'swaggerApi'
    ])
  }
}
</script>
