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
      <AppButton :label="'Home'" @click="$router.push('/')"/>
    </div>
  </section>
</template>
<script>
import AppButton from '@/components/Base/AppButton'
export default {
  layout: 'auth',
  components: {
    AppButton
  }
}
</script>
<style scoped>
a:active {
  transform: translate(5px, 5px);
}
</style>

