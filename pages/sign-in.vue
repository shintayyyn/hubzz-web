<template>
  <section class="sign-in-card">
    <div class="flex flex-col">
      <div class="flex flex-row flex-nowrap justify-center mb-16">
        <div class="rounded-full bg-yellow-dark px-12 py-5 font-bold text-sm cursor-pointer">Sign In</div>
        <div
          class="px-12 py-5 font-bold text-sm text-grey cursor-pointer"
          @click="$router.push('sign-up')"
        >Sign Up</div>
      </div>
      <div class="rounded-lg shadow-lg px-8 pb-8 pt-12">
        <div class="w-full flex flex-col">
          <AppInput
            v-model="form.email"
            :type="'email'"
            :name="'email'"
            :label="'Email address'"
            :placeholder="''"
            :error="formError.find(item => item.field === 'email')"
            @submit="login"
          />
          <AppInput
            v-model="form.password"
            :type="'password'"
            :name="'password'"
            :label="'Password'"
            :placeholder="''"
            :error="formError.find(item => item.field === 'password')"
            @submit="login"
          />
        </div>

        <div class="flex justify-end mb-8">
          <span class="hover:underline cursor-pointer">Forgot password?</span>
        </div>
        <div class="flex justify-center">
          <AppButton :label="'Sign In'" @click="login"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppInput from '@/components/Base/AppInput'
import AppButton from '@/components/Base/AppButton'
export default {
  layout: 'auth',
  components: {
    AppInput,
    AppButton
  },
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      formError: []
    }
  },
  watch: {
    'form.email'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'email')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'email', message: 'Required' })
      } else {
        const error = this.ValidateEmail(value)
        if (error) {
          this.formError.push(error)
        }
      }
    },
    'form.password'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'password')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'password', message: 'Required' })
      } else if (value && value.length < 6) {
        this.formError.push({ field: 'password', message: 'Password Must Be Atleast 6 Characters' })
      }
    },
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
              const token = res.data.token.token
              this.$axios.setToken(token, 'Bearer')
              this.$auth.$storage.setUniversal('_token.local', 'Bearer ' + token)
              await this.$auth.fetchUser()
              this.$router.push('/dashboard')
            })
            .catch(err => {
              err.response.data.error_messages.forEach(error => {
                this.formError.push(error)
              })
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

