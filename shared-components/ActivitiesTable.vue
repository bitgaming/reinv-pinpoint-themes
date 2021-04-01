<template>
  <q-table
    :data="activities"
    :columns="columns || activitiesColumns"
    row-key="name"
    class="no-shadow"
    dense
    :rows-per-page-options="[0]"
    hide-pagination
    :visible-columns="visibleColumns || allCol"
    :bordered="bordered"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
        >
          <country-item
            v-if="col.field === 'country' && col.value"
            :value="col.value"
            classes="my-grey"
          />

          <ua-item
            v-else-if="col.field === 'userAgent' && col.value"
            :ua="col.value"
            classes="my-grey"
          />

          <div v-else-if="col.type === 'datetimeTooltip'" class="my-grey">
            {{ col.value && Number(col.value) !== 0 ? unixDiffNowUTC(col.value) : '-' }}
            <q-tooltip v-if="col.value && Number(col.value) !== 0">
              {{ unixToCalendar(col.value) }}
            </q-tooltip>
          </div>

          <div v-else :class="[{
            'text-positive': typeof col.value === 'boolean' && col.value,
            'q-py-none': typeof col.value === 'boolean' && col.value
          }]">
            <q-icon
              v-if="typeof col.value === 'boolean' && col.value"
              :name="booleanIcons[col.name] || 'las la-check-circle'"
              :class="booleanClasses[col.name] || 'text-positive'"
              size="xs"
            />
            <div v-else>
              {{ col.value || '-' }}
              <q-tooltip v-if="col.field === 'name' && col.value === 'Login'">Last Login Info</q-tooltip>
            </div>
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { vMoment, localeCodeToEng } from 'shared-components/mixins/mixins'

export default {
  name: 'PlayerProfileActivitiesTable',
  mixins: [vMoment, localeCodeToEng],
  components: {
    UaItem: () => import('shared-components/UaItem.vue'),
    CountryItem: () => import('shared-components/CountryItem.vue')
  },
  props: {
    activities: {
      type: Array,
      required: true
    },
    visibleColumns: {
      type: Array,
      default: null
    },
    columns: {
      type: Array,
      default: null
    },
    bordered: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    allCol () {
      return (this.columns || this.activitiesColumns).map(x => x.name)
    },
    activitiesColumns () {
      const commonProps = { align: 'left', sortable: true }

      const activitiesColumns = [
        { name: 'name', label: '', field: 'name', ...commonProps, classes: 'black-white text-weight-medium' },
        { name: 'country', label: 'Country', field: 'country', ...commonProps },
        { name: 'datetime', label: 'Datetime', field: 'datetime', type: 'datetimeTooltip', ...commonProps },
        { name: 'ip', label: 'IP', field: 'ip', ...commonProps },
        { name: 'device', label: 'Device', field: 'device', ...commonProps },
        { name: 'language', label: 'Language', field: 'language', ...commonProps, format: val => val ? this.localeCodeToEnglish(val) : val },
        { name: 'userAgent', label: 'User Agent', field: 'userAgent', ...commonProps }
      ]
      return this.columns || activitiesColumns
    }
  }
}
</script>
