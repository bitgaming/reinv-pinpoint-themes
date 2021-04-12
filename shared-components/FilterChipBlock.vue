<template>
  <div class="row items-center wrapper">
    <q-item class="q-pl-none my-grey" dense>
      <q-item-section>
        <q-icon name="las la-filter" size="sm" />
      </q-item-section>
    </q-item>

    <q-chip
      v-for="(x, i) in filters"
      :key="i"
      removable
      @remove="onRemove(x)"
      :icon-remove="getChipIcon(x)"
      color="primary"
    >
      <div class="ellipsis">{{ formatChip(x) }}</div>
    </q-chip>

    <q-btn
      v-if="nameOptions.length"
      flat
      no-caps
      dense
      icon="las la-plus"
      label="NEW"
      class="my-grey"
      :loading="loading"
      @click="onNew"
    />

    <q-dialog ref="dialog" @hide="onHide">
      <q-card class="card">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ dialogTitle }}</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <div v-if="!(target && target.nonremovable)">
            <div class="text-bold">Type</div>
            <div class="q-gutter-sm">
              <q-radio
                v-for="(x, i) in nameOptions"
                :key="i"
                v-model="name"
                v-bind="x"
                @input="operator = ''"
              />
            </div>
          </div>

          <q-slide-transition>
            <div v-if="!skipCompare && name && !['boolean', 'radio', 'select'].includes(valueType)">
              <div class="text-bold">Compare</div>
              <div class="q-gutter-sm">
                <q-radio
                  v-for="(x, i) in operatorOptions"
                  :key="i"
                  v-model="operator"
                  v-bind="x"
                  @input="value = ''"
                />
              </div>
            </div>
          </q-slide-transition>

          <q-slide-transition>
            <div v-show="skipCompare || operator || (name && ['boolean', 'radio', 'select'].includes(valueType))">
              <div class="text-bold">Value</div>

              <datetime-input v-if="valueType === 'datetime'" v-model="value" with-seconds />

              <div v-else-if="valueType === 'boolean'">
                <q-radio v-model="value" label="Yes" :val="true" />
                <q-radio v-model="value" label="No" :val="false" />
              </div>

              <q-scroll-area
                v-else-if="valueType === 'radio'"
                :style="{
                  'height': '15vh'
                }"
                :thumb-style="thumbStyleHor"
              >
                <div class="row">
                  <q-radio
                    v-for="(o, oIndex) in operatorOptions"
                    :key="oIndex"
                    v-model="value"
                    :label="o.label"
                    :val="o.val"
                    class="col-12"
                  />
                </div>
              </q-scroll-area>

              <q-select
                v-else-if="valueType === 'select'"
                :key="target.name"
                color="primary"
                :label="target.displayName"
                v-model="value"
                :options="operatorOptions"
                emit-value
                map-options
                :menu-offset="[15, 0]"
                :use-input="target.useInput"
                @filter="target.filterFn"
              >
                <template v-slot:option="scope">
                  <slot :name="`select-option-${target.name}`" v-bind="scope">
                    <q-item
                      v-bind="scope.itemProps"
                      v-on="scope.itemEvents"
                    >
                      <q-item-section>
                        <q-item-label v-html="scope.opt.label" />
                      </q-item-section>
                    </q-item>
                  </slot>
                </template>
              </q-select>

              <q-input
                v-else
                v-model="value"
                :type="valueType"
                v-bind="{
                  ...(
                    target && target.rules ? {
                      rules: target.rules,
                      'lazy-rules': 'ondemand'
                    } : {}
                  )
                }"
                @keyup.enter="onApply"
                ref="input"
              />
            </div>
          </q-slide-transition>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancel" unelevated @click="onCancel" no-caps />
          <q-btn label="Apply" color="primary" unelevated @click="onApply" :disable="!isReady()" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { thumbStyle } from 'shared-components/mixins/mixins'

export default {
  mixins: [thumbStyle],
  components: {
    DatetimeInput: () => import('components/DatetimeInput.vue')
  },
  props: {
    filters: {
      type: Array,
      require: true
    },
    createFilterOptions: {
      type: Array,
      require: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      name: '',
      operator: null,
      value: null
    }
  },
  watch: {
    name () {
      this.operator = ''
      this.value = ''
    }
  },
  computed: {
    nameOptions () {
      return this.createFilterOptions
        .filter(x => !x.nonremovable)
        .map(x => ({ val: x.name, label: x.displayName }))
    },
    target () {
      return this.createFilterOptions.find(x => x.name === this.name)
    },
    operatorOptions () {
      return this.target ? this.target.operators : []
    },
    valueType () {
      return this.target ? this.target.type : ''
    },
    dialogTitle () {
      if (this.target) {
        return this.target.dialogTitle || `${this.target.nonremovable ? 'Update' : 'New'}  Filter`
      }
      return 'New Filter'
    },
    skipCompare () {
      return this.target ? this.target.skipCompare : false
    }
  },
  methods: {
    onNew () {
      this.$emit('new')
      this.$refs.dialog.show()
    },
    onRemove (val) {
      const target = this.createFilterOptions.find(x => x.name === val.field)
      if (target.nonremovable) {
        this.name = target.name
        this.value = val.value
        this.$refs.dialog.show()
      } else {
        this.$emit('remove', val)
      }
    },
    onHide () {
      this.reset()
    },
    onCancel () {
      this.$refs.dialog.hide()
      this.reset()
    },
    reset () {
      this.name = ''
      this.operator = ''
      this.value = ''
    },
    isReady () {
      return !!('' + this.value)
    },
    onApply () {
      if (!this.isReady()) return
      if (this.$refs.input) {
        const result = this.$refs.input.validate()
        if (result === false) return
      }

      this.$emit(this.target.nonremovable ? 'update' : 'add', {
        field: this.name,
        condition: this.target.type === 'boolean' ? '=' : this.operator,
        value: this.target.formatVal ? this.target.formatVal(this.value) : this.value
      })

      this.onCancel()
    },
    formatChip (val) {
      const target = this.createFilterOptions.find(x => x.name === val.field)
      const name = target.chipPrefix || target.displayName || val.field
      const value = target.formatValDisplay ? target.formatValDisplay(val.value) : val.value

      if (target.type === 'radio') {
        return `${target.chipPrefix}${value}`
      } if (target.type === 'select') {
        return `${name}: ${value}`
      } else {
        return `${name} ${val.condition} ${value}`
      }
    },
    getChipIcon (val) {
      const target = this.createFilterOptions.find(x => x.name === val.field)
      return target.nonremovable ? 'las la-pen' : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  width: 500px;
}

.wrapper {
  min-height: 36px;
}
</style>
