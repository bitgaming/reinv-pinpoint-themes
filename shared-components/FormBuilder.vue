<template>
  <div>
    <q-form
      class="max-width form form-builder"
      @submit="onSubmit"
      @reset="onReset"
      ref="form"
    >
      <div v-for="(field, index) in theFields" :key="index" :class="['row', { 'q-mt-md': index > 0 }]">
        <div v-if="!hideLabelCol && hasLabelCol" :class="[
          'col-3',
          'column',
          'text-right',
          field.type === 'json-object' ? 'justify-start' : 'justify-center',
          field.rules ? 'pb-20' : ''
        ]">
          <q-item class="full-width q-px-none">
            <q-item-section class="break-word q-px-none my-grey">{{ field.label }}</q-item-section>
          </q-item>
        </div>

        <div :class="['col', { 'q-pl-md': !hideLabelCol && hasLabelCol }, 'column', 'justify-center']">
          <component
            v-if="field.type === 'checkbox' || field.type === 'toggle'"
            :is="field.type === 'checkbox' ? 'q-checkbox' : 'q-toggle'"
            v-model="field.value"
            color="primary"
            v-bind="getCommomAttr(field, index)"
            :readonly="field.readonly"
            lazy-rules="ondemand"
            @input="val => field.onInput ? field.onInput(val, theFields) : null"
          />

          <q-select
            v-else-if="field.type === 'select' || field.type === 'multi-select'"
            v-model="field.value"
            v-bind="getCommomAttr(field, index)"
            :options="field.options && typeof field.options === 'function' ? field.options(theFields) : field.options"
            color="primary"
            emit-value
            map-options
            :multiple="field.type === 'multi-select'"
            :readonly="field.readonly"
            @input="val => field.onInput ? field.onInput(val, theFields) : null"
          >
            <template
              v-if="field.type === 'multi-select'"
              v-slot:option="{ itemProps, itemEvents, opt, selected, toggleOption }"
            >
              <q-item
                v-bind="itemProps"
                v-on="itemEvents"
              >
                <q-item-section>
                  <q-item-label v-html="opt.label" ></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle
                    :value="selected"
                    @input="toggleOption(opt)"
                  />
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            v-else-if="field.type === 'select-multiple-chip'"
            v-bind="getCommomAttr(field, index)"
            v-model="field.value"
            use-input
            use-chips
            multiple
            hide-dropdown-icon
            input-debounce="0"
            new-value-mode="add-unique"
          />

          <q-input
            v-else-if="field.type === 'password'"
            v-model="field.value"
            :type="field.hide ? 'password' : 'text'"
            color="primary"
            v-bind="getCommomAttr(field, index)"
            :readonly="field.readonly"
            lazy-rules="ondemand"
          >
            <template v-slot:append>
              <q-btn
                :icon="field.hide ? 'visibility' : 'visibility_off'"
                round
                flat
                @click="field.hide = !field.hide"
              />
            </template>
          </q-input>

          <DatetimeInput
            v-else-if="datetimeType.includes(field.type)"
            v-model="field.value"
            color="primary"
            v-bind="{
              ...getCommomAttr(field, index),
              'stack-label': (!hasLabelCol && (field.type === 'date' || field.type === 'time'))
            }"
          />

          <q-input
            v-else
            v-model="field.value"
            :type="(['email'].includes(field.type) ? 'text' : field.type) || 'text'"
            color="primary"
            v-bind="{
              ...getCommomAttr(field, index),
              'stack-label': (!hasLabelCol && (field.type === 'date' || field.type === 'time'))
            }"
            :readonly="field.readonly"
            lazy-rules="ondemand"
            :autogrow="field.type === 'textarea'"
          />
        </div>
      </div>

      <div
        v-show="!hideActions"
        :class="['row', 'items-center', 'justify-end', 'q-mt-md']"
        :style="{
          padding: '1px'
        }"
      >
        <!-- the 1px padding is a dirty fix for height glitching out when loading is true -->
        <div :class="['q-gutter-x-md', 'q-gutter-y-sm', { 'full-width': fullWidthActions }]">
          <q-btn
            v-if="!hideReset"
            :label="resetBtnText"
            type="reset"
            flat
            dense
            unelevated
            no-caps
            :class="['q-px-sm', 'my-grey', , { 'full-width': fullWidthActions }]"
          />

          <q-btn
            :label="saveBtnText"
            :loading="loading"
            color="primary"
            type="submit"
            unelevated
            dense
            no-caps
            :class="['q-px-sm', { 'full-width': fullWidthActions }]"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import { extend } from 'quasar'
