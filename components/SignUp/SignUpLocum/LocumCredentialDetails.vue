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
          <div class="relative flex flex-col mt-8">
            <div class="flex flex-row justify-between">
              <label for="email" class="text-sm" style="width:50%">Email</label>
            </div>
            <div class="flex flex-row justify-between mt-4">
              <div
                class="flex flex-col border-b-2 border-grey-light"
                style="width:100%"
                :class="[setFocus === 'email' ? 'border-yellow':'', formError.find(item => item.field === 'email') ? 'border-red':'']"
              >
                <input
                  type="email"
                  name="email"
                  id="email"
                  ref="email"
                  class="focus:outline-none font-bold text-sm"
                  style="height:40px;"
                  @focus="setFocus = 'email'"
                  @blur="validateEmail"
                  v-model="form.email"
                  placeholder="Your email address"
                >
              </div>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'email')"
            >{{formError.find(item => item.field === 'email').message}}</div>
          </div>

          <div class="relative flex flex-col mt-8">
            <div class="flex flex-row justify-between">
              <label for="password" class="text-sm" style="width:50%">Password</label>
            </div>
            <div class="flex flex-row justify-between mt-4">
              <div
                class="flex flex-col border-b-2 border-grey-light"
                style="width:100%"
                :class="[setFocus === 'password' ? 'border-yellow':'', formError.find(item => item.field === 'password') ? 'border-red':'']"
              >
                <input
                  type="password"
                  name="password"
                  id="password"
                  ref="password"
                  class="focus:outline-none font-bold text-sm"
                  style="height:40px;"
                  @focus="setFocus = 'password'"
                  @blur="setFocus = ''"
                  v-model="form.password"
                  placeholder="Password"
                >
              </div>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'password')"
            >{{formError.find(item => item.field === 'password').message}}</div>
          </div>

          <div class="relative flex flex-col mt-8">
            <div class="flex flex-row justify-between">
              <label
                for="password_confirmation"
                class="text-sm"
                style="width:50%"
              >Repeat password to verify</label>
            </div>
            <div class="flex flex-row justify-between mt-4">
              <div
                class="flex flex-col border-b-2 border-grey-light"
                style="width:100%"
                :class="[setFocus === 'password_confirmation' ? 'border-yellow':'', formError.find(item => item.field === 'password_confirmation') ? 'border-red':'']"
              >
                <input
                  type="password"
                  name="password_confirmation"
                  id="password_confirmation"
                  ref="password_confirmation"
                  class="focus:outline-none font-bold text-sm"
                  style="height:40px;"
                  @focus="setFocus = 'password_confirmation'"
                  @blur="setFocus = ''"
                  v-model="form.password_confirmation"
                  placeholder="Repeat password"
                >
              </div>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'password_confirmation')"
            >{{formError.find(item => item.field === 'password_confirmation').message}}</div>
          </div>

          <div class="relative flex flex-col mt-8">
            <div class="flex flex-row justify-start">
              <input
                type="checkbox"
                name="privacy_policy"
                id="privacy_policy"
                ref="privacy_policy"
                v-model="form.privacy_policy"
              >
              <label
                for="privacy_policy"
                class="text-sm ml-1"
              >I agree with the Terms and Conditions and Privacy Policy of Hubzz</label>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'privacy_policy')"
            >{{formError.find(item => item.field === 'privacy_policy').message}}</div>
          </div>
        </form>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start mt-5">
      <div class="flex justify-center" style="width:600px">
        <button
          class="rounded-lg p-6 bg-yellow text-lg font-bold hover:text-white focus:outline-none mx-1"
          @click.prevent="$store.commit('signUp/SET_ACTIVE_TAB', 'professional_details')"
          v-text="'<<'"
        ></button>
        <button
          class="rounded-lg p-6 bg-yellow text-lg font-bold hover:text-white focus:outline-none"
          @click.prevent="next"
        >Next</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
        password_confirmation: '',
        privacy_policy: false,
      },
      formError: [],
      setFocus: ''
    }
  },
  computed: {
    credentialDetails() {
      return this.$store.state.signUp.credential_details
    }
  },
  mounted() {
    this.form.email = this.credentialDetails.email
    this.form.password = this.credentialDetails.password
    this.form.password_confirmation = this.credentialDetails.password_confirmation
    this.form.privacy_policy = this.credentialDetails.privacy_policy
  },
  methods: {
    validateEmail(e) {
      this.setFocus = ''
      this.formError = []
      this.$axios
        .$post(`/api/v1/valid-email`, { email: e.target.value })
        .then(res => {
          console.log(res.message)
        }).catch(err => {
          this.formError.push(err.response.data.error_messages[0])
        })
    },
    next() {
      try {
        this.formError = []
        this.Validate(this.form)
        this.ValidatePassword(this.form.password, this.form.password_confirmation)
        if (!this.formError.length) {
          // alert('Waiting for API')
          this.$store.commit('signUp/SET_CREDENTIAL_DETAILS', this.form)
          this.$store.dispatch('signUp/registeredLocum')
          // response here
          // this.$router.push('/sign-up/success')
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
