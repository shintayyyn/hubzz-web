<template>
  <div class="h-full relative">
      <img src="../../assets/images/landing-page.png" class=" object-cover w-screen h-full">
      <p class="absolute z-10 message text-6xl font-bold text-center mr-32 py-2 text-white rounded-lg leading-tight">Despite these uncertain times, we're here to serve you</p>
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
