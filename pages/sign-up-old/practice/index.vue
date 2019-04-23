<template>
  <div>
    <template v-if="success">
      <div class="text-center mt-32">
        <div>thank you</div>
        <div>
          A confirmation email has been sent to you to verify your email address.<br>
          Please check your inbox for it to proceed.
        </div>
        <div>
          <nuxt-link to="/sign-in">Home</nuxt-link>
        </div>
      </div>
    </template>
    <template v-else>
      <ProgressBar :percentage="progress" />
      <div class="p-10 lg:w-3/4">
        <nuxt-link to="/sign-up">arrow icon here</nuxt-link>
        <div class="font-semibold text-xl mb-5">Sign Up for Practice Account</div>
        <PracticeSignUpForm @signUpProgress="$event === 1 ? progress = 70 : progress = 100" @success="success = true"/>
      </div>
    </template>
  </div>
</template>

<script>
import ProgressBar from '@/components/SignUp/ProgressBar'
import PracticeSignUpForm from '@/components/Practice/PracticeSignUpForm'
  export default {
    layout: 'index',
    components: {
      ProgressBar,
      PracticeSignUpForm
    },
    data () {
      return {
        showForm: false,
        progress: 70,
        success: false
      }
    },
    async asyncData () {
      console.log('asyncData pages sign-up practice index')
    }
  }
</script>
