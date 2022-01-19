<template>
  <section class="verify-email-section">
    <div class="flex flex-col" style="width:50%;text-align:center;margin:0 auto">
      <h1 class="flex flex-row justify-center mt-32">
        Awesome!
      </h1>
      <div class="flex flex-row justify-center mt-4 font-bold">
        Your email has been verified successfully.
      </div>
    </div>
    <div class="flex flex-row justify-center mt-5">
      <AppButton :label="'Home'" @click="$router.push('/')" />
    </div>
  </section>
</template>

<script>
import AppButton from "@/components/Base/AppButton"

export default {
  layout: "verification",

  components: {
    AppButton,
  },

  data () {
    return {
      emailVerificationToken: null,
    }
  },

  async asyncData ({ app, params, }) {
    try {
      let response = await app.$axios.get(`/api/v1/email-verification/${params.token}`)

      const emailVerificationToken = response.data.data.email_verification_token

      return {
        emailVerificationToken,
      }
    } catch (err) {
      throw err
    }
  },

  mounted () {
    this.$axios.post(`/api/v1/email-verification/${this.emailVerificationToken.token}`).then(() => {
      if (this.$auth.loggedIn) {
        this.$auth.fetchUser()
      }
    })
  },
}
</script>
