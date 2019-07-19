<template>
  <section class="verify-email-section">
    <div class="flex flex-col" style="width:50%;text-align:center;margin:0 auto">
      <h1 class="flex flex-row justify-center mt-32">Thank you!</h1>
      <div class="flex flex-row justify-center mt-4 font-bold">Welcome to Hubzz</div>
    </div>
    <div class="flex flex-row justify-center mt-5">
      <AppButton :label="'Home'" @click="$router.push('/')" />
    </div>
  </section>
</template>
<script>
import AppButton from '@/components/Base/AppButton'
export default {
  // layout: 'auth',
  components: {
    AppButton
  },
  async asyncData({ app, params }) {
    try {
      console.log("dsadsaddsad")
      let response = await app.$axios.$get(`/api/v1/email-verification/${params.token}`)
      const email_verification_token = response.data.email_verification_token
      
      return {
        email_verification_token
      }
    } catch (err) {
      throw err
    }
  },
  created() {
    this.$axios.$post(`/api/v1/email-verification/${this.email_verification_token.token}`).then(res => {

    })
  }
}
</script>
