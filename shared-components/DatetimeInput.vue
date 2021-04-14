<template>
  <q-input
    :dense="dense"
    :value="value"
    :color="_color"
    :mask="_inputMask"
    :rules="rules"
    lazy-rules="ondemand"
    :autofocus="autofocus"
    :outlined="outlined"
    @input="onInput"
  >
    <template v-if="withDate" v-slot:prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date :value="value" @input="onInput" :mask="_datetimeMask" :color="_color">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" :color="_color" flat dense />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>

    <template v-if="withTime" v-slot:append>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-time
            :value="value"
            @input="onInput"
            :mask="_datetimeMask"
            format24h
            :color="_color"
            v-bind="{
              ...( withSeconds ? { 'with-seconds' : true } : {} )
            }"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" :color="_color" flat dense />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
export default {
  name: 'DatetimeInput',
  props: {
    value: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    withSeconds: {
      type: Boolean,
      default: false
    },
    withTime: {
      type: Boolean,
      default: true
    },
    withDate: {
      type: Boolean,
      default: true
    },
    rules: {
      type: Array,
      default () {
        return undefined
      }
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    _color () {
      return !this.color || this.color === 'primary' ? 'primary' : this.color
    },
    _inputMask () {
      return this._datetimeMask.replace(/[a-zA-Z]/ig, '#')
    },
    _datetimeMask () {
      let mask = this.withTime ? this.withSeconds ? process.env.DATETIME_FORMAT : process.env.SIMPLE_DATETIME_FORMAT : process.env.DATE_FORMAT
      if (!this.withDate) mask = mask.replace(process.env.DATE_FORMAT, '').trim()
      return mask
    }
  },
  methods: {
    onInput (value) {
      this.$emit('input', value)
    }
  }
}
</script>
