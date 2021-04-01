<template>
  <div class="my-json full-width" @click.stop>
    <vue-json-pretty v-bind="{ ...$props, data: sortedData}" />
    <q-btn
      icon="las la-copy"
      class="absolute-top-right copy-btn my-grey"
      size="sm"
      flat
      round
      @click="copy(JSON.stringify(sortedData))"
    />
  </div>
</template>

<script>
import { copy } from 'shared-components/mixins/mixins'
import { extend } from 'quasar'

export default {
  name: 'MyVueJsonPretty',
  mixins: [copy],
  components: {
    VueJsonPretty: () => import('vue-json-pretty')
  },
  props: [
    'data',
    'deep',
    'showLength',
    'showLine',
    'showDoubleQuotes',
    'virtual',
    'itemHeight',
    'v-model',
    'path',
    'pathSelectable',
    'selectableType',
    'showSelectController',
    'selectOnClickNode',
    'highlightSelectedNode',
    'collapsedOnClickBrackets',
    'customValueFormatter',
    'highlightMouseoverNode'
  ],
  computed: {
    sortedData () {
      if (this.data && !Array.isArray(this.data) && typeof this.data === 'object') {
        const clone = extend(true, (Array.isArray(this.data) ? [] : {}), this.data)
        return this.sortObj(clone)
      } else {
        return this.data
      }
    }
  },
  methods: {
    sortObj (val) {
      if (!val || Array.isArray(val) || typeof val !== 'object') {
        return val
      } else {
        Object.keys(val).forEach(x => {
          val[x] = this.sortObj(val[x])
        })
        return this.sortObjHelper(val)
      }
    },
    sortObjHelper (json) {
      return Object
        .keys(json)
        .filter(k => k !== '__typename')
        .sort()
        .reduce((obj, key) => {
          obj[key] = json[key]
          return obj
        }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
.my-json {
  position: relative;

  .copy-btn {
    opacity: 0;
    transition: opacity .3s ease-in-out;
    right: map-get(map-get($spaces, "md"), "x");
    // top: map-get(map-get($spaces, "xs"), "y");
    top: 0;
  }

  &:hover .copy-btn {
    opacity: 1;
  }
}
</style>

<style lang="scss">
.body--dark .my-json {
  .vjs-tree.is-mouseover {
      background-color: #2c323a;
  }

  .vjs-tree.is-highlight-selected {
      background-color: #504945;
  }

  .vjs-tree .vjs-tree__content.has-line {
      border-left: 1px dotted #414141;
  }

  .vjs-tree .vjs-comment {
      color: #6d6d6d;
  }

  .vjs-tree .vjs-value__null {
      color: #f85149;
  }

  .vjs-tree .vjs-value__boolean,.vjs-tree .vjs-value__number {
      color: #a5d6ff;
  }

  .vjs-tree .vjs-value__string {
      color: #7ee787;
  }

}
</style>
