<template>
  <div class="embed-wrapper rounded-borders my-grey-border">
    <q-scroll-area
      :thumb-style="thumbStyleHor"
      :style="{
        height: '53px',
        width: '100%'
      }"
      horizontal
    >
      <pre class="embed q-px-md" ref="embed">{{ embedUrl }}</pre>
    </q-scroll-area>

    <q-btn
      class="copy-btn"
      icon="las la-copy"
      size="16px"
      dense
      round
      color="primary"
      @click.stop="copy(embedUrl)"
    >
      <q-tooltip>
        Copy to Clipboard
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
import { copy, thumbStyle } from 'shared-components/mixins/mixins'

export default {
  mixins: [copy, thumbStyle],
  props: {
    embedUrl: {
      type: String,
      require: true
    }
  }
}
</script>

<style lang="scss" scoped>
// .embed {
//   position: relative;
//   white-space: pre-wrap;       /* Since CSS 2.1 */
//   white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
//   white-space: -pre-wrap;      /* Opera 4-6 */
//   white-space: -o-pre-wrap;    /* Opera 7 */
//   word-wrap: break-word;
// }

.embed-wrapper {
  height: 100%;
  width: 100%;
  overflow-x: auto;

  // &:hover {
  //   .copy-btn {
  //     opacity: 1;
  //   }
  // }

  .copy-btn {
    position: absolute;
    right: 25px;
    top: 25px;
    opacity: 1;
    transition: opacity .3s ease-in-out;
  }
}
</style>
