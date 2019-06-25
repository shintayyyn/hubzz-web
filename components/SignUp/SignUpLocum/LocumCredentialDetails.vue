<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex mx-4" style="flex: 0 1 600px;">
        <h3>Finally</h3>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex m-4" style="flex: 0 1 600px;">
        <span>For your sign-in credentials</span>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start">
      <div class="mx-4 flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <form class="w-full">
          <AppInput
            v-model="form.email"
            :type="'email'"
            :name="'email'"
            :label="'Email'"
            :placeholder="'Your email address'"
            :error="formError.find(item => item.field === 'email')"
          />
          <AppInput
            v-model="form.password"
            :type="'password'"
            :name="'password'"
            :label="'Password'"
            :placeholder="'Password'"
            :error="formError.find(item => item.field === 'password')"
          />
          <AppInput
            v-model="form.password_confirmation"
            :type="'password'"
            :name="'password_confirmation'"
            :label="'Repeat password to verify'"
            :placeholder="'Repeat password'"
            :password="form.password"
            :error="formError.find(item => item.field === 'password_confirmation')"
          />

          <AppInput
            v-model="privacy_policy"
            :type="'single-checkbox'"
            :name="'privacy_policy'"
            :label="'I agree with the Terms and Conditions and Privacy Policy of Hubzz'"
          />
        </form>
      </div>
    </div>

    <div class="flex justify-center mt-4">
      <AppButton :label="'<<'" @click="$emit('nextTab', 'LocumProfessionalDetails')"/>
      <div class="mx-2"></div>
      <AppButton :label="'Next'" @click="next"/>
    </div>
  </div>
</template>
<script>
import AppInput from '@/components/Base/AppInput'
import AppButton from '@/components/Base/AppButton'
export default {
  components: {
    AppInput,
    AppButton
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
        password_confirmation: '',
      },
      privacy_policy: false,
      formError: [],
    }
  },
  computed: {
    credentialDetails() {
      return this.$store.state.signUp.credential_details
    },
    credentialFormError() {
      return this.$store.state.signUp.credential_detail_form_error
    }
  },
  watch: {
    credentialFormError(value) {
      if (value.length > 0) {
        value.forEach(item => {
          this.formError.push(item)
        })
      }
    },
  },
  mounted() {
    this.form.email = this.credentialDetails.email
    this.form.password = this.credentialDetails.password
    this.form.password_confirmation = this.credentialDetails.password_confirmation
    this.form.privacy_policy = false
    if (this.credentialFormError.length > 0) {
      this.credentialFormError.forEach(item => {
        this.formError.push(item)
      })
    }
  },
  methods: {
    next() {
      try {
        if (!this.privacy_policy) {
          return
        }
        this.formError = []
        // this.Validate(this.form)
        if (!this.formError.length) {
          this.$store.commit('signUp/SET_CREDENTIAL_DETAILS', this.form)
          setTimeout(() => {
            this.$store.dispatch('signUp/registeredLocum')
          }, 1000)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style scoped>
button:active {
  transform: translate(5px, 5px);
}
</style>
