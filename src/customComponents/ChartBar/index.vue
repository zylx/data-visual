<template>
  <vue-echarts :id="id" :options="propValue" />
</template>

<script>
export default {
  name: 'VBar',
  props: {
    id: {
      type: Number
    },
    propValue: {
      type: Object
    },
    element: {
      type: Object
    }
  }
}
</script>