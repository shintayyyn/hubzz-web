<template>
  <div class="relative rounded-lg border w-full p-4">
    <AppLoading :loading="loading" spinner />

    <template v-if="user.status === 'Deactivated'">
      <div class="flex flex-col">
        <div class="flex flex-col">
          <div class="text-sm">
            Title:
          </div>
          <div class="mx-1" />
          <div class="font-bold">
            {{ user.title }}
          </div>
        </div>
        <div class="flex flex-col mt-4">
          <div class="text-sm">
            Fullname:
          </div>
          <div class="mx-1" />
          <div class="font-bold">
            {{ user.first_name }} {{ user.last_name }}
          </div>
        </div>

        <div v-if="false" class="flex flex-col mt-4">
          <div class="text-sm">
            Suffix:
          </div>
          <div class="mx-1" />
          <div class="font-bold">
            {{ user.suffix }}
          </div>
        </div>

        <div class="flex flex-col mt-4">
          <div class="text-sm">
            Status:
          </div>
          <div class="mx-1" />
          <div class="font-bold">
            {{ user.status }}
          </div>
        </div>
        <div class="flex flex-col mt-4">
          <div class="text-sm">
            Deactivated At:
          </div>
          <div class="mx-1" />
          <div class="font-bold">
            {{ $moment(user.deactivated_at).format('DD/MM/YYYY') }}
          </div>
        </div>
      </div>
    </template>

    <template v-if="user.status !== 'Deactivated'">
      <template v-if="authPermissions.includes('Update Profile Users')">
        <AppInput
          v-model="form.username"
          :type="'text'"
          :name="'username'"
          :label="'Username'"
          :error="formError.find(item => item.field === 'username')"
          @submit="save"
          @blur="CheckEmptyField(form.username, 'username')"
        />
  
        <AppInput
          v-model="form.email"
          :type="'email'"
          :name="'email'"
          :label="'Email'"
          :error="formError.find(item => item.field === 'email')"
          @submit="save"
          @blur="CheckEmptyField(form.email, 'email')"
        />
  
        <AppInput
          v-model="form.title"
          :type="'text'"
          :name="'title'"
          :label="'Title'"
          @submit="save"
        />
  
        <AppInput
          v-model="form.first_name"
          :type="'text'"
          :name="'first_name'"
          :label="'First name'"
          :error="formError.find(item => item.field === 'first_name')"
          @submit="save"
          @blur="CheckEmptyField(form.first_name, 'first_name')"
        />
  
        <AppInput
          v-model="form.last_name"
          :type="'text'"
          :name="'last_name'"
          :label="'Last name'"
          :error="formError.find(item => item.field === 'last_name')"
          @submit="save"
          @blur="CheckEmptyField(form.last_name, 'last_name')"
        />
  
        <AppInput
          v-model="form.suffix"
          :type="'text'"
          :name="'suffix'"
          :label="'Suffix'"
          @submit="save"
        />
  
        <AppInput
          v-model="form.practice_role"
          :type="'select'"
          :name="'practice_role'"
          :label="'Role'"
          :placeholder="'Select...'"
          :items="practice_roles"
        />
  
        <AppInput
          v-model="form.practice_user_role_id"
          :type="'select'"
          :name="'practice_user_role_id'"
          :label="'Practice User Role'"
          :error="formError.find(item => item.field === 'practice_user_role_id')"
          :placeholder="'Select...'"
          :items="roles"
          :disabled="!roles.length"
        />
  
        <AppInput
          v-model="form.status"
          :type="'select'"
          :name="'status'"
          :label="'Status'"
          :error="formError.find(item => item.field === 'status')"
          :items="[{ label: 'Disabled', value: 'Disabled' }, { label: 'Active', value: 'Active' }]"
          :disabled="!Boolean(verifiedEmail)"
        />
  
        <div
          v-if="user && user.practice_detail && user.practice_detail.role.name !== 'Practice User Admin'"
          class="text-left mt-5"
        >
          <AppButton
            v-if="authPermissions.includes('Update Profile Users') && user.status !== 'Deactivated'"
            :label="'Save changes'"
            :disabled="loading"
            @click="save"
          />
  
          <AppButton
            v-if="authPermissions.includes('Deactivate Profile Users') && user.status !== 'Deactivated'"
            :label="'Deactivate User'"
            :disabled="loading"
            :custom-theme="'bg-red-500 hover:bg-red-600 text-white'"
            @click="modal = true"
          />
        </div>
  
        <AppConfirmationModal
          :label="'Proceed to deactivate this user?'"
          :confirm-label="'Yes'"
          :cancel-label="'Cancel'"
          :modal="modal"
          @confirm="remove"
          @cancel="modal = false"
        />
      </template>

      <template v-if="!authPermissions.includes('Update Profile Users')">
        <div class="flex flex-col">
          <div class="flex flex-col">
            <div class="text-sm">
              Username:
            </div>
            <div class="mx-1" />
            <div class="font-bold">
              {{ user.username }}
            </div>
          </div>

          <div class="flex flex-col">
            <div class="text-sm">
              Email:
            </div>
            <div class="mx-1" />
            <div class="font-bold">
              {{ user.email }}
            </div>
          </div>

          <div class="flex flex-col">
            <div class="text-sm">
              Name:
            </div>
            <div class="mx-1" />
            <div class="font-bold">
              {{ user.name }}
            </div>
          </div>

          <div class="flex flex-col">
            <div class="text-sm">
              Role:
            </div>
            <div class="mx-1" />
            <div class="font-bold">
              {{ user.practice_role }}
            </div>
          </div>

          <div class="flex flex-col">
            <div class="text-sm">
              User Role:
            </div>
            <div class="mx-1" />
            <div class="font-bold">
              {{ user && user.practice_detail && user.practice_detail.role ? user.practice_detail.role.name : '' }}
            </div>
          </div>

          <div class="flex flex-col mt-4">
            <div class="text-sm">
              Status:
            </div>
            <div class="mx-1" />
            <div class="font-bold">
              {{ user.status }}
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading"
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"

