<template>
  <section>
    <div class="flex flex-no-wrap justify-start">
      <nuxt-link to="/invite" class="mr-5 p-3 text-sm font-bold cursor-pointer"
                 :class="$route.name === 'invite' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Invite
        Locums
      </nuxt-link>

      <nuxt-link to="/invite/invite-practices" class="mr-5 p-3 text-sm font-bold cursor-pointer"
                 :class="$route.name === 'invite-invite-practices' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Invite Practices
      </nuxt-link>
    </div>

    <div class="mt-3">
      <nuxt-child :referralCode="referralCode" />
    </div>
  </section>
</template>

<script>
  export default {
    middleware: "isVerified",

    data () {
      return {
        referralCode: '',
      }
    },

    mounted () {
      this.$axios.get('/api/v1/user-invites/referral-code').then((response) => {
        if (response.data && response.data.data && response.data.data.user_referral_code) {
          this.referralCode = response.data.data.user_referral_code.referral_code
        }
      })
    },
  }
</script>