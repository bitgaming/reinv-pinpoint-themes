<template>
  <div class="row no-wrap">
    <q-item class="min-height-unset my-pagination my-px-sm-md" dense>
      <q-item-section avatar>
        <q-item-label>
          Count: {{ count }}
        </q-item-label>
      </q-item-section>

      <q-item-section v-if="!hideRowPerPageSelect" class="rpp-label">
        <q-item-label>
          Records per page:
        </q-item-label>
      </q-item-section>

      <q-item-section v-if="!hideRowPerPageSelect" side>
        <q-select
          dense
          borderless
          options-dense
          :value="rowsPerPage"
          :options="rowsPerPageOptions"
          :disable="disabled"
          @input="val => $emit('change-rows-per-page', val)"
        />
      </q-item-section>
    </q-item>

    <q-item v-if="!hidePageNumber" class="min-height-unset my-px-sm-md" dense>
      <q-item-section>
        <q-item-label>Page {{ pageNumber }}</q-item-label>
      </q-item-section>
    </q-item>

    <template v-if="!hideNavBtns">
      <q-btn
        v-for="(x, i) in paginationBtns"
        :key="i"
        unelevated
        round
        dense
        size="sm"
        :icon="x.icon"
        :disable="disabled || (x.disable ? x.disable() : false)"
        @click="$emit(x.event)"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'MyPagination',
  props: {
    count: {
      type: Number,
      default: 0
    },
    rowsPerPage: {
      type: Number,
      default: 25
    },
    rowsPerPageOptions: {
      type: Array,
      default () {
        return [15, 25, 50]
      }
    },
    pageNumber: {
      type: Number,
      default: 1
    },
    paginationBtns: {
      type: Array,
      default () {
        return [
          { icon: 'las la-angle-double-left', event: 'first' },
          { icon: 'las la-angle-left', event: 'prev' },
          { icon: 'las la-angle-right', event: 'next' },
          { icon: 'las la-angle-double-right', event: 'last' }
        ]
      }
    },
    disabled: {
      type: Boolean,
      detauls: false
    },
    hideRowPerPageSelect: {
      type: Boolean,
      default: false
    },
    hidePageNumber: {
      type: Boolean,
      default: false
    },
    hideNavBtns: {
      type: Boolean,
      default: false
    }
  }
}
</script>
