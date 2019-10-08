<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex mx-4" style="flex: 0 1 600px;">
        <h3>What's your account details?</h3>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex m-4" style="flex: 0 1 600px;">
        <span>Basic details about yourself</span>
      </div>
    </div>

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
            :error="formError.find(error => error.field === 'first_name')"
            @blur="CheckEmptyField(form.first_name, 'first_name')"
          />

          <AppInput
            v-model="form.last_name"
            :type="'text'"
            :name="'last_name'"
            :label="'Last name'"
            :placeholder="'Your last name'"
            :error="formError.find(error => error.field === 'last_name')"
            @blur="CheckEmptyField(form.last_name, 'last_name')"
          />
          <AppInput
            v-model="form.suffix"
            :type="'text'"
            :name="'suffix'"
            :label="'Suffix'"
            :placeholder="'(ex. Ph.D., M.D., etc.)'"
          />
          <AppInput
            v-model="form.gender"
            :type="'select'"
            :name="'gender'"
            :label="'Gender'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'gender')"
            @blur="CheckEmptyField(form.gender, 'gender')"
            :items="genders"
          />

          <AppInput
            v-model.number="form.mobile_number"
            :type="'text'"
            :name="'mobile_number'"
            :label="'Mobile'"
            :error="formError.find(error => error.field === 'mobile_number')"
            @blur="CheckEmptyField(form.mobile_number, 'mobile_number')"
            :info="'In case of emergency'"
          />

          <AppInput
            v-model.number="form.home_number"
            :type="'text'"
            :name="'home_number'"
            :label="'Home number'"
          />
          <AppInput
            v-model.number="form.work_number"
            :type="'text'"
            :name="'work_number'"
            :label="'Work number'"
          />
        </form>
      </div>
    </div>

    <div class="flex justify-center mt-4">
      <AppButton :label="'Next'" @click="next" />
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
const genders = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" }
];
export default {
  components: {
    AppInput,
    AppButton
  },
  data() {
    return {
      genders,
      form: {
        title: "",
        first_name: "",
        last_name: "",
        suffix: "",
        gender: "",
        mobile_number: "",
        home_number: "",
        work_number: ""
      },
      formError: []
    };
  },
  computed: {
    accountDetails() {
      return this.$store.getters["sign-up/accountDetails"];
    },
    accountFormError() {
      return this.$store.getters["sign-up/accountFormError"];
    }
  },
  watch: {
    "form.first_name"(value) {
      this.CheckEmptyField(this.form.first_name, "first_name");
    },
    "form.last_name"(value) {
      this.CheckEmptyField(this.form.last_name, "last_name");
    },
    "form.gender"(value) {
      this.CheckEmptyField(this.form.gender, "gender");
    },
    "form.mobile_number"(value) {
      this.CheckEmptyField(this.form.mobile_number, "mobile_number");
    }
  },
  mounted() {
    this.form.title = this.accountDetails.title;
    this.form.first_name = this.accountDetails.first_name;
    this.form.last_name = this.accountDetails.last_name;
    this.form.suffix = this.accountDetails.suffix;
    this.form.gender = this.accountDetails.gender;
    this.form.mobile_number = this.accountDetails.mobile_number;
    this.form.home_number = this.accountDetails.home_number;
    this.form.work_number = this.accountDetails.work_number;

    if (this.accountFormError.length > 0) {
      this.accountFormError.forEach(item => {
        this.formError.push(item);
      });
    }
  },
  methods: {
    next() {
      this.Validate(this.form, [
        "title",
        "suffix",
        "home_number",
        "work_number"
      ]);
      this.formError = [];
      if (!this.formError.length) {
        this.form.mobile_number = this.form.mobile_number.toString();
        this.$store.commit("sign-up/SET_ACCOUNT_DETAILS", this.form);
        this.$store.commit(
          "sign-up/SET_ACTIVE_COMPONENT",
          "LocumAddressDetails"
        );
      } else {
        this.$nextTick(() => {
          this.$parent.$refs.signUpContainer.scrollTop = 0;
        });
      }
    }
  }
};
</script>