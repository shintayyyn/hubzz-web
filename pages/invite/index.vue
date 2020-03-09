<template>
  <section>
    <div v-if="success">
      <div class="rounded-lg shadow-lg pt-10 px-4 md:px-8 pb-8 max-w-sm">
        <div class="flex flex-col text-center">
          <div class="flex justify-center">
            <svgicon name="success-checkmark" height="180" width="180" />
          </div>
          <div class="font-bold text-2xl mt-4">
            Thank you!
          </div>
          <div class="font-bold text-base mt-4">
            Your invitation email have been sent
          </div>
          <AppButton :label="'Confirm'" :inStyle="'padding:5px'" @click="success = false" />
        </div>
      </div>
    </div>

    <div v-else class="relative rounded-lg shadow-lg md:pt-10 p-4 md:px-8 md:pb-8">
      <AppInput v-model="form.email" :type="'multiemail'" :name="'email'" :label="`Email addresses to locums`"
                :placeholder="''" :info="'Seperate with commas'" :error="formError.find(error => error.field === 'email')"
      />

      <div class="flex justify-start mt-8">
        <div class="text-xs sm:text-sm">
          The message to be sent to locums
        </div>
      </div>
      <div class="flex justify-start mt-5">
        <div class="text-xs sm:text-sm font-bold">
          Have you heard the buzz about hubzz?
        </div>
      </div>
      <div class="flex justify-start mt-5">
        <span class="text-xs sm:text-sm font-bold">Join hubzz at &nbsp;</span>
        <span class="text-xs sm:text-sm font-bold">
          <a href="http://hubzz.co.uk" target="_blank" class="text-black no-underline hover:underline">hubzz.co.uk</a>
        </span>
      </div>
      <div class="flex justify-start mt-5">
        <AppButton :label="'Send'" :disabled="loading" @click="send" />
      </div>
      <AppLoading :loading="loading" spinner />
    </div>

    <div class="flex justify-start mt-5">
      <AppButton label="Share In Whatsapp For Locum" @click="shareLocumRegisterInWhatsApp" />
    </div>
  </section>
</template>

<script>
  import AppInput from "@/components/Base/AppInput"
  import AppButton from "@/components/Base/AppButton"
  import AppLoading from "@/components/Base/AppLoading"

  export default {
    transition: {
      name: "fade",
      mode: "out-in"
    },

    components: {
      AppInput,
      AppLoading,
      AppButton
    },

    props: {
      referralCode: {
        type: String,
        required: true,
      },
    },

    data () {
      return {
        loading: false,
        form: {
          email: ""
        },
        formError: [],
        success: false
      }
    },
    watch: {
      "form.email" () {
        this.formError = this.formError.filter(error => error.field !== "emails")
      }
    },
    methods: {
      shareLocumRegisterInWhatsApp () {
        const message = `Have you heard the buzz about hubzz?\nJoin hubzz at ${window.location.origin}/sign-up/locum?referral_code=${this.referralCode}`

        window.open(`https://wa.me/?text=${encodeURI(message)}`)
      },

      send () {
        this.formError = []
        this.Validate(this.form)
        if (!this.formError.length) {
          this.loading = true
          this.$axios
            .$post(`api/v1/invite`, {
              emails: this.form.email.split(","),
              domain: "Locum"
            })
            .then(() => {
              this.form.email = ""
              this.success = true
            })
            .catch(err => {
              console.log("err", err.response || err)
              if (err.response.data.message) {
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "danger",
                  text: [`${err.response.data.message}`]
                })
              }
              if (err.response.data.error_messages) {
                this.formError = err.response.data.error_messages
              }
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: ["Please fill up all the forms"]
          })
        }
      }
    }
  }
</script>