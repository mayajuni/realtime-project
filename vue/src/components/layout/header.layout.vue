<template>
  <div class="header">
    <header>
      <h1>
        Realtime-Project
        <small class="developer">by Kwon Dong Jun</small>
      </h1>
    </header>
  </div>
</template>

<script>
  export default {
    name: 'header',
    data () {
      return {}
    }
  }
</script>

<style scoped lang='scss'>
  .header {
    -webkit-box-flex: 0;
    -webkit-flex: none;
    -ms-flex: none;
    flex: none;

    header {
      padding: 30px;
      text-align: center;
      background-color: #252b74;
      color: #eae9f5;
      position: relative;

      .developer {
        margin-top: 5px;
        display: block;
        font-size: 16px;
        color: #dddddd;
      }
    }
  }
</style>
