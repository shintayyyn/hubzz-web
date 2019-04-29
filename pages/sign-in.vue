<template>
  <section class="auth-section">
    <!-- <div
      class="h-full w-full flex flex-col overflow-auto xl:justify-center"
      v-if="$store.state.activeTab === 'forgot_password'"
    >
      <ForgotPassword/>
    </div>

    <div
      class="h-full w-full flex flex-col overflow-auto xl:justify-center"
      v-if="$store.state.activeTab === 'auth_success'"
    >
      <AuthSuccess/>
    </div>

    <div
      class="h-full w-full flex flex-col overflow-auto"
      v-if="$store.state.activeTab === 'sign_up_locum'"
    >
      <SignUpLocum/>
    </div>

    <div
      class="h-full w-full flex flex-col overflow-auto"
      v-if="$store.state.activeTab === 'sign_up_practice'"
    >
      <SignUpPractice/>
    </div>-->

    <div class="h-full w-full flex flex-col overflow-auto xl:justify-center mt-20">
      <AuthTab/>
      <div class="flex justify-center" style="height: 600px;">
        <SignIn v-if="$store.state.signIn.authTab === 'sign_in'"/>
        <SignUp v-if="$store.state.signIn.authTab === 'sign_up'"/>
      </div>
    </div>
  </section>
</template>

<script>
import AuthTab from '~/components/Auth/AuthTab.vue'
import SignIn from '~/components/Auth/SignIn.vue'
import SignUp from '~/components/Auth/SignUp.vue'
// import ForgotPassword from '~/components/Auth/ForgotPassword.vue'
// import SignUpLocum from '~/components/Auth/SignUp/SignUpLocum.vue'
// import SignUpPractice from '~/components/Auth/SignUp/SignUpPractice.vue'
// import AuthSuccess from '~/components/Auth/SignUp/SignUpLocum/AuthSuccess.vue'
export default {
  layout: 'auth',
  components: {
    AuthTab,
    SignIn,
    SignUp,
    // ForgotPassword,
    // SignUpLocum,
    // SignUpPractice,
    // AuthSuccess
  },
  mounted() {
    this.$store.commit('signUp/CLEAR_FORM_DETAILS')
  }
}
</script>
