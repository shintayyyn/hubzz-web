<template>
  <div class="relative bg-white rounded-lg shadow-lg p-4 md:p-8 max-w-3xl">
    <AppLoading :loading="loading" spinner />
    <!-- <AppFormError :formError="formError" v-if="formError.length > 0" /> -->
    <template v-if="$auth.user.domain === 'Practice'">
      <AppInput
        v-model="practiceForm.email"
        :type="'email'"
        :name="'email'"
        :label="'Email address'"
        :error="formError.find(item => item.field === 'email')"
        @submit="save"
        @blur="CheckEmptyField(practiceForm.email, 'email')"
        required
      />
      <div class="-mt-6 mb-4" v-if="email_verifiedAt">
        <span
          class="text-xs"
        >E-mail is Verified on {{$moment(email_verifiedAt).format('MMM DD, YYYY | hh:mm A')}}</span>
      </div>
      <div class="-mt-6 mb-4" v-if="!email_verifiedAt">
        <span class="text-red-500 text-xs">E-mail is not yet verified.</span>
        <span
          class="p-1 bg-gray-800 rounded text-xs text-white cursor-pointer whitespace-no-wrap"
          @click="resendEmailVerification()"
        >Click here to re-send</span>
      </div>
      <AppInput
        v-model="practiceForm.title"
        :type="'text'"
        :name="'title'"
        :label="'Title'"
        @submit="save"
      />
      <AppInput
        v-model="practiceForm.first_name"
        :type="'text'"
        :name="'first_name'"
        :label="'First name'"
        :error="formError.find(item => item.field === 'first_name')"
        @submit="save"
        @blur="CheckEmptyField(practiceForm.first_name, 'first_name')"
        required
      />
      <AppInput
        v-model="practiceForm.last_name"
        :type="'text'"
        :name="'last_name'"
        :label="'Last name'"
        :error="formError.find(item => item.field === 'last_name')"
        @submit="save"
        @blur="CheckEmptyField(practiceForm.last_name, 'last_name')"
        required
      />
      <AppInput
        v-model="practiceForm.suffix"
        :type="'text'"
        :name="'suffix'"
        :label="'Suffix'"
        @submit="save"
      />
      <AppInput
        v-model="practiceForm.practice_role"
        :type="'select'"
        :name="'practice_role'"
        :label="'Role'"
        :placeholder="'Role...'"
        :items="roles"
        required
      />
      <div class="text-left mt-5">
        <AppButton :label="'Save changes'" @click="save('practice')" />
      </div>
    </template>
    <template v-if="$auth.user.domain === 'Locum'">
      <AppInput
        v-model="locumForm.email"
        :type="'email'"
        :name="'email'"
        :label="'Email address'"
        :error="formError.find(item => item.field === 'email')"
        @submit="save"
        @blur="CheckEmptyField(locumForm.email, 'email')"
        required
      />
      <div class="-mt-4 mb-4">
        <template v-if="email_verifiedAt">
          <span
            class="text-xs"
          >E-mail is Verified on {{$moment(email_verifiedAt).format('MMM DD, YYYY | hh:mm A')}}</span>
        </template>
        <template v-else>
          <span class="text-red-500 text-xs">E-mail is not yet verified.</span>
          <span
            class="my-1 p-1 bg-gray-800 rounded text-xs text-white cursor-pointer whitespace-no-wrap"
            @click="resendEmailVerification()"
          >Click here to re-send</span>
        </template>
      </div>
      <AppInput
        v-model="locumForm.title"
        :type="'text'"
        :name="'title'"
        :label="'Title'"
        :error="formError.find(item => item.field === 'title')"
        @submit="save"
      />
      <AppInput
        v-model="locumForm.first_name"
        :type="'text'"
        :name="'first_name'"
        :label="'First name'"
        :error="formError.find(item => item.field === 'first_name')"
        @submit="save"
        @blur="CheckEmptyField(locumForm.first_name, 'first_name')"
        required
      />
      <AppInput
        v-model="locumForm.last_name"
        :type="'text'"
        :name="'last_name'"
        :label="'Last name'"
        :error="formError.find(item => item.field === 'last_name')"
        @submit="save"
        @blur="CheckEmptyField(locumForm.last_name, 'last_name')"
        required
      />
      <AppInput
        v-model="locumForm.suffix"
        :type="'text'"
        :name="'suffix'"
        :label="'Suffix'"
        @submit="save"
      />
      <AppInput
        v-model="locumForm.gender"
        :type="'select'"
        :name="'gender'"
        :label="'Gender'"
        :error="formError.find(item => item.field === 'gender')"
        :items="[{ label: 'Male', value: 'Male'}, { label: 'Female', value: 'Female' }]"
        @blur="CheckEmptyField(locumForm.gender, 'gender')"
        required
      />
      <AppInput
        v-model="locumForm.mobile_number"
        :type="'text'"
        :name="'mobile_number'"
        :label="'Mobile Number'"
        :error="formError.find(item => item.field === 'mobile_number')"
        @submit="save"
        @blur="CheckEmptyField(locumForm.mobile_number, 'mobile_number')"
        required
      />
      <AppInput
        v-model="locumForm.home_number"
        :type="'text'"
        :name="'home_number'"
        :label="'Home Number'"
        @submit="save"
      />
      <AppInput
        v-model="locumForm.work_number"
        :type="'text'"
        :name="'work_number'"
        :label="'Work Number'"
        @submit="save"
      />
      <div class="rounded-lg bg-gray-400 p-4 md:p-8 my-2">
        <AppPostCode
          :urlIndex="'/api/v1/postcode-coordinates'"
          v-model="locumForm.post_code"
          :name="'post_code'"
          :label="'Post code'"
          :error="formError.find(item => item.field === 'post_code')"
          :inStyle="'background-color:#dae1e7;border-color:white'"
          @blur="CheckEmptyField(locumForm.post_code, 'post_code')"
          required
        />
        <AppInput
          v-model="locumForm.address_line_1"
          :type="'text'"
          :name="'address_line_1'"
          :label="'Address line 1'"
          :error="formError.find(item => item.field === 'address_line_1')"
          :inStyle="'background-color:#dae1e7;border-color:white;padding:16px 8px;'"
          @submit="save"
          @blur="CheckEmptyField(locumForm.address_line_1, 'address_line_1')"
          required
        />
        <AppInput
          v-model="locumForm.address_line_2"
          :type="'text'"
          :name="'address_line_2'"
          :label="'Address line 2 (optional)'"
          :inStyle="'background-color:#dae1e7;border-color:white;padding:16px 8px;'"
          @submit="save"
        />
        <AppInput
          v-model="locumForm.address_line_3"
          :type="'text'"
          :name="'address_line_3'"
          :label="'City / Town / District'"
          :error="formError.find(item => item.field === 'address_line_3')"
          :inStyle="'background-color:#dae1e7;border-color:white;padding:16px 8px;'"
          @submit="save"
          @blur="CheckEmptyField(locumForm.address_line_3, 'address_line_3')"
          required
        />
      </div>
      <div class="text-left mt-5">
        <AppButton :label="'Save changes'" @click="save('locum')" />
      </div>
    </template>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
