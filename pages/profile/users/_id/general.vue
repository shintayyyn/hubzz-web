<template>
  <div class="relative rounded-lg shadow-lg w-full p-4 md:p-8">
    <AppFormError :formError="formError" v-if="formError.length > 0" />
    <form class="relative w-full">
      <AppLoading :loading="loading" spinner />
      <AppInput
        v-model="form.email"
        :type="'email'"
        :name="'email'"
        :label="'Email'"
        :error="formError.find(item => item.field === 'email')"
        :disabled="user.practice_detail.role.name === 'Practice User Admin'"
        @submit="save"
        @blur="CheckEmptyField(form.email, 'email')"
      />
      <AppInput
        disabled
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
        :disabled="user.practice_detail.role.name === 'Practice User Admin'"
        @submit="save"
        @blur="CheckEmptyField(form.first_name, 'first_name')"
      />
      <AppInput
        v-model="form.last_name"
        :type="'text'"
        :name="'last_name'"
        :label="'Last name'"
        :error="formError.find(item => item.field === 'last_name')"
        :disabled="user.practice_detail.role.name === 'Practice User Admin'"
        @submit="save"
        @blur="CheckEmptyField(form.last_name, 'last_name')"
      />
      <AppInput
        v-model="form.suffix"
        :type="'text'"
        :name="'suffix'"
        :label="'Suffix'"
        :disabled="user.practice_detail.role.name === 'Practice User Admin'"
        @submit="save"
      />
      <AppInput
        v-model="form.practice_role"
        :type="'select'"
        :name="'practice_role'"
        :label="'Role'"
        :placeholder="'Select...'"
        :disabled="user.practice_detail.role.name === 'Practice User Admin'"
        :items="practice_roles"
      />
      <template v-if="user.practice_detail.role.name !== 'Practice User Admin'">
        <span v-if="!roles.length">
          You haven't created any role yet, create role
          <nuxt-link class="underline" :to="'/roles-and-permissions/roles'">here</nuxt-link>
        </span>
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
      </template>
      <AppInput
        v-model="form.status"
        :type="'select'"
        :name="'status'"
        :label="'Status'"
        :disabled="user.practice_detail.role.name === 'Practice User Admin'"
        :error="formError.find(item => item.field === 'status')"
        :items="[{ label: 'Disabled', value: 'Disabled' }, { label: 'Active', value: 'Active' }]"
      />
      <div class="text-left mt-5" v-if="user.practice_detail.role.name !== 'Practice User Admin'">
        <AppButton
          :label="'Save changes'"
          @click="save"
          v-if="authPermissions.includes('Update Profile Users')"
        />
      </div>
    </form>
  </div>
</template>
<script>
import AppFormError from "@/components/Base/AppFormError";
import AppLoading from "@/components/Base/AppLoading";
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
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
    AppButton
  },
  transition: {
    name: "fade",
    mode: "out-in"
  },
  props: ["user"],
  data() {
    return {
      practice_roles,
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
      formError: []
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  created() {
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
  async asyncData({ app, error }) {
    try {
      const response = await app.$axios.$get(`/api/v1/practice/practice-roles`);
      let roles =
        response.data && response.data.roles ? response.data.roles : [];
      roles = roles.map(role => {
        return {
          label: role.name,
          value: role.id
        };
      });
      return {
        roles
      };
    } catch (err) {
      throw err;
    }
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
            this.loading = false;
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            });
            this.$emit("updateUser", res.data.user);
          })
          .catch(err => {
            this.loading = false;
            this.formError = err.response.data.error_messages;
          });
      }
    }
  }
};
</script>