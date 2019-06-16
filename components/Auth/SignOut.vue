<template>
  <div class="signout fixed pin-t w-full flex justify-center" v-if="$store.state.toggled_signout">
    <div class="signout-modal border-solid rounded-b-lg bg-yellow-dark p-2">
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
  </div>
</template>
<script>
export default {
  methods: {
    logout() {
      this.$auth.logout().then(() => {
        this.$store.commit('TOGGLE_SIGNOUT', false)
        this.$store.commit('TOGGLE_SIDEBAR', false)
        this.$auth.$storage.setUniversal('_token.local', '')
        this.$router.push('/sign-in')
      })
    },
    cancel() {
      this.$store.commit('TOGGLE_SIGNOUT', false)
    }
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

