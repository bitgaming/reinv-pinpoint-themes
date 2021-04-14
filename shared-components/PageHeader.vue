<template>
  <div
    :class="[
      'wrapper',
      $q.dark.isActive ? 'no-shadow' : 'shadow-5'
    ]"
    :style="{ top: `${top}px` }"
  >
    <q-toolbar
      :class="[
        'my-toolbar'
      ]">
      <div>
        <Breadcrumbs />
      </div>

      <slot />
    </q-toolbar>
  </div>
</template>

<script>

export default {
  name: 'PageHeader',
  components: {
    Breadcrumbs: () => import('shared-components/Breadcrumbs.vue')
  },
  props: {
    top: {
      type: Number,
      default: 50
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: -webkit-sticky;
  position: sticky;
  width: 100%;
  z-index: $z-fab;
  overflow: hidden;

  background-color: #fff;

  .body--dark & {
    background: var(--q-color-primary-header-bg--dark, $dark);
  }

  .my-toolbar {
    height: $breadcrumbs-height;
  }
}

</style>
