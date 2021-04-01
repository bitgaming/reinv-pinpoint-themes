<template>
  <div :class="['full-width']" :style="wrapperStyle">
    <q-item v-if="title" dense>
      <q-item-section>
        <q-item-label :class="titleClass">
          {{ title }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-table
      dense
      :data="data"
      :columns="columns"
      :row-key="rowKey"
      :pagination="pagination"
      :rows-per-page-options="[0]"
      :class="['custom-loading', 'sticky-header-table', classes]"
      color="primary"
      :bordered="bordered"
      :loading="loading"
      :table-style="tableStyle"
      :hide-pagination="hidePagination"
      :visible-columns="visibleColumns || allColNames"
      :virtual-scroll="virtualScroll"
      v-bind="customSort ? {
        sortMethod: customSort
      } : {}"
    >
      <template v-slot:loading>
        <StickyTableLoading />
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <!-- ok / error / denied status -->
          <q-th v-if="!hideStatusBar" class="status" auto-width />

          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
<!-- 'selected': highlight === props.rowIndex -->
      <template v-slot:body="props">
        <q-tr
          :props="props"
          :class="[{
            'cursor-pointer': !disableRowClick,
            'selected': highlight === (typeof rowKey === 'function' ? rowKey(props.row) : props.row[rowKey] || props.rowIndex)
          }]"
          @click="_ => {
            if (disableRowClick) return
            if (expandable) props.expand = !props.expand
            else if (!disableDrawer) onRowClick(props.row, props.rowIndex)
            highlight = (typeof rowKey === 'function' ? rowKey(props.row) : props.row[rowKey] || props.rowIndex)
            $emit('row-click', { row: props.row, index: props.rowIndex })
          }"
        >
          <!-- ok / error / denied status -->
          <q-td v-if="!hideStatusBar" class="table-status-bar" auto-width>
            <status-bar
              :status="statusBarStatus(props.row)"
              :strokeWidth="5"
              rounded
              :tooltipText="statusBarTooltips"
            />
          </q-td>

          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            :auto-width="col.autoWidth"
          >
            <q-tooltip v-if="col.tooltip">{{ col.tooltip }}</q-tooltip>

            <id
              v-if="col.type === 'id' && col.value"
              :id="col.value"
              :border="false"
              :classes="`pl-none ellipsis ${!noMaxWidth ? 'max-w-500' : ''} ${col.classes}`"
              :copy-btn="col.copyBtn"
            />

            <delay-linear-progress
              v-else-if="col.type === 'linearProgress'"
              :value="col.value || 0"
              :extra-delay="props.rowIndex * 50"
              rounded
            />

            <q-toggle
              v-else-if="col.type === 'toggle'"
              :value="col.value"
              :label="typeof col.toggelLabel === 'function' ? col.toggelLabel(col.value, props.row) : col.toggelLabel"
              dense
              @input="col.onInput ? col.onInput(col.value, props.row) : null"
            />

            <q-btn
              v-else-if="col.type === 'button'"
              :label="typeof col.btnLabel === 'function' ? col.btnLabel(col.value, props.row) : col.btnLabel"
              :icon="typeof col.btnIcon === 'function' ? col.btnIcon(col.value, props.row) : col.btnIcon"
              dense
              flat
              @click.stop="col.onInput ? col.onInput(col.value, props.row) : null"
            />

            <q-item
              v-else-if="col.type === 'withImgAvatar'"
              :class="[col.classes, 'q-pa-none', 'min-height-unset']"
              dense
            >
              <q-item-section :avatar="!col.hideValue">
                <q-avatar size="18px">
                  <img :src="typeof col.src === 'function' ? col.src(col.value) : col.src">
                </q-avatar>
              </q-item-section>

              <q-item-section v-if="!col.hideValue">
                <q-item-label>
                  {{ col.value }}
                </q-item-label>
              </q-item-section>

              <q-tooltip v-if="col.showTooltip">{{ col.value }}</q-tooltip>
            </q-item>

            <q-badge
              v-else-if="col.type === 'status' && col.value"
              :outline="false"
              :label="col.value"
              :class="[
                'no-border',
                'id--half-transparent',
                (
                  col.statusClasses ?
                    (typeof col.statusClasses === 'function' ? col.statusClasses(col.value) : col.statusClasses) :
                    (col.value === 'OK' ? 'text-positive' : (col.value === 'Error' ? 'text-negative' : 'text-warning'))
                )
              ]"
              multi-line
            />

            <vip-status
              v-else-if="col.type === 'vipStatus' && col.value && col.value !== 'none'"
              :value="col.value"
              class="min-height-unset"
            />

            <div v-else-if="col.type === 'datetimeTooltip'">
              <template v-if="col.value && Number(col.value) !== 0">
                {{ unixDiffNowUTC(col.value) }}
                <q-tooltip>
                  {{ unixToCalendar(col.value) }}
                </q-tooltip>
              </template>
              <div v-else>-</div>
            </div>

            <div v-else-if="col.type === 'datestringTooltip'">
              <template v-if="col.value">
                {{ dateStrDiffNowUTC(col.value) }}
                <q-tooltip>
                  {{ dateStrToCalendar(col.value) }}
                </q-tooltip>
              </template>
              <div v-else>-</div>
            </div>

            <div v-else-if="col.type === 'datestringFormat'">
              <template v-if="col.value">
                {{ dateStrFormat(col.value, col.dateFormat) }}
                <q-tooltip>
                  {{ dateStrToCalendar(col.value) }}
                </q-tooltip>
              </template>
              <div v-else>-</div>
            </div>

            <template v-else-if="col.type === 'country'">
              <country-item v-if="col.value" :value="col.value" :classes="col.classes" />
              <div v-else>-</div>
            </template>

            <ua-item
              v-else-if="col.type === 'userAgent' && col.value"
              :ua="col.value"
              :classes="[col.classes]"
            />

            <template v-else-if="col.type === 'lastIpCheck' && col.value">
              <last-ip-check-item
                v-if="typeof col.value === 'object'"
                :lastIpCheck="col.value"
                :classes="[col.classes]"
              />
              <div v-else>{{ col.value }}</div>
            </template>

            <template v-else-if="col.type === 'badge' && col.value">
              <div class="row items-center no-wrap">
                <q-badge
                  :outline="false"
                  :label="col.value"
                  :class="[
                    'no-border',
                    'id--half-transparent',
                    typeof col.badgeClasses === 'function' ? col.badgeClasses(col.value) : col.badgeClasses
                  ]"
                  multi-line
                />
                <div v-if="col.append" class="q-pl-xs">{{ typeof col.append === 'function' ? col.append(props.row) : col.append }}</div>
              </div>
            </template>

            <json-item
              v-else-if="col.type === 'json' && typeof col.value === 'object'"
              :label="col.value | stringify"
              :json="col.value"
            />

            <div
              v-else
              :class="[
                'ellipsis',
                {
                  'max-w-500': !noMaxWidth,
                  'text-positive': typeof col.value === 'boolean' && col.value,
                  'q-py-none': typeof col.value === 'boolean' && col.value
                }
              ]"
            >
              <q-icon
                v-if="typeof col.value === 'boolean' && (col.value || col.showFalse)"
                :name="col.value ? 'las la-check-circle' : 'las la-times-circle'"
                :class="col.value ? 'text-positive' : 'text-negative'"
                size="xs"
              />
              <div
                v-else
                :class="[
                  'ellipsis',
                  (col.customClasses ? (typeof col.customClasses === 'function' ? col.customClasses(col.value) : col.customClasses) : '')
                ]"
              >
                {{ col.showZero ? col.value : (col.value || '-') }}
              </div>
            </div>
          </q-td>
        </q-tr>

        <q-tr v-if="expandable" v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <my-vue-json-pretty :data="props.row" highlightMouseoverNode showLength :deep="expandableDeep" />
          </q-td>
        </q-tr>
      </template>

      <template v-slot:pagination>
        <my-pagination
          :count="data.length"
          :rowsPerPage="rowsPerPage"
          :rowsPerPageOptions="rowsPerPageOptions"
          :pageNumber="pageNumber"
          :paginationBtns="paginationBtns || pagBtns"
          :disabled="loading"
          :hide-row-per-page-select="hideRowPerPageSelect"
          :hide-page-number="hidePageNumber"
          :hide-nav-btns="hideNavBtns"
          @change-rows-per-page="val => $emit('change-rows-per-page', val)"
          @first="$emit('first')"
          @prev="$emit('prev')"
          @next="$emit('next')"
          @last="$emit('last')"
        />
      </template>

      <!-- this slot is a workaround for showing pagination when table data is empty -->
      <template v-slot:no-data="props">
        <q-item v-if="pageNumber === 1" class="min-height-unset my-pagination my-px-sm-md" dense>
          <q-item-section avatar>
            <q-icon :name="props.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ props.message }}</q-item-label>
          </q-item-section>
        </q-item>

        <template v-else>
          <div class="column full-width">
            <div class="col">
              <q-item class="min-height-unset my-pagination my-px-sm-md" dense>
                <q-item-section avatar>
                  <q-icon :name="props.icon" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ props.message }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <q-separator />

            <div class="col row justify-end">
              <my-pagination
                :count="data.length"
                :rowsPerPage="rowsPerPage"
                :rowsPerPageOptions="rowsPerPageOptions"
                :pageNumber="pageNumber"
                :paginationBtns="paginationBtns || pagBtns"
                :disabled="loading"
                :hide-row-per-page-select="hideRowPerPageSelect"
                :hide-page-number="hidePageNumber"
                :hide-nav-btns="hideNavBtns"
                @change-rows-per-page="val => $emit('change-rows-per-page', val)"
                @first="$emit('first')"
                @prev="$emit('prev')"
                @next="$emit('next')"
                @last="$emit('last')"
              />
            </div>
          </div>
        </template>
      </template>
    </q-table>
  </div>
