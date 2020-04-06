<template>
  <section class="forgot-password-section">
    <div class="flex flex-col items-start p-4 md:p-8">
      <nuxt-link to="/" class="focus:outline-none text-black">
        <svgicon name="left-arrow" height="32" width="32" />
      </nuxt-link>
      <div class="flex flex-col items-center mt-4 lg:mt-32 p-2">
        <div class="font-bold text-lg md:text-3xl md:w-3/4 w-full">
          Reset password
        </div>
        <div class="flex justify-center w-full md:w-3/4">
          <div class="mt-2 md:mt-5 rounded-lg shadow-md p-4 md:py-10 md:px-8 w-full">
            <template v-if="success">
              <div>
                Check your email inbox for further instructions
                <strong>should your email address match our records.</strong>
              </div>
            </template>
            <template v-else>
              <div class="text-sm md:text-base leading-tight">
                Please enter the email address of your account at Hubzz. If your email address matches our records, you'll receive
                an email with further instruction to proceed.
              </div>

              <form class="w-full">
                <div
                  class="relative flex flex-col mt-2 md:mt-8 border-b-2 border-gray-300"
                  :class="[
                    setFocus === 'email' ? 'border-yellow-400' : '',
                    formError.find(item => item.field === 'email') ? 'border-red-500' : ''
                  ]"
                >
                  <label for="email" class="mb-2">Email address or Username</label>
                  <input
                    id="email"
                    ref="email"
                    v-model="form.email"
                    type="email"
                    name="email"
                    class="focus:outline-none font-bold py-3"
                    @focus="setFocus = 'email'"
                    @blur="setFocus = ''"
                    @keyup.enter="send"
                  >
                </div>
                <span
                  v-if="formError.find(item => item.field === 'email')"
                  class="text-red-500 text-sm py-2"
                >{{ formError.find(item => item.field === "email").message.charAt(0).toUpperCase() + formError.find(item => item.field === "email").message.slice(1) }}</span>
              </form>
              <button
                class="rounded-lg bg-yellow-500 shadow-md py-2 px-4 mt-3 font-bold md:text-xl focus:outline-none hover:text-white transition-hover"
                @click="send"
              >
                Send
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  export default {
    layout: "auth",

    data () {
      return {
        form: {
          email: ""
        },
        formError: [],
        setFocus: "",
        // sample
        success: false
      }
    },

    mounted () {
      this.success = false
      this.$refs.email.focus()
    },

    methods: {

      async send () {
        try {
          this.formError = await this.$validator(this.form, {
            email: 'required|string',
          }, {
            'email.required': 'Email is required.',
            'email.string': 'Invalid email.',
          }).then(() => []).catch((errors) => errors)

          if (this.formError.length) {
            return
          }

          await this.$axios.post(`/api/v1/forgot-password`, this.form)

          this.success = true
        } catch (err) {
          console.log('err', err.response || err)

          let message = null

          if (err.response) {
            if (err.response.status === 400 || err.response.data.error_messages) {
              this.formError = err.response.data.error_messages
            } else {
              message = err.response.data.message
            }
          } else if (err.request) {
            message = 'Something went wrong!'
          } else {
            message = err.message
          }

          if (message) {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: [`${message}`],
            })
          }
        }
      },
      
    },

  }
</script>

<style scoped>
  button:active {
    transform: translate(2px, 2px);
  }
</style>
