<template lang='pug'>
#app
  router-view
</template>

<script>
export default {
  created() {
    this.$Message.config({
      duration: 2.5
    })
  }
}
</script>
