<template>
  <div class="relative bg-white rounded-lg shadow-lg w-full p-4 md:p-8 lg:w-2/3">
    <AppLoading :loading="loading" spinner />
    <AppFormError :formError="formError" v-if="formError.length > 0" />
    <form class="w-full">
      <AppInput
        v-model="form.email"
        :type="'email'"
        :name="'email'"
        :label="'Email address'"
        :error="formError.find(item => item.field === 'email')"
        @submit="save"
        @blur="CheckEmptyField(form.email, 'email')"
      />
      <div class="-mt-6 mb-4">
        <template v-if="email_verifiedAt">
          <span
            class="text-xs"
          >E-mail is Verified on {{$moment(email_verifiedAt).format('MMM DD, YYYY | hh:mm A')}}</span>
        </template>
        <template v-if="!email_verifiedAt">
          <span class="text-red-500 text-xs">E-mail is not yet verified.</span>
          <span
            class="p-1 bg-gray-800 rounded text-xs text-white cursor-pointer whitespace-no-wrap"
            @click="resendEmailVerification()"
          >Click here to re-send</span>
        </template>
      </div>
      <AppInput
        v-model="form.title"
        :type="'text'"
        :name="'title'"
        :label="'Title'"
        :error="formError.find(item => item.field === 'title')"
        @submit="save"
      />
      <AppInput
        v-model="form.first_name"
        :type="'text'"
        :name="'first_name'"
        :label="'First name'"
        :error="formError.find(item => item.field === 'first_name')"
        @submit="save"
        @blur="CheckEmptyField(form.first_name, 'first_name')"
      />
      <AppInput
        v-model="form.last_name"
        :type="'text'"
        :name="'last_name'"
        :label="'Last name'"
        :error="formError.find(item => item.field === 'last_name')"
        @submit="save"
        @blur="CheckEmptyField(form.last_name, 'last_name')"
      />
      <AppInput
        v-model="form.suffix"
        :type="'text'"
        :name="'suffix'"
        :label="'Suffix'"
        @submit="save"
      />
      <AppInput
        v-model="form.gender"
        :type="'select'"
        :name="'gender'"
        :label="'Gender'"
        :error="formError.find(item => item.field === 'gender')"
        :placeholder="'Select...'"
        :items="[{ label: 'Male', value: 'Male'}, { label: 'Female', value: 'Female' }]"
        @blur="CheckEmptyField(form.gender, 'gender')"
      />
      <AppInput
        v-model="form.mobile_number"
        :type="'text'"
        :name="'mobile_number'"
        :label="'Mobile Number'"
        :error="formError.find(item => item.field === 'mobile_number')"
        @submit="save"
        @blur="CheckEmptyField(form.mobile_number, 'mobile_number')"
      />
      <AppInput
        v-model="form.home_number"
        :type="'text'"
        :name="'home_number'"
        :label="'Home Number'"
        @submit="save"
      />
      <AppInput
        v-model="form.work_number"
        :type="'text'"
        :name="'work_number'"
        :label="'Work Number'"
        @submit="save"
      />
      <div class="rounded-lg bg-gray-400 p-8 my-2">
        <AppPostCode
          v-model="form.post_code"
          :name="'post_code'"
          :label="'Post code'"
          :error="formError.find(item => item.field === 'post_code')"
          :inStyle="'background-color:#dae1e7;border-color:white'"
          @onSelect="onSelect"
          @blur="CheckEmptyField(form.post_code, 'post_code')"
        />
        <AppInput
          v-model="form.address_line_1"
          :type="'text'"
          :name="'address_line_1'"
          :label="'Address line 1'"
          :error="formError.find(item => item.field === 'address_line_1')"
          :inStyle="'background-color:#dae1e7;border-color:white;padding:16px 8px;'"
          @submit="save"
          @blur="CheckEmptyField(form.address_line_1, 'address_line_1')"
        />
        <AppInput
          v-model="form.address_line_2"
          :type="'text'"
          :name="'address_line_2'"
          :label="'Address line 2 (optional)'"
          :inStyle="'background-color:#dae1e7;border-color:white;padding:16px 8px;'"
          @submit="save"
        />
        <AppInput
          v-model="form.address_line_3"
          :type="'text'"
          :name="'address_line_3'"
          :label="'City / Town / District'"
          :error="formError.find(item => item.field === 'address_line_3')"
          :inStyle="'background-color:#dae1e7;border-color:white;padding:16px 8px;'"
          @submit="save"
          @blur="CheckEmptyField(form.address_line_3, 'address_line_3')"
        />
      </div>
      <div class="text-left mt-5">
        <AppButton :label="'Save changes'" @click="save" />
      </div>
    </form>
  </div>