import { util } from 'shared-components/mixins/mixins'

export default {
  name: 'FormBuilder',
  mixins: [util],
  components: {
    DatetimeInput: () => import('components/DatetimeInput.vue')
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    fields: {
      type: Array,
      required: true
    },
    autofocus: {
      type: Boolean,
      required: false
    },
    saveBtnText: {
      type: String,
      default: 'Save'
    },
    resetBtnText: {
      type: String,
      default: 'Reset'
    },
    hideActions: {
      type: Boolean,
      defualt: false
    },
    hideReset: {
      type: Boolean,
      default: false
    },
    hideLabelCol: {
      type: Boolean,
      default: false
    },
    fullWidthActions: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      theFields: this.formatFields(this.fields),
      columns: [
        { name: 'name', label: 'Name', field: 'name', align: 'left' },
        { name: 'value', label: 'Value', field: 'value', align: 'left' }
      ],
      hasLabelCol: true,
      datetimeType: Object.freeze(['date', 'time', 'datetime', 'time_s', 'datetime_s'])
    }
  },
  mounted () {
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  destroyed () {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    validate () {
      return this.$refs.form.validate()
    },
    getCommomAttr (field, index) {
      const attr = {
        autofocus: this.autofocus && index === 0
      }

      if (field.hint) attr.hint = field.hint
      if (field.rules) attr.rules = field.rules
      if (this.hideLabelCol || !this.hasLabelCol) attr.label = field.label

      if (field.type === 'email') {
        const emailRule = v => this.validateEmail(v) || 'Please enter a valid email'
        if (attr.rules) {
          attr.rules = [...attr.rules, emailRule]
        } else {
          attr.rules = [emailRule]
        }
      }

      if (this.datetimeType.includes(field.type)) {
        if (field.type === 'date') attr.withTime = false
        else if (['time', 'time_s'].includes(field.type)) attr.withDate = false

        if (['time_s', 'datetime_s'].includes(field.type)) attr.withSeconds = true
      }

      return attr
    },
    onResize () {
      this.hasLabelCol = this.hideLabelCol ? false : window.innerWidth > 600
    },
    onSubmit () {
      const result = {}

      this.theFields.forEach(({ name, value, type }) => {
        if (type === 'json-object') {
          const val = {}
          value.forEach(v => {
            if (v.name !== undefined && v.value !== undefined) {
              if (!val[v.name]) val[v.name] = []
              val[v.name].push(v.value)
            }
          })
          value = val
        } else if (type === 'number') {
          value = Number(value)
        }
        result[name] = value
      })

      this.$emit('submit', result)
      return result
    },
    onReset () {
      this.theFields = this.formatFields(this.fields)
      this.$refs.form.resetValidation()
    },
    doSubmit () {
      this.$refs.form.submit()
    },
    formatFields (input) {
      const clone = extend(true, [], input)

      clone.forEach(field => {
        if (field.type === 'json-object') {
          const jsonTableData = []
          Object
            .entries(field.value)
            .forEach(([name, value]) => {
              if (Array.isArray(value)) {
                value.forEach(x => {
                  jsonTableData.push({ name, value: x })
                })
              } else {
                jsonTableData.push({ name, value })
              }
            })
          if (jsonTableData.length === 0) jsonTableData.push({ name: undefined, value: undefined })
          field.value = jsonTableData
        } else if (field.type === 'password') {
          field.hide = true
        }
      })

      return clone
    }
  }
}
</script>

<style lang="scss" scoped>
.pb-20 {
  padding-bottom: 20px;
}

.form {
  overflow-x: hidden;
}
</style>

<style lang="scss">
.form-builder {
  .q-field--error .q-field__bottom {
    height: 20px;
    overflow-y: hidden;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {

    -webkit-text-fill-color: #000;
    .body--dark & {
      -webkit-text-fill-color: #fff;
    }

    -webkit-box-shadow: 0 0 0 1000px $dark inset !important;
    transition: background-color 300ms ease-in-out 0s;
  }
  .q-field--outlined .q-field__control:before {
    z-index: 1;
  }
}
</style>
