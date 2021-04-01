<template>
  <div>
    <q-item
      v-if="title"
      dense
      :class="[
        'q-px-none',
        'my-grey-border-color',
        'title'
      ]"
    >
      <q-item-section class="row justify-start">
        <q-item-label class="text-bold">{{ title }}</q-item-label>
      </q-item-section>
    </q-item>

    <div :class="['row', 'my-row', `max-col-${maxCol}`,]">
      <div
        v-for="(data, j) in columns"
        :key="j"
        :class="[
          colClasses[maxCol - 1],
          'block',
          'q-pr-sm',
          'q-pb-sm'
        ]">
        <div :class="[
          'full-height',
          'items-wrapper',
          'my-grey-border-color'
        ]">
          <div
            v-for="({
              name,
              value,
              valueClass,
              valType,
              valStyle,
              valBadgeClasses,
              hideCountryCode,
              tooltipMode,
              copyable,
              editable,
              popupEdit,
              editEvent,
              sideValue,
              sideValType,
              sideValueClass,
              sideStyle,
              sideBadgeClasses,
              sideHideCountryCode,
              sideTooltipMode,
              hideSideParenthesis
            }, i) in data"
            :key="i"
            :class="['q-py-sm', 'my-pr-md', 'item']"
          >
            <div class="my-grey break-word row items-baseline q-mb-xs">
              <div>{{ name }}</div>
            </div>

            <div :class="['break-word', 'value-wrapper', valueClass]">
              <div class="row items-center q-gutter-y-xs">
                <q-icon
                  v-if="value !== maskString && copyable && value"
                  name="las la-copy"
                  size="16px"
                  class="copy-icon cursor-pointer q-mr-xs"
                  @click="copy(value)"
                />

                <key-value-section-helper
                  :val-type="valType"
                  :value="value"
                  :editable="value !== maskString && editable"
                  :val-style="valStyle"
                  :hideCountryCode="hideCountryCode"
                  :badgeClasses="valBadgeClasses"
                  :tooltip-mode="tooltipMode"
                />

                <div v-if="sideValue" :class="['row', 'items-center', 'q-ml-xs', sideValueClass]">
                  <span v-if="!hideSideParenthesis" :style="sideStyle">(</span>
                  <key-value-section-helper
                    :val-type="sideValType"
                    :value="sideValue"
                    :val-style="sideStyle"
                    :hideCountryCode="sideHideCountryCode"
                    :badgeClasses="sideBadgeClasses"
                    :tooltip-mode="sideTooltipMode"
                  />
                  <span v-if="!hideSideParenthesis" :style="sideStyle">)</span>
                </div>

                <q-icon
                  v-if="value !== maskString && editable"
                  name="las la-pen"
                  size="17px"
                  :class="[
                    'edit-icon',
                    'cursor-pointer',
                    { 'q-ml-xs': value || sideValue }
                  ]"
                  color="primary"
                  @click="$emit('edit', { editEvent: editEvent || name, value })"
                >
                  <q-tooltip v-if="$store.state.layout.windowWidth > $store.state.layout.breakpoints[0]">Update</q-tooltip>

                  <q-popup-edit
                    v-if="popupEdit"
                    v-model="localPopupEditValue[popupEdit.name || name]"
                    buttons
                    label-set="Save"
                    label-cancel="Close"
                    :validate="val => onValidate(val, popupEdit)"
                    @before-show="onBeforeShow(popupEdit.value || data[i].value, popupEdit.name || name)"
                    @hide="onHide"
                    @save="(value, initValue) => onSave(value, initValue, popupEdit.name || name)"
                  >
                    <q-toggle
                      v-if="popupEdit.type === 'boolean'"
                      v-model="localPopupEditValue[popupEdit.name || name]"
                      v-bind="getLocalPopupEditAttr(name)"
                    />
                    <q-input
                      v-else-if="popupEdit.type === 'number'"
                      type="number"
                      v-model.number="localPopupEditValue[popupEdit.name || name]"
                      v-bind="getLocalPopupEditAttr(name)"
                    />
                    <q-select
                      v-else-if="popupEdit.type === 'select-multiple-chip'"
                      v-bind="getLocalPopupEditAttr(name)"
                      v-model="localPopupEditValue[popupEdit.name || name]"
                      :options="popupEdit.options || []"
                      use-input
                      use-chips
                      multiple
                      emit-value
                      map-options
                      input-debounce="100"
                      new-value-mode="add-unique"
                      @filter="(val, update) => {
                        if (popupEdit.filterFn) {
                          popupEdit.filterFn(val, update)
                        }
                      }"
                    />
                    <q-input
                      v-else
                      type="text"
                      v-model="localPopupEditValue[popupEdit.name || name]"
                      v-bind="getLocalPopupEditAttr(name)"
                    />
                  </q-popup-edit>
                </q-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getName } from 'country-list'
