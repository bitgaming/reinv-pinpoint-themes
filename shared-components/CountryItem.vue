<template>
  <q-item class="q-pa-none min-height-unset" dense>
    <q-item-section :class="[{ 'q-pr-sm': !tooltipMode }]" :avatar="!tooltipMode">
      <q-avatar size="xs" :class="[`flag:${value}`, 'my-grey-solid-shadow']" />

      <q-tooltip v-if="tooltipMode">
        <div class="row no-wrap items-baseline">
          <div v-if="!hideCountryCode" class="roboto-mono">{{ value }}</div>
          <div v-if="!hideCountryCode">&nbsp;-&nbsp;{{ getCountryName(value) }}</div>
          <span v-else>{{ getCountryName(value) }}</span>
        </div>
      </q-tooltip>
    </q-item-section>

    <q-item-section v-if="!tooltipMode" :class="[classes]">
      <div class="row no-wrap items-baseline">
        <div v-if="!hideCountryCode" class="roboto-mono">{{ value }}</div>
        <div v-if="!hideCountryCode">&nbsp;-&nbsp;{{ getCountryName(value) }}</div>
        <span v-else>{{ getCountryName(value) }}</span>
      </div>
    </q-item-section>
  </q-item>
</template>

<script>
import { getName } from 'country-list'

export default {
  name: 'CountryItem',
  props: {
    value: {
      type: String,
      required: true
    },
    classes: {
      type: [String, Array, Object],
      default: ''
    },
    hideCountryCode: {
      type: Boolean,
      default: false
    },
    tooltipMode: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getCountryName (val) {
      return getName(val)
    }
  }
}
</script>
