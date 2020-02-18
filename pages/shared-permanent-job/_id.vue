<template>
  <div>
    {{sharedPermanentJob}}
  </div>
</template>
<script>
export default {
  data(){
    return{
      sharedPermanentJob: '',
    }
  },
  async asyncData({ app, route }) {
    const response = await app.$axios.$get(`/api/v1/shared-permanent-job/${route.params.id}`)
    const sharedPermanentJob = response.data.permanent_job
    return {
      sharedPermanentJob
    }
  }
}
</script>

<style>

</style>