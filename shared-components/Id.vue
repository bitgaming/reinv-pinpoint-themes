<template>
  <div>
    <q-item
      dense
      class="id q-pa-none my-grey roboto-mono min-height-unset"
    >
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" />
      </q-item-section>

      <q-item-section
        :class="[
          'items-start',
          'no-flex-grow',
          { 'cursor-pointer': to, }
        ]"
      >
        <component
          :is="to ? 'router-link' : 'div'"
          :to="to"
          class="row no-wrap"
        >
          <q-badge
            :outline="outline"
            :label="id"
            :class="[
              'id',
              {
                'link': !!to,
                'no-border': !border,
                'my-grey': outline && !to,
                'id--half-transparent text-primary--link': !outline,
              },
              classes
            ]"
            multi-line
          />
          <!-- 'id--half-transparent text-primary': !outline && !to, -->
        </component>
      </q-item-section>

      <q-item-section
        v-if="copyBtn"
        side
        :class="[
          'copy-icon',
          'cursor-pointer',
          'my-grey',
          'pl-xs'
        ]"
        @click.stop="copy(id)"
      >
        <q-icon name="las la-copy" size="16px">
          <q-tooltip>
            Copy
          </q-tooltip>
        </q-icon>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { copy } from 'shared-components/mixins/mixins'

export default {
  name: 'Id',
  mixins: [copy],
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    icon: {
      type: String,
      default: undefined
    },
    to: {
      type: String,
      default: null
    },
    outline: {
      type: Boolean,
      default: true
    },
    copyBtn: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    },
    classes: {
      type: [String, Object],
      default: null
    }
  },
  computed: {
    clickEvent () {
      return this.to ? 'click' : null
    }
  },
  methods: {
    onClick () {
      if (this.to) this.$router.push(this.to)
    }
  }
}
</script>

<style lang="scss" scoped>
.pl-xs {
  padding-left: map-get(map-get($spaces, "xs"), "x") !important;
}

.copy-icon {
  opacity: 0;
  transition: all .3s ease-in-out;

  .id:hover & {
    opacity: 1;
  }
}

.no-flex-grow {
  flex: unset;
}

.text-underline {
  text-decoration: underline;
}

.no-border {
  border: none;
}

.id {
  font-size: 13px;
}
</style>

<style lang="scss">
.id--half-transparent {
  background: var(--q-color-primary-bg--half-transparent);
}
</style>
