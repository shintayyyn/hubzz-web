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
            name="'title'"
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
          />

          <AppInput
            v-model="form.last_name"
            :type="'text'"
            :name="'last_name'"
            :label="'Last name'"
            :placeholder="'Your last name'"
            :error="formError.find(error => error.field === 'last_name')"
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
            :error="formError.find(item => item.field === 'gender')"
            :placeholder="'Select...'"
            :items="genders"
          />

          <AppInput
            v-model.number="form.mobile_number"
            :type="'text'"
            :name="'mobile_number'"
            :label="'Mobile'"
            :placeholder="''"
            :error="formError.find(error => error.field === 'mobile_number')"
            :info="'In case of emergency'"
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
        mobile_number: ""
      },
      formError: []
    };
  },
  computed: {
    accountDetails() {
      return this.$store.state.signUp.account_details;
    },
    accountFormError() {
      return this.$store.state.signUp.account_detail_form_error;
    }
  },
  watch: {
    "form.first_name"(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === "first_name");
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      // validate
      if (!value) {
        // required
        this.formError.push({
          field: "first_name",
          message: "First Name is Required"
        });
      }
    },
    "form.last_name"(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === "last_name");
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      // validate
      if (!value) {
        // required
        this.formError.push({
          field: "last_name",
          message: "Last Name is Required"
        });
      }
    },
    "form.gender"(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === "gender");
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: "gender", message: "Gender is Required" });
      }
    },
    "form.mobile_number"(value) {
      // splice from formerror
      let index = this.formError.findIndex(
        item => item.field === "mobile_number"
      );
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      // validate
      if (!value) {
        // required
        this.formError.push({
          field: "mobile_number",
          message: "Mobile Number is Required"
        });
      }
    }
  },
  mounted() {
    this.form.title = this.accountDetails.title;
    this.form.first_name = this.accountDetails.first_name;
    this.form.last_name = this.accountDetails.last_name;
    this.form.suffix = this.accountDetails.suffix;
    this.form.gender = this.accountDetails.gender;
    this.form.mobile_number = this.accountDetails.mobile_number;

    if (this.accountFormError.length > 0) {
      this.accountFormError.forEach(item => {
        this.formError.push(item);
      });
    }
  },
  methods: {
    next() {
      try {
        this.formError = [];

        if (!this.form.first_name) {
          this.formError.push({
            field: "first_name",
            message: "First Name is Required"
          });
        }
        if (!this.form.last_name) {
          this.formError.push({
            field: "last_name",
            message: "Last Name is Required"
          });
        }
        if (!this.form.gender) {
          this.formError.push({
            field: "gender",
            message: "Gender is Required"
          });
        }
        if (!this.form.mobile_number) {
          this.formError.push({
            field: "mobile_number",
            message: "Mobile Number is Required"
          });
        }

        if (!this.formError.length) {
          this.form.mobile_number = this.form.mobile_number.toString();
          this.$store.commit("signUp/SET_ACCOUNT_DETAILS", this.form);
          this.$store.commit(
            "signUp/SET_ACTIVE_COMPONENT",
            "LocumAddressDetails"
          );
          // this.$emit("nextTab", "LocumAddressDetails");
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>