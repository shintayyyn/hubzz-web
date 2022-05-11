<template>
  <div class>
    <div class="flex flex-no-wrap justify-start border-b border-sunglow mb-4">
      <div
        class="px-3 py-2 text-sm font-bold border-b-4 border-sunglow"
      >
        Contact Us
      </div>
    </div>

    <div class="relative rounded-lg border p-4">
      <div class="border rounded-lg px-2 py-3 w-1/3">
        <h4 class="text-gray-500 mb-1">
          Receiver
        </h4>

        <AppInput
          v-model="form.receiver_email"
          :type="'select'"
          :name="'receiver_email'"
          :placeholder="'Choose a Receiver'"
          :error="formError.find(item => item.field === 'receiver_email')"
          :items="contactUsEmailReceiverSelections"
          class="px-2"
          @blur="CheckEmptyField(form.receiver_email, 'receiver_email')"
        />
      </div>

      <div class="flex flex-col md:flex-row flex-wrap justify-between mb-4">
        <div class="w-full md:w-1/2">
          <div class="text-sm my-2">
            Email address
          </div>
          <div class="text-sm font-bold">
            {{ user.email }}
          </div>
        </div>

        <div class="w-full md:w-1/2">
          <div class="text-sm my-2">
            Role
          </div>
          <div class="text-sm font-bold">
            {{ role }}
          </div>
        </div>

        <div class="w-full md:w-1/2">
          <div class="text-sm my-2">
            Sender
          </div>
          <div class="text-sm font-bold">
            {{ fullname }}
          </div>
        </div>
      </div>
      
      <div>
        <textarea
          ref="textArea"
          v-model="form.message"
          rows="6" 
          cols="140"
          placeholder="Enter your message here"
          class="border-b-2 focus:border-yellow-400 focus:outline-none py-4 px-2 font-bold text-xs sm:text-sm w-full"
          @keydown.enter.exact="newline"
        />
      </div>
      
      <AppButton :label="'Send'" :disabled="loading" @click="send" />
      <AppLoading :loading="loading" spinner />
    </div>
  </div>
</template>

<script>
import AppButton from "@/components/Base/AppButton"
import AppInput from "@/components/Base/AppInput"
import AppLoading from "@/components/Base/AppLoading"
export default {
  components: {
    AppButton,
    AppLoading,
    AppInput,
  },

  data () {
    return {
      loading: false,
      form: {
        receiver_email: "",
        message: "",
      },
      formError: [],
      contactUsEmailReceivers: [],
    }
  },

  computed: {
    user () {
      return this.$auth.user
    },

    contactUsEmailReceiverSelections () {
      return this.contactUsEmailReceivers.map(contactUsEmailReceiver => ({
        label: contactUsEmailReceiver.email,
        value: contactUsEmailReceiver.email,
        description: contactUsEmailReceiver.description,
      }))
    },

    fullname () {
      return [
        this.user?.title,
        this.user?.first_name,
        this.user?.last_name
      ].filter(v => v).join(' ')
    },

    role () {
      if (this.user.domain === "Locum") {
        return `${this.user.locum_detail.profession.name}`
      } else if (this.user.domain === "Practice") {
        return `${this.user.practice_detail.practice_role}`
      }

      return ''
    },
  },

  mounted () {
    this.loading = true
    this.$axios.get('/api/v1/contact-us/receivers').then((response) => {
      this.contactUsEmailReceivers = response.data.data.contact_us_email_receivers
    }).catch((err) => {
      console.log('err', err.response || err)

      let message = null

      if (err.response) {
        message = err.response.data.message
      } else if (err.request) {
        message = 'Something went wrong!'
      } else {
        message = err.message
      }

      if (message) {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: [`${message}`,],
        })
      }
    }).finally(() => {
      this.loading = false
    })
  },

  methods: {
    newline () {
      this.form.message = `${this.form.message}`
    },

    send () {
      this.formError = []
      this.Validate(this.form)
      if (!this.formError.length) {
        this.loading = true
        this.$axios
          .$post(`/api/v1/contact-us`, this.form)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`,],
            })
            this.form.message = ""
          })
          .catch(err => {
            console.log("err", err.response || err)
            if (err.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: [`${err.response.data.message}`,],
              })
            }
            if (err.response.data.error_messages) {
              this.formError = err.response.data.error_messages
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
  },
}
</script>

<style scoped>
  button:active {
    transform: translate(2px, 2px);
  }
</style>

