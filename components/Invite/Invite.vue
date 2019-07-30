<template>
  <div class="rounded-lg shadow-lg pt-10 px-8 pb-8">
    <AppInput
      v-model="form.email"
      :type="'multiemail'"
      :name="'email'"
      :label="`Email addresses to ${$route.query.invite_domain.toUpperCase()}`"
      :placeholder="''"
      :info="'Seperate with commas'"
      :error="formError.find(error => error.field === 'email')"
    />
    <div class="flex justify-start mt-8">
      <div class="text-xs sm:text-sm">The message to be sent to {{$route.query.invite_domain}}</div>
    </div>
    <div class="flex justify-start mt-5">
      <div class="text-xs sm:text-sm font-bold">Have you heard the buzz about hubzz?</div>
    </div>
    <div class="flex justify-start mt-5">
      <span class="text-xs sm:text-sm font-bold">Join hubzz at &nbsp;</span>
      <span class="text-xs sm:text-sm font-bold">
        <a
          href="http://hubzz.co.uk"
          target="_blank"
          class="text-black no-underline hover:underline"
        >hubzz.co.uk</a>
      </span>
    </div>
    <div class="flex justify-start mt-5">
      <AppButton :label="'Send'" @click="send" />
    </div>
  </div>
</template>
<script>
import AppInput from '@/components/Base/AppInput'
import AppButton from '@/components/Base/AppButton'
export default {
  components: {
    AppInput,
    AppButton
  },
  data() {
    return {
      form: {
        email: ''
      },
      formError: [],
    }
  },
  watch: {
    'form.email'() {
      this.formError = this.formError.filter(error => error.field !== 'email')
    },
    $route(to, from) {
      this.formError = []
    }
  },
  methods: {
    send() {
      this.formError = []
      this.Validate(this.form)
      if (!this.formError.length) {
        this.$axios.$post(`api/v1/invite`, { emails: this.form.email, domain: 'Locums' }).then(res => {
          this.form.email = ''
          this.$router.push('/invite?invite=success')
        })
      } else {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: ["Please fill up all the forms"]
        });
      }
    }
  }
}
</script>
<style>
textarea {
  resize: none;
}
button:active {
  transform: translate(2px, 2px);
}
</style>