import AppFormError from "@/components/Base/AppFormError";
import AppPostCode from "@/components/Base/AppPostCode";
const roles = [
  { value: "Practice Staff", label: "Practice Staff" },
  { value: "Practice Manager", label: "Practice Manager" },
  { value: "Partner", label: "Partner" }
];
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppInput,
    AppButton,
    AppLoading,
    AppFormError,
    AppPostCode
  },
  data() {
    return {
      loading: false,
      formError: [],
      email_verifiedAt: "",
      roles,

      practiceForm: {
        email: "",
        title: "",
        first_name: "",
        last_name: "",
        suffix: "",
        practice_role: ""
      },

      locumForm: {
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
      }
    };
  },
  async asyncData({ app, error }) {
    try {
      const response = await app.$axios.$get("/api/v1/me");
      const user =
        response.data && response.data && response.data.user
          ? response.data.user
          : null;

      let practiceForm = {};
      let locumForm = {};
      let email_verifiedAt = "";

      if (user.domain === "Practice") {
        practiceForm.email = user.email;
        practiceForm.title = user.personal_detail.title;
        practiceForm.first_name = user.personal_detail.first_name;
        practiceForm.last_name = user.personal_detail.last_name;
        practiceForm.suffix = user.personal_detail.suffix;
        practiceForm.practice_role = user.practice_detail.practice_role;
        email_verifiedAt = user.email_verified_at;

        return {
          user,
          practiceForm,
          email_verifiedAt
        };
      }
      if (user.domain === "Locum") {
        locumForm.email = user.email;
        locumForm.title = user.personal_detail.title;
        locumForm.first_name = user.personal_detail.first_name;
        locumForm.last_name = user.personal_detail.last_name;
        locumForm.suffix = user.personal_detail.suffix;
        locumForm.gender = user.personal_detail.gender;
        locumForm.mobile_number = user.contact_detail.mobile_number;
        locumForm.home_number = user.contact_detail.home_number;
        locumForm.work_number = user.contact_detail.work_number;
        locumForm.address_line_1 = user.address_detail.address.line_1;
        locumForm.address_line_2 = user.address_detail.address.line_2;
        locumForm.address_line_3 = user.address_detail.address.line_3;
        locumForm.post_code = user.address_detail.address.post_code;
        email_verifiedAt = user.email_verified_at;

        return {
          user,
          locumForm,
          email_verifiedAt
        };
      }
    } catch (err) {
      throw err;
    }
  },
  mounted() {
    this.$socket.on(
      "User Notification Email Pending",
      this.getEmailVerificationRealTime
    );
    this.$socket.on(
      "User Notification Email Verified",
      this.getEmailVerificationRealTime
    );
  },
  destroyed() {
    this.removeListener();
  },
  methods: {
    async getEmailVerificationRealTime() {
      await this.$auth.fetchUser();
      this.email_verifiedAt = this.$auth.user.email_verified_at;
    },
    removeListener() {
      this.$socket.removeListener(
        "User Notification Email Pending",
        this.getEmailVerificationRealTime
      );
      this.$socket.removeListener(
        "User Notification Email Verified",
        this.getEmailVerificationRealTime
      );
    },
    resendEmailVerification() {
      this.$axios
        .$post(`/api/v1/email-verification/resend`)
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
        })
        .catch(err => {
          console.log("err", err.response || err);
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`]
            });
            throw err;
          }
        });
    },
    save(domain) {
      if (domain === "practice") {
        this.formError = [];
        this.Validate(this.practiceForm, ["title", "suffix"]);
        if (!this.formError.length) {
          this.loading = true;
          this.$axios
            .$put(`/api/v1/practice/me/account`, this.practiceForm)
            .then(res => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: ["Saved"]
              });
            })
            .catch(err => {
              console.log("err", err.response || err);
              if (err.response.data.message) {
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "danger",
                  text: [`${err.response.data.message}`]
                });
              }
              if (err.response.data.error_messages) {
                err.response.data.error_messages.forEach(error => {
                  this.formError.push(error);
                });
              }
            })
            .finally(() => {
              this.scrollToTop();
              this.loading = false;
            });
        } else {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: ["Please fill up all the forms"]
          });
          this.scrollToTop();
        }
      }

      if (domain === "locum") {
        this.formError = [];
        this.Validate(this.locumForm, [
          "title",
          "suffix",
          "home_number",
          "work_number",
          "address_line_2"
        ]);
        if (!this.formError.length) {
          this.loading = true;
          this.$axios
            .$put(`/api/v1/locum/me/account`, this.locumForm)
            .then(res => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: ["Saved"]
              });
              this.CheckUserVerification();
            })
            .catch(err => {
              console.log("err", err.response || err);
              if (err.response.data.message) {
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "danger",
                  text: [`${err.response.data.message}`]
                });
              }
              if (err.response.data.error_messages) {
                err.response.data.error_messages.forEach(error => {
                  this.formError.push(error);
                });
              }
            })
            .finally(() => {
              this.scrollToTop();
              this.loading = false;
            });
        } else {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: ["Please fill up all the forms"]
          });
          this.scrollToTop();
        }
      }
    }
  }
};
</script>
