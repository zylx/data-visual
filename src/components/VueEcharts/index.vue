<template>
  <div class="echarts" :id="`chart-${id}`"></div>
</template>

<script>
const Echarts = require('echarts')
import { mapState } from 'vuex'
import eventBus from '@/utils/eventBus'

let charts = {}

export default {
  name: 'VueEcharts',
  props: {
    id: {
      type: Number,
      required: true
    },
    options: {
      type: Object,
      required: true
    },
    theme: [String, Object]
  },
  computed: {
    ...mapState([
      'curComponent'
    ])
  },
  mounted () {
    this.initChart()
    eventBus.$on('chartResize', () => {
      charts[`chart-${this.id}`].resize()
    })
  },
  watch: {
    options () {
      this.initChart()
    }
  },
  methods: {
    initChart () {
      const chartId = `chart-${this.id}`
      if (!charts[chartId]) {
        const dom = document.getElementById(chartId)
        charts[chartId] = Echarts.init(dom, this.theme)
      }
      if (this.options) {
        charts[chartId].setOption(this.options)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
