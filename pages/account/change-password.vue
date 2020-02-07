<template>
  <div class="relative bg-white rounded-lg shadow-lg p-4 md:p-8 max-w-3xl">
    <AppLoading :loading="loading" spinner />
    <!-- <transition name="fade">
      <div class="flex items-center border border-green-400 rounded bg-green-200 text-sm px-4 py-1 text-green-800" v-if="updateSuccess">
        <span><svgicon name="success-checkmark" width="16" class="fill-current"/></span>
        <span class="pl-2">Password Updated</span>
      </div>
    </transition>-->
    <!-- <transition name="fade">
      <AppFormError :formError="formError" v-if="formError.length > 0" />
    </transition>-->
    <form class="w-full">
      <div class="relative">
        <AppInput
          v-if="toggleShowCurrentPass === false"
          v-model="form.old_password"
          :type="'password'"
          :name="'old_password'"
          :label="'Current password'"
          :error="formError.find(item => item.field === 'old_password')"
          @submit="update"
          @blur="CheckEmptyField(form.old_password, 'old_password')"
          required
        />
        <AppInput
          v-if="toggleShowCurrentPass"
          v-model="form.old_password"
          :type="'text'"
          :name="'old_password'"
          :label="'Current password'"
          :error="formError.find(item => item.field === 'old_password')"
          @submit="update"
          @blur="CheckEmptyField(form.old_password, 'old_password')"
          required
        />
        <span
          class="absolute top-0 right-0 h-full flex items-center"
          :class="!formError.find(item => item.field === 'old_password') && 'mt-2'"
        >
          <svgicon
            name="eye"
            class="w-6 h-6 cursor-pointer fill-current"
            :class="toggleShowCurrentPass ? 'text-gray-500' : 'text-gray-600'"
            @click="toggleShowCurrentPass = !toggleShowCurrentPass"
          />
        </span>
      </div>
      <div class="relative">
        <AppInput
          v-if="toggleShowNewPass === false"
          v-model="form.new_password"
          :type="'password'"
          :name="'new_password'"
          :label="'New password'"
          :error="formError.find(item => item.field === 'new_password')"
          @submit="update"
          @blur="CheckEmptyField(form.new_password, 'new_password')"
          required
        />
        <AppInput
          v-if="toggleShowNewPass"
          v-model="form.new_password"
          :type="'text'"
          :name="'new_password'"
          :label="'New password'"
          :error="formError.find(item => item.field === 'new_password')"
          @submit="update"
          @blur="CheckEmptyField(form.new_password, 'new_password')"
          required
        />
        <span
          class="absolute top-0 right-0 h-full flex items-center"
          :class="!formError.find(item => item.field === 'new_password') && 'mt-2'"
        >
          <svgicon
            name="eye"
            class="w-6 h-6 cursor-pointer fill-current"
            :class="toggleShowNewPass ? 'text-gray-500' : 'text-gray-600'"
            @click="toggleShowNewPass = !toggleShowNewPass"
          />
        </span>
      </div>
      <div class="relative">
        <AppInput
          v-if="toggleShowNewPass2 === false"
          v-model="form.new_password_confirmation"
          :type="'password'"
          :name="'new_password_confirmation'"
          :label="'Repeat password to confirm'"
          :error="formError.find(item => item.field === 'new_password_confirmation')"
          @submit="update"
          @blur="CheckEmptyField(form.new_password_confirmation, 'new_password_confirmation')"
          required
        />
        <AppInput
          v-if="toggleShowNewPass2"
          v-model="form.new_password_confirmation"
          :type="'text'"
          :name="'new_password_confirmation'"
          :label="'Repeat password to confirm'"
          :error="formError.find(item => item.field === 'new_password_confirmation')"
          @submit="update"
          @blur="CheckEmptyField(form.new_password_confirmation, 'new_password_confirmation')"
          required
        />
        <span
          class="absolute top-0 right-0 h-full flex items-center"
          :class="!formError.find(item => item.field === 'new_password_confirmation') && 'mt-2'"
        >
          <svgicon
            name="eye"
            class="w-6 h-6 cursor-pointer fill-current"
            :class="toggleShowNewPass2 ? 'text-gray-500' : 'text-gray-600'"
            @click="toggleShowNewPass2 = !toggleShowNewPass2"
          />
        </span>
      </div>
      <div class="text-left mt-5">
        <AppButton :label="'Update'" @click="update" :disabled="loading" />
      </div>
    </form>
  </div>
</template>
<script>
import AppFormError from "@/components/Base/AppFormError";
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppFormError,
    AppInput,
    AppButton,
    AppLoading
  },
  data() {
    return {
      loading: false,
      form: {
        old_password: "",
        new_password: "",
        new_password_confirmation: ""
      },
      toggleShowCurrentPass: false,
      toggleShowNewPass: false,
      toggleShowNewPass2: false,
      formError: []
    };
  },
  methods: {
    async update() {
      try {
        this.formError = [];
        this.Validate(this.form);
        if (!this.formError.length) {
          this.form.new_password = this.form.new_password.trim();
          this.form.new_password_confirmation = this.form.new_password_confirmation.trim();
          this.loading = true;
          await this.$axios.$put(`/api/v1/me/change-password`, this.form);
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Password changed"]
          });
          this.form.old_password = "";
          this.form.new_password = "";
          this.form.new_password_confirmation = "";
          this.loading = false;
        } else {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: ["Please fill up all the forms"]
          });
          this.loading = false;
          this.scrollToTop();
        }
      } catch (err) {
        console.log("err", err.response || err);
        if (err.response.data.error_messages) {
          err.response.data.error_messages.forEach(error => {
            this.formError.push({
              field:
                error.field === "new_password"
                  ? "new_password_confirmation"
                  : error.field,
              message: error.message,
              validation: error.validation
            });
          });
        }
        this.loading = false;
        this.scrollToTop();
      }
    }
  }
};
</script>