</template>
<script>
import AppFormError from "@/components/Base/AppFormError";
import AppLoading from "@/components/Base/AppLoading";
import AppInput from "@/components/Base/AppInput";
import AppPostCode from "@/components/Base/AppPostCode";
import AppButton from "@/components/Base/AppButton";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppFormError,
    AppLoading,
    AppInput,
    AppPostCode,
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
        home_number: "",
        work_number: "",
        post_code: "",
        address_line_1: "",
        address_line_2: "",
        address_line_3: ""
      },
      formError: [],
      loading: false,
      email_verifiedAt: ""
    };
  },
  watch: {
    "form.email"() {
      this.CheckEmptyField(this.form.email, "email");
    },
    "form.first_name"() {
      this.CheckEmptyField(this.form.first_name, "first_name");
    },
    "form.last_name"() {
      this.CheckEmptyField(this.form.last_name, "last_name");
    },
    "form.gender"() {
      this.CheckEmptyField(this.form.gender, "gender");
    },
    "form.mobile_number"() {
      this.CheckEmptyField(this.form.mobile_number, "mobile_number");
    },
    "form.post_code"() {
      this.CheckEmptyField(this.form.post_code, "post_code");
    },
    "form.address_line_1"() {
      this.CheckEmptyField(this.form.address_line_1, "address_line_1");
    },
    "form.address_line_3"() {
      this.CheckEmptyField(this.form.address_line_3, "address_line_3");
    }
  },
  async asyncData({ app, error }) {
    try {
      const response = await app.$axios.$get("/api/v1/me");
      const user =
        response.data && response.data && response.data.user
          ? response.data.user
          : null;
      return {
        user
      };
    } catch (err) {
      throw err;
    }
  },
  mounted() {
    this.form.email = this.user.email;
    this.form.title = this.user.personal_detail.title;
    this.form.first_name = this.user.personal_detail.first_name;
    this.form.last_name = this.user.personal_detail.last_name;
    this.form.suffix = this.user.personal_detail.suffix;
    this.form.gender = this.user.personal_detail.gender;
    this.form.mobile_number = this.user.contact_detail.mobile_number;
    this.form.home_number = this.user.contact_detail.home_number;
    this.form.work_number = this.user.contact_detail.work_number;
    this.form.address_line_1 = this.user.address_detail.address.line_1;
    this.form.address_line_2 = this.user.address_detail.address.line_2;
    this.form.address_line_3 = this.user.address_detail.address.line_3;
    this.form.post_code = this.user.address_detail.address.post_code;
    this.email_verifiedAt = this.user.email_verified_at;
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
    async save() {
      try {
        this.formError = [];
        this.Validate(this.form, [
          "title",
          "suffix",
          "home_number",
          "work_number",
          "address_line_2"
        ]);
        if (!this.formError.length) {
          this.loading = true;
          await this.$axios.$put(`/api/v1/locum/me/account`, this.form);
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Saved"]
          });
          this.scrollToTop();
          this.loading = false;
        } else {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: ["Please fill up all the forms"]
          });
          this.scrollToTop();
          this.loading = false;
        }
      } catch (err) {
        this.formError = err.response.data.error_messages;
        this.scrollToTop();
        this.loading = false;
      }
    },
    async resendEmailVerification() {
      try {
        this.loading = true;
        await this.$axios.post(`/api/v1/email-verification/resend`);
        this.loading = false;
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: ["Confirmation e-mail sent"]
        });
      } catch (err) {
        this.loading = false;
        this.formError = err.response.data.error_messages;
        console.log("Something went wrong! ", err);
      }
    }
  }
};
</script>