</template>

<script>
import { vMoment } from 'shared-components/mixins/mixins'

export default {
  name: 'EventsTable',
  mixins: [vMoment],
  components: {
    StickyTableLoading: () => import('components/StickyTableLoading.vue'),
    MyVueJsonPretty: () => import('shared-components/MyVueJsonPretty.vue'),
    Id: () => import('shared-components/Id.vue'),
    VipStatus: () => import('components/VipStatus.vue'),
    UaItem: () => import('shared-components/UaItem.vue'),
    LastIpCheckItem: () => import('shared-components/LastIpCheckItem.vue'),
    DelayLinearProgress: () => import('shared-components/DelayLinearProgress.vue'),
    StatusBar: () => import('components/StatusBar.vue'),
    MyPagination: () => import('shared-components/MyPagination.vue'),
    CountryItem: () => import('shared-components/CountryItem.vue'),
    JsonItem: () => import('shared-components/JsonItem.vue')
  },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    rowKey: {
      type: [String, Function],
      default: 'eventId'
    },
    bordered: {
      type: Boolean,
      default: false
    },
    classes: {
      type: String,
      default: ''
    },
    pagination: {
      type: Object,
      default () {
        return {
          rowsPerPage: 0
        }
      }
    },
    hidePagination: {
      type: Boolean,
      default: false
    },
    rowsPerPage: {
      type: Number,
      default: 25
    },
    rowsPerPageOptions: {
      type: Array,
      default () {
        return [15, 25, 50, 100]
      }
    },
    pageNumber: {
      type: Number,
      default: 1
    },
    customSort: {
      type: Function,
      default: null
    },
    expandable: {
      type: Boolean,
      default: false
    },
    disableRowClick: {
      type: Boolean,
      default: false
    },
    disableDrawer: {
      type: Boolean,
      default: false
    },
    hideStatusBar: {
      type: Boolean,
      default: false
    },
    statusBarStatus: {
      type: Function,
      default: row => {
        if (row.event) {
          try {
            return row.event.includes('.ok') ? 'active' : row.event.includes('.error') ? 'deactivated' : 'warning'
          } catch (err) {
            if (process.env.ENV !== 'prod') {
              console.log(row)
              console.error(err)
            }
          }
        } else {
          return 'active'
        }
      }
    },
    statusBarTooltips: {
      type: Object,
      default () {
        return {
          active: 'OK',
          deactivated: 'Error',
          warning: 'Denied'
        }
      }
    },
    visibleColumns: {
      type: Array,
      default: null
    },
    paginationBtns: {
      type: Array,
      default: null
    },
    openDetailDrawerData: {
      type: Function,
      default (row) {
        return {
          json: { ...row, tenantId: this.$store.state.auth.tenant },
          key: `${this.$store.state.auth.tenant}-${row.eventId}`,
          id: row.eventId,
          status: row.event.endsWith('.ok') ? 'active' : row.event.endsWith('.error') ? 'deactivated' : 'warning',
          title: 'Event ID'
        }
      }
    },
    virtualScroll: {
      type: Boolean,
      default: false
    },
    wrapperStyle: {
      type: [String, Object],
      default: null
    },
    tableStyle: {
      type: [String, Object],
      default () {
        return { 'max-height': 'calc(100vh - 300px)' }
      }
    },
    hideRowPerPageSelect: {
      type: Boolean,
      default: false
    },
    hidePageNumber: {
      type: Boolean,
      default: false
    },
    hideNavBtns: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    titleClass: {
      type: [String, Array, Object],
      default: ''
    },
    expandableDeep: {
      type: Number,
      default: Number.MAX_VALUE
    },
    noMaxWidth: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      booleanIcons: {},
      booleanClasses: {},
      highlight: '',
      pagBtns: [
        { icon: 'las la-angle-double-left', event: 'first', disable: this.disableFirst },
        { icon: 'las la-angle-left', event: 'prev', disable: this.disableFirst },
        { icon: 'las la-angle-right', event: 'next', disable: this.disableNext }
      ]
    }
  },
  computed: {
    allColNames () {
      return this.columns.map(x => x.name)
    }
  },
  watch: {
    '$store.state.layout.showDetailDrawer': {
      handler (val) {
        if (!val) this.highlight = ''
      }
    }
  },
  methods: {
    onRowClick (row) {
      this.$store.dispatch('layout/openDetailDrawer', {
        type: 'JSON',
        data: this.openDetailDrawerData(row)
      })
    },
    disableFirst () {
      return this.pageNumber === 1
    },
    disableNext () {
      return this.rowsPerPage !== this.data.length
    }
  },
  filters: {
    stringify (json) {
      return JSON.stringify(json)
    }
  }
}
</script>
