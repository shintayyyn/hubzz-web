<template>
  <section class="sign-in-card">
    <div class="flex flex-col">
      <div v-if="forgotPasswordToken">
        <div v-if="forgotPasswordToken.username" class="p-2">
          <span>Username:</span>
          <span>{{ forgotPasswordToken.username }}</span>
        </div>
        <div v-if="forgotPasswordToken.name" class="p-2">
          <span>Name:</span>
          <span>{{ forgotPasswordToken.name }}</span>
        </div>
      </div>
      <div class="rounded-lg shadow-lg px-8 pb-8 pt-12">
        <div class="w-full flex flex-col">
          <AppInput
            v-model="password"
            :type="'password'"
            :label="'New password'"
            :error="formErrors && formErrors.find(formError => formError.field === 'password')"
          />
          <AppInput
            v-model="passwordConfirmation"
            :type="'password'"
            :label="'Repeat password to confirm'"
            :error="formErrors && formErrors.find(formError => formError.field === 'password_confirmation')"
          />
        </div>
        <AppButton :label="'Change Password'" @click="reset" />
      </div>
    </div>
  </section>
</template>

<script>
  import AppInput from "@/components/Base/AppInput"
  import AppButton from "@/components/Base/AppButton"

  export default {
    layout: 'auth',

    components: {
      AppInput,
      AppButton
    },

    data () {
      return {
        loading: false,
        forgotPasswordToken: null,
        password: '',
        passwordConfirmation: '',
        formErrors: [],
      }
    },

    watch: {
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
              message: 'New password is required.',
              validation: 'required',
            })
          }
        }
      },

      passwordConfirmation () {
        const index = this.formErrors.findIndex((formError) => formError.field === 'password_confirmation')

        if (this.passwordConfirmation) {
          if (index > -1) {
            this.formErrors.splice(index, 1)
          }
        } else {
          if (index === -1) {
            this.formErrors.push({
              field: 'password_confirmation',
              message: 'New password confirmation is required.',
              validation: 'required',
            })
          }
        }
      },
    },

    async asyncData ({ app, params, error }) {
      try {
        const {
          token,
        } = params

        const forgotPasswordToken = await app.$axios.get(`/api/v1/forgot-password/${token}`)
          .then(response => response.data.data.forgot_password_token)

        return {
          forgotPasswordToken
        }
      } catch (err) {
        if (err.response) {
          return error({
            message: err.response.data.message,
            statusCode: err.response.data.status,
          })
        } else if (err.request) {
          return error({
            message: 'Something went wrong!',
            statusCode: 500,
          })
        }

        throw err
      }
    },

    methods: {

      async reset () {
        try {
          this.formErrors = []

          const data = {
            password: this.password,
            password_confirmation: this.passwordConfirmation,
          }

          this.formErrors = await this.$validator(data, {
            password: 'required|string|min:6',
            password_confirmation: 'required|string|min:6|same:password',
          }, {
            'password.required': 'New password is required.',
            'password.string': 'Invalid new password.',
            'password.min': 'New password must be at least 6 characters.',

            'password_confirmation.required': 'New password confirmation is required.',
            'password_confirmation.string': 'Invalid new password confirmation.',
            'password_confirmation.min': 'New password confirmation must be at least 6 characters.',
            'password_confirmation.same': 'New password do not match.',
          }).then(() => []).catch((errors) => errors)

          if (this.formErrors.length) {
            return
          }

          this.loading = true

          const response = await this.$axios.post(`/api/v1/reset-password/${this.forgotPasswordToken.token}`, data)

          const message = response.data.message

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: [message]
          })

          this.$router.push('/')

          this.loading = false
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

          this.loading = false
        }
      },

    },

  }
</script>

<style scoped>
  .sign-in-card {
    position: absolute;
    top: 0px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    max-width: 600px;
    height: 500px;
    padding: 1px;
  }

  @media screen and (max-width: 1205px) {
    .sign-in-card {
      position: relative;
      top: 30px;
    }
  }
</style>
