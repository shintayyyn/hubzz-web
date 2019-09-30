<template>
  <div class="modal-container shadow-lg">
    <div class="p-8 max-w-3xl">
      <div @click="$router.push('/profile/users')" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex flex-col mt-8">
        <div class="font-bold text-lg">Create User</div>
        <div class="text-sm">Surgery: {{$auth.user.practice_detail.practice.surgery.name}}</div>
        <div class="flex w-full justify-center xl:justify-start">
          <div class="mx-4 flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
            <form class="w-full">
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
              />
              <AppInput
                v-model="form.last_name"
                :type="'text'"
                :name="'last_name'"
                :label="'Last Name'"
                :error="formError.find(item => item.field === 'last_name')"
              />
              <AppInput v-model="form.suffix" :type="'text'" :name="'suffix'" :label="'Suffix'" />
              <AppInput
                v-model="form.email"
                :type="'email'"
                :name="'email'"
                :label="'Email'"
                :error="formError.find(item => item.field === 'email')"
              />
              <AppInput
                v-model="form.practice_role"
                :type="'select'"
                :name="'practice_role'"
                :label="'Role'"
                :error="formError.find(item => item.field === 'practice_role')"
                :placeholder="'Select...'"
                :items="practice_roles"
              />

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

              <AppInput
                v-model="form.password"
                :type="'password'"
                :name="'password'"
                :label="'Password'"
                :error="formError.find(item => item.field === 'password')"
              />
              <AppInput
                v-model="form.password_confirmation"
                :type="'password'"
                :name="'password_confirmation'"
                :label="'Repeat password to confirm'"
                :error="formError.find(item => item.field === 'password_confirmation')"
              />
            </form>
            <AppButton :label="'Create'" @click="create" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
const practice_roles = [
  { value: "Partner", label: "Partner" },
  { value: "Practice Manager", label: "Practice Manager" },
  { value: "Practice Staff", label: "Practice Staff" }
];
export default {
  components: {
    AppInput,
    AppButton
  },
  data() {
    return {
      practice_roles,
      form: {
        title: "",
        first_name: "",
        last_name: "",
        suffix: "",
        email: "",
        practice_role: "",
        practice_user_role_id: "",
        password: "",
        password_confirmation: ""
      },
      formError: []
    };
  },
  async asyncData({ app, error }) {
    try {
      if (
        !app.$auth.user.practice_detail.role.permissions
          .map(item => item.name)
          .includes("Create Profile Users")
      ) {
        error({
          statusCode: 401,
          message: "You're Not Authorized To View This Page"
        });
      }
      const response = await app.$axios.$get(`/api/v1/practice/practice-roles`);
      let responseRoles =
        response.data && response.data.roles ? response.data.roles : [];
      let roles = [];
      responseRoles.forEach(role => {
        if (role.id != 1) {
          roles.push({ label: role.name, value: role.id });
        }
      });

      return {
        roles
      };
    } catch (err) {
      throw err;
    }
  },
  methods: {
    create() {
      this.formError = [];
      this.Validate(this.form, ["title", "suffix"]);
      if (!this.formError.length) {
        this.$axios
          .$post(`/api/v1/practice/practice-users`, this.form)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            });
            this.$emit("addedUser", res.data.user);
            this.$router.push("/profile/users");
          });
      }
    }
  }
};
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