<template>
  <div class="relative rounded-lg shadow-lg w-full p-4 md:p-8">
    <AppFormError :formError="formError" v-if="formError.length > 0" />
    <form class="relative w-full">
      <AppLoading :loading="loading" spinner />
      <AppInput
        v-model="form.old_password"
        :type="'password'"
        :name="'old_password'"
        :label="'Current password'"
        :error="formError.find(item => item.field === 'old_password')"
        @submit="update"
        @blur="CheckEmptyField(form.old_password, 'old_password')"
      />
      <AppInput
        v-model="form.new_password"
        :type="'password'"
        :name="'new_password'"
        :label="'New password'"
        :error="formError.find(item => item.field === 'new_password')"
        @submit="update"
        @blur="CheckEmptyField(form.new_password, 'new_password')"
      />
      <AppInput
        v-model="form.new_password_confirmation"
        :type="'password'"
        :name="'new_password_confirmation'"
        :label="'Repeat password to confirm'"
        :error="formError.find(item => item.field === 'new_password_confirmation')"
        @submit="update"
        @blur="CheckEmptyField(form.new_password_confirmation, 'new_password_confirmation')"
      />
      <div class="text-left mt-5">
        <AppButton
          :label="'Update'"
          @click="update"
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
      form: {
        old_password: "",
        new_password: "",
        new_password_confirmation: ""
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
  methods: {
    update() {
      this.Validate(this.form);
      if (!this.formError.length) {
        this.loading = true;
        this.$axios
          .$put(
            `/api/v1/practice/practice-users/${this.$route.params.id}/change-password`,
            this.form
          )
          .then(res => {
            console.log(res);
            this.loading = false;
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Success"]
            });
          })
          .catch(err => {
            this.loading = false;
            this.formError = err.response.data.error_messages;
          });
        // this.form.old_password = "";
        // this.form.new_password = "";
        // this.form.new_password_confirmation = "";
      }
    }
  }
};
</script>