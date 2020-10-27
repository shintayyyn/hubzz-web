<template>
  <div>
    <div class="m-32 px-8">
      <h1 class="font-bold text-black">
        Session Expired. Please Log In again.
      </h1>
      <div class="text-black cursor-pointer underline text-sm" @click="logOut()">
        Log In
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "sharedPermJob",

  // mounted () {
  //   this.logOut()
  // },

  methods: {
    logOut () {
      this.$loggedOutBroadcastChannel.postMessage()
      return this.loggedOutHandler()
    },
    loggedOutHandler () {
      return this.$auth.logout()
        .then(() => {
          this.$auth.$storage.setUniversal('_token.local', '')
        })
        .finally(()=>{
          this.$router.push('/')
        })
    },
  },
}
</script>

<style>

</style>
