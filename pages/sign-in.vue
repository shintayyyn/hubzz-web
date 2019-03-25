<template>
  <div class="h-full w-full flex flex-col overflow-auto xl:justify-center">

    <IndexTabControl/>

    <div class="flex justify-center items-start" style="height: 600px;">

      <div class="flex flex-col px-10 py-6 m-4 rounded-lg shadow-lg" style="width: 600px;">
        <div class="relative">
          <label class="text-xs">Email address</label>
          <span v-show="emailErrorMessage && !showEmailFocus" class="text-white bg-red absolute pin-r p-1 text-xs">{{ emailErrorMessage }}</span>
        </div>
        <input class="py-2 mt-2 mb-8 outline-none border-b" v-model="email" @keyup.enter="login" :class="showEmailFocus ? 'border-yellow-dark' : emailErrorMessage ? 'border-red' : 'border-grey-dark'" @focus="showEmailFocus = true" @blur="showEmailFocus = false, checkEmail()">

        <div class="relative">
          <label class="text-xs">Password</label>
          <span v-show="passwordErrorMessage && !showPasswordFocus" class="text-white bg-red absolute pin-r p-1 text-xs">{{ passwordErrorMessage }}</span>
        </div>
        <input class="py-2 mt-2 mb-8 outline-none border-b" v-model="password" @keyup.enter="login" :class="showPasswordFocus ? 'border-yellow-dark' : passwordErrorMessage ? 'border-red' : 'border-grey-dark'" @focus="showPasswordFocus = true" @blur="showPasswordFocus = false, checkPassword()">

        <nuxt-link to="/forgot-password" class="self-end no-underline text-black text-xs pr-2 pb-4 hover:underline">Forgot Password?</nuxt-link>

        <button @click="login" class="self-center rounded-lg p-5 font-bold" style="background-color: #FFDA3A;">Sign In</button>
      </div>
    </div>

  </div>
</template>

<script>
  import IndexTabControl from '~/components/IndexTabControl.vue'

  export default {
    layout: 'index',

    components: {
      IndexTabControl
    },

    async asyncData () {
      console.log('asyncData pages sign-in')
    },

    data() {
      return {
        email: '',
        password: '',
        emailErrorMessage: false,
        passwordErrorMessage: false,
        showEmailFocus: false,
        showPasswordFocus: false
      }
    },

    watch: {
      email() {
        this.checkEmail()
      },

      password() {
        this.checkPassword()
      }
    },

    methods: {
      login() {
        console.log('login')
      },

      checkEmail() {
        if (this.email.trim() === '') {
          this.emailErrorMessage = 'Required'
        } else {
          this.emailErrorMessage = false
        }
      },

      checkPassword() {
        if (this.password.trim() === '') {
          this.passwordErrorMessage = 'Required'
        } else {
          this.passwordErrorMessage = false
        }
      }
    }
  }
</script>