import { copy } from 'shared-components/mixins/mixins'
// import { extend } from 'quasar'

export default {
  name: 'KeyValueSection',
  mixins: [copy],
  components: {
    KeyValueSectionHelper: () => import('shared-components/KeyValueSectionHelper.vue')
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      required: true
    },
    maxCol: {
      type: Number,
      default: 4,
      validator (val) {
        return val < 5 && val > 0
      }
    }
  },
  data () {
    const localPopupEditValue = {}

    this.columns.forEach(c => {
      c.forEach(item => {
        if (item.popupEdit) {
          const { name, value } = item.popupEdit
          localPopupEditValue[name || item.name] = value || item.value
        }
      })
    })

    return {
      colClasses: [
        'col-12',
        'col-12 col-sm-6',
        'col-12 col-sm-6 col-md-4',
        'col-12 col-sm-6 col-md-4 col-lg-3'
      ],
      maskString: process.env.MASKED_STRING,
      localPopupEdit: {
        input: '',
        error: false,
        errorMessage: ''
      },
      localPopupEditValue
    }
  },
  methods: {
    getLocalPopupEditAttr (name) {
      return {
        label: name,
        error: this.localPopupEdit.error,
        'error-message': this.localPopupEdit.errorMessage,
        dense: true,
        autofocus: true
      }
    },
    getCountryName (val) {
      return getName(val)
    },
    onValidate (value, popupEdit) {
      const { validate } = popupEdit
      if (validate) {
        const result = validate(value)
        if (typeof result === 'string') {
          this.localPopupEdit.errorMessage = result
          this.localPopupEdit.error = true
          return false
        }

        this.localPopupEdit.errorMessage = ''
        this.localPopupEdit.error = false
        return true
      } else {
        this.localPopupEdit.errorMessage = ''
        this.localPopupEdit.error = false
        return true
      }
    },
    onSave (value, initialValue, name) {
      this.$emit('save', {
        name,
        value,
        initialValue
      })
    },
    onBeforeShow (initValue, name) {
      // this.localPopupEdit.input = initValue
      this.localPopupEditValue[name] = initValue
      this.localPopupEdit.error = false
      this.localPopupEdit.errorMessage = ''
    },
    onHide (name) {
      // this.localPopupEdit.input = ''
      this.localPopupEditValue[name] = ''
      this.localPopupEdit.error = false
      this.localPopupEdit.errorMessage = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  border-bottom-style: solid;
  border-bottom-width: 1px;
}

@mixin md-border {
  &:nth-child(2) {
    .items-wrapper {
      border-top-width: 0;
    }
  }

  &:nth-child(2n - 1) {
    .items-wrapper {
      border-right-width: 1px;
    }
  }
}

@mixin lg-border {
  &:nth-child(2),
  &:nth-child(3) {
    .items-wrapper {
      border-top-width: 0;
    }
  }

  &:nth-child(3n - 1),
  &:nth-child(3n - 2) {
    .items-wrapper {
      border-right-width: 1px;
    }
  }
}

.block {
  .items-wrapper {
    border-style: solid;
    border-width: 0 0 0 0;

    .item {
      min-height: 65px;
    }
  }

  &:not(:first-child) {
    .items-wrapper {
      border-top-width: 1px;
    }
  }

  .max-col-2 & {
    @media (min-width: $breakpoint-sm-min) {
      @include md-border;
    }
  }

  .max-col-3 & {
    @media (min-width: $breakpoint-sm-min) and (max-width: $breakpoint-sm-max) {
      @include md-border;
    }

    @media (min-width: $breakpoint-md-min) {
      @include lg-border;
    }
  }

  .max-col-4 & {
    @media (min-width: $breakpoint-sm-min) and (max-width: $breakpoint-sm-max) {
      @include md-border;
    }

    @media (min-width: $breakpoint-md-min) and (max-width: $breakpoint-md-max) {
      @include lg-border;
    }

    @media (min-width: $breakpoint-lg-min) {
      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4) {
        .items-wrapper {
          border-top-width: 0;
        }
      }

      &:nth-child(4n - 1),
      &:nth-child(4n - 2),
      &:nth-child(4n - 3) {
        .items-wrapper {
          border-right-width: 1px;
        }
      }
    }
  }
}
</style>
