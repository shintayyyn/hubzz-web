<template>
  <section class="sign-in-card">
    <div class="flex flex-col">
      <div class="flex flex-row flex-nowrap justify-center mb-16">
        <div
          class="px-12 py-5 font-bold text-sm text-grey cursor-pointer"
          @click="$router.push('/')"
        >Sign In</div>
        <div class="rounded-full bg-yellow-dark px-12 py-5 font-bold text-sm cursor-pointer">Sign Up</div>
      </div>
      <div class="rounded-lg shadow-lg px-8 pb-8 pt-12">
        <div class="mt-5 flex flex-row justify-center">
          <div class="text-lg">New to hubzz? Get started here</div>
        </div>
        <div class="mt-5 flex justify-center">
          <nuxt-link
            class="w-full sm:w-3/4 flex justify-center rounded-lg border-4 border-yellow-dark bg-yellow-dark shadow-md py-8 no-underline text-black font-bold text-sm sm:text-xl focus:outline-none hover:text-white"
            to="/sign-up/locum"
          >I'm looking for work</nuxt-link>
        </div>
        <div class="mt-5 flex justify-center">
          <nuxt-link
            class="w-full sm:w-3/4 flex justify-center rounded-lg border-4 border-yellow-dark shadow-md py-8 no-underline text-black font-bold text-sm sm:text-xl focus:outline-none hover:text-white hover:bg-yellow-dark"
            to="/sign-up/practice"
          >I'm looking for locums</nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'auth',
  mounted() {
    //   clean all forms from store
    this.$store.commit('signUp/CLEAR_FORM_PRACTICE_DETAILS')
  }
}
</script>
<style scoped>
.sign-in-card {
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  max-width: 600px;
  height: 500px;
  padding: 1px;
}

@media screen and (max-width: 1205px) {
  .sign-in-card {
    position: relative;
    top: 30px;
  }
}
</style>

