<template>
  <q-item class="q-pa-none" dense>
    <q-item-section>
      <q-item class="q-pa-none full-width" dense>
        <q-item-section>
          <q-item
            class="text-bold full-width grp-label q-pl-xs"
            dense
            clickable
            manual-focus
            v-ripple
            @click="expand = !expand"
          >
            <q-item-section class="expand-icon-wrapper" avatar>
              <q-icon
                name="las la-angle-down"
                size="10px"
                :class="[
                  'expand-icon',
                  'q-ml-xs',
                  { 'rotate-180': expand }
                ]"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label
                :class="[
                  'ellipsis',
                  'flex',
                  'no-wrap',
                  'items-baseline'
                ]"
                line="1"
              >
                <div class="q-pr-xs">{{ header }}</div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-item-section>

        <q-item-section v-if="value.length !== 0 && value.length !== allNames.length" side>
          <q-item-label
            :class="[
              'text-caption',
              'link',
              'q-mr-md'
            ]"
            @click="onReset"
          >
            Reset
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-slide-transition>
        <div v-show="options.length && expand" class="full-width">
          <q-scroll-area
            :class="['list']"
            :thumb-style="thumbStyleHor"
            :style="`height: ${scrollingAreaHeight}px`"
          >
            <q-input
              v-if="listHeight > maxHeight"
              v-model="keyword"
              placeholder="Filter..."
              class="q-px-md pl-23 my-facet-filter"
              input-class="text-right"
              borderless
              dense
            >
              <template v-slot:append>
                <q-icon v-if="keyword" size="xs" name="clear" class="cursor-pointer" @click="keyword = ''" />
                <q-icon v-else size="xs" name="search" />
              </template>
            </q-input>

            <q-item
              v-for="({ name, displayName, val, icon, labelClass, labelClassDark, prefixFormat, prefixClasses }, i) in (sortByCount ? sortedOptions : filteredOptions)"
              :key="i"
              tag="label"
              dense
              clickable
              v-ripple
              class="my-item pl-23"
              @click="onClick(name)"
            >
              <q-item-section v-if="!hasNoIcons" avatar>
                <q-avatar v-if="icon && icon.includes('flag:')" size="xs" :class="[icon, 'my-grey-solid-shadow']" />
                <q-icon
                  v-else
                  :name="displayName === emptyFacetDisplay ? 'las la-minus' : icon"
                  :class="[
                    getItemClasses(displayName, labelClassDark, labelClass)
                  ]"
                  size="xs"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label
                  :class="[
                    'ellipsis',
                    'filter-name',
                    getItemClasses(displayName, labelClassDark, labelClass)
                  ]"
                  line="1"
                >
                  <span v-if="displayName !== emptyFacetDisplay && prefixFormat" :class="prefixClasses">{{ prefixFormat(name) }}</span>
                  <span>{{ displayName || name }}</span>
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="row no-wrap items-center q-gutter-x-xs">
                  <div class="text-caption hint">{{ hoverEye ? 'Toggle' : value.length && value[0] === name ? 'All' : 'Only' }}</div>
                  <div v-if="!hideValue" :class="['val', 'text-caption', { 'black-white': val }]">{{ val || '-' }}</div>
                  <q-icon
                    color="primary"
                    v-bind="getIcon(name)"
                    @click.stop="() => {
                      if (noMultiple) onClick(name)
                      else onClickEye(name)
                    }"
                    @mouseenter="() => { if (!noMultiple) hoverEye = true }"
                    @mouseleave="() => { if (!noMultiple) hoverEye = false }"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-scroll-area>
        </div>
      </q-slide-transition>
    </q-item-section>
  </q-item>
</template>

<script>
import { thumbStyle } from 'shared-components/mixins/mixins'

export default {
  name: 'FacetGroup',
  mixins: [thumbStyle],
  props: {
    header: {
      type: String,
      default: null
    },
    options: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
      required: true
    },
    defaultOpened: {
      type: Boolean,
      default: false
    },
    emptyFacetDisplay: {
      type: String,
      default: 'Misc'
    },
    sortByCount: {
      type: Boolean,
      default: false
    },
    hideValue: {
      type: Boolean,
      default: false
    },
    maxHeight: {
      type: Number,
      default: 400
    },
    noMultiple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      expand: false,
      keyword: '',
      optionHeight: 32,
      hoverEye: false
    }
  },
  computed: {
    listHeight () {
      return this.optionHeight * this.options.length
    },
    allNames () {
      return this.options.map(x => x.name)
    },
    displayValueSet () {
      if (this.value.length === 0) {
        return new Set(this.allNames)
      } else {
        return new Set(this.value)
      }
    },
    hasNoIcons () {
      return this.options.every(x => !x.icon)
    },
    filteredOptions () {
      return this.keyword ? this.options.filter(x => {
        if (!x || (!x.displayName && !x.name)) return false

        const [a, b] = [(x.displayName || x.name).toLowerCase(), this.keyword.toLowerCase()]
        return a.includes(b) || b.includes(a)
      }) : this.options
    },
    scrollingAreaHeight () {
      if (this.listHeight > this.maxHeight) {
        return Math.min(this.maxHeight, this.filteredOptions.length * this.optionHeight) + 40
      } else {
        return this.listHeight
      }
    },
    sortedOptions () {
      const arr = [...this.filteredOptions]
      arr.sort((a, b) => b.val - a.val)
      return arr
    }
  },
  mounted () {
    this.expand = this.defaultOpened
  },
  methods: {
    onReset () {
      this.$emit('c-input', [])
    },
    onClick (name) {
      if (this.value.length && this.value[0] === name) {
        this.$emit('c-input', [])
      } else {
        this.$emit('c-input', [name])
      }
    },
    getIcon (name) {
      return this.displayValueSet.has(name) ? {
        name: 'las la-eye',
        size: 'xs'
      } : {
        name: 'img:icons/eye-closed.svg',
        size: 'xs',
        style: 'height: 12px'
      }
    },
    getItemClasses (displayName, labelClassDark, labelClass) {
      return (this.$q.dark.isActive && labelClassDark ? labelClassDark : labelClass) || 'my-grey'
    },
    onClickEye (name) {
      const arr = (Array.from(this.displayValueSet))
      if (this.displayValueSet.has(name)) {
        this.$emit('c-input', arr.filter(x => x !== name))
      } else {
        this.$emit('c-input', [...arr, name])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 10px;
}

.grp-label {
  font-size: 12px;
}

// .val {
//   &--accent {
//     color: $accent-2;

//     .body--dark & {
//       color: $accent;
//     }
//   }
// }

.pl-xs {
  padding-left: map-get(map-get($spaces, "sm"), "x");
}

.pl-none {
  padding-left: 0 !important;
}

.expand-icon-wrapper {
  width: 20px;
  .expand-icon {
    transition: transform .3s ease;
  }
}

.pl-23 {
  padding-left: 24px;
}

.my-item {
  font-size: 13px;

  .hint {
    display: none;
  }

  &:hover .hint {
    display: inline-block;
  }
}
</style>

<style lang="scss">
.my-facet-filter {
  .q-field__control {
    height: 30px;
    font-size: 12px;
    opacity: .5;

    .q-field__native.q-placeholder {
      padding: 0;
    }
  }

  .q-field__marginal {
    height: auto;
  }
}
</style>
