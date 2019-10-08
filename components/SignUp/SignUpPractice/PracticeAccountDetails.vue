<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="mx-4 flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <form class="w-full">
          <AppInput
            v-model="form.type"
            :type="'select'"
            :name="'type'"
            :label="'Type'"
            :placeholder="'Select...'"
            :error="this.formError.find(item => item.field === 'type')"
            :items="types"
          />

          <AppFilterSearch
            v-if="form.type === 'Spoke'"
            v-model="form.parent_surgery_id"
            :name="'parent_surgery_id'"
            :label="'Parent Surgery'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'parent_surgery_id')"
            :url="'/api/v1/surgeries'"
            :limitItem="1"
          />

          <AppFilterSearch
            v-if="form.type === 'Hub'"
            v-model="form.children_surgery_id"
            :name="'children_surgery_id'"
            :label="'Children Surgery'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'children_surgery_id')"
            :url="'/api/v1/surgeries'"
          />

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
          <AppInput
            v-model="form.practice_role"
            :type="'select'"
            :name="'practice_role'"
            :label="'Role'"
            :error="formError.find(item => item.field === 'practice_role')"
            :placeholder="'Select...'"
            :items="practice_roles"
          />
          <AppInput
            v-model="form.practice_type_id"
            :type="'multi-checkbox'"
            @checked="checkPracticeType($event)"
            @unchecked="uncheckPracticeType($event)"
            :name="'practice_type_id'"
            :label="'What type of Practice(s) do you do?'"
            :error="formError.find(item => item.field === 'practice_type_id')"
            :lists="practiceTypes"
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
import AppButton from "@/components/Base/AppButton";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
const types = [
  { value: "Hub", label: "Hub" },
  { value: "Spoke", label: "Spoke" },
  { value: "Stand Alone", label: "Stand Alone" }
];
const practice_roles = [
  { value: "Partner", label: "Partner" },
  { value: "Practice Manager", label: "Practice Manager" },
  { value: "Practice Staff", label: "Practice Staff" }
];
export default {
  components: {
    AppInput,
    AppButton,
    AppFilterSearch
  },
  data() {
    return {
      types,
      practice_roles,
      form: {
        type: "",
        parent_surgery_id: [],
        children_surgery_id: [],
        title: "",
        first_name: "",
        last_name: "",
        suffix: "",
        practice_role: "",
        practice_type_id: [],
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
      return this.$store.getters["sign-up/getPracticeTypes"];
    },
    practiceAccountDetails() {
      return this.$store.getters["sign-up/practiceAccountDetails"];
    },
    practiceAccountFormError() {
      return this.$store.getters["sign-up/practiceAccountFormError"];
    }
  },
  created() {
    this.practiceAccountDetails.practice_type_id.forEach(id => {
      this.form.practice_type_id.push(
        this.practiceTypes.find(item => item.value === id)
      );
    });
  },
  watch: {
    // "form.type"(newValue, oldValue) {
    //   if (newValue && oldValue) {
    //     this.form.parent_surgery_id = [];
    //     this.form.children_surgery_id = [];
    //   }
    // },
    practiceAccountFormError(value) {
      if (value.length > 0) {
        value.forEach(item => {
          this.formError.push(item);
        });
      }
    }
  },
  mounted() {
    // this.form.type = this.practiceAccountDetails.type;
    // this.form.parent_surgery_id = this.practiceAccountDetails.parent_surgery_id;
    // this.form.children_surgery_id = this.practiceAccountDetails.children_surgery_id;
    // this.form.title = this.practiceAccountDetails.title;
    // this.form.first_name = this.practiceAccountDetails.first_name;
    // this.form.last_name = this.practiceAccountDetails.last_name;
    // this.form.suffix = this.practiceAccountDetails.suffix;
    // this.form.practice_role = this.practiceAccountDetails.practice_role;
    // this.form.practice_type_id = this.practiceAccountDetails.practice_type_id;
    // this.form.email = this.practiceAccountDetails.email;
    // this.form.password = this.practiceAccountDetails.password;
    // this.form.password_confirmation = this.practiceAccountDetails.password_confirmation;

    if (this.practiceAccountFormError.length > 0) {
      this.practiceAccountFormError.forEach(item => {
        this.formError.push(item);
      });
    }
  },
  methods: {
    signUp() {
      this.formError = [];
      let notRequired = ["title", "suffix"];
      if (this.form.type === "Hub") {
        notRequired.push("parent_surgery_id");
      }
      if (this.form.type === "Spoke") {
        notRequired.push("children_surgery_id");
      }
      if (this.form.type === "Stand Alone") {
        notRequired.push("parent_surgery_id");
        notRequired.push("children_surgery_id");
      }
      this.Validate(this.form, notRequired);
      if (!this.formError.length) {
        let submitForm = {};
        submitForm = {
          ...this.form,
          children_surgery_id: this.form.children_surgery_id.map(
            item => item.value
          ),
          parent_surgery_id: this.form.parent_surgery_id.map(
            item => item.value
          )[0]
        };
        console.log(this.form);
        console.log(submitForm);
        this.$store.commit("sign-up/SET_PRACTICE_ACCOUNT_DETAILS", submitForm);
        setTimeout(() => {
          this.$store.dispatch("sign-up/registeredPractice");
        }, 1000);
      }
    },
    checkPracticeType(value) {
      let selectedArr = [];
      selectedArr.push(value);
      this.form.practice_type_id = [
        ...this.form.practice_type_id,
        ...selectedArr
      ];
    },
    uncheckPracticeType(value) {
      this.form.practice_type_id = this.form.practice_type_id.filter(
        id => id != value
      );
    }
  }
};
</script>
<style scoped>
button:active {
  transform: translate(5px, 5px);
}
</style>
