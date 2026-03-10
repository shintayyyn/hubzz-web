<template>
  <div class="relative w-full">
    <AppLoading :loading="loading" spinner />

    <AppFormError v-if="false && formError.length > 0" :formError="formError" />

    <!-- =========PRACTICE========= -->
    <div
      v-if="!loading && $auth.user.domain === 'Practice'"
      class="flex flex-wrap max-w-3xl"
    >
      <div class="w-full border rounded-lg p-4">
        <AppInput
          v-model="practiceForm.username"
          :type="'text'"
          :name="'username'"
          :label="'Username'"
          :error="formError.find(item => item.field === 'username')"
          required
          @submit="save"
          @blur="CheckEmptyField(practiceForm.username, 'username')"
        />

        <AppInput
          v-model="practiceForm.email"
          :type="'email'"
          :name="'email'"
          :label="'Email Address'"
          :error="formError.find(item => item.field === 'email')"
          required
          @submit="save"
          @blur="CheckEmptyField(practiceForm.email, 'email')"
        />

        <div
          v-if="user && user.email === practiceForm.email"
          class="-mt-4 mb-4"
        >
          <template v-if="user.email_verified">
            <span class="text-xs">E-mail Verified on
              {{ user.email_verified_at_in_gb_formatted }}</span>
          </template>

          <template v-if="!user.email_verified">
            <span class="text-red-500 text-xs">E-mail is not yet verified.</span>

            <span
              class="my-1 p-1 bg-gray-800 rounded text-xs text-white cursor-pointer whitespace-no-wrap"
              @click="resendEmailVerification()"
            >Click here to re-send</span>
          </template>
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
          :label="'First Name'"
          :error="formError.find(item => item.field === 'first_name')"
          required
          @submit="save"
          @blur="CheckEmptyField(practiceForm.first_name, 'first_name')"
        />

        <AppInput
          v-model="practiceForm.last_name"
          :type="'text'"
          :name="'last_name'"
          :label="'Last Name'"
          :error="formError.find(item => item.field === 'last_name')"
          required
          @submit="save"
          @blur="CheckEmptyField(practiceForm.last_name, 'last_name')"
        />

        <AppInput
          v-if="false"
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

        <AppInput
          v-model="practiceForm.memorable_word_category_id"
          type="select"
          label="Memorable Word Category"
          placeholder="Select..."
          :error="
            formError.find(item => item.field === 'memorable_word_category_id')
          "
          :items="memorableWordCategoriesSelectionList"
          required
        />

        <AppInput
          v-model="practiceForm.memorable_word"
          type="text"
          label="Memorable Word"
          placeholder="Your memorable word"
          :error="formError.find(error => error.field === 'memorable_word')"
          required
        />

        <AppDate
          v-model="practiceForm.memorable_date"
          label="Memorable Date"
          :error="formError.find(item => item.field === 'memorable_date')"
          required
        />

        <AppInput
          v-model="practiceForm.memorable_number"
          type="number"
          label="Memorable 6 Digit Number"
          placeholder="Your memorable number"
          :error="formError.find(error => error.field === 'memorable_number')"
          required
          :limit="6"
        />
      </div>

      <div class="flex justify-end w-full mt-5">
        <AppButton :label="'Save changes'" @click="save('practice')" />
      </div>
    </div>

    <!-- ==========LOCUM=========== -->
    <div v-if="!loading && $auth.user.domain === 'Locum'">
      <div class="flex flex-col md:flex-row items-start">
        <div class="w-full md:w-1/2 border rounded-lg p-4 md:mr-2">
          <AppInput
            v-model="locumForm.email"
            :type="'email'"
            :name="'email'"
            :label="'Email Address'"
            :error="formError.find(item => item.field === 'email')"
            required
            @submit="save"
            @blur="CheckEmptyField(locumForm.email, 'email')"
          />

          <div v-if="user && user.email === locumForm.email" class="-mt-4 mb-4">
            <template v-if="user.email_verified">
              <span class="text-xs">E-mail Verified on
                {{ user.email_verified_at_in_gb_formatted }}</span>
            </template>

            <template v-if="!user.email_verified">
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
            :label="'First Name'"
            :error="formError.find(item => item.field === 'first_name')"
            required
            @submit="save"
            @blur="CheckEmptyField(locumForm.first_name, 'first_name')"
          />

          <AppInput
            v-model="locumForm.last_name"
            :type="'text'"
            :name="'last_name'"
            :label="'Last Name'"
            :error="formError.find(item => item.field === 'last_name')"
            required
            @submit="save"
            @blur="CheckEmptyField(locumForm.last_name, 'last_name')"
          />

          <AppInput
            v-if="false"
            v-model="locumForm.suffix"
            :type="'text'"
            :name="'suffix'"
            :label="'Suffix'"
            @submit="save"
          />

          <AppInput
            v-model="genderSelected"
            :type="'select'"
            :name="'genderSelected'"
            :label="'Gender'"
            :error="
              formError.find(
                item => item.field === 'gender' && genderSelected !== 'Other'
              )
            "
            :items="[
              { label: 'Select..', value: '' },
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
              { label: 'Other', value: 'Other' }
            ]"
            required
          />

          <AppInput
            v-if="genderSelected === 'Other'"
            v-model="locumForm.gender"
            :type="'text'"
            :name="'gender'"
            :label="'Please specify'"
            :error="formError.find(item => item.field === 'gender')"
            required
            @submit="save"
          />

          <AppDate
            v-model="locumForm.date_of_birth"
            :name="'date_of_birth'"
            :label="'Date of Birth'"
            :error="formError.find(item => item.field === 'date_of_birth')"
            isBefore
            :limitYear="100"
            :maxYearBefore="10"
            required
            @blur="CheckEmptyField(locumForm.date_of_birth, 'date_of_birth')"
          />

          <AppInput
            v-model="locumForm.mobile_number"
            type="text"
            name="mobile_number"
            label="Mobile Number"
            :error="formError.find(item => item.field === 'mobile_number')"
            :limit="11"
            :showMobilePrefix="true"
            required
            @submit="save"
            @keydown="inputNumberOnly($event)"
            @blur="CheckEmptyField(locumForm.mobile_number, 'mobile_number')"
          />

          <AppInput
            v-model="locumForm.home_number"
            type="text"
            name="home_number"
            label="Home Number"
            :limit="11"
            @keydown="inputTelephone($event)"
            @submit="save"
          />

          <AppInput
            v-model="locumForm.work_number"
            type="text"
            name="work_number"
            label="Work Number"
            :limit="11"
            @keydown="inputTelephone($event)"
            @submit="save"
          />
        </div>

        <div class="w-full md:w-1/2">
          <div class="rounded-lg bg-gray-400 p-4 my-2 md:my-0">
            <AppPostCode
              v-model="locumForm.post_code"
              :urlIndex="'/api/v1/postcode-coordinates'"
              :name="'post_code'"
              :label="'Post Code'"
              :error="formError.find(item => item.field === 'post_code')"
              :inStyle="
                'background-color:#dae1e7;border-color:white; padding: 8px 12px;'
              "
              required
              @blur="CheckEmptyField(locumForm.post_code, 'post_code')"
            />

            <AppInput
              v-model="locumForm.address_line_1"
              :type="'text'"
              :name="'address_line_1'"
              :label="'Address Line 1'"
              :error="formError.find(item => item.field === 'address_line_1')"
              :inStyle="
                'background-color:#dae1e7;border-color:white; padding: 8px 12px;'
              "
              required
              @submit="save"
              @blur="
                CheckEmptyField(locumForm.address_line_1, 'address_line_1')
              "
            />

            <AppInput
              v-model="locumForm.address_line_2"
              :type="'text'"
              :name="'address_line_2'"
              :label="'Address Line 2 (optional)'"
              :inStyle="
                'background-color:#dae1e7;border-color:white; padding: 8px 12px;'
              "
              @submit="save"
            />

            <AppInput
              v-model="locumForm.address_line_3"
              :type="'text'"
              :name="'address_line_3'"
              :label="'City / Town / District'"
              :error="formError.find(item => item.field === 'address_line_3')"
              :inStyle="
                'background-color:#dae1e7;border-color:white; padding: 8px 12px;'
              "
              required
              @submit="save"
              @blur="
                CheckEmptyField(
                  locumForm.address_line_3,
                  'address_line_3',
                  'City / Town / District'
                )
              "
            />
          </div>

          <div class="border rounded-lg p-4 my-2">
            <AppInput
              v-model="locumForm.memorable_word_category_id"
              type="select"
              label="Memorable Word Category"
              placeholder="Select..."
              :error="
                formError.find(
                  item => item.field === 'memorable_word_category_id'
                )
              "
              :items="memorableWordCategoriesSelectionList"
              required
            />

            <AppInput
              v-model="locumForm.memorable_word"
              type="text"
              label="Memorable Word"
              placeholder="Your memorable word"
              :error="formError.find(error => error.field === 'memorable_word')"
              required
            />
            <!--new props maxYearBefore="0" -->
            <AppDate
              v-model="locumForm.memorable_date"
              label="Memorable Date"
              isBefore
              :limitYear="100"
              maxYearBefore="0"
              :error="formError.find(item => item.field === 'memorable_date')"
              required
            />
            <!--end-->
            <AppInput
              v-model="locumForm.memorable_number"
              type="number"
              label="Memorable 6 Digit Number"
              placeholder="Your memorable number"
              :error="
                formError.find(error => error.field === 'memorable_number')
              "
              required
              :limit="6"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-5">
        <AppButton :label="'Save changes'" @click="save('locum')" />
      </div>
    </div>
  </div>
