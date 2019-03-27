<template>
  <div class="h-full w-full flex flex-col overflow-auto">


    <div class="flex flex-col items-center justify-center w-full pb-16">

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
        <div class="flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">

          <div class="flex flex-col mb-8" ref="inputEmail">
            <div class="flex flex-wrap justify-between">
              <label class="text-xs my-1 py-1">Email *</label>
              <div class="m-1 flex-auto flex justify-end">
                <span class="text-xs bg-red p-1 text-white" v-if="emailErrorMessage && !showEmailFocus">{{ emailErrorMessage }}</span>
              </div>
            </div>
            <input class="outline-none py-1 mt-1 border-b" :class="showEmailFocus ? 'border-yellow-dark' : emailErrorMessage ? 'border-red' : 'border-grey-dark'" v-model="email" @focus="showEmailFocus = true" @blur="showEmailFocus = false, checkEmail()" placeholder="Your email address">
          </div>

          <div class="flex flex-col mb-8" ref="inputPassword">
            <div class="flex flex-wrap justify-between">
              <label class="text-xs my-1 py-1">Password *</label>
              <div class="m-1 flex-auto flex justify-end">
                <span class="text-xs bg-red p-1 text-white" v-if="passwordErrorMessage && !showPasswordFocus">{{ passwordErrorMessage }}</span>
              </div>
            </div>
            <input type="password" class="outline-none py-1 mt-1 border-b" :class="showPasswordFocus ? 'border-yellow-dark' : passwordErrorMessage ? 'border-red' : 'border-grey-dark'" v-model="password" @focus="showPasswordFocus = true" @blur="showPasswordFocus = false, checkPassword()" placeholder="Password">
          </div>

          <div class="flex flex-col mb-8" ref="inputPasswordConfirmation">
            <div class="flex flex-wrap justify-between">
              <label class="text-xs my-1 py-1">Repeat password to verify *</label>
              <div class="m-1 flex-auto flex justify-end">
                <span class="text-xs bg-red p-1 text-white" v-if="passwordConfirmationErrorMessage && !showPasswordConfirmationFocus">{{ passwordConfirmationErrorMessage }}</span>
              </div>
            </div>
            <input type="password" class="outline-none py-1 mt-1 border-b" :class="showPasswordConfirmationFocus ? 'border-yellow-dark' : passwordConfirmationErrorMessage ? 'border-red' : 'border-grey-dark'" v-model="passwordConfirmation" @focus="showPasswordConfirmationFocus = true" @blur="showPasswordConfirmationFocus = false, checkPasswordConfirmation()" placeholder="Repeat Password">
          </div>

        </div>
      </div>

      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex justify-center" style="flex: 0 1 600px;">
          <nuxt-link class="inline-flex border rounded-lg text-black no-underline p-4 my-2" style="background-color: #FFDA3A;" to="/sign-up/locum/professional-details">< <</nuxt-link>
          <button class="inline-flex border rounded-lg text-black no-underline p-4 my-2" style="background-color: #FFDA3A;" @click="register" V-if="!registering">Sign Up</button>
          <button class="inline-flex border rounded-lg text-black no-underline p-4 my-2" style="background-color: #FFDA3A;" v-if="registering">Loading...</button>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
  import isEmail from 'validator/lib/isEmail'

  export default {
    layout: 'index',

    async asyncData({ store, redirect }) {
      try {
        console.log('asyncData pages sign-up locum credential-details')

        if (!store.getters['sign-up/locum/isAccountDetailsValid']) {
          redirect('/sign-up/locum/account-details')

          return
        }

        if (!store.getters['sign-up/locum/isAddressDetailsValid']) {
          redirect('/sign-up/locum/address-details')

          return
        }

        if (!store.getters['sign-up/locum/isProfessionalDetailsValid']) {
          redirect('/sign-up/locum/professional-details')

          return
        }

      } catch (err) {
        console.log('asyncData pages sign-up locum credential-details err', err)
      }
    },

    data() {
      return {
        showEmailFocus: false,
        showPasswordFocus: false,
        showPasswordConfirmationFocus: false,
        registering: false
      }
    },

    computed: {
      email: {
        get() {
          return this.$store.getters['sign-up/locum/getEmail']
        },
        set(email) {
          this.$store.commit('sign-up/locum/setEmail', email)
        }
      },
      emailErrorMessage: {
        get() {
          return this.$store.getters['sign-up/locum/getEmailErrorMessage']
        },
        set(emailErrorMessage) {
          this.$store.commit('sign-up/locum/setEmailErrorMessage', emailErrorMessage)
        }
      },
      password: {
        get() {
          return this.$store.getters['sign-up/locum/getPassword']
        },
        set(password) {
          this.$store.commit('sign-up/locum/setPassword', password)
        }
      },
      passwordErrorMessage: {
        get() {
          return this.$store.getters['sign-up/locum/getPasswordErrorMessage']
        },
        set(passwordErrorMessage) {
          this.$store.commit('sign-up/locum/setPasswordErrorMessage', passwordErrorMessage)
        }
      },
      passwordConfirmation: {
        get() {
          return this.$store.getters['sign-up/locum/getPasswordConfirmation']
        },
        set(passwordConfirmation) {
          this.$store.commit('sign-up/locum/setPasswordConfirmation', passwordConfirmation)
        }
      },
      passwordConfirmationErrorMessage: {
        get() {
          return this.$store.getters['sign-up/locum/getPasswordConfirmationErrorMessage']
        },
        set(passwordConfirmationErrorMessage) {
          this.$store.commit('sign-up/locum/setPasswordConfirmationErrorMessage', passwordConfirmationErrorMessage)
        }
      },

      accountDetailsValid() {
        return this.$store.getters['sign-up/locum/isAccountDetailsValid']
      },

      addressDetailsValid() {
        return this.$store.getters['sign-up/locum/isAddressDetailsValid']
      },

      professionalDetailsValid() {
        return this.$store.getters['sign-up/locum/isProfessionalDetailsValid']
      },

      credentialDetailsValid() {
        return this.$store.getters['sign-up/locum/isCredentialDetailsValid']
      },
    },

    watch: {
      accountDetailsValid() {
        if (!this.accountDetailsValid) {
          this.$router.replace('/sign-up/locum/account-details')
        }
      },
      addressDetailsValid() {
        if (!this.addressDetailsValid) {
          this.$router.replace('/sign-up/locum/address-details')
        }
      },
      professionalDetailsValid() {
        if (!this.professionalDetailsValid) {
          this.$router.replace('/sign-up/locum/professional-details')
        }
      }
    },

    methods: {
      checkEmail() {
        if (!this.email) {
          this.emailErrorMessage = 'Required'
        } else if (!isEmail(this.email)) {
          this.emailErrorMessage = 'Please enter a valid email address.'
        } else {
          this.emailErrorMessage = ''
        }
      },

      checkPassword() {
        if (!this.password) {
          this.passwordErrorMessage = 'Required'
        } else if (this.password.length < 6) {
          this.passwordErrorMessage = 'Please enter at least 6 characters.'
        } else {
          this.passwordErrorMessage = ''

          if (this.passwordConfirmation && !this.passwordConfirmationErrorMessage && this.password !== this.passwordConfirmation) {
            this.passwordConfirmationErrorMessage = 'must equal to Password'
          }
        }
      },

      checkPasswordConfirmation() {
        if (!this.passwordConfirmation) {
          this.passwordConfirmationErrorMessage = 'Required'
        } else if (this.passwordConfirmation.length < 6) {
          this.passwordConfirmationErrorMessage = 'Please enter at least 6 characters.'
        } else if (!this.passwordErrorMessage && this.password !== this.passwordConfirmation) {
          this.passwordConfirmationErrorMessage = 'must equal to Password'
        } else {
          this.passwordConfirmationErrorMessage = ''
        }
      },

      register() {
        this.checkEmail()
        this.checkPassword()
        this.checkPasswordConfirmation()

        this.registering = true

        if (this.accountDetailsValid && this.addressDetailsValid && this.professionalDetailsValid && this.credentialDetailsValid) {
          this.$store.dispatch('sign-up/locum/register').then((response) => {
            console.log('response', response)
          }).catch((err) => {
            console.log('err', err)
          }).finally(() => {
            this.registering = false
          })
        }
      }
    },

    mounted() {
      this.emailErrorMessage = ''
    }
  }
</script>
