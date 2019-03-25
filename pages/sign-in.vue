<template>
  <div class="__login">

    <IndexTabControl/>

    <div class="__login_form_container">
      <div class="__login_form">
        <div class="relative">
          <label>Email address</label>
          <span v-show="emailErrorMessage" class="__error_message">{{ emailErrorMessage }}</span>
        </div>
        <input v-model="email" @keyup.enter="login" @blur="checkEmail" :class="emailErrorMessage ? '__error' : ''">

        <div class="relative">
          <label>Password</label>
          <span v-show="passwordErrorMessage" class="__error_message">{{ passwordErrorMessage }}</span>
        </div>
        <input v-model="password" @keyup.enter="login" @blur="checkPassword" :class="passwordErrorMessage ? '__error' : ''">

        <nuxt-link to="/forgot-password" class="__forgot_password_link">Forgot Password?</nuxt-link>

        <button @click="login" class="__login_button">Sign In</button>
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
        passwordErrorMessage: false
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

<style>
  .__login {
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;

    overflow: auto;
  }

  .__login_form_container {
    height: 600px;
    display: flex;
    justify-content: center;
  }

  .__login_form {
    max-width: 600px;
    width: 600px;

    display: flex;
    flex-direction: column;

    padding: 2.5rem 1.5rem;
    margin: 1rem;
    border-radius: 1rem;
    box-shadow: 3px 3px 30px 3px rgba(0, 0, 0, 0.11), 0 5px 15px 0 rgba(0, 0, 0, 0.08);
  }

  .__login_form label {
    font-size: .8rem;
  }

  .__login_form input {
    display: block;
    border-bottom: 1.5px solid #55565a;
    outline: none;

    padding: .5rem 0;
    margin: .5rem 0 2rem 0;
  }

  .__login_form > input.__error {
    border-bottom: 1.5px solid #DB8D8D;
  }

  .__error_message {
    background-color: #F00;
    color: #FFF;
    position: absolute;
    right: 0;

    padding: .25rem;
    font-size: .8rem;
  }

  .__forgot_password_link {
    padding: 0 .5rem 1rem 0;
    align-self: flex-end;
    text-decoration: none;
    color: inherit;
    font-size: .75rem;
  }

  .__forgot_password_link:hover {
    text-decoration: underline;
  }

  .__login_button {
    align-self: center;

    border-radius: .75rem;

    padding: 1.25rem;
    background-color: #FFDA3A;
  }


  @media (min-width: 1280px) {
    .__login {
      justify-content: center;
    }
  }
</style>