</template>

<script>
import AppInput from "@/components/Base/AppInput";
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
import AppFormError from "@/components/Base/AppFormError";
import AppPostCode from "@/components/Base/AppPostCode";

export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },

  components: {
    AppInput,
    AppDate,
    AppButton,
    AppLoading,
    AppFormError,
    AppPostCode
  },

  data() {
    return {
      loading: false,

      user: null,

      memorableWordCategories: [],

      formError: [],

      roles: [
        { value: "Practice Staff", label: "Practice Staff" },
        { value: "Practice Manager", label: "Practice Manager" },
        { value: "Partner", label: "Partner" }
      ],

      practiceForm: {
        username: "",
        email: "",
        title: "",
        first_name: "",
        last_name: "",
        suffix: "",
        practice_role: "",
        memorable_word_category_id: "",
        memorable_word: "",
        memorable_date: "",
        memorable_number: ""
      },

      genderSelected: "",

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
        address_line_3: "",
        memorable_word_category_id: "",
        memorable_word: "",
        memorable_date: "",
        memorable_number: ""
      }
    };
  },

  computed: {
    memorableWordCategoriesSelectionList() {
      return this.memorableWordCategories.map(({ id, name }) => ({
        label: name,
        value: id
      }));
    },

    authPermissions() {
      return this.$store.getters["permissions"];
    }
  },

  watch: {
    genderSelected(newVal, oldVal) {
      if (newVal === "Male") {
        this.locumForm.gender = "Male";
      } else if (newVal === "Female") {
        this.locumForm.gender = "Female";
      } else if (oldVal === "Male") {
        this.locumForm.gender = "";
      } else if (oldVal === "Female") {
        this.locumForm.gender = "";
      }
    },

    "locumForm.gender"() {
      this.formError = this.formError.filter(
        formError => formError.field !== "gender"
      );

      if (!this.locumForm.gender) {
        this.formError.push({
          message: "Gender is required",
          field: "gender",
          validation: "required"
        });
      }
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

    this.loading = true;
    Promise.all([
      this.$axios
        .get("/api/v1/memorable-word-categories?limit=9999")
        .then(response => response.data.data.memorable_word_categories),
      this.getUser()
    ])
      .then(responses => {
        const [memorableWordCategories] = responses;

        this.memorableWordCategories = memorableWordCategories;
      })
      .catch(this.errorHandler)
      .finally(() => {
        this.loading = false;
      });
  },

  destroyed() {
    this.$socket.removeListener(
      "User Notification Email Pending",
      this.getEmailVerificationRealTime
    );
    this.$socket.removeListener(
      "User Notification Email Verified",
      this.getEmailVerificationRealTime
    );
  },

  methods: {
    async getUser() {
      const response = await this.$axios.get("/api/v1/me");

      const user = response.data.data.user;

      this.user = user;

      if (user.domain === "Practice") {
        let practiceForm = {};

        practiceForm.username = user.username;
        practiceForm.email = user.email;
        practiceForm.title = user.title;
        practiceForm.first_name = user.first_name;
        practiceForm.last_name = user.last_name;
        practiceForm.suffix = user.suffix;
        practiceForm.practice_role = user.practice_detail.practice_role;
        practiceForm.memorable_word_category_id =
          user.memorable_word_category_id;
        practiceForm.memorable_word = user.memorable_word;
        practiceForm.memorable_date = user.memorable_date;
        practiceForm.memorable_number = user.memorable_number;

        this.practiceForm = practiceForm;
      }

      if (user.domain === "Locum") {
        let locumForm = {};

        locumForm.email = user.email;
        locumForm.title =
          user.title || (user.profession_name === "GP" ? "Dr." : "");
        locumForm.first_name = user.first_name;
        locumForm.last_name = user.last_name;
        locumForm.suffix = user.suffix;
        if (user.gender === "Male") {
          this.genderSelected = "Male";
          locumForm.gender = "Male";
        } else if (user.gender === "Female") {
          this.genderSelected = "Female";
          locumForm.gender = "Female";
        } else if (user.gender) {
          this.genderSelected = "Other";
          locumForm.gender = user.gender;
        } else {
          this.genderSelected = "";
          locumForm.gender = "";
        }
        locumForm.date_of_birth = user.date_of_birth;
        // locumForm.mobile_number = user.contact_detail.mobile_number
        locumForm.mobile_number = user.contact_detail.mobile_number
          ? user.contact_detail.mobile_number.replace("+44", "")
          : "";
        locumForm.home_number = user.contact_detail.home_number;
        locumForm.work_number = user.contact_detail.work_number;
        locumForm.address_line_1 = user.address_detail.address.line_1;
        locumForm.address_line_2 = user.address_detail.address.line_2;
        locumForm.address_line_3 = user.address_detail.address.line_3;
        locumForm.post_code = user.address_detail.address.post_code;
        locumForm.memorable_word_category_id = user.memorable_word_category_id;
        locumForm.memorable_word = user.memorable_word;
        locumForm.memorable_date = user.memorable_date;
        locumForm.memorable_number = user.memorable_number;

        this.locumForm = locumForm;

        console.log("locum form", locumForm);
      }
    },

    async getEmailVerificationRealTime() {
      await this.$auth.fetchUser();

      this.user = this.$auth.user;
    },

    errorHandler(err) {
      console.log("err", err.response || err);

      let message = null;

      if (err.response) {
        if (err.response.status === 400 && err.response.data.error_messages) {
          this.formError = err.response.data.error_messages;
        }

        message = err.response.data.message;
      } else if (err.request) {
        message = "Something went wrong!";
      } else {
        message = err.message;
      }

      if (message) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: [`${message}`]
        });
      }
    },

    resendEmailVerification() {
      this.$axios
        .post(`/api/v1/email-verification/resend`)
        .then(response => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${response.data.message}`]
          });
        })
        .catch(this.errorHandler);
    },

    save(domain) {
      if (domain === "practice") {
        this.formError = [];

        this.Validate(
          this.practiceForm,
          ["title", "suffix"],
          [{ field: "address_line_3", display: "City / Town / District" }]
        );

        if (
          this.practiceForm.memorable_number &&
          this.practiceForm.memorable_number.toString().length !== 6
        ) {
          this.formError.push({
            field: "memorable_number",
            message: "Memorable number should be 6 digits"
          });
        }

        if (this.formError.length > 0) {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: ["Please fill up all the forms"]
          });

          this.scrollToTop();

          return;
        }

        this.loading = true;
        this.$axios
          .put(`/api/v1/practice/me/account`, this.practiceForm)
          .then(() => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Saved"]
            });

            this.CheckUserVerification();
          })
          .catch(this.errorHandler)
          .finally(() => {
            this.scrollToTop();
            this.loading = false;
          });
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

        if (
          this.locumForm.memorable_number &&
          this.locumForm.memorable_number.toString().length !== 6
        ) {
          this.formError.push({
            field: "memorable_number",
            message: "Memorable number should be 6 digits"
          });
        }

        if (this.formError.length > 0) {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: ["Please fill up all the forms"]
          });

          this.scrollToTop();

          return;
        }

        this.loading = true;

        // this.locumForm.mobile_number = `+44${this.locumForm.mobile_number}`

        this.$axios
          .put(`/api/v1/locum/me/account`, this.locumForm)
          .then(() => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Saved"]
            });
            this.getUser();
            this.CheckUserVerification();
          })
          .catch(this.errorHandler)
          .finally(() => {
            this.scrollToTop();
            this.loading = false;
          });
      }
    }
  }
};
</script>
