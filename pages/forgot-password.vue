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

              <section class="w-full">
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
              </section>
              <div v-if="rateLimitCountdown > 0" class="text-red-500 text-sm mt-2">
                Too many attempts. Try again in {{ rateLimitCountdown }}s.
              </div>
              <button
                class="rounded-lg bg-sunglow shadow-md py-1 px-6 mt-3 font-bold focus:outline-none hover:text-white transition-hover disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="rateLimitCountdown > 0"
                @click="send"
              >
                {{ rateLimitCountdown > 0 ? `Wait ${rateLimitCountdown}s` : 'Send' }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { getRateLimitExpiry, setRateLimitExpiry, clearRateLimitExpiry } from '@/utils/rateLimitStorage'

const RATE_LIMIT_KEY = 'forgotPasswordRateLimitExpiry'
const RATE_LIMIT_WINDOW_MS = 60000

export default {
  layout: "auth",

  data () {
    return {
      form: {
        email: "",
      },
      formError: [],
      setFocus: "",
      success: false,
      rateLimitCountdown: 0,
      countdownInterval: null,
    }
  },

  mounted () {
    this.success = false
    this.$refs.email.focus()
    this.restoreCountdown()
  },

  beforeDestroy () {
    if (this.countdownInterval) clearInterval(this.countdownInterval)
  },

  methods: {

    async restoreCountdown () {
      const localExpiry = getRateLimitExpiry(RATE_LIMIT_KEY)
      if (localExpiry) {
        this.startCountdown(localExpiry)
        return
      }
      try {
        const { data } = await this.$axios.get('/api/v1/forgot-password-rate-limit-status')
        if (data && data.rateLimited && data.remainingSeconds > 0) {
          const expiryMs = Date.now() + data.remainingSeconds * 1000
          setRateLimitExpiry(RATE_LIMIT_KEY, expiryMs)
          this.startCountdown(expiryMs)
        }
      } catch (e) {}
    },

    startCountdown (expiryMs) {
      if (this.countdownInterval) clearInterval(this.countdownInterval)
      const tick = () => {
        const remaining = Math.ceil((expiryMs - Date.now()) / 1000)
        if (remaining <= 0) {
          this.rateLimitCountdown = 0
          clearInterval(this.countdownInterval)
          this.countdownInterval = null
          clearRateLimitExpiry(RATE_LIMIT_KEY)
        } else {
          this.rateLimitCountdown = remaining
        }
      }
      tick()
      this.countdownInterval = setInterval(tick, 1000)
    },

    async send () {
      if (this.rateLimitCountdown > 0) return

      try {
        this.formError = await this.$validator(this.form, {
          email: 'required|string',
        }, {
          'email.required': 'Email is required.',
          'email.string': 'Invalid email.',
        }).then(() => []).catch((errors) => errors)

        if (this.formError.length) return

        await this.$axios.post(`/api/v1/forgot-password`, this.form)

        this.success = true
      } catch (err) {
        const res = err && err.response
        let message = null

        if (res && res.status === 429) {
          const expiryMs = Date.now() + RATE_LIMIT_WINDOW_MS
          setRateLimitExpiry(RATE_LIMIT_KEY, expiryMs)
          this.startCountdown(expiryMs)
        } else if (res && res.status === 400 && res.data && res.data.error_messages) {
          this.formError = res.data.error_messages
        } else {
          message = (res && res.data && (res.data.error || res.data.message)) || (err && err.message) || 'Something went wrong!'
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
