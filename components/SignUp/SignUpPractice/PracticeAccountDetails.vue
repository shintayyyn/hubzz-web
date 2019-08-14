<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="mx-4 flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <form class="w-full">
          <AppInput
            v-model="form.title"
            :type="'text'"
            :name="'title'"
            :label="'Title'"
            :placeholder="'(ex. Mr., Ms., Mrs.)'"
          />
          <AppInput
            v-model="form.first_name"
            :type="'text'"
            :name="'first_name'"
            :label="'First name'"
            :placeholder="'Your first name'"
            :error="this.formError.find(item => item.field === 'first_name')"
          />
          <AppInput
            v-model="form.last_name"
            :type="'text'"
            :name="'last_name'"
            :label="'Last name'"
            :placeholder="'Your last name'"
            :error="this.formError.find(item => item.field === 'last_name')"
          />
          <AppInput
            v-model="form.suffix"
            :type="'text'"
            :name="'suffix'"
            :label="'Suffix'"
            :placeholder="'(ex. Ph.D., M.D., etc.)'"
          />
          <AppSelect
            v-model="form.practice_role"
            :name="'practice_role'"
            :label="'Role'"
            :placeholder="'Select..'"
            :items="practice_roles"
            :error="this.formError.find(item => item.field === 'practice_role')"
          />
          <AppFilterSearch
            v-model="form.practice_list"
            :name="'practice_type_id'"
            :label="'What type of Practice(s) do you do?'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'practice_type_id')"
            :items="practice_list"
          />
          <AppInput
            v-model="form.email"
            :type="'email'"
            :name="'email'"
            :label="'Email'"
            :placeholder="'Your email address'"
            :error="this.formError.find(item => item.field === 'email')"
          />
          <AppInput
            v-model="form.password"
            :type="'password'"
            :name="'password'"
            :label="'Password'"
            :placeholder="'Your password'"
            :error="this.formError.find(item => item.field === 'password')"
          />
          <AppInput
            v-model="form.password_confirmation"
            :type="'password'"
            :name="'password_confirmation'"
            :label="'Repeat password to verify'"
            :placeholder="'Repeat password'"
            :password="form.password"
            :error="this.formError.find(item => item.field === 'password_confirmation')"
          />
          <AppInput
            v-model="form.privacy_policy"
            :type="'single-checkbox'"
            :name="'privacy_policy'"
            :label="'I agree with the Terms and Conditions and Privacy Policy of Hubzz'"
            :placeholder="''"
            :error="this.formError.find(item => item.field === 'privacy_policy')"
          />
        </form>
      </div>
    </div>

    <div class="flex justify-center mt-4">
      <AppButton :label="'<<'" @click="$emit('nextTab', 'PracticeDetails')" />
      <div class="mx-2"></div>
      <AppButton :label="'Next'" @click="signUp" />
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppSelect from "@/components/Base/AppSelect";
import AppButton from "@/components/Base/AppButton";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
const practice_roles = [
  { value: "Partner", label: "Partner" },
  { value: "Practice Manager", label: "Practice Manager" },
  { value: "Practice Staff", label: "Practice Staff" }
];
// const practice_list = [
//   { value: "Partner", label: "Partner" },
//   { value: "Practice Manager", label: "Practice Manager" },
//   { value: "Practice Staff", label: "Practice Staff" }
// ];
export default {
  components: {
    AppInput,
    AppSelect,
    AppButton,
    AppFilterSearch
  },
  data() {
    return {
      // pratice_types: [],
      practice_roles,
      form: {
        practice_list: [],
        title: "",
        first_name: "",
        last_name: "",
        suffix: "",
        practice_role: "",
        // practice_type_id: [],
        email: "",
        password: "",
        password_confirmation: "",
        privacy_policy: false
      },
      formError: []
    };
  },
  computed: {
    practiceTypes() {
      return this.$store.getters["signUp/getPracticeTypes"];
    },
    practiceAccountDetails() {
      return this.$store.state.signUp.practice_account_details;
    },
    practiceAccountFormError() {
      return this.$store.state.signUp.practice_account_detail_form_error;
    }
  },
  created() {
    this.practice_list = this.practiceTypes;
    // this.pratice_types = this.practiceTypes;
    this.practiceAccountDetails.practice_type_id.forEach(id => {
      this.form.practice_type_id.push(
        this.practiceTypes.find(item => item.value === id)
      );
    });
  },
  watch: {
    practiceAccountFormError(value) {
      if (value.length > 0) {
        value.forEach(item => {
          this.formError.push(item);
        });
      }
    }
  },
  mounted() {
    this.form.title = this.practiceAccountDetails.title;
    this.form.first_name = this.practiceAccountDetails.first_name;
    this.form.last_name = this.practiceAccountDetails.last_name;
    this.form.suffix = this.practiceAccountDetails.suffix;
    this.form.practice_role = this.practiceAccountDetails.practice_role;
    this.form.practice_type_id = this.practiceAccountDetails.practice_type_id;
    this.form.email = this.practiceAccountDetails.email;
    this.form.password = this.practiceAccountDetails.password;
    this.form.password_confirmation = this.practiceAccountDetails.password_confirmation;

    if (this.practiceAccountFormError.length > 0) {
      this.practiceAccountFormError.forEach(item => {
        this.formError.push(item);
      });
    }
  },
  methods: {
    // ! ask arvi unknown column 'normalized email'
    signUp() {
      try {
        this.formError = [];
        // this.Validate(this.form, ['title', 'suffix'])
        // this.ValidateSamePassword(this.form.password, this.form.password_confirmation)
        if (!this.formError.length) {
          if (this.form.practice_list < 1) {
            this.formError.push({
              field: "practice_type_id",
              message: "Practice Type is Required"
            });
          }
          this.form.practice_type_id = this.form.practice_list
            ? this.form.practice_list.map(item => item.value)
            : [];
          this.$store.commit("signUp/SET_PRACTICE_ACCOUNT_DETAILS", this.form);
          setTimeout(() => {
            this.$store.dispatch("signUp/registeredPractice");
          }, 1000);
          // response here
          // this.$router.push('/sign-up/success')
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>
<style scoped>
button:active {
  transform: translate(5px, 5px);
}
</style>
