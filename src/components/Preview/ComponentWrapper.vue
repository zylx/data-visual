<template>
  <!-- <div @click="handleClick"> -->
  <div>
    <component
      v-for="(config, index) in componentData"
      :key="index"
      class="conponent"
      :is="config.component"
      :style="getStyle(config.style)"
      :id="getUUID()"
      :propValue="config.propValue"
    />
  </div>
</template>

<script>
import { v4 as uuid } from 'uuid'
import getStyle from '@/utils/style'
// import { mixins } from '@/utils/events'

export default {
  props: {
    componentData: {
      type: Array,
      default: () => [],
      require: true
    }
  },
  // mixins: [mixins],
  methods: {
    getStyle,
    getUUID () {
      return uuid()
    }
    // handleClick() {
    //     const events = this.config.events
    //     Object.keys(events).forEach(event => {
    //         this[event](events[event])
    //     })
    // }
  }
}
</script>

<style lang="scss" scoped>
.conponent {
  position: absolute;
}
</style>