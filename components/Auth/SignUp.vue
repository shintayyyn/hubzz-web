<template>
  <section class="sign-up-section" style="width:90%">
    <div class="rounded-lg shadow-lg px-10 py-10">
      <div class="mt-2 flex justify-center">
        <div class="text-lg">New to hubzz? Get started here</div>
      </div>
      <div class="mt-5 flex justify-center">
        <nuxt-link
          class="flex justify-center rounded-lg border-4 border-yellow-dark bg-yellow-dark shadow-md py-8 no-underline text-black font-bold text-xl focus:outline-none hover:text-white"
          to="/sign-up/locum"
          style="width:60%"
        >I'm looking for work</nuxt-link>
      </div>
      <div class="mt-5 flex justify-center">
        <nuxt-link
          class="flex justify-center rounded-lg border-4 border-yellow-dark shadow-md py-8 no-underline text-black font-bold text-xl focus:outline-none hover:text-white hover:bg-yellow-dark"
          to="/sign-up/practice"
          style="width:60%"
        >I'm looking for locums</nuxt-link>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  mounted() {
    this.$store.commit('signUp/SET_ACTIVE_TAB', 'account_details')
  }
}
</script>

<style scoped>
button:active {
  transform: translate(5px, 5px);
}
</style>

