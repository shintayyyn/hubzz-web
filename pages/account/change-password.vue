<template>
  <div class="border-solid rounded-lg shadow-lg p-8">
    <form class="w-full">
      <AppFormError :formError="formError" v-if="formError.length > 0" />
      <AppInput
        v-model="form.old_password"
        :type="'password'"
        :name="'old_password'"
        :label="'Current password'"
        :error="formError.find(item => item.field === 'old_password')"
        @submit="save"
        @blur="CheckEmptyField(form.old_password, 'old_password')"
      />
      <AppInput
        v-model="form.new_password"
        :type="'password'"
        :name="'new_password'"
        :label="'New password'"
        :error="formError.find(item => item.field === 'new_password')"
        @submit="save"
        @blur="CheckEmptyField(form.new_password, 'new_password')"
      />
      <AppInput
        v-model="form.new_password_confirmation"
        :type="'password'"
        :name="'new_password_confirmation'"
        :label="'Repeat password to confirm'"
        :error="formError.find(item => item.field === 'new_password_confirmation')"
        @submit="save"
        @blur="CheckEmptyField(form.new_password_confirmation, 'new_password_confirmation')"
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
    "form.old_password"() {
      this.CheckEmptyField(this.form.old_password, "old_password");
    },
    "form.new_password"() {
      this.CheckEmptyField(this.form.new_password, "new_password");
    },
    "form.new_password_confirmation"() {
      this.CheckEmptyField(
        this.form.new_password_confirmation,
        "new_password_confirmation"
      );
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
        this.scrollToTop();
      }
    }
  }
};
</script>

