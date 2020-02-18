<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex md:mx-4" style="flex: 0 1 600px;">
        <h3>What's your account details?</h3>
      </div>
    </div>

    <!-- <div class="flex w-full justify-center xl:justify-start">
      <div class="flex my-2 md:m-4" style="flex: 0 1 600px;">
        <span>Basic details about yourself</span>
      </div>
    </div>-->

    <div class="flex w-full justify-center xl:justify-start">
      <div
        class="md:mx-4 flex flex-col p-4 md:p-8 m-1 rounded-lg shadow-lg"
        style="flex: 0 1 600px;"
      >
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
            required
          />

          <AppInput
            v-model="form.last_name"
            :type="'text'"
            :name="'last_name'"
            :label="'Last name'"
            :placeholder="'Your last name'"
            :error="formError.find(error => error.field === 'last_name')"
            @blur="CheckEmptyField(form.last_name, 'last_name')"
            required
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
            required
          />
          <AppDate
            v-model="form.date_of_birth"
            :name="'date_of_birth'"
            :label="'Date of Birth'"
            :error="formError.find(item => item.field === 'date_of_birth')"
            @blur="CheckEmptyField(form.date_of_birth, 'date_of_birth')"
            isBefore
            :limitYear="100"
            :maxYearBefore="10"
            required
          />
          <AppInput
            v-model="form.mobile_number"
            :type="'text'"
            :name="'mobile_number'"
            :label="'Mobile'"
            :error="formError.find(error => error.field === 'mobile_number')"
            @blur="CheckEmptyField(form.mobile_number, 'mobile_number')"
            :info="'In case of emergency'"
            required
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
      <AppButton :label="'Next'" @click="next" :inStyle="'padding:6px 16px;'" />
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppDate from "@/components/Base/AppDate";
const genders = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" }
];
export default {
  components: {
    AppInput,
    AppButton,
    AppDate
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
        work_number: "",
        date_of_birth: ""
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
  mounted() {
    this.form.title = this.accountDetails.title;
    this.form.first_name = this.accountDetails.first_name;
    this.form.last_name = this.accountDetails.last_name;
    this.form.suffix = this.accountDetails.suffix;
    this.form.gender = this.accountDetails.gender;
    this.form.date_of_birth = this.accountDetails.date_of_birth;
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
      this.formError = [];
      this.Validate(this.form, [
        "title",
        "suffix",
        "home_number",
        "work_number"
      ]);
      if (!this.formError.length) {
        // this.form.mobile_number = this.form.mobile_number.toString();
        this.$store.commit("sign-up/SET_ACCOUNT_DETAILS", this.form);
        this.$store.commit("sign-up/SET_ACCOUNT_DETAIL_FORM_ERROR", []);
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