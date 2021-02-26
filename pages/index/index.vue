<template>
  <div class="bg-white rounded-lg shadow-lg p-4 md:p-8">
    <div class="w-full flex flex-col">
      <AppInput
        v-model="email"
        type="text"
        label="Email address or Username"
        name="email"
        :error="formErrors.find(formError => formError.field === 'email')"
        @submit="login"
      />

      <AppInput
        v-model="password"
        label="Password"
        type="password"
        name="password"
        :error="formErrors.find(formError => formError.field === 'password')"
        @submit="login"
        @keyup.enter="login"
      />

      <!-- <div class="flex flex-col">
        <label class="text-xs md:text-sm">Password</label>
        <div class="w-full relative pt-1">
          <input
            v-model="password"
            :type="passwordInputType"
            class="w-full py-1 border-b-2 focus:border-yellow-400 focus:outline-none text-xs md:text-sm"
            :class="formErrors.find(formError => formError.field === 'password') ? 'border-red-500' : ''"
            @submit="login"
            @keyup.enter="login"
          >
          <button v-if="password" tabindex="-1" class="absolute top-0 right-0 mx-2 h-full focus:outline-none"
                  @click="passwordInputType === 'password' ? passwordInputType = 'text' : passwordInputType = 'password'"
          >
            <svgicon v-if="passwordInputType === 'password'" name="eye" height="24" width="24"
                     class="fill-current text-gray-500 hover:text-gray-600"
            />
            <svgicon v-else name="hide-eye" height="24" width="24"
                     class="fill-current text-gray-500 hover:text-gray-600"
            />
          </button>
        </div>
        <transition name="drop-down">
          <div
            v-if="formErrors.find(formError => formError.field === 'password')"
            class="text-red-500 py-1 text-xs text-white"
          >
            {{ formErrors.find(formError => formError.field === 'password').message }}
          </div>
        </transition>
      </div> -->
    </div>

    <div class="flex flex-col items-end justify-end mb-8">
      <nuxt-link to="/forgot-password">
        <span class="hover:underline text-sm cursor-pointer">Forgot password?</span>
      </nuxt-link>
      <nuxt-link to="/change-email-request">
        <span class="hover:underline text-sm cursor-pointer">Forgot email?</span>
      </nuxt-link>
    </div>

    <div class="flex justify-center">
      <AppButton label="Sign In" :disabled="loggingIn" @click="login" />
    </div>
  </div>
</template>

<script>
  import AppInput from "@/components/Base/AppInput"
  import AppButton from "@/components/Base/AppButton"
  import debounce from "lodash.debounce"

  export default {
    transition: {
      name: 'fade',
      mode: 'out-in'
    },

    layout: 'auth',

    components: {
      AppInput,
      AppButton,
    },

    data () {
      return {
        email: '',
        password: '',
        passwordInputType: 'password',
        formErrors: [],
        loggingIn: false,
      }
    },

    watch: {
      email () {
        const index = this.formErrors.findIndex((formError) => formError.field === 'email')

        if (this.email) {
          if (index > -1) {
            this.formErrors.splice(index, 1)
          }
        } else {
          if (index === -1) {
            this.formErrors.push({
              field: 'email',
              message: 'Email is required.',
              validation: 'required',
            })
          }
        }
      },

      password () {
        const index = this.formErrors.findIndex((formError) => formError.field === 'password')

        if (this.password) {
          if (index > -1) {
            this.formErrors.splice(index, 1)
          }
        } else {
          if (index === -1) {
            this.formErrors.push({
              field: 'password',
              message: 'Password is required.',
              validation: 'required',
            })
          }
        }
      },
    },

    mounted () {
      this.$loggedInBroadcastChannel.addEventListener('message', this.loggedInHandler)
    },

    destroyed () {
      this.$loggedInBroadcastChannel.removeEventListener('message', this.loggedInHandler)
    },

    methods: {

      login: debounce(async function () {
        try {
          if (this.loggingIn || this.$auth.loggedIn) {
            return
          }

          const data = {
            email: this.email,
            password: this.password,
          }

          this.formErrors = await this.$validator(data, {
            email: 'required|string',
            password: 'required|string',
          }, {
            'email.required': 'Email is required.',
            'email.string': 'Invalid email.',
            'password.required': 'Password is required.',
            'password.string': 'Invalid password.',
          }).then(() => []).catch((errors) => errors)

          if (this.formErrors.length) {
            return
          }

          this.loggingIn = true

          const response = await this.$axios.post('/api/v1/login', data)

          const token = response.data.data.token.token

          await this.loggedInHandler(token)

          await this.$loggedInBroadcastChannel.postMessage(token)

          this.loggingIn = false
        } catch (err) {
          console.log('err', err.response || err)

          let message = null

          if (err.response) {
            if (err.response.status === 400 && err.response.data.error_messages) {
              this.formErrors = err.response.data.error_messages
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

          this.loggingIn = false
        }
      }, 10),

      async loggedInHandler (token) {
        try {
          this.$axios.setToken(token, 'Bearer')

          this.$auth.$storage.setUniversal('_token.local', 'Bearer ' + token)

          await this.$auth.fetchUser()

          this.$router.push('/dashboard')

          if (this.$socket.connected) {
            await this.$axios.post('/api/v1/socket/login', {
              socket_id: this.$socket.id
            })

            console.log('Socket Logged In')
          }

          await this.$store.dispatch('one-signal/setOneSignalUser')
        } catch (err) {
          console.log('err', err)
        }
      },

    },

  }
</script>
