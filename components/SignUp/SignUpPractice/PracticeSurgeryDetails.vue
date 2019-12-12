<template>
  <div class="flex flex-col items-center justify-center xl:mx-4 w-full" ref="container">
    <AppFormError class="w-full mb-4" :formError="formError" v-if="formError.length > 0" />
    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex flex-col w-full p-4 md:p-8 m-1 rounded-lg shadow-lg">
        <form class="w-full">
          <AppInput v-model="form.name" :type="'text'" :name="'name'" :label="'Practice'" />
          <AppInput
            v-model="form.phone_number"
            :type="'text'"
            :name="'phone_number'"
            :label="'Phone number'"
            :placeholder="'Phone number'"
            :error="this.formError.find(item => item.field === 'phone_number')"
            @blur="CheckEmptyField(form.phone_number,'phone_number')"
          />
          <AppInput
            v-model="form.clinical_commissioning_group_name"
            :type="'text'"
            :name="'clinical_commissioning_group_name'"
            :label="'Clinical Commissioning Group name'"
            :error="this.formError.find(item => item.field === 'clinical_commissioning_group_name')"
            @blur="CheckEmptyField(form.clinical_commissioning_group_name,'clinical_commissioning_group_name')"
          />
          <AppInput
            v-model="form.code"
            :type="'text'"
            :name="'code'"
            :label="'Code'"
            :error="this.formError.find(item => item.field === 'code')"
            @blur="CheckEmptyField(form.code,'code')"
          />
          <AppPostCode
            v-model="form.address_post_code"
            :name="'address_post_code'"
            :label="'Post code'"
            :error="formError.find(item => item.field === 'address_post_code')"
            :inStyle="'background-color:#dae1e7;border-color:white'"
            @blur="CheckEmptyField(form.address_post_code, 'address_post_code')"
          />
          <AppInput
            v-model="form.address_line_1"
            :type="'text'"
            :name="'address_line_1'"
            :label="'address_line_1'"
            :error="this.formError.find(item => item.field === 'address_line_1')"
            @blur="CheckEmptyField(form.address_line_1,'address_line_1')"
          />
          <AppInput
            v-model="form.address_line_2"
            :type="'text'"
            :name="'address_line_2'"
            :label="'address_line_2'"
            :error="this.formError.find(item => item.field === 'address_line_2')"
            @blur="CheckEmptyField(form.address_line_2,'address_line_2')"
          />
          <AppInput
            v-model="form.address_line_3"
            :type="'text'"
            :name="'address_line_3'"
            :label="'address_line_3'"
            :error="this.formError.find(item => item.field === 'address_line_3')"
            @blur="CheckEmptyField(form.address_line_3,'address_line_3')"
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
import AppPostCode from "@/components/Base/AppPostCode";
import AppFormError from "@/components/Base/AppFormError";
export default {
  components: {
    AppInput,
    AppButton,
    AppPostCode,
    AppFormError
  },
  data() {
    return {
      form: {
        name: "",
        phone_number: "",
        clinical_commissioning_group_name: "",
        code: "",
        address_line_1: "",
        address_line_2: "",
        address_line_3: "",
        address_post_code: "",
        coordinates_x: "",
        coordinates_y: ""
      },
      formError: []
    };
  },
  computed: {
    practiceDetails() {
      return this.$store.getters["sign-up/practiceDetails"];
    },
    practiceSurgeryDetails() {
      return this.$store.getters["sign-up/practiceSurgeryDetails"];
    },
    practiceSurgeryFormError() {
      return this.$store.getters["sign-up/practiceSurgeryFormError"];
    }
  },
  watch: {
    practiceSurgeryFormError(value) {
      if (value.length > 0) {
        value.forEach(item => {
          this.formError.push(item);
        });
      }
    }
  },
  mounted() {
    this.form.name = this.practiceDetails.name;
    this.form.phone_number = this.practiceDetails.phone_number;
    this.form.code = this.practiceDetails.code;
    this.form.clinical_commissioning_group_name = this.practiceDetails.clinical_commissioning_group_name;
    this.form.address_line_1 = this.practiceDetails.address_line_1;
    this.form.address_line_2 = this.practiceDetails.address_line_2;
    this.form.address_line_3 = this.practiceDetails.address_line_3;
    this.form.address_post_code = this.practiceDetails.address_post_code;
    this.form.coordinates_x = this.practiceDetails.coordinates_x;
    this.form.coordinates_y = this.practiceDetails.coordinates_y;

    if (this.practiceSurgeryFormError.length > 0) {
      this.practiceSurgeryFormError.forEach(item => {
        this.formError.push(item);
      });
    }
  },
  methods: {
    signUp() {
      this.formError = [];
      // input coordinate here manually
      this.form.coordinates_x = "";
      this.form.coordinates_y = "";
      this.Validate(this.form, []);
      if (!this.formError.length) {
        this.$store.commit("sign-up/SET_PRACTICE_SURGERY_DETAILS", submitForm);
        this.$emit("nextTab", "PracticeAccountDetails");
      }
    }
  }
};
</script>
