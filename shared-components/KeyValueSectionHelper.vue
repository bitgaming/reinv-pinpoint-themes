<template>
  <div :class="[
    'row',
    'items-center',
    {
      'full-width': valType === 'ua-item' || (!valType && value && typeof value ==='object')
    }
  ]">
    <template v-if="valType === 'country'">
      <country-item v-if="value" :value="value" :hide-country-code="hideCountryCode" :tooltip-mode="tooltipMode" />
      <div v-else-if="!editable" class="my-grey">-</div>
    </template>

    <template v-else-if="valType === 'id'">
      <id
        v-if="value"
        :id="value"
        :copyBtn="false"
        :outline="false"
        v-bind="{
          ...(to ? { to } : {})
        }"
      />
      <div v-else-if="!editable" class="my-grey">-</div>
    </template>

    <template v-else-if="valType === 'badge'">
      <q-badge
        v-if="value"
        :outline="false"
        :label="value"
        :class="[
          'no-border',
          'id--half-transparent',
          badgeClasses
        ]"
        multi-line
      />
      <div v-else-if="!editable" class="my-grey">-</div>
    </template>

    <!-- <template v-else-if="valType === 'a'">
      <a v-if="value" :href="`//${value}`" target="_blank">{{ value }}</a>
      <div v-else-if="!editable" class="my-grey">-</div>
    </template> -->

    <template v-else-if="valType === 'vip-status'">
      <vip-status v-if="value && value !== 'none'" :value="value" class="min-height-unset" />
      <div v-else-if="!editable" class="my-grey">-</div>
    </template>

    <template v-else-if="valType === 'ua-item'">
      <ua-item v-if="value" :ua="value" />
      <div v-else-if="!editable" class="my-grey">-</div>
    </template>

    <template v-else-if="valType === 'last-ip-check-item'">
      <last-ip-check-item v-if="value" :last-ip-check="value" />
      <div v-else-if="!editable" class="my-grey">-</div>
    </template>

    <template v-else-if="valType === 'datetime-tooltip'">
      <div v-if="value && Number(value) !== 0">
        {{ unixDiffNowUTC(value) }}
      </div>
      <q-tooltip v-if="value && Number(value) !== 0">
        {{ unixToCalendar(value) }}
      </q-tooltip>
      <div v-else-if="!editable" class="my-grey">-</div>
    </template>

    <template v-else-if="valType === 'datestring-tooltip'">
      <div v-if="value && Date.parse(value)">
        {{ dateStrDiffNowUTC(value) }}
      </div>
      <q-tooltip v-if="value && Date.parse(value)">
        {{ dateStrToCalendar(value) }}
      </q-tooltip>
      <div v-else-if="!editable" class="my-grey">-</div>
    </template>

    <template v-else-if="value && typeof value === 'object'">
      <my-vue-json-pretty
        :data="value"
        highlightMouseoverNode
        showLength
        :showDoubleQuotes="false"
      />
    </template>

    <span v-else-if="value" class="break-word" :style="valStyle">{{ value }}</span>
    <div v-else-if="!editable" class="my-grey">-</div>
  </div>
</template>

<script>
import { copy, vMoment } from 'shared-components/mixins/mixins'

export default {
  name: 'KeyValueSectionHelper',
  mixins: [copy, vMoment],
  components: {
    MyVueJsonPretty: () => import('shared-components/MyVueJsonPretty.vue'),
    VipStatus: () => import('components/VipStatus.vue'),
    UaItem: () => import('shared-components/UaItem.vue'),
    LastIpCheckItem: () => import('shared-components/LastIpCheckItem.vue'),
    CountryItem: () => import('shared-components/CountryItem.vue'),
    Id: () => import('shared-components/Id.vue')
  },
  props: {
    valType: {
      type: String,
      default: ''
    },
    value: {
      type: [Number, Object, String, Boolean, Array],
      default: null
    },
    editable: {
      type: Boolean,
      default: false
    },
    hideCountryCode: {
      type: Boolean,
      default: false
    },
    valStyle: {
      type: Object,
      default: null
    },
    badgeClasses: {
      type: String,
      default: ''
    },
    tooltipMode: {
      type: Boolean,
      default: false
    },
    to: {
      type: String,
      default: ''
    }
  }
}
</script>
