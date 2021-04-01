
<template>
  <item-menu
    :label="label"
    :classes="classes"
  >
    <div class="q-pa-md">
      <my-vue-json-pretty
        :data="json"
        highlightMouseoverNode
        showLength
      />
    </div>
  </item-menu>
</template>

<script>
export default {
  name: 'JsonItem',
  components: {
    ItemMenu: () => import('shared-components/ItemMenu.vue'),
    MyVueJsonPretty: () => import('shared-components/MyVueJsonPretty.vue')
  },
  props: {
    json: {
      type: [Object, Array],
      require: true
    },
    label: {
      type: String,
      default: ''
    },
    classes: {
      type: [String, Array, Object],
      default: ''
    }
  }
}
</script>
