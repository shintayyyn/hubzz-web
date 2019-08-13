<template>
  <div class="signout fixed top-0 w-full flex justify-center">
    <div class="signout-modal border-solid rounded-b-lg bg-yellow-500 p-2">
      <div class="flex justify-center">
        <div class>Proceed to sign-out?</div>
      </div>
      <div class="flex justify-center my-1">
        <div class="mx-2">
          <button
            class="border border-solid bg-yellow-500 hover:text-white focus:outline-none text-black font-bold py-5 rounded-lg"
            @click.prevent="logout"
            style="width:100px;"
          >Yes</button>
        </div>
        <div class="mx-2">
          <button
            class="border border-solid bg-yellow-500 hover:text-white focus:outline-none text-black font-bold py-5 rounded-lg"
            @click.prevent="$emit('modal', false)"
            style="width:100px;"
          >Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    logout() {
      this.$axios.post('/api/v1/logout').then(() => {
        console.log('Socket Logged Out')
        console.log('One Signal Logged Out')
        return this.$auth.logout()
      }).then(() => {
        this.$emit('modal', false)
        this.$store.commit('TOGGLE_SIDEBAR', false)
        this.$auth.$storage.setUniversal('_token.local', '')
        this.$router.push('/')
      })
    },
  }
}
</script>
<style scoped>
.signout {
  z-index: 600;
}
.signout-modal {
  width: 100%;
}
@media screen and (min-width: 991px) {
  .signout-modal {
    width: auto;
  }
}
button:active {
  transform: translate(2px, 2px);
}
</style>

