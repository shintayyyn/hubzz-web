<template>
  <section class="sign-in-card">
    <div class="flex flex-col">
      <div class="rounded-lg shadow-lg px-8 pb-8 pt-12">
        <div class="w-full flex flex-col">
          <AppInput
            v-model="form.password"
            :type="'password'"
            :name="'password'"
            :label="'New password'"
            :placeholder="''"
          />
          <AppInput
            v-model="form.password_confirmation"
            :type="'password'"
            :name="'password_confirmation'"
            :label="'Repeat password to confirm'"
            :placeholder="''"
          />
        </div>
        <div class="flex justify-center">
          <AppButton :label="'Change Password'" @click="reset" />
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
  async asyncData({ app, params, error }) {
    try {
      let response = await app.$axios.$get(`/api/v1/forgot-password/${params.token}`)
      const forgot_password_token = response.data.forgot_password_token
      return {
        forgot_password_token
      }
    } catch (err) {
      if (err) {
        return error({ message: err.response.data.message, statusCode: err.response.data.status })
      }
      throw err
    }
  },
  data() {
    return {
      form: {
        password: '',
        password_confirmation: ''
      },
    }
  },
  methods: {
    reset() {
      this.$axios.$post(`/api/v1/reset-password/${this.forgot_password_token.token}`, this.form).then(res => {
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: [res.message] })
        this.$router.push('/')
      })
    }
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
