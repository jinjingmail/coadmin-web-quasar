<template>
  <div >
    <div v-if="show">
      <div class="q-ma-xs">
        <q-card class="q-pa-sm">
          <div class="text-body2 ">
            <span>
              系统：{{ data.sys.os }}
            </span>
            <span>
              IP：{{ data.sys.ip }}
            </span>
            <span>
              项目已不间断运行：{{ data.sys.day }}
            </span>
          </div>
        </q-card>
      </div>

      <div class="row">
        <div class="col-6 q-pa-xs">
          <q-card class="">
            <div class="title">CPU使用率</div>
            <div class="content">
              <q-circular-progress
                show-value
                font-size="14px"
                :value="parseFloat(data.cpu.used)"
                size="100px"
                :thickness="0.22"
                color="teal"
                track-color="grey-3"
              >
                {{ data.cpu.used }}%
              </q-circular-progress>
              <q-tooltip >
                <div style="font-size: 12px;">
                  <div style="padding: 3px;">
                    {{ data.cpu.name }}
                  </div>
                  <div style="padding: 3px">
                    {{ data.cpu.package }}
                  </div>
                  <div style="padding: 3px">
                    {{ data.cpu.core }}
                  </div>
                  <div style="padding: 3px">
                    {{ data.cpu.logic }}
                  </div>
                </div>
              </q-tooltip>
            </div>
            <div class="footer">{{ data.cpu.coreNumber }} 核心</div>
          </q-card>
        </div>
        <div class="col-6 q-pa-xs">
          <q-card>
            <div class="title">内存使用率</div>
              <div class="content">
                <q-circular-progress
                  show-value
                  font-size="14px"
                  :value="parseFloat(data.memory.usageRate)"
                  size="100px"
                  :thickness="0.22"
                  color="teal"
                  track-color="grey-3"
                >
                  {{ data.memory.usageRate }}%
                </q-circular-progress>
                <q-tooltip >
                  <div style="font-size: 12px;">
                    <div style="padding: 3px;">
                      总量：{{ data.memory.total }}
                    </div>
                    <div style="padding: 3px">
                      已使用：{{ data.memory.used }}
                    </div>
                    <div style="padding: 3px">
                      空闲：{{ data.memory.available }}
                    </div>
                  </div>
                </q-tooltip>
              </div>
            <div class="footer">{{ data.memory.used }} / {{ data.memory.total }}</div>
          </q-card>
        </div>
        <div class="col-6 q-pa-xs">
          <q-card>
            <div class="title">交换区使用率</div>
            <div class="content">
              <q-circular-progress
                show-value
                font-size="14px"
                :value="parseFloat(data.swap.usageRate)"
                size="100px"
                :thickness="0.22"
                color="teal"
                track-color="grey-3"
              >
                {{ data.swap.usageRate }}%
              </q-circular-progress>
              <q-tooltip >
                <div style="font-size: 12px;">
                  <div style="padding: 3px;">
                    总量：{{ data.swap.total }}
                  </div>
                  <div style="padding: 3px">
                    已使用：{{ data.swap.used }}
                  </div>
                  <div style="padding: 3px">
                    空闲：{{ data.swap.available }}
                  </div>
                </div>
              </q-tooltip>
            </div>
            <div class="footer">{{ data.swap.used }} / {{ data.swap.total }}</div>
          </q-card>
        </div>
        <div class="col-6 q-pa-xs">
          <q-card>
            <div class="title">磁盘使用率</div>
            <div class="content">
              <q-circular-progress
                show-value
                font-size="14px"
                :value="parseFloat(data.disk.usageRate)"
                size="100px"
                :thickness="0.22"
                color="teal"
                track-color="grey-3"
              >
                {{ data.disk.usageRate }}%
              </q-circular-progress>
              <q-tooltip >
                <div style="font-size: 12px;">
                  <div style="padding: 3px">
                    总量：{{ data.disk.total }}
                  </div>
                  <div style="padding: 3px">
                    空闲：{{ data.disk.available }}
                  </div>
                </div>
              </q-tooltip>
            </div>
            <div class="footer">{{ data.disk.used }} / {{ data.disk.total }}</div>
          </q-card>
        </div>
      </div>

      <div class="row ">
        <div class="col-12 col-md-6 q-pa-xs">
          <q-card>
            <q-card-section >
              <div class="text-h6">CPU使用率监控</div>
            </q-card-section>
            <div>
              <v-chart :options="cpuInfo" />
            </div>
          </q-card>
        </div>
        <div class="col-12 col-md-6 q-pa-xs">
          <q-card>
            <q-card-section>
              <div class="text-h6">内存使用率监控</div>
            </q-card-section>
            <div>
              <v-chart :options="memoryInfo" />
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import { initData } from '@/api/data'
export default {
  name: 'ServerMonitor',
  components: {
    'v-chart': ECharts
  },
  data() {
    return {
      show: false,
      monitor: null,
      url: 'api/monitor',
      data: {},
      cpuInfo: {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20
        },
        series: [{
          data: [],
          type: 'line',
          areaStyle: {
            normal: {
              color: 'rgb(32, 160, 255)' // 改变区域颜色
            }
          },
          itemStyle: {
            normal: {
              color: '#6fbae1',
              lineStyle: {
                color: '#6fbae1' // 改变折线颜色
              }
            }
          }
        }]
      },
      memoryInfo: {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20
        },
        series: [{
          data: [],
          type: 'line',
          areaStyle: {
            normal: {
              color: 'rgb(32, 160, 255)' // 改变区域颜色
            }
          },
          itemStyle: {
            normal: {
              color: '#6fbae1',
              lineStyle: {
                color: '#6fbae1' // 改变折线颜色
              }
            }
          }
        }]
      }
    }
  },
  created() {
    this.init()
    this.monitor = window.setInterval(() => {
      setTimeout(() => {
        this.init()
      }, 2)
    }, 3500)
  },
  destroyed() {
    clearInterval(this.monitor)
  },
  methods: {
    init() {
      if (!this.show) {
        this.$q.loading.show()
      }
      initData(this.url, {}).then(res => {
        if (!this.show) {
          this.$q.loading.hide()
        }
        this.data = res.data
        this.show = true
        if (this.cpuInfo.xAxis.data.length >= 8) {
          this.cpuInfo.xAxis.data.shift()
          this.memoryInfo.xAxis.data.shift()
          this.cpuInfo.series[0].data.shift()
          this.memoryInfo.series[0].data.shift()
        }
        this.cpuInfo.xAxis.data.push(res.data.time)
        this.memoryInfo.xAxis.data.push(res.data.time)
        this.cpuInfo.series[0].data.push(parseFloat(res.data.cpu.used))
        this.memoryInfo.series[0].data.push(parseFloat(res.data.memory.usageRate))
      }).catch(err => {
        if (!this.show) {
          this.$q.loading.hide()
        }
        console.log(this.url + ' initData err', err)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .cpu, .memory, .swap, .disk  {
    width: 20%;
    float: left;
  }
  .title, .footer {
    text-align: center;
    font-size: 15px;
    font-weight: 500;
    color: #999;
    height: 25px;
    line-height: 25px;
  }
  .content {
    text-align: center;
  }
</style>
