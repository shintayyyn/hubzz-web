<template>
  <div class="relative rounded-lg border w-full p-4">
    <form class="relative w-full">
      <AppLoading :loading="loading" spinner />
      <AppInput
        v-model="form.password"
        :type="'password'"
        :name="'password'"
        :label="'New password'"
        :error="formError.find(item => item.field === 'password')"
        @blur="CheckEmptyField(form.password, 'password')"
      />
      <AppInput
        v-model="form.password_confirmation"
        :type="'password'"
        :name="'password_confirmation'"
        :label="'Repeat password to confirm'"
        :error="formError.find(item => item.field === 'password_confirmation')"
        @blur="CheckEmptyField(form.password_confirmation, 'password_confirmation')"
      />
      <div class="text-left mt-5">
        <AppButton
          v-if="authPermissions.includes('Update Profile Users')"
          :label="'Update'"
          :disabled="loading"
          @click="update"
        />
      </div>
    </form>
  </div>
</template>

<script>
  import AppLoading from "@/components/Base/AppLoading"
  import AppInput from "@/components/Base/AppInput"
  import AppButton from "@/components/Base/AppButton"
  export default {
    components: {
      AppLoading,
      AppInput,
      AppButton
    },
    transition: {
      name: "fade",
      mode: "out-in"
    },
    data () {
      return {
        form: {
          password: "",
          password_confirmation: ""
        },
        loading: false,
        formError: []
      }
    },
    computed: {
      authPermissions () {
        return this.$store.getters["permissions"]
      }
    },
    methods: {
      update () {
        this.Validate(this.form)
        if (!this.formError.length) {
          this.form.password = this.form.password.trim()
          this.form.password_confirmation = this.form.password_confirmation.trim()
          this.loading = true
          this.$axios
            .$put(
              `/api/v1/practice/practice-users/${this.$route.params.id}/change-password`,
              this.form
            )
            .then(() => {
              this.form.old_password = ""
              this.form.password = ""
              this.form.password_confirmation = ""
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: ["Password changed"]
              })
            })
            .catch(err => {
              if (err.response.data.error_messages) {
                err.response.data.error_messages.forEach(error => {
                  this.formError.push({
                    field:
                      error.field === "password" &&
                      error.message === "New Password Do Not Match"
                        ? "password_confirmation"
                        : error.field,
                    message: error.message,
                    validation: error.validation
                  })
                })
              }
              if (err.response.data.message) {
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "danger",
                  text: [`${err.response.data.message}`]
                })
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      }
    }
  }
</script>
