<template>
  <div class="full-width full-height">
    <div class="row no-wrap items-center">
      <template v-for="(p, i) in el">
        <q-icon v-if="i > 0" :key="`${i}-s`" name="las la-angle-right" class="q-pr-sm my-grey" />
        <component
          :is="p.to && i !== el.length - 1 ? 'router-link' : 'div'"
          :key="i"
          :to="p.to"
          :class="[
            { 'black-white': !p.to }
          ]"
        >
          <div class="q-pr-sm crumb ellipsis">
            {{ p.label | format }}
          </div>
        </component>
      </template>
    </div>
    <!-- <q-breadcrumbs separator=">" class="no-wrap">
      <q-breadcrumbs-el v-for="(p, i) in el" :key="i" :to="p.to">
        <div :class="p.to ? '' : $q.dark.isActive ? 'text-white' : 'text-black'">
          {{ p.label | format }}
        </div>
      </q-breadcrumbs-el>
    </q-breadcrumbs> -->
  </div>
</template>

<script>
import { format } from 'quasar'

const { capitalize } = format

const exceptions = {
  'jumio-api-server': 'Jumio API Server',
  'iam-service': 'IAM Service',
  'id-verification': 'ID Verification',
  'player-api-authorizer': 'Player API Authorizer',
  'player-admin-api-authorizer': 'Player Admin API Authorizer',
  'affiliate-admin-api-authorizer': 'Affiliate Admin API Authorizer'
}

const nonexistent = [
  'sandbox',
  'app-configuration',
  'connections'
]

export default {
  name: 'Breadcrumbs',
  computed: {
    el () {
      if (this.$router.currentRoute.path) {
        let link = `/${this.$store.state.auth.tenant}`
        return this.$router.currentRoute.path
          .split('/')
          .slice(2)
          .map((p, index) => {
            link += `/${p}`

            // exceptions
            if (nonexistent.includes(p)) {
              return { label: exceptions[p] || p, to: null }
            } else if (index === 0 && (p === 'player')) {
              return { label: exceptions[p] || p, to: `/${this.$store.state.auth.tenant}/player/search` }
            } else if (index === 0 && (p === 'affiliate')) {
              return { label: exceptions[p] || p, to: `/${this.$store.state.auth.tenant}/affiliate/search` }
            } else if (p === 'media') {
              return { label: exceptions[p] || p, to: `/${this.$store.state.auth.tenant}/affiliate/media/analytics` }
            }

            return { label: exceptions[p] || p, to: link }
          })
      } else {
        return []
      }
    }
  },
  filters: {
    format (value) {
      if (!value) return ''

      return /\d/.test(value) ? value : value.split('-').map(str => capitalize(str)).join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>
.crumb {
  max-width: 100px;

  @media (min-width: $breakpoint-sm-min) {
    max-width: unset;
  }
}
</style>
