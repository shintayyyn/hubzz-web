<template>
  <div class="border-solid rounded-b-lg bg-yellow-dark p-2 max-w-lg">
    <div class="flex justify-center">
      <div class>Proceed to sign-out?</div>
    </div>
    <div class="flex justify-center my-1">
      <div class="mx-2">
        <button
          class="border border-solid bg-yellow-dark hover:text-white focus:outline-none text-black font-bold py-5 rounded-lg"
          @click.prevent="logout"
          style="width:100px;"
        >Yes</button>
      </div>
      <div class="mx-2">
        <button
          class="border border-solid bg-yellow-dark hover:text-white focus:outline-none text-black font-bold py-5 rounded-lg"
          @click.prevent="cancel"
          style="width:100px;"
        >Cancel</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    logout() {
      this.$axios.post('/api/v1/logout').then(() => {
        return this.$auth.logout()
      }).then(() => {
        this.$store.commit('TOGGLE_SIGN_OUT_MODAL', false)
        this.$store.commit('SET_SIGNOUT_SHIELD', false)
        this.$auth.$storage.setUniversal('_token.local', '')
        this.$router.push('/sign-in')
      })
    },
    cancel() {
      this.$store.commit('TOGGLE_SIGN_OUT_MODAL', false)
      this.$store.commit('SET_SIGNOUT_SHIELD', false)
    }
  }
}
</script>
<style scoped>
.sign-out-modal {
}
button:active {
  transform: translate(2px, 2px);
}
</style>

