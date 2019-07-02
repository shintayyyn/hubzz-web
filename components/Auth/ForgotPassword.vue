<template>
  <section class="forgot-password-section">
    <div class="p-10">
      <nuxt-link to="/" class="focus:outline-none text-black">
        <svgicon name="left-arrow" height="32" width="32" />
      </nuxt-link>
      <div class="flex flex-col mt-32">
        <div class="flex justify-center">
          <div class="font-bold text-3xl" style="width:70%">Reset password</div>
        </div>
        <div class="flex justify-center">
          <div class="mt-5 rounded-lg shadow-md py-10 px-8" style="width:70%">
            <template v-if="success">
              <div>
                Check your email inbox for further instructions
                <strong>should your email address match our records.</strong>
              </div>
            </template>
            <template v-else>
              <div>
                Please enter the email address of your account at Hubzz.
                If your email address matches our records, you'll receive an email with further instruction to proceed.
              </div>

              <form class="w-full">
                <div
                  class="relative flex flex-col mt-8 border-b-2 border-white"
                  :class="[setFocus === 'email' ? 'border-yellow':'', formError.find(item => item.field === 'email') ? 'border-red':'']"
                >
                  <label for="email" class="text-lg mb-4">Email address</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    ref="email"
                    class="focus:outline-none font-bold"
                    style="height:40px"
                    @focus="setFocus = 'email'"
                    @blur="setFocus = ''"
                    v-model="form.email"
                    @keyup.enter="send"
                  />
                  <span
                    class="absolute pin-r bg-red text-white p-1"
                    v-if="formError.find(item => item.field === 'email')"
                  >{{formError.find(item => item.field === 'email').message}}</span>
                </div>
              </form>

              <div class="mt-5 flex justify-start">
                <button
                  class="rounded-lg bg-yellow-dark shadow-md p-8 font-bold text-xl focus:outline-none hover:text-white"
                  @click="send"
                >Send</button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      form: {
        email: ''
      },
      formError: [],
      setFocus: '',
      // sample
      success: false
    }
  },
  watch: {
    'form.email'(value) {
      let index = this.formError.findIndex(item => item.field === 'email')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
    }
  },
  mounted() {
    this.success = false
    this.$refs.email.focus()
  },
  methods: {
    async send() {
      try {
        this.formError = []
        this.Validate(this.form)
        if (!this.formError.length) {
          this.$axios.$post(`/api/v1/forgot-password`, this.form).then(res => {
            this.success = true
          })
        }
      } catch (e) {

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

