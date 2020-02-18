<template>
  <div class="flex flex-col items-center justify-center xl:mx-4 w-full" ref="container">
    <AppFormError class="w-full mb-4" :formError="formError" v-if="formError.length > 0" />
    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex flex-col w-full p-4 md:p-8 m-1 rounded-lg shadow-lg">
        <form class="w-full">
          <AppInput
            v-model="form.name"
            :type="'text'"
            :name="'practice_name'"
            :label="'Practice'"
            :error="this.formError.find(item => item.field === 'practice_name')"
            @blur="CheckEmptyField(form.name,'practice_name')"
            required
          />
          <AppInput
            v-model="form.phone_number"
            :type="'text'"
            :name="'phone_number'"
            :label="'Phone number'"
            :placeholder="'Phone number'"
            :error="this.formError.find(item => item.field === 'phone_number')"
            @blur="CheckEmptyField(form.phone_number,'phone_number')"
            required
          />
          <AppPostCode
            :urlIndex="'/api/v1/clinical-commissioning-groups'"
            :dataIndex="'clinical_commissioning_groups'"
            v-model="form.clinical_commissioning_group_name"
            :name="'clinical_commissioning_group_name'"
            :label="'Clinical Commissioning Group name'"
            :error="formError.find(item => item.field === 'clinical_commissioning_group_name')"
            :inStyle="'background-color:#dae1e7;border-color:white'"
            @blur="CheckEmptyField(form.clinical_commissioning_group_name, 'clinical_commissioning_group_name')"
            required
          />
          <AppInput
            v-model="form.code"
            :type="'text'"
            :name="'code'"
            :label="'Code'"
            :error="this.formError.find(item => item.field === 'code')"
            @blur="CheckEmptyField(form.code,'code')"
            required
          />
          <AppPostCode
            :urlIndex="'/api/v1/postcode-coordinates'"
            v-model="form.postcode"
            :name="'postcode'"
            :label="'Post code'"
            :error="formError.find(item => item.field === 'postcode')"
            :inStyle="'background-color:#dae1e7;border-color:white'"
            @blur="CheckEmptyField(form.postcode, 'postcode')"
            required
          />
          <AppInput
            v-model="form.address_line_1"
            :type="'text'"
            :name="'address_line_1'"
            :label="'address_line_1'"
            :error="this.formError.find(item => item.field === 'address_line_1')"
            @blur="CheckEmptyField(form.address_line_1,'address_line_1')"
            required
          />
          <AppInput
            v-model="form.address_line_2"
            :type="'text'"
            :name="'address_line_2'"
            :label="'address_line_2'"
            :error="this.formError.find(item => item.field === 'address_line_2')"
            @blur="CheckEmptyField(form.address_line_2,'address_line_2')"
            required
          />
          <AppInput
            v-model="form.address_line_3"
            :type="'text'"
            :name="'address_line_3'"
            :label="'address_line_3'"
            :error="this.formError.find(item => item.field === 'address_line_3')"
            @blur="CheckEmptyField(form.address_line_3,'address_line_3')"
            required
          />
          <AppInput
            v-model="form.address_line_4"
            :type="'text'"
            :name="'address_line_4'"
            :label="'address_line_4'"
            :error="this.formError.find(item => item.field === 'address_line_4')"
            @blur="CheckEmptyField(form.address_line_4,'address_line_4')"
            required
          />
          <AppInput
            v-model="form.address_line_5"
            :type="'text'"
            :name="'address_line_5'"
            :label="'address_line_5'"
            :error="this.formError.find(item => item.field === 'address_line_5')"
            @blur="CheckEmptyField(form.address_line_5,'address_line_5')"
            required
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
        address_line_4: "",
        address_line_5: "",
        postcode: "",
        coordinate_x: "",
        coordinate_y: ""
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
  async mounted() {
    if (this.practiceDetails && this.practiceDetails.surgery_id) {
      this.form.name = this.practiceDetails.name;
      this.form.phone_number = this.practiceDetails.phone_number;
      this.form.code = this.practiceDetails.code;
      this.form.clinical_commissioning_group_name = this.practiceDetails.clinical_commissioning_group_name;
      this.form.address_line_1 = this.practiceDetails.address_line_1;
      this.form.address_line_2 = this.practiceDetails.address_line_2;
      this.form.address_line_3 = this.practiceDetails.address_line_3;
      this.form.address_line_4 = this.practiceDetails.address_line_4;
      this.form.address_line_5 = this.practiceDetails.address_line_5;
      this.form.postcode = this.practiceDetails.postcode;
    } else if (
      !this.practiceDetails.surgery_id &&
      this.practiceSurgeryDetails &&
      this.practiceSurgeryDetails.name
    ) {
      this.form.name = this.practiceSurgeryDetails.name;
      this.form.phone_number = this.practiceSurgeryDetails.phone_number;
      this.form.code = this.practiceSurgeryDetails.code;
      this.form.clinical_commissioning_group_name = this.practiceSurgeryDetails.clinical_commissioning_group_name;
      this.form.address_line_1 = this.practiceSurgeryDetails.address_line_1;
      this.form.address_line_2 = this.practiceSurgeryDetails.address_line_2;
      this.form.address_line_3 = this.practiceSurgeryDetails.address_line_3;
      this.form.address_line_4 = this.practiceSurgeryDetails.address_line_4;
      this.form.address_line_5 = this.practiceSurgeryDetails.address_line_5;
      this.form.postcode = this.practiceSurgeryDetails.postcode;
    }

    if (this.practiceSurgeryFormError.length > 0) {
      this.practiceSurgeryFormError.forEach(item => {
        this.formError.push(item);
      });
    }
  },
  methods: {
    checkCoordinates(postcode) {
      return this.$axios
        .$post("/api/v1/postcode-to-coordinates", { postcode })
        .then(res => {
          if (res.data && res.data.postcode_coordinate) {
            this.form.coordinate_x = res.data.postcode_coordinate.coordinate_x;
            this.form.coordinate_y = res.data.postcode_coordinate.coordinate_y;
          }
        })
        .catch(err => {
          console.log("err", err.response || err);
          if (
            err.response.data.status === 404 &&
            err.response.data.message === "Postcode Coordinate Not Found"
          ) {
            this.formError.push({
              field: "postcode",
              message: "Invalid post code"
            });
          }
        });
    },
    async signUp() {
      this.formError = [];
      await this.checkCoordinates(this.form.postcode);
      this.Validate(this.form, [
        "coordinate_x",
        "coordinate_y",
        "address_line_2",
        "address_line_4",
        "address_line_5"
      ]);
      if (!this.formError.length) {
        this.$store.commit("sign-up/SET_PRACTICE_SURGERY_DETAILS", this.form);
        this.$emit("nextTab", "PracticeAccountDetails");
      }
    }
  }
};
</script>
