<template>
  <div class="border-solid rounded-lg shadow-lg p-8">
    <form class="relative w-full">
      <AppLoading :loading="loading" :message="'Loading'" />
      <AppFormError :formError="formError" v-if="formError.length" />
      <AppInput
        v-model="form.email"
        :type="'email'"
        :name="'email'"
        :label="'Email address'"
        :placeholder="''"
        :error="formError.find(item => item.field === 'email')"
      />
      <div class="-mt-6 mb-4" v-if="email_isVerified === true ">
        <span
          class="text-xs"
        >E-mail is Verified on {{$moment(email_verifiedAt).format('MMM DD, YYYY | hh:mm A')}}</span>
      </div>
      <div class="-mt-6 mb-4" v-if="email_isVerified === false ">
        <span class="text-red-500 text-xs">E-mail is not yet verified.</span>
        <span
          class="p-1 bg-gray-800 rounded text-xs text-white cursor-pointer"
          @click="resendEmailVerification()"
        >Click here to re-send</span>
      </div>
      <AppInput
        v-model="form.title"
        :type="'text'"
        :name="'title'"
        :label="'Title'"
        :placeholder="''"
      />
      <AppInput
        v-model="form.first_name"
        :type="'text'"
        :name="'first_name'"
        :label="'First name'"
        :placeholder="''"
        :error="formError.find(item => item.field === 'first_name')"
      />
      <AppInput
        v-model="form.last_name"
        :type="'text'"
        :name="'last_name'"
        :label="'Last name'"
        :placeholder="''"
        :error="formError.find(item => item.field === 'last_name')"
      />
      <AppInput
        v-model="form.suffix"
        :type="'text'"
        :name="'suffix'"
        :label="'Suffix'"
        :placeholder="''"
      />
      <AppSelect
        v-model="form.practice_role"
        :name="'practice_role'"
        :label="'Role'"
        :placeholder="'Role'"
        :error="formError.find(item => item.field === 'practice_role')"
        :items="roles"
      />
      <div class="text-left mt-5">
        <AppButton :label="'Save changes'" @click="save" />
      </div>
    </form>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppSelect from "@/components/Base/AppSelect";
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
    name: 'fade',
    mode: 'out-in'
  },
  components: {
    AppInput,
    AppSelect,
    AppButton,
    AppLoading,
    AppFormError,
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
      email_isVerified: '',
      email_verifiedAt: '',
      loading: false,
      formError: []
    }
  },
  created() {
    this.$axios.$get('/api/v1/me').then(res => {
      this.form.email = res.data.user.email
      this.form.title = res.data.user.personal_detail.title
      this.form.first_name = res.data.user.personal_detail.first_name
      this.form.last_name = res.data.user.personal_detail.last_name
      this.form.suffix = res.data.user.personal_detail.suffix
      this.form.practice_role = res.data.user.practice_detail.practice_role
      this.email_isVerified = res.data.user.is_email_verified
      this.email_verifiedAt = res.data.user.email_verified_at
      this.loading = false;
    })
  },
  watch: {
    "form.email"(value) {
      let index = this.formError.findIndex(item => item.field === "email");
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      if (!value) {
        this.formError.push({ field: "email", message: "Required" });
      } else {
        const error = this.ValidateEmail(value);
        if (error) {
          this.formError.push(error);
        }
      }
    },
    "form.first_name"(value) {
      let index = this.formError.findIndex(item => item.field === "first_name");
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      if (!value) {
        this.formError.push({ field: "first_name", message: "Required" });
      }
    },
    "form.last_name"(value) {
      let index = this.formError.findIndex(item => item.field === "last_name");
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      if (!value) {
        this.formError.push({ field: "last_name", message: "Required" });
      }
    },
    "form.practice_role"(value) {
      let index = this.formError.findIndex(
        item => item.field === "practice_role"
      );
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      if (!value) {
        this.formError.push({ field: "practice_role", message: "Required" });
      }
    }
  },
  methods: {
    async save() {
      this.loading = true;
      try {
        this.formError = [];
        this.Validate(this.form, ["title", "suffix"]);
        if (!this.formError.length) {
          const response = await this.$axios.$put(`/api/v1/practice/me/account`, this.form)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Saved"]
          })
          this.scrollToTop()
          this.loading = false
        } else {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: ["Please fill up all the forms"]
          });
          this.scrollToTop()
          this.loading = false
        }
      } catch (err) {
        this.formError = err.response.data.error_messages
        this.scrollToTop()
        this.loading = false
      }
    },
    async resendEmailVerification() {
      try {
        await this.$axios.post(`/api/v1/email-verification/resend`)
        // alert('Confirmation e-mail sent')
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: ['Confirmation e-mail sent'] })
      } catch (err) {
        console.log("Something went wrong! ", err)
      }
    }
  }
};
</script>



