<template>
  <div class="rounded-lg shadow-lg max-w-md">
    <div class="w-full p-8">
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
        <span class="text-red text-xs">E-mail is not yet verified.</span>
        <span
          class="p-1 bg-grey rounded text-xs"
          @click="resendEmailVerification()"
        >Click here to re-send</span>
      </div>
      <AppInput
        v-model="form.title"
        :type="'text'"
        :name="'title'"
        :label="'Title'"
        :placeholder="''"
        :error="formError.find(item => item.field === 'title')"
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
        :error="formError.find(item => item.field === 'suffix')"
      />
      <AppSelect
        v-model="form.gender"
        :name="'gender'"
        :label="'Gender'"
        :placeholder="'Select...'"
        :error="formError.find(item => item.field === 'gender')"
        :items="[{label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}]"
      />
      <AppInput
        v-model="form.mobile_number"
        :type="'text'"
        :name="'mobile_number'"
        :label="'Mobile Number'"
        :placeholder="''"
        :error="formError.find(item => item.field === 'mobile_number')"
      />
      <div class="rounded-lg bg-grey-light p-8 my-2">
        <AppPostCode
          v-model="form.post_code"
          :name="'post_code'"
          :label="'Post code'"
          @onSelect="onSelect"
          :inStyle="'background-color:#dae1e7;border-color:white'"
        />
        <AppInput
          v-model="form.address_line_1"
          :type="'text'"
          :name="'address_line_1'"
          :label="'Address line 1'"
          :placeholder="''"
          :error="formError.find(item => item.field === 'address_line_1')"
          :inStyle="'background-color:#dae1e7;border-color:white'"
        />
        <AppInput
          v-model="form.address_line_2"
          :type="'text'"
          :name="'address_line_2'"
          :label="'Address line 2 (optional)'"
          :placeholder="''"
          :error="formError.find(item => item.field === 'address_line_2')"
          :inStyle="'background-color:#dae1e7;border-color:white'"
        />
        <AppInput
          v-model="form.address_line_3"
          :type="'text'"
          :name="'address_line_3'"
          :label="'City / Town / District'"
          :placeholder="''"
          :error="formError.find(item => item.field === 'address_line_3')"
          :inStyle="'background-color:#dae1e7;border-color:white'"
        />
      </div>
      <AppButton :label="'Save changes'" @click="save" />
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppPostCode from "@/components/Base/AppPostCode";
import AppSelect from "@/components/Base/AppSelect";
import AppButton from "@/components/Base/AppButton";
export default {
  components: {
    AppInput,
    AppPostCode,
    AppSelect,
    AppButton
  },
  data() {
    return {
      form: {
        email: "",
        title: "",
        first_name: "",
        last_name: "",
        suffix: "",
        gender: "",
        mobile_number: "",
        post_code: "",
        address_line_1: "",
        address_line_2: "",
        address_line_3: ""
      },
      email_isVerified: '',
      email_verifiedAt: '',
      formError: []
    };
  },
  watch: {
    'form.email'(value) {
      this.formError = this.formError.filter(error => error.field !== 'email')
    },
    'form.first_name'() {
      this.formError = this.formError.filter(error => error.field !== 'first_name')
    },
    'form.last_name'() {
      this.formError = this.formError.filter(error => error.field !== 'last_name')
    },
    'form.gender'() {
      this.formError = this.formError.filter(error => error.field !== 'gender')
    },
    'form.mobile_number'() {
      this.formError = this.formError.filter(error => error.field !== 'mobile_number')
    },
    'form.post_code'() {
      this.formError = this.formError.filter(error => error.field !== 'post_code')
    },
    'form.address_line_1'() {
      this.formError = this.formError.filter(error => error.field !== 'address_line_1')
    },
    'form.address_line_3'() {
      this.formError = this.formError.filter(error => error.field !== 'address_line_3')
    },
  },
  created() {
    this.$axios.$get("/api/v1/me").then(res => {
      this.form.email = res.data.user.email;
      this.form.title = res.data.user.personal_detail.title;
      this.form.first_name = res.data.user.personal_detail.first_name;
      this.form.last_name = res.data.user.personal_detail.last_name;
      this.form.suffix = res.data.user.personal_detail.suffix;
      this.form.gender = res.data.user.personal_detail.gender;
      this.form.mobile_number = res.data.user.contact_detail.mobile_number;
      this.form.address_line_1 = res.data.user.address_detail.address.line_1;
      this.form.address_line_2 = res.data.user.address_detail.address.line_2;
      this.form.address_line_3 = res.data.user.address_detail.address.line_3;
      this.form.post_code = res.data.user.address_detail.address.post_code;
      this.email_isVerified = res.data.user.is_email_verified;
      this.email_verifiedAt = res.data.user.email_verified_at
    });
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
    save() {
      try {
        this.formError = [];
        this.Validate(this.form, ['title', 'suffix', 'address_line_2'])
        if (!this.formError.length) {
          this.$axios.$put(`/api/v1/locum/me/account`, this.form).then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Saved"]
            });
          });
        } else {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: ["Please fill up all the forms"]
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    async resendEmailVerification() {
      try {
        await this.$axios.post(`/api/v1/email-verification/resend`)
        alert('Confirmation e-mail sent')
      } catch (err) {
        console.log("Something went wrong! ", err)
      }
    }
  }
};
</script>


