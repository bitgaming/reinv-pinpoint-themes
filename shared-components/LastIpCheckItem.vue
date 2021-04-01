
<template>
  <item-menu
    :label="lastIpCheck ? lastIpCheck.ip : null"
    :menu-data="data"
    :classes="classes"
  />
</template>

<script>
import { getName } from 'country-list'

export default {
  name: 'UaItem',
  components: {
    ItemMenu: () => import('shared-components/ItemMenu.vue')
  },
  props: {
    lastIpCheck: {
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
        ip,
        country,
        city,
        timezone,
        latitude,
        longitude,
        postalCode,
        rawPayload,
        traits
      } = this.lastIpCheck

      return [
        { name: 'IP', value: ip },
        { name: 'Country', value: country ? getName(country) || country : country },
        { name: 'City', value: city },
        { name: 'Timezone', value: timezone },
        { name: 'Latitude', value: latitude },
        { name: 'Longitude', value: longitude },
        { name: 'Postal Code', value: postalCode },
        { name: 'Traits', value: JSON.stringify(traits) },
        { name: 'Raw Payload', value: rawPayload }
      ]
    }
  }
}
</script>