const practice_roles = [
  { value: "Partner", label: "Partner", },
  { value: "Practice Manager", label: "Practice Manager", },
  { value: "Practice Staff", label: "Practice Staff", },
]

export default {
  components: {
    AppLoading,
    AppInput,
    AppButton,
    AppConfirmationModal,
  },

  transition: {
    name: "fade",
    mode: "out-in",
  },

  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      practice_roles,
      user_roles: [],
      roles: [],
      form: {
        username: "",
        email: "",
        title: "",
        first_name: "",
        last_name: "",
        suffix: "",
        practice_role: "",
        practice_user_role_id: "",
        status: "",
      },
      loading: false,
      modal: false,
      formError: [],
    }
  },

  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },

    verifiedEmail () {
      return this.user && this.user.email_verified_at ? true : false
    },
  },

  async asyncData ({ app, error, }) {
    try {
      const practiceRoles = await app.$axios.get(`/api/v1/practice/practice-roles`)
        .then(response => response.data.data.roles)

      const roles = practiceRoles.map(practiceRole => ({
        label: practiceRole.name,
        value: practiceRole.id,
      }))

      return {
        roles,
      }
    } catch (err) {
      console.log("err", err || err.response)
      return error({ status: 404, message: "Page Not Found", })
    }
  },

  mounted () {
    this.form.username = this.user.username
    this.form.email = this.user.email
    this.form.title = this.user.personal_detail.title
    this.form.first_name = this.user.personal_detail.first_name
    this.form.last_name = this.user.personal_detail.last_name
    this.form.suffix = this.user.personal_detail.suffix
    this.form.practice_role = this.user.practice_detail.practice_role
    this.form.practice_user_role_id = this.user.practice_detail.role
      ? this.user.practice_detail.role.id
      : null
    this.form.status = this.user.status
  },

  methods: {

    save () {
      this.formError = []
      this.Validate(this.form, ["title", "suffix",])
      if (!this.formError.length) {
        this.loading = true
        this.$axios
          .$put(
            `/api/v1/practice/practice-users/${this.$route.params.id}/account`,
            this.form
          )
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`,],
            })
            this.$emit("updateUser", res.data.user)
            this.$router.push("/profile/users")
          })
          .catch(err => {
            console.log("err", err.response || err)
            if (err.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
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

    remove () {
      this.loading = true
      this.$axios
        .$put(`/api/v1/practice/practice-users/${this.user.id}/deactivate`)
        .then(res => {
          console.log(res)
          this.loading = false
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
          // let index = this.users.findIndex(
          // 	item => item.id == this.this.user.id
          // );
          // if (index >= 0) {
          // 	this.users.splice(index, 1);
          // }
          this.modal = false
          this.$router.push("/profile/users")
        })
        .catch(err => {
          this.loading = false
          this.modal = false
          console.log("err", err.response)
          this.formError = err.response.data.error_messages
        })
    },

  },

}
</script>
