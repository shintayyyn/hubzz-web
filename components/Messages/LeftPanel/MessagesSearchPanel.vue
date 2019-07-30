<template>
  <div class="messages-search-section">
    <input type="text" placeholder="Search" @keydown="inputSearchKeyDownHandler" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      search: ''
    }
  },
  methods: {
    inputSearchKeyDownHandler(e) {

    }
  }
}
</script>
<style scoped>
.messages-search-section {
  /* border: 1px solid black; */
}
</style>
