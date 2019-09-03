<template>
  <section>
    <div v-if="success">
      <div class="rounded-lg shadow-lg pt-10 px-8 pb-8 max-w-sm">
        <div class="flex flex-col text-center">
          <div class="flex justify-center">
            <svgicon name="success-checkmark" height="180" width="180" />
          </div>
          <div class="font-bold text-2xl mt-4">Thank you!</div>
          <div class="font-bold text-base mt-4">Your invitation email have been sent</div>
        </div>
      </div>
    </div>
    <div v-else class="rounded-lg shadow-lg pt-10 px-8 pb-8">
      <AppInput
        v-model="form.email"
        :type="'multiemail'"
        :name="'email'"
        :label="`Email addresses to practices`"
        :placeholder="''"
        :info="'Seperate with commas'"
        :error="formError.find(error => error.field === 'email')"
      />
      <div class="flex justify-start mt-8">
        <div class="text-xs sm:text-sm">The message to be sent to practices</div>
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
  </section>
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
      success: false
    }
  },
  watch: {
    'form.email'() {
      this.formError = this.formError.filter(error => error.field !== 'email')
    },
  },
  methods: {
    send() {
      this.formError = []
      this.Validate(this.form)
      if (!this.formError.length) {
        this.$axios.$post(`api/v1/invite`, { emails: this.form.email.split(","), domain: 'Practice' }).then(res => {
          this.form.email = ''
          this.success = true
        }).catch(err => {
          this.formError = err.response.data.messages
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
<style scoped>
textarea {
  resize: none;
}
</style>


