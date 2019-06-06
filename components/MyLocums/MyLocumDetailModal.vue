<template>
  <div class="p-8 max-w-xl">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32"/>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      locum: null
    }
  },
  created() {
    this.$axios.$get(`/api/v1/practice/locums/${this.$store.state.myLocums.my_locum_id}`).then(res => {
      console.log(res)
    })
  }
}
</script>
