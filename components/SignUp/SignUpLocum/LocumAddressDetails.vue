<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex mx-4" style="flex: 0 1 600px;">
        <h4>What's your address?</h4>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start mt-5">
      <div class="mx-4 flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <form class="w-full rounded-lg bg-gray-300 px-8 pb-8">
          <AppPostCode
            v-model="form.post_code"
            :name="'post_code'"
            :label="'Post code'"
            :error="formError.find(error => error.field === 'post_code')"
            :inStyle="'background-color:#dae1e7;border-color:white'"
            @onSelect="onSelect"
            @blur="CheckEmptyField(form.post_code, 'post_code')"
          />
          <AppInput
            v-model="form.address_line_1"
            :type="'text'"
            :name="'address_line_1'"
            :label="'Address line 1'"
            :error="formError.find(error => error.field === 'address_line_1')"
            :inStyle="'background-color:#dae1e7;border-color:white'"
            @blur="CheckEmptyField(form.address_line_1, 'address_line_1')"
          />

          <AppInput
            v-model="form.address_line_2"
            :type="'text'"
            :name="'address_line_2'"
            :label="'Address line 2 (optional)'"
            :placeholder="''"
            :inStyle="'background-color:#dae1e7;border-color:white'"
          />

          <AppInput
            v-model="form.address_line_3"
            :type="'text'"
            :name="'address_line_3'"
            :label="'City / Town / District'"
            :error="formError.find(error => error.field === 'address_line_3')"
            :inStyle="'background-color:#dae1e7;border-color:white'"
            @blur="CheckEmptyField(form.address_line_3, 'address_line_3')"
          />
        </form>
      </div>
    </div>

    <div class="flex justify-center mt-4">
      <AppButton
        :label="'<<'"
        @click="$store.commit('sign-up/SET_ACTIVE_COMPONENT', 'LocumAccountDetails')"
      />
      <div class="mx-2"></div>
      <AppButton :label="'Next'" @click="next" />
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppPostCode from "@/components/Base/AppPostCode";
import AppButton from "@/components/Base/AppButton";
export default {
  components: {
    AppInput,
    AppPostCode,
    AppButton
  },
  data() {
    return {
      form: {
        post_code: "",
        address_line_1: "",
        address_line_2: "",
        address_line_3: ""
      },
      formError: []
    };
  },
  computed: {
    addressDetails() {
      return this.$store.getters["sign-up/addressDetails"];
    },
    addressFormError() {
      return this.$store.getters["sign-up/addressFormError"];
    }
  },
  watch: {
    // "form.post_code"(value) {
    //   this.CheckEmptyField(this.form.post_code, "post_code");
    // },
    // "form.address_line_1"(value) {
    //   this.CheckEmptyField(this.form.address_line_1, "address_line_1");
    // },
    // "form.address_line_3"(value) {
    //   this.CheckEmptyField(this.form.address_line_3, "address_line_3");
    // }
  },
  mounted() {
    this.form.post_code = this.addressDetails.post_code;
    this.form.address_line_1 = this.addressDetails.address_line_1;
    this.form.address_line_2 = this.addressDetails.address_line_2;
    this.form.address_line_3 = this.addressDetails.address_line_3;

    if (this.addressFormError.length > 0) {
      this.addressFormError.forEach(item => {
        this.formError.push(item);
      });
    }
  },
  methods: {
    onSelect(value) {
      let address_components = value.details.result.address_components;
      let postal_code = address_components.find(component =>
        component.types.includes("postal_code")
      );
      let route = address_components.find(component =>
        component.types.includes("route")
      );
      let postal_town = address_components.find(component =>
        component.types.includes("postal_town")
      );
      this.form.post_code = postal_code ? postal_code.long_name : "";
      this.form.address_line_1 = route ? route.long_name : "";
      this.form.address_line_3 = postal_town ? postal_town.long_name : "";
    },
    next() {
      this.formError = [];
      // this.Validate(this.form, ["address_line_2"]);
      if (!this.formError.length) {
        this.$store.commit("sign-up/SET_ADDRESS_DETAILS", this.form);
        this.$store.commit(
          "sign-up/SET_ACTIVE_COMPONENT",
          "LocumProfessionalDetails"
        );
      }
    }
  }
};
</script>
