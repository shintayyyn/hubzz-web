<template>
  <section class="forgot-password-section">
    <div class="flex flex-col" style="width:50%;text-align:center;margin:0 auto">
      <h1 class="flex flex-row justify-center mt-32">Thank you!</h1>
      <div
        class="flex flex-row justify-center mt-4 font-bold"
      >A confirmation email has been sent to you to verify your email address.</div>
      <div class="flex flex-row justify-center font-bold">Please check your inbox for it to proceed.</div>
    </div>
    <div class="flex flex-row justify-center mt-5">
      <nuxt-link
        to="/sign-in"
        class="rounded-lg p-5 bg-yellow font-bold text-lg hover:text-white no-underline text-black"
      >Home</nuxt-link>
    </div>
  </section>
</template>
<script>
export default {
  layout: 'auth',
}
</script>
<style scoped>
button:active {
  transform: translate(5px, 5px);
}
</style>

