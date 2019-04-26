<template>
  <section class="forgot-password-section">
    <ForgotPassword/>
  </section>
</template>
<script>
import ForgotPassword from '@/components/Auth/ForgotPassword'
export default {
  layout: 'auth',
  components: {
    ForgotPassword
  }
}
</script>

