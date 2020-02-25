<template>
  <div class="relative rounded-lg shadow-lg w-full p-4 md:p-8">
    <AppLoading :loading="loading" spinner />
    <AppInput
      v-model="form.email"
      :type="'email'"
      :name="'email'"
      :label="'Email'"
      :error="formError.find(item => item.field === 'email')"
      @submit="save"
      @blur="CheckEmptyField(form.email, 'email')"
    />
    <AppInput v-model="form.title" :type="'text'" :name="'title'" :label="'Title'" @submit="save" />
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
      :items="user_roles"
      :disabled="!user_roles.length"
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
      class="text-left mt-5"
      v-if="user && user.practice_detail && user.practice_detail.practice_role !== 'Practice User Admin'"
    >
      <AppButton
        :label="'Save changes'"
        @click="save"
        :disabled="loading"
        v-if="authPermissions.includes('Update Profile Users')"
      />

      <AppButton
        :label="'Delete User'"
        @click="modal = true"
        :disabled="loading"
        :customTheme="'bg-red-500 hover:bg-red-600 font-bold md:text-lg text-white'"
        v-if="authPermissions.includes('Update Profile Users')"
      />
    </div>
    <AppConfirmationModal
      :label="'Proceed to delete this user?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="modal"
      @confirm="remove"
      @cancel="modal = false"
    />
  </div>
</template>
<script>
import AppFormError from "@/components/Base/AppFormError";
import AppLoading from "@/components/Base/AppLoading";
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
const practice_roles = [
  { value: "Partner", label: "Partner" },
  { value: "Practice Manager", label: "Practice Manager" },
  { value: "Practice Staff", label: "Practice Staff" }
];
export default {
  components: {
    AppFormError,
    AppLoading,
    AppInput,
    AppButton,
    AppConfirmationModal
  },
  transition: {
    name: "fade",
    mode: "out-in"
  },
  data() {
    return {
      practice_roles,
      user: null,
      user_roles: [],
      form: {
        email: "",
        title: "",
        first_name: "",
        last_name: "",
        suffix: "",
        practice_role: "",
        practice_user_role_id: "",
        status: ""
      },
      loading: false,
      modal: false,
      formError: []
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["permissions"];
    },
    verifiedEmail() {
      return this.user && this.user.email_verified_at ? true : false;
    }
  },
  async asyncData({ app, params, error }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/practice/practice-users/${params.id}`
      );
      const user =
        response.data && response.data.user ? response.data.user : null;

      const responseRoles = await app.$axios.$get(
        `/api/v1/practice/practice-roles?include_all`
      );
      const roles =
        response.data && response.data.roles
          ? response.data.roles.map(item => {
              return {
                label: item.name,
                value: item.id
              };
            })
          : [];

      return {
        user,
        roles
      };
    } catch (err) {
      console.log("err", err || err.response);
      return error({ status: 404, message: "Page Not Found" });
    }
  },
  mounted() {
    this.form.email = this.user.email;
    this.form.title = this.user.personal_detail.title;
    this.form.first_name = this.user.personal_detail.first_name;
    this.form.last_name = this.user.personal_detail.last_name;
    this.form.suffix = this.user.personal_detail.suffix;
    this.form.practice_role = this.user.practice_detail.practice_role;
    this.form.practice_user_role_id = this.user.practice_detail.role
      ? this.user.practice_detail.role.id
      : null;
    this.form.status = this.user.status;
  },
  methods: {
    save() {
      this.Validate(this.form, ["title", "suffix"]);
      if (!this.formError.length) {
        this.loading = true;
        this.$axios
          .$put(
            `/api/v1/practice/practice-users/${this.$route.params.id}/account`,
            this.form
          )
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            });
            this.$emit("updateUser", res.data.user);
            this.$router.push("/profile/users");
          })
          .catch(err => {
            console.log("err", err.response || err);
            if (err.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`]
              });
            }
            if (err.response.data.error_messages) {
              this.formError = err.response.data.error_messages;
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    remove() {
      this.loading = true;
      this.$axios
        .$delete(`/api/v1/practice/practice-users/${this.user.id}`, this.form)
        .then(res => {
          this.loading = false;
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
          // let index = this.users.findIndex(
          // 	item => item.id == this.this.user.id
          // );
          // if (index >= 0) {
          // 	this.users.splice(index, 1);
          // }
          this.modal = false;
          this.$router.push("/profile/users");
        })
        .catch(err => {
          this.loading = false;
          this.modal = false;
          console.log("err", err);
          this.formError = err.response.data.error_messages;
        });
    }
  }
};
</script>