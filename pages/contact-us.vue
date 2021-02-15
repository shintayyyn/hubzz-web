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
      <!-- <AppInput
        v-model="form.message"
        :type="'textarea'"
        :name="'message'"
        :label="'Your message'"
        :placeholder="'Enter your message here'"
        :resize="false"
        :error="formError.find(item => item.field === 'message')"
        @keydown.enter.exact.prevent
        @keyup.enter.exact="newline"
      /> -->
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
        message: "",
      },
      formError: [],
    }
  },
  computed: {
    fullname () {
      return `${
        this.user.personal_detail.title ? this.user.personal_detail.title : ""
      } ${this.user.personal_detail.first_name} ${
        this.user.personal_detail.last_name
      }`
    },
    role () {
      if (this.user.domain === "Locum") {
        return `${this.user.locum_detail.profession.name}`
      } else if (this.user.domain === "Practice") {
        return `${this.user.practice_detail.practice_role}`
      }
    },
  },
  async asyncData ({ app, error, }) {
    const response = await app.$axios.$get(`/api/v1/me`)
    const user
      = response.data && response.data.user ? response.data.user : null

    return {
      user,
    }
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

