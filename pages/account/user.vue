<template>
  <div class="border-solid rounded-lg shadow-lg p-8">
    <AppFormError :formError="formError" v-if="formError.length > 0" />
    <form class="relative w-full">
      <AppLoading :loading="loading" :message="'Loading'" />
      <AppInput
        v-model="form.email"
        :type="'email'"
        :name="'email'"
        :label="'Email address'"
        :error="formError.find(item => item.field === 'email')"
        @submit="save"
        @blur="CheckEmptyField(form.email, 'email')"
      />
      <div class="-mt-6 mb-4" v-if="email_isVerified === true ">
        <span
          class="text-xs"
        >E-mail is Verified on {{$moment(email_verifiedAt).format('MMM DD, YYYY | hh:mm A')}}</span>
      </div>
      <div class="-mt-6 mb-4" v-if="email_isVerified === false ">
        <span class="text-red-500 text-xs">E-mail is not yet verified.</span>
        <span
          class="p-1 bg-gray-800 rounded text-xs text-white cursor-pointer whitespace-no-wrap"
          @click="resendEmailVerification()"
        >Click here to re-send</span>
      </div>
      <template v-if="user.email_verified_at">
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
          :placeholder="'Role...'"
          :items="roles"
        />
        <div class="text-left mt-5">
          <AppButton :label="'Save changes'" @click="save" />
        </div>
      </template>
    </form>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
import AppFormError from "@/components/Base/AppFormError";
const roles = [
  { value: "Practice Staff", label: "Practice Staff" },
  { value: "Practice Manager", label: "Practice Manager" },
  { value: "Partner", label: "Partner" }
];
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppInput,
    AppButton,
    AppLoading,
    AppFormError
  },
  data() {
    return {
      roles,
      form: {
        email: "",
        title: "",
        first_name: "",
        last_name: "",
        suffix: "",
        practice_role: ""
      },
      email_isVerified: "",
      email_verifiedAt: "",
      loading: false,
      formError: []
    };
  },
  async asyncData({ app, error }) {
    try {
      const response = await app.$axios.$get(`/api/v1/me`);
      const user =
        response.data && response.data.user ? response.data.user : null;
      console.log(user);
      return {
        user
      };
    } catch (err) {
      throw err;
    }
  },
  created() {
    this.form.email = this.user.email;
    this.form.title = this.user.personal_detail.title;
    this.form.first_name = this.user.personal_detail.first_name;
    this.form.last_name = this.user.personal_detail.last_name;
    this.form.suffix = this.user.personal_detail.suffix;
    this.form.practice_role = this.user.practice_detail.practice_role;
    this.email_isVerified = this.user.is_email_verified;
    this.email_verifiedAt = this.user.email_verified_at;
  },
  watch: {
    "form.email"(value) {
      this.CheckEmptyField(this.form.email, "email");
    },
    "form.first_name"(value) {
      this.CheckEmptyField(this.form.first_name, "first_name");
    },
    "form.last_name"(value) {
      this.CheckEmptyField(this.form.last_name, "last_name");
    },
    "form.practice_role"(value) {
      this.CheckEmptyField(this.form.practice_role, "practice_role");
    }
  },
  methods: {
    async save() {
      this.loading = true;
      try {
        this.formError = [];
        this.Validate(this.form, ["title", "suffix"]);
        if (!this.formError.length) {
          const response = await this.$axios.$put(
            `/api/v1/practice/me/account`,
            this.form
          );
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Saved"]
          });
          this.scrollToTop();
          this.loading = false;
        } else {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: ["Please fill up all the forms"]
          });
          this.scrollToTop();
          this.loading = false;
        }
      } catch (err) {
        this.formError = err.response.data.error_messages;
        this.loading = false;
      }
    },
    async resendEmailVerification() {
      try {
        await this.$axios.post(`/api/v1/email-verification/resend`);
        // alert('Confirmation e-mail sent')
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: ["Confirmation e-mail sent"]
        });
      } catch (err) {
        console.log("Something went wrong! ", err);
      }
    }
  }
};
</script>



