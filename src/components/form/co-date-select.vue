<!--
  提示：暂时不支持编辑输入框
  初值：
    this.$attrs.value
      range=false "2019/02/10"
      range=true  ["2019/02/10", "2019/02/15"]
  新增插槽：
      form-label
  新增prop：
      见prop定义
      date-today-btn
      default-time   自动在日期后面添加后缀，比如：['00:00:00', '23:59:59']
      date-time-join 日期和时间链接符号
      date-mask      注意：只支持双位的格式，比如YYYY、MM、DD
      range          false=选择单个日期，true=选择日期区间
      range-separator 两个日期区间的连接符
      hide-dropdown-icon
      edit-time     修改时间
      with-seconds  修改时间包含秒
  返回值：
      range=false "2019/02/10"
      range=true  ["2019/02/10", "2019/02/15"]
-->
<template>
  <co-field
    :value="inputModel"
    ref="input"
    class="co-date-select"
    v-on="listeners"
    v-bind="$attrs"
    :disable="disable"
    :readonly="readonly"
    :no-clear-focus="noClearFocus"
    :rules="rules"
  >
    <q-popup-proxy
      ref="popupDate"
      @before-hide="_popupDateBeforeHide"
      @show="modified=false"
    >
      <co-date
        :value="dateModel"
        :class="dateClass"
        :style="dateStyle"
        :color="dateColor"
        :text-color="dateTextColor"
        :mask="dateMask"
        :multiple="false"
        :range="range"
        :today-btn="dateTodayBtn"
        :disable="disable"
        :readonly="readonly"
        :range-separator="rangeSeparator"
        :options="dateOptions"
        :default-year-month="defaultYearMonth"
        :navigation-min-year-month="navigationMinYearMonth"
        :navigation-max-year-month="navigationMaxYearMonth"
        @input="___inputDate"
      >
        <div class="row q-gutter-xl" v-if="editTime">
          <q-field dense class="col" label="开始时间" :value="times[0]" v-if="times[0]">
            <template v-slot:control>{{times[0]}}</template>
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time
                v-model="times[0]"
                :with-seconds="withSeconds"
                format24h
                @input="modified=true"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="关闭" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-field>
          <q-field dense class="col" label="结束时间" :value="times[1]" v-if="times[1]">
            <template v-slot:control>{{times[1]}}</template>
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time
                v-model="times[1]"
                :with-seconds="withSeconds"
                format24h
                @input="modified=true"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="关闭" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-field>
        </div>
      </co-date>
    </q-popup-proxy>

    <template v-slot:append v-if="!hideDropdownIcon || (clearable && !!inputModel)">
      <q-icon v-if="!disable && clearable && !!inputModel" :name="clearIcon" class="cursor-pointer" @click.prevent.stop="_clearInput"/>
      <q-icon v-else-if="!hideDropdownIcon" :name="dropdownIcon" />
    </template>

    <template v-for="slotName in Object.keys($slots)" v-slot:[slotName]>
      <slot :name="slotName"/>
    </template>

  </co-field>
</template>

<script>
export default {
  name: 'CoDateSelect',
  inheritAttrs: false,
  props: {
    disable: Boolean,
    readonly: Boolean,
    clearable: Boolean,
    useInput: Boolean,
    rules: Array,
    dropdownIcon: {
      type: String,
      default: 'event'
    },
    hideDropdownIcon: Boolean,
    clearIcon: {
      type: String,
      default: 'cancel'
    },
    noClearFocus: {
      type: Boolean,
      default: true
    },
    range: {
      type: Boolean,
      default: false
    },
    rangeSeparator: {
      type: String,
      default: '→'
    },
    dateTimeJoin: {
      type: String,
      default: ' '
    },
    dateTodayBtn: Boolean,
    dateMask: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    dateMinimal: Boolean,
    dateOptions: [Array, Function],
    dateClass: String,
    dateStyle: String,
    dateColor: String,
    dateTextColor: String,
    defaultYearMonth: String,
    navigationMinYearMonth: String,
    navigationMaxYearMonth: String,
    defaultTime: Array,
    editTime: Boolean,
    withSeconds: Boolean
  },
  data () {
    return {
      times: [],
      date: '',
      modified: false
    }
  },
  created() {
    if (Array.isArray(this.defaultTime) && this.defaultTime.length > 0) {
      this.times[0] = this.defaultTime[0]
      if (this.defaultTime.length > 1) {
        this.times[1] = this.defaultTime[1]
      }
    }
  },
  watch: {
    '$attrs.value': {
      handler (val, old) {
        if (!val) {
          this.date = ''
        } else if (typeof val === 'string') {
          this.date = val.substr(0, this.dateMask.length)
        } else {
          // 范围的处理
          this.date = { from: val[0].substr(0, this.dateMask.length), to: val[1].substr(0, this.dateMask.length) }
        }
      },
      immediate: true
    }
  },
  computed: {
    dateModel () {
      if (this.range && this.date) {
        if (this.date.from === this.date.to) {
          return this.date.from
        } else {
          return this.date
        }
      } else {
        return this.date
      }
    },
    inputModel () {
      const newVal = this.date
      let input
      if (this.range) {
        if (!newVal) {
          input = undefined
        } else {
          if (newVal.from) {
            input = newVal.from + this.rangeSeparator + newVal.to
          } else {
            input = newVal + this.rangeSeparator + newVal
          }
        }
      } else {
        if (!newVal) {
          input = undefined
        } else {
          input = newVal + (this.editTime ? (this.dateTimeJoin + this.times[0]) : '')
        }
      }
      /*if (this.disable) {
        return undefined
      }*/
      return input
    },
    listeners: function () {
      const vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 从父级添加所有的监听器
        vm.$listeners,
        // 添加自定义监听器，或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (value) {
          }
        }
      )
    }
  },
  methods: {
    _popupDateBeforeHide() {
      if (this.modified) {
        this._dateInput(this.date)
      }
    },
    ___inputDate(value) {
      this.modified = true
      if (value === null) {
        this.date = ''
      } else {
        this.date = value
        if (!this.range) {
          this._dateInput(this.date)
        }
      }
    },
    _dateInput(value/*, reason, details*/) {
      const newVal = value
      if (this.range && newVal) {
        let time1 = ''
        let time2 = ''
        if (this.times) {
          if (this.times.length >= 1) {
            time1 = this.times[0]
          }
          if (this.times.length >= 2) {
            time2 = this.times[1]
          }
        }
        if (newVal && newVal.from) {
          this.$emit('input', [newVal.from + this.dateTimeJoin + time1, newVal.to + this.dateTimeJoin + time2])
        } else {
          this.$emit('input', [newVal + this.dateTimeJoin + time1, newVal + this.dateTimeJoin + time2])
        }
      } else if (newVal && newVal.length > 0) {
        let time1 = ''
        if (this.times && this.times.length >= 1) {
          time1 = this.times[0]
        }
        this.$refs.popupDate.hide()
        this.$emit('input', newVal + this.dateTimeJoin + time1)
      } else {
        this.$refs.popupDate.hide()
        this.$emit('input', undefined)
      }
    },
    _clearInput(old) {
      this.date = ''
      this.$emit('input', undefined)
    },

    resetValidation () {
      this.$refs.input.resetValidation()
    },
    validate (value) {
      return this.$refs.input.validate(value)
    },
    focus () {
      this.$refs.input.focus()
    },
    blur () {
      this.$refs.input.blur()
    }
  }
}
</script>
