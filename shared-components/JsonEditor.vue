<template>
  <div
    id="jsoneditor"
    class="full-width je"
    :style="wrapperStyle"
    ref="d"
  />
</template>

<script>
import JSONEditor from 'jsoneditor'

export default {
  name: 'JsonEditor',
  props: {
    wrapperStyle: {
      type: [String, Object, Array],
      default () {
        return {
          height: '500px'
        }
      }
    },
    value: {
      type: [Object, Array],
      default: null
    },
    mainMenuBar: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      editor: null
    }
  },
  mounted () {
    this.editor = new JSONEditor(this.$refs.d, {
      mode: 'code',
      onChangeText: this.onChange,
      mainMenuBar: this.mainMenuBar
    })

    this.editor.set(this.value)
  },
  methods: {
    get () {
      return this.editor.get()
    },
    onChange (string) {
      try {
        this.$emit('input', JSON.parse(string))
      } catch (err) {
        if (process.env.ENV !== 'prod') console.error(err)
      }
      // console.log(json)

      // this.$emit('input', json)
    }
  }
}
</script>

<style src='jsoneditor/dist/jsoneditor.min.css'></style>

<style lang="scss">
.je {
  .jsoneditor {
    border: thin solid $separator-color;
    border-radius: $generic-border-radius;
    box-shadow: $table-box-shadow;
  }

  .body--dark & .jsoneditor {
    border-color: $separator-dark-color;
  }

  .jsoneditor-menu {
    background-color: var(--q-color-primary);
    border-bottom: 1px solid var(--q-color-primary);
  }

  .jsoneditor-poweredBy {
    display: none;
  }

  .ace_constant.ace_numeric {
    color: #1d8ce0;
  }

  .ace_string {
    color: #13ce66;
  }

  .body--dark & {
    .ace-jsoneditor.ace_editor {
      background: none;
    }
    .ace-jsoneditor .ace_gutter {
      color: $my-grey--dark;
      background: #2c323a;
    }

    .ace-jsoneditor .ace_gutter-active-line {
      background: #504945;
    }

    .jsoneditor-statusbar {
      color: $my-grey--dark;
      background: #2c323a;
      border-top-color: $separator-dark-color;
    }

    .ace-jsoneditor .ace_scroller {
      background: $dark-page;
    }

    .ace-jsoneditor .ace_marker-layer .ace_active-line {
      background: #2c323a;
    }

    .ace-jsoneditor .ace_marker-layer .ace_selection {
      background: #504945;
    }

    .ace_variable {
      color: #fff;
    }

    .ace_constant.ace_numeric {
      color: #a5d6ff;
    }

    .ace_string {
      color: #7ee787;
    }
  }
}
</style>
