<template>
  <div class="flex items-center justify-center">
    <q-btn
      label="Columns"
      icon="las la-columns"
      class="my-grey"
      no-caps
      flat
      dense
    >
      <q-menu :offset="$store.state.layout.qMenuOffset" @show="onShow">
        <q-card>
          <q-card-section class="q-py-xs q-px-md">
            <q-input
              v-model="keyword"
              placeholder="Filter..."
              dense
              borderless
              color="primary"
              input-class="text-right"
              ref="input"
            >
              <template v-slot:append>
                <q-icon v-if="keyword" name="clear" class="cursor-pointer" @click="keyword = ''" />
                <q-icon v-else name="search" />
              </template>
            </q-input>
          </q-card-section>

          <q-card-section class="q-pa-none">
            <q-list>
              <q-item
                dense
                class="q-py-xs q-px-md"
              >
                <q-item-section>
                  <q-btn
                    label="Default"
                    color="primary"
                    dense
                    unelevated
                    no-caps
                    @click="onDefault"
                  />
                </q-item-section>
              </q-item>

              <q-item
                tag="label"
                v-ripple
                dense
                class="q-py-xs q-px-md"
              >
                <q-item-section avatar>
                  <q-checkbox
                    :value="_allValue"
                    color="primary"
                    dense
                    @input="onAll"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ _allValue ? 'Hide' : 'Show' }} All</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item
                v-for="(x, i) in _filteredCols"
                :key="i"
                tag="label"
                v-ripple
                dense
                class="q-py-xs q-px-md"
              >
                <q-item-section avatar>
                  <q-checkbox
                    :value="value"
                    :val="x.name"
                    color="primary"
                    dense
                    @input="onInput"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ x.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
import { extend } from 'quasar'

export default {
  name: 'TableColVisibleBtn',
  props: {
    columns: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      show: false,
      keyword: ''
    }
  },
  computed: {
    _all () {
      return this.columns.map(x => x.name)
    },
    _allValue () {
      return this.value.length === this._all.length
    },
    _columns () {
      const clone = extend(true, [], this.columns)
      clone.sort((a, b) => a.label.localeCompare(b.label))
      return clone
    },
    _filteredCols () {
      return this.keyword ? this._columns.filter(x => {
        const [q, w] = [x.label.toLowerCase(), this.keyword.toLowerCase()]
        return q.includes(w) || w.includes(q)
      }) : this._columns
    }
  },
  methods: {
    onInput (val) {
      this.$emit('input', val)
    },
    onAll () {
      this.$emit('input', this._allValue ? [] : this._all)
    },
    onShow () {
      this.$refs.input.focus()
    },
    onDefault () {
      this.$emit('default')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
