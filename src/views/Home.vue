<template>
  <div class="home">
    <header>Header</header>
    <main>
      <section class="left-side">left side</section>
      <section class="center">center</section>
      <section class="right-side">right side</section>
    </main>
  </div>
</template>

<script>
export default {
  nam: 'Home'
}
</script>

<style lang="scss">
.home {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  header {
    height: 64px;
    line-height: 64px;
    border-bottom: 1px solid #ececec;
  }

  main {
    display: flex;
    height: 100%;
    flex: 1;
    .left-side {
      width: 200px;
      height: 100%;
      padding: 15px 10px;
      background: #eee;
    }
    .center {
      flex: 1;
      margin: 5px 10px;
      background: #ccc;
    }
    .right-side {
      width: 220px;
      height: 100%;
      padding: 15px 10px;
      background: #eee;
    }
  }
}
</style>