<template>
  <div class="bg-white rounded-lg shadow-lg p-4 md:p-8">
    <div class="w-full flex flex-col">
      <AppInput
        v-model="form.email"
        :type="'text'"
        :name="'email'"
        :label="'Email address or Username'"
        :placeholder="''"
        :error="formError.find(item => item.field === 'email')" @submit="login"
      />

      <div class="flex flex-col">
        <label class="text-xs md:text-sm">Password</label>
        <div class="w-full relative">
          <input
            v-model="form.password"
            :type="form.type"
            class="w-full py-3 border-b-2 focus:border-yellow-400 focus:outline-none text-xs md:text-sm"
            :class="formError.find(item => item.field === 'password') ? 'border-red-500' : ''"
            @submit="login"
            @keyup.enter="login"
          >
          <button v-if="form.password" tabindex="-1" class="absolute top-0 right-0 mx-2 h-full focus:outline-none"
                  @click="form.type === 'password' ? form.type = 'text' : form.type = 'password'"
          >
            <svgicon v-if="form.type === 'password'" name="eye" height="24" width="24"
                     class="fill-current text-gray-500 hover:text-gray-600"
            />
            <svgicon v-else name="hide-eye" height="24" width="24"
                     class="fill-current text-gray-500 hover:text-gray-600"
            />
          </button>
        </div>
        <transition name="drop-down">
          <div
            v-if="formError.find(item => item.field === 'password')"
            class="text-red-500 py-1 text-xs text-white"
          >
            {{ formError.find(item => item.field === 'password').message }}
          </div>
        </transition>
      </div>
    </div>

    <div class="flex justify-end mt-2 mb-8">
      <nuxt-link to="/forgot-password">
        <span class="hover:underline text-sm cursor-pointer">Forgot password?</span>
      </nuxt-link>
    </div>

    <div class="flex justify-center">
      <AppButton :label="'Sign In'" :disabled="loggingIn" @click="login" />
    </div>
  </div>
</template>

<script>
  import AppInput from "@/components/Base/AppInput"
  import AppButton from "@/components/Base/AppButton"
  import debounce from "lodash.debounce"

  export default {
    transition: {
      name: "fade",
      mode: "out-in"
    },

    layout: "auth",

    components: {
      AppInput,
      AppButton
    },

    data () {
      return {
        form: {
          email: "",
          password: "",
          type: "password"
        },
        formError: [],
        loggingIn: false
      }
    },

    watch: {
      'form.email' () {
        const index = this.formError.findIndex((formError) => formError.field === 'email')

        if (this.form.email) {
          if (index > -1) {
            this.formError.splice(index, 1)
          }
        } else {
          if (index === -1) {
            this.formError.push({
              field: 'email',
              message: 'Email is required.',
              validation: 'required',
            })
          }
        }
      },

      'form.password' () {
        const index = this.formError.findIndex((formError) => formError.field === 'password')

        if (this.form.password) {
          if (index > -1) {
            this.formError.splice(index, 1)
          }
        } else {
          if (index === -1) {
            this.formError.push({
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

          this.formError = await this.$validator(this.form, {
            email: 'required|string',
            password: 'required|string',
          }, {
            'email.required': 'Email is required.',
            'email.string': 'Invalid email.',
            'password.required': 'Password is required.',
            'password.string': 'Invalid password.',
          }).then(() => []).catch((errors) => errors)

          if (this.formError.length) {
            return
          }

          this.loggingIn = true

          const response = await this.$axios.post('/api/v1/login', this.form)

          const token = response.data.data.token.token

          await this.loggedInHandler(token)

          await this.$loggedInBroadcastChannel.postMessage(token)

          this.loggingIn = false
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

<style scoped>
  a {
    text-decoration: none;
    color: black;
  }
</style>
