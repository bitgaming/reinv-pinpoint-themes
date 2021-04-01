
<template>
  <item-menu
    :icon-left="getIconLeft(ua)"
    :label="ua ? getUaBrowserIcon(ua.browser ? ua.browser.name : '') ? ua.browser.name : ua.ua ? ua.ua.split(' ')[0].split('/')[0] : ua.ua || null : null"
    :menu-data="data"
    :classes="classes"
  />
</template>

<script>
export default {
  name: 'UaItem',
  components: {
    ItemMenu: () => import('shared-components/ItemMenu.vue')
  },
  props: {
    ua: {
      type: Object,
      require: true
    },
    classes: {
      type: [String, Array, Object],
      default: ''
    }
  },
  data () {
    return {
      openTimeout: null,
      closeTimeout: null,
      menu: false
    }
  },
  computed: {
    data () {
      const {
        ua,
        browser,
        engine,
        os,
        device,
        cpu
      } = this.ua

      const {
        name: bName,
        version: bVersion
      } = (browser || {})

      const {
        name: eName,
        version: eVersion
      } = (engine || {})

      const {
        name: oName,
        version: oVersion
      } = (os || {})

      const {
        model: dModel,
        type: dType,
        vendor: dVendor
      } = (device || {})

      const {
        architecture: cArchitecture
      } = (cpu || {})

      return [
        { name: 'User Agent', value: ua },
        { name: 'Brower', value: bName },
        { name: 'Brower Version', value: bVersion },
        { name: 'Engine', value: eName },
        { name: 'Engine Version', value: eVersion },
        { name: 'OS', value: oName },
        { name: 'OS Version', value: oVersion },
        { name: 'Device Model', value: dModel },
        { name: 'Device Type', value: dType },
        { name: 'Device Vendor', value: dVendor },
        { name: 'CPU', value: cArchitecture }
      ]
    }
  },
  methods: {
    onUaMouseEnter () {
      clearTimeout(this.openTimeout)
      clearTimeout(this.closeTimeout)
      this.openTimeout = setTimeout(() => {
        this.menu = true
      }, 500)
    },
    onUaMouseLeave () {
      if (this.menu) {
        clearTimeout(this.closeTimeout)
        this.closeTimeout = setTimeout(() => {
          this.menu = false
        }, 500)
      } else {
        clearTimeout(this.openTimeout)
      }
    },
    onUaMenuMouseEnter () {
      clearTimeout(this.closeTimeout)
    },
    getIconLeft (ua) {
      const icons = []

      const oIcon = this.getUaOsIcon(ua && ua.os ? ua.os.name : null)
      const bIcon = this.getUaBrowserIcon(ua && ua.browser ? ua.browser.name : null)
      if (oIcon) icons.push(oIcon)
      if (bIcon && !icons.includes(bIcon)) icons.push(bIcon)

      return icons
    },
    getUaBrowserIcon (name) {
      if (!name) return ''
      const x = name.toLowerCase()

      if (x.includes('chrome')) {
        return 'lab la-chrome'
      } else if (x.includes('edge')) {
        return 'lab la-edge'
      } else if (x.includes('firefox')) {
        return 'lab la-firefox'
      } else if (x.includes('internet explorer')) {
        return 'lab la-internet-explorer'
      } else if (x.includes('safari')) {
        return 'lab la-safari'
      } else {
        return ''
      }
    },
    getUaOsIcon (name) {
      if (!name) return ''
      const x = name.toLowerCase()

      if (x.includes('mac os') || x === 'ios') {
        return 'lab la-apple'
      } else if (x.includes('windows')) {
        return 'lab la-windows'
      } else if (x.includes('fedora')) {
        return 'lab la-fedora'
      } else if (x.includes('redhat')) {
        return 'lab la-redhat'
      } else if (x.includes('ubuntu')) {
        return 'lab la-ubuntu'
      } else if (x.includes('firefox')) {
        return 'lab la-firefox'
      } else if (x.includes('chromium')) {
        return 'lab la-chrome'
      }
    }
  }
}
</script>
