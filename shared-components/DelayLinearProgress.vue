<template>
  <fragment>
    <q-linear-progress :value="delayDone ? value : 0" :rounded="rounded" />
  </fragment>
</template>

<script>
export default {
  name: 'DelayLinearProgress',
  props: {
    value: {
      type: Number,
      default: 0
    },
    delay: {
      type: Number,
      default: 200
    },
    extraDelay: {
      type: Number,
      default: 0
    },
    rounded: {
      tpye: Boolean,
      default: false
    }
  },
  data () {
    return {
      delayDone: false,
      timeout: null
    }
  },
  mounted () {
    this.timeout = setTimeout(() => {
      this.delayDone = true
    }, this.delay + this.extraDelay)
  },
  destroyed () {
    clearTimeout(this.timeout)
  }
}
</script>
