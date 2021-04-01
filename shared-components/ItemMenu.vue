
<template>
  <q-item
    :class="['q-pa-none', 'min-height-unset', 'ua-item']"
    dense
    clickable
    manual-focus
    @click.stop="menu = !menu"
  >
    <q-item-section
      v-if="iconLeft && (typeof iconLeft === 'string' ? iconLeft : iconLeft.length)"
      class="q-pr-xs"
      avatar
      :class="classes"
    >
      <div class="row no-wrap">
        <q-icon
          v-if="typeof iconLeft === 'string'"
          :name="iconLeft"
          class="cursor-pointer"
          size="sm"
        />

        <q-icon
          v-else
          v-for="(icon, i) in iconLeft"
          :key="i"
          :name="icon"
          class="cursor-pointer"
          size="sm"
        />
      </div>
    </q-item-section>

    <q-item-section :class="['row', 'no-wrap', classes]">
      <div class="row no-wrap items-center">
        <span class="ellipsis user-agent cursor-pointer">
          {{ label || '-' }}
        </span>
        <q-icon
          name="las la-chevron-circle-down"
          size="xs"
          color="primary"
          class="q-pl-xs"
        />
      </div>
    </q-item-section>

    <q-menu
      v-if="menuData"
      v-model="menu"
      :offset="$store.state.layout.qMenuOffset"
      ref="menu"
      no-parent-event
    >
      <slot>
        <div class="ua-menu q-py-md q-gutter-sm">
          <q-item v-for="(d, i) in menuData" :key="i" class="q-px-md" dense>
            <q-item-section>
              <q-item-label caption class="caption">{{ d.name }}</q-item-label>
              <q-item-label>
                <q-badge :class="['val', 'full-width', 'my-grey-border', d.value ? 'black-white' : 'my-grey']" outline multi-line>{{ d.value || '-' }}</q-badge>
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </slot>
    </q-menu>
  </q-item>
</template>

<script>
export default {
  name: 'ItemMenu',
  props: {
    iconLeft: {
      type: [String, Array],
      default: null
    },
    label: {
      type: String,
      default: ''
    },
    menuData: {
      type: Array,
      default () {
        return []
      }
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
  }
}
</script>

<style lang="scss" scoped>
.user-agent {
  .q-td &,
  td & {
    // width: 100%;
    max-width: 200px;
  }
}

.ua-menu {
  min-width: 300px;

  .val,
  .caption {
    font-size: 14px;
    line-height: 1.2;
  }

  .caption {
    padding-left: 7px;
  }
}
</style>
