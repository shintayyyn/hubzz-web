<template>
  <div class="p-8 max-w-2xl">
    <div @click="close" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32"/>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    close() {
      this.$router.push('/jobs?job_status=unsuccessfull')
    }
  }
}
</script>

