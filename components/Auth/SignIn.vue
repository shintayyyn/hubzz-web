<template>
  <section class="sign-in-section" style="width:90%">
    <div class="rounded-lg shadow-lg px-10 py-12">
      <form class="w-full">
        <div
          class="relative flex flex-col mt-8 border-b-2 border-white"
          :class="[setFocus === 'email' ? 'border-yellow':'', formError.find(item => item.field === 'email') ? 'border-red':'']"
        >
          <label for="email" class="text-lg mb-4">Email address</label>
          <input
            type="email"
            name="email"
            ref="email"
            id="email"
            class="focus:outline-none font-bold"
            style="height:40px"
            @focus="setFocus = 'email'"
            @blur="setFocus = ''"
            v-model="form.email"
            @keyup.enter="login"
          >
          <span
            class="absolute pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'email')"
          >{{formError.find(item => item.field === 'email').message}}</span>
        </div>
        <div
          class="relative flex flex-col mt-8 border-b-2 border-white"
          :class="[setFocus === 'password' ? 'border-yellow':'', formError.find(item => item.field === 'password') ? 'border-red':'']"
        >
          <label for="password" class="text-lg mb-4">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            class="focus:outline-none font-bold"
            style="height:40px"
            @focus="setFocus = 'password'"
            @blur="setFocus = ''"
            v-model="form.password"
            @keyup.enter="login"
          >
          <span
            class="absolute pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'password')"
          >{{formError.find(item => item.field === 'password').message}}</span>
        </div>
      </form>
      <div class="mt-8 flex justify-end">
        <nuxt-link
          class="no-underline text-black hover:underline"
          to="/forgot-password"
        >Forgot password ?</nuxt-link>
      </div>
      <div class="mt-5 flex justify-center">
        <button
          class="rounded-lg bg-yellow-dark shadow-md p-8 font-bold text-xl focus:outline-none hover:text-white"
          @click="login"
        >Sign In</button>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      setFocus: '',
      formError: []
    }
  },
  watch: {
    'form.email'(value) {
      let index = this.formError.findIndex(item => item.field === 'email')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
    },
    'form.password'(value) {
      let index = this.formError.findIndex(item => item.field === 'password')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
    }
  },
  mounted() {
    this.$refs.email.focus()
  },
  methods: {
    async login() {
      try {
        this.formError = []
        this.Validate(this.form)
        if (!this.formError.length) {
          this.$axios
            .$post('/api/v1/login', this.form)
            .then(async res => {
              console.log(res)
              const token = res.data.token.token
              this.$axios.setToken(token, 'Bearer')
              this.$auth.$storage.setUniversal('_token.local', 'Bearer ' + token)
              await this.$auth.fetchUser()
              this.$router.push('/')
            })
            .catch(err => {
              this.formError = err.response.data.errors
            })
        }
      } catch (e) {
        console.log(e)
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

