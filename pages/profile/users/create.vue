<template>
  <div ref="modalContainer" class="">
    <div class="flex flex-col items-start p-4 max-w-3xl">
      <!-- <nuxt-link :to="'/profile/users'">
        <svgicon name="left-arrow" height="32" width="32" class="cursor-pointer" />
      </nuxt-link> -->
      <div class="font-bold text-lg">
        Create User
      </div>
      <div class="text-sm">
        Surgery: {{ $auth.user.practice_detail.practice.surgery.name }}
      </div>
      <div class="relative rounded-lg border w-full p-4 my-2">
        <AppFormError v-if="formError.length > 0" class="w-full mb-4" :formError="formError" />
        <AppLoading :loading="loading" spinner />
        <AppInput
          v-model="form.title"
          :type="'text'"
          :name="'title'"
          :label="'Title'"
          :error="formError.find(item => item.field === 'title')"
        />
        <AppInput
          v-model="form.first_name"
          :type="'text'"
          :name="'first_name'"
          :label="'First Name'"
          :error="formError.find(item => item.field === 'first_name')"
          required
          @blur="CheckEmptyField(form.first_name, 'first_name')"
        />
        <AppInput
          v-model="form.last_name"
          :type="'text'"
          :name="'last_name'"
          :label="'Last Name'"
          :error="formError.find(item => item.field === 'last_name')"
          required
          @blur="CheckEmptyField(form.first_name, 'last_name')"
        />

        <AppInput
          v-if="false"
          v-model="form.suffix" :type="'text'" :name="'suffix'" :label="'Suffix'"
        />

        <AppInput
          v-model="form.username"
          :type="'text'"
          :name="'username'"
          :label="'Username'"
          :error="formError.find(item => item.field === 'username')"
          required
          @blur="CheckEmptyField(form.first_name, 'username')"
        />
        <AppInput
          v-model="form.email"
          :type="'email'"
          :name="'email'"
          :label="'Email'"
          :error="formError.find(item => item.field === 'email')"
          required
          @blur="CheckEmptyField(form.first_name, 'email')"
        />
        <AppInput
          v-model="form.practice_role"
          :type="'select'"
          :name="'practice_role'"
          :label="'Role'"
          :error="formError.find(item => item.field === 'practice_role')"
          :placeholder="'Select...'"
          :items="practice_roles"
          required
          @blur="CheckEmptyField(form.first_name, 'practice_role')"
        />

        <span v-if="!user_roles.length">
          You haven't created any role yet, create role
          <nuxt-link class="underline" :to="'/roles-and-permissions/roles'">here</nuxt-link>.
        </span>
        <AppInput
          v-model="form.practice_user_role_id"
          :type="'select'"
          :name="'practice_user_role_id'"
          :label="'Practice User Role'"
          :error="formError.find(item => item.field === 'practice_user_role_id')"
          :placeholder="'Select...'"
          :items="user_roles"
          :disabled="!user_roles.length"
          :class="!user_roles.length && 'text-gray-500'"
          required
          @blur="CheckEmptyField(form.first_name, 'practice_user_role_id')"
        />

        <AppInput
          v-model="form.password"
          :type="'password'"
          :name="'password'"
          :label="'Password'"
          :error="formError.find(item => item.field === 'password')"
          required
          @blur="CheckEmptyField(form.first_name, 'password')"
        />
        <AppInput
          v-model="form.password_confirmation"
          :type="'password'"
          :name="'password_confirmation'"
          :label="'Repeat password to confirm'"
          :error="formError.find(item => item.field === 'password_confirmation')"
          required
          @blur="CheckEmptyField(form.first_name, 'password_confirmation')"
        />
        <AppButton :label="'Create'" :disabled="loading" @click="create" />
      </div>
    </div>
  </div>
</template>
<script>
import AppFormError from "@/components/Base/AppFormError"
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
import AppLoading from "@/components/Base/AppLoading"
const practice_roles = [
  { value: "Partner", label: "Partner", },
  { value: "Practice Manager", label: "Practice Manager", },
  { value: "Practice Staff", label: "Practice Staff", },
]
export default {
  components: {
    AppFormError,
    AppInput,
    AppLoading,
    AppButton,
  },
  data () {
    return {
      loading: false,
      practice_roles,
      user_roles: [],
      form: {
        title: "",
        first_name: "",
        last_name: "",
        suffix: "",
        username: "",
        email: "",
        practice_role: "",
        practice_user_role_id: "",
        password: "",
        password_confirmation: "",
      },
      formError: [],
    }
  },
  async mounted () {
    this.loading = true
    await this.getUserRoles()
    this.loading = false
  },
  methods: {
    getUserRoles () {
      this.$axios
        .$get(`/api/v1/practice/practice-roles`)
        .then(res => {
          return res.data.roles.forEach(role => {
            this.user_roles.push({ label: role.name, value: role.id, })
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            return this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`,],
            })
          }
        })
    },
    create () {
      this.formError = []
      this.Validate(this.form, ["title", "suffix",])
      if (!this.formError.length) {
        this.$axios
          .$post(`/api/v1/practice/practice-users`, this.form)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`,],
            })
            this.$emit("addUser", res.data.user)
            this.$router.push("/profile/users")
          })
          .catch(err => {
            console.log("err", err.response || err)
            if (err.response.data.error_messages) {
              err.response.data.error_messages.forEach(error => {
                this.formError.push({
                  field:
                    error.field === "new_password"
                    && error.validation === "confirmed"
                      ? "new_password_confirmation"
                      : error.field,
                  message: error.message,
                  validation: error.validation,
                })
              })
              this.$nextTick(() => {
                this.$refs.modalContainer.scrollTop = 0
              })
            }
            // if (err.response.data) {
            //   this.$store.commit("SET_NOTIFICATION", {
            //     enabled: true,
            //     status: "danger",
            //     text: [`${err.response.data.message}`]
            //   });
            // }
          })
      } else {
        this.$nextTick(() => {
          this.$refs.modalContainer.scrollTop = 0
        })
      }
    },
  },
}
</script>
<style scoped>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>
