<template>
  <div class="modal-container shadow-lg">
    <div class="m-6">
      <div class="text-lg font-semibold">
        {{specificInvitation.practice.surgery.name}}
      </div>
      <div>
        {{specificInvitation.practice.phone_number}}
      </div>
      <div>
        Permissions
      </div>
      <div>
        {{specificInvitation.pay_for_surgery}}
      </div>
      <div>
        {{specificInvitation.verify_job_creation}}
      </div>
      <div>
        {{specificInvitation.share_banks_to_other_surgeries}}
      </div>
      <div>
        {{specificInvitation.create_job_rate_limit}}
      </div>

      <div @click="acceptInvitation()" class="p-4 bg-green-500">
        accept
      </div>
      <div @click="rejectInvitation()" class="p-4 bg-red-500">
        reject
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      specificInvitation: '',
    }
  },
  async asyncData({ app, route, store }){
    let response = await app.$axios.$get(`/api/v1/practice/me/parent-surgery/invitations/${route.params.invitationId}`)
    const specificInvitation = response.data.practice_surgery
    console.log(specificInvitation)
    return {
      specificInvitation
    }
  },
  methods:{
    acceptInvitation(){
      console.log('haha')
      // await app.$axios.post(`/api/v1/practice/me/parent-surgery/accept`,{
      //   practice_surgery_id: this.specificInvitation.id
      // }).then(res => {

      // }).catch(err => {

      // })
    },
    rejectInvitation(){
      console.log('haha')
    }
  }
}
</script>

<style>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 70%;
  }
}
.shield {
  z-index: 509;
}
</style>