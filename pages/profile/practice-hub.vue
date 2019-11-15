<template>
  <div class="shadow-lg m-6 rounded-lg">
    <div class="m-4 my-6">
      <p class="text-lg font-semibold">Practice Hub</p>
      <p class="mx-4">{{practiceHub.name}}</p>
      <p class="text-lg my-2 font-semibold">Permissions</p>
      <div class="mx-4 m-2">
        <p class="font-semibold">Does Hub handle Billing Transactions?</p>
        <p class="text-sm mx-6">{{practiceSpoke.pay_for_surgery === true ? 'Yes':'No'}}</p>
        <p class="font-semibold">Can other Spokes see your Banks?</p>
        <p class="text-sm mx-6">{{practiceSpoke.share_banks_to_other_surgeries === true ? 'Yes':'No'}}</p>
        <p class="font-semibold">Does Hub need to Approve sessions being created before showing in Live?</p>
        <p class="text-sm mx-6">{{practiceSpoke.verify_job_creation === true ? 'Yes':'No'}}</p>
        <div v-if="practiceSpoke.pay_for_surgery === true">
          <p class="font-semibold">Rate Limit</p>
          <p class="text-sm mx-6">{{'£ '+practiceSpoke.create_job_rate_limit}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      practiceSpoke: '',
      practiceHub: ''
    }
  },

  async asyncData({ app, route, store }){
    try{
      let response = await app.$axios.get(`/api/v1/practice/me/parent-surgery`)
      const practiceSpoke = response.data.data.practice
      const practiceHub = response.data.data.practice.parent_surgery
      return{
        practiceSpoke,
        practiceHub
      }
    }catch(err){
      throw err;
    }
  },
}
</script>

<style>

</style>