<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style lang="scss">
// 1. -webkit-scrollbar-track：滚动条轨道
// 2. -webkit-scrollbar：滚动条的宽度
// 3. -webkit-scrollbar-thumb：滚动条滑块
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  border-radius: 0;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.15);
  transition: color 0.2s ease-in-out;
  cursor: pointer;
}
</style>
