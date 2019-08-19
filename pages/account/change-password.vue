<template>
  <div class="border-solid rounded-lg shadow-lg p-8">
    <form class="w-full">
      <AppFormError :formError="formError" v-if="formError.length > 0" />
      <AppInput
        v-model="form.old_password"
        :type="'password'"
        :name="'old_password'"
        :label="'Current password'"
        :placeholder="''"
      />
      <AppInput
        v-model="form.new_password"
        :type="'password'"
        :name="'new_password'"
        :label="'New password'"
        :placeholder="''"
      />
      <AppInput
        v-model="form.new_password_confirmation"
        :type="'password'"
        :name="'new_password_confirmation'"
        :label="'Repeat password to confirm'"
        :placeholder="''"
      />

      <div class="text-left mt-5">
        <AppButton :label="'Update'" @click="update" />
      </div>
    </form>
  </div>
</template>
<script>
import AppFormError from "@/components/Base/AppFormError";
import AppInput from "@/components/Base/AppInput";
import AppSelect from "@/components/Base/AppSelect";
import AppButton from "@/components/Base/AppButton";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppFormError,
    AppInput,
    AppSelect,
    AppButton
  },
  data() {
    return {
      form: {
        old_password: "",
        new_password: "",
        new_password_confirmation: ""
      },
      formError: []
    };
  },
  watch: {
    "form.old_password"(value) {
      let index = this.formError.findIndex(
        item => item.field === "old_password"
      );
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      if (!value) {
        this.formError.push({
          field: "old_password",
          message: "Current Password Required"
        });
      }
    },
    "form.new_password"(value) {
      let index = this.formError.findIndex(
        item => item.field === "new_password"
      );
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      if (!value) {
        this.formError.push({
          field: "new_password",
          message: "New Password Required"
        });
      }
    },
    "form.new_password_confirmation"(value) {
      let index = this.formError.findIndex(
        item => item.field === "new_password_confirmation"
      );
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      if (!value) {
        this.formError.push({
          field: "new_password_confirmation",
          message: "Password Confirmation Required"
        });
      } else {
        const error = this.ValidateSamePassword(
          this.form.new_password,
          value,
          "new_password_confirmation"
        );
        if (error) {
          this.formError.push(error);
        }
      }
    }
  },
  methods: {
    async update() {
      try {
        this.formError = [];
        this.Validate(this.form);
        if (!this.formError.length) {
          await this.$axios.$put(`/api/v1/me/change-password`, this.form);
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Password changed"]
          });
        } else {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: ["Please fill up all the forms"]
          });
          this.scrollToTop();
        }
      } catch (err) {
        this.formError = err.response.data.error_messages;
      }
    }
  }
};
</script>

