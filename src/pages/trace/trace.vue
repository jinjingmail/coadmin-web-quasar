<template>
  <div>
    <trace-patient simplify :patient-no="patientNo"/>
    <trace-nipt simplify :patient-no="patientNo" class="q-mt-lg"/>
    <trace-cs simplify :patient-no="patientNo" class="q-mt-lg"/>
    <trace-cma simplify :patient-no="patientNo" class="q-mt-lg"/>
  </div>
</template>

<script>
import tracePatient from './trace-patient'
import traceNipt from './trace-nipt'
import traceCs from './trace-cs'
import traceCma from './trace-cma'
import { updateTraceViewed } from '@/api/trace/trace-patient'

export default {
  name: 'Trace',
  components: { tracePatient, traceNipt, traceCs, traceCma },
  data () {
    return {
      patientNo: null
    }
  },
  created () {
    this.patientNo = this.$route.query.patientNo
    if (this.patientNo == null || !this.patientNo) {
      this.patientNo = 'not-exist-patient-no'
      alert('缺少patientNo参数')
    } else {
      updateTraceViewed(this.patientNo).then(res => {
        this.crud.notifySuccess('更新已读标记成功')
      }).catch(err => {
        console.error('updateTraceViewed err:', err)
        this.crud.notifyWarning('更新已读标记失败')
      })
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
