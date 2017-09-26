<template>
  <div>
    <span>{{ card.title }}</span>
  </div>
</template>

<script>
  export default {
    name: 'kanvan-list',
    props: {
      card: Object
    },
    data () {
      return {
        enableInput: false
      }
    },
    methods: {}
  }
</script>

<style scoped lang='scss'>

</style>
