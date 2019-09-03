<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div class="w-full p-0 lg:w-2/3 lg:pr-4 order-2 lg:order-1">
      <div class="relative rounded-lg shadow-lg w-full p-8">
        <AppFormError :formError="formError" v-if="formError.length > 0" />
        <AppLoading :loading="loading" :message="'Loading'" />
        <AppInput
          v-model="form.gmc_or_nmc_number"
          :type="'text'"
          :name="'gmc_or_nmc_number'"
          :label="'GMC / NMC Number'"
          :error="formError.find(item => item.field === 'gmc_or_nmc_number')"
          :info="'For compliance; to be verified by the hubzz team'"
          @submit="save"
          @blur="CheckEmptyField(form.gmc_or_nmc_number, 'gmc_or_nmc_number')"
        />
        <AppInput
          v-model="form.mpl_or_npl_number"
          :type="'text'"
          :name="'mpl_or_npl_number'"
          :label="'MPL / NPL Number'"
          :error="formError.find(item => item.field === 'mpl_or_npl_number')"
          :info="'For compliance; to be verified by the hubzz team'"
          @submit="save"
          @blur="CheckEmptyField(form.mpl_or_npl_number, 'mpl_or_npl_number')"
        />
        <AppInput
          v-model="form.nhs_smart_card_id_number"
          :type="'text'"
          :name="'nhs_smart_card_id_number'"
          :label="'Your NHS Smart Card ID number'"
          @submit="save"
        />
        <AppInput
          v-model="form.headline"
          :type="'text'"
          :name="'headline'"
          :label="'Headline'"
          :info="'A short headline about yourself to show to Practices'"
          @submit="save"
        />
        <AppInput
          v-model="form.short_biography"
          :type="'textarea'"
          :name="'short_biography'"
          :label="'Short Biography'"
          :info="'A little bit about yourself to inform to the Practices'"
          :resize="false"
          @submit="save"
        />
        <AppInput
          v-model="form.special_requirements"
          :type="'textarea'"
          :name="'special_requirements'"
          :label="'Special requirements'"
          :info="'Information for Practices for your own needs'"
          :resize="false"
          @submit="save"
        />
        <AppInput
          v-model="form.profession_id"
          :type="'select'"
          :name="'profession_id'"
          :label="'Profession'"
          :placeholder="'Select...'"
          :items="professions"
        />
        <AppFilterSearch
          v-model="form.qualification_id"
          :name="'qualification_id'"
          :label="'Specialty'"
          :placeholder="'Select...'"
          :error="formError.find(item => item.field === 'qualification_id')"
          :info="'Choose at least one qualification'"
          :url="'/api/v1/qualifications'"
          :professionCategoryId="professionCategoryId.toString()"
          @add="CheckEmptyField(form.qualification_id, 'qualification_id')"
          @remove="CheckEmptyField(form.qualification_id, 'qualification_id')"
        />
        <AppFilterSearch
          v-model="form.clinical_system_id"
          :name="'clinical_system_id'"
          :label="'Clinical systems'"
          :placeholder="'Select...'"
          :error="formError.find(item => item.field === 'clinical_system_id')"
          :info="'Choose at least one IT system'"
          :url="'/api/v1/clinical-systems'"
          @add="CheckEmptyField(form.clinical_system_id, 'clinical_system_id')"
          @remove="CheckEmptyField(form.clinical_system_id, 'clinical_system_id')"
        />
        <AppFilterSearch
          v-model="form.spoken_language_id"
          :name="'spoken_language_id'"
          :label="'Spoken languages'"
          :placeholder="'Select...'"
          :info="'Choose other languages you can speak'"
          :url="'/api/v1/spoken-languages'"
          :defaultItem="'English'"
        />
        <div class="flex flex-col my-8">
          <div class="flex flex-row justify-between">
            <label for="rates" class="text-xs sm:text-sm py-1">Your preferred rates £</label>
            <div class="rounded-lg bg-gray-300 p-1 text-xs sm:text-sm">To match available jobs with</div>
          </div>
          <div class="flex flex-row flex-wrap justify-between">
            <div class="flex flex-col w-full sm:w-1/3 px-1">
              <label for="rates" class="text-xs sm:text-sm py-1">Per Hour</label>
              <div class="flex flex-row flex-no-wrap">
                <AppInput
                  v-model="form.min_rate_per_hour"
                  :type="'text'"
                  :name="'min_rate_per_hour'"
                  :label="'From £'"
                  :error="formError.find(item => item.field === 'min_rate_per_hour')"
                  @submit="save"
                  @blur="CheckEmptyField(form.min_rate_per_hour, 'min_rate_per_hour')"
                />
                <div class="mx-1"></div>
                <AppInput
                  v-model="form.max_rate_per_hour"
                  :type="'text'"
                  :name="'max_rate_per_hour'"
                  :label="'To £'"
                  :error="formError.find(item => item.field === 'max_rate_per_hour')"
                  @submit="save"
                  @blur="CheckEmptyField(form.max_rate_per_hour, 'max_rate_per_hour')"
                />
              </div>
            </div>
            <div class="flex flex-col w-full sm:w-1/3 px-1">
              <label for="rates" class="text-xs sm:text-sm py-1">Per Half Day Session</label>
              <div class="flex flex-row flex-no-wrap">
                <AppInput
                  v-model="form.min_rate_per_half_day_session"
                  :type="'text'"
                  :name="'min_rate_per_half_day_session'"
                  :label="'From £'"
                  :error="formError.find(item => item.field === 'min_rate_per_half_day_session')"
                  @submit="save"
                  @blur="CheckEmptyField(form.min_rate_per_half_day_session, 'min_rate_per_half_day_session')"
                />
                <div class="mx-1"></div>
                <AppInput
                  v-model="form.max_rate_per_half_day_session"
                  :type="'text'"
                  :name="'max_rate_per_half_day_session'"
                  :label="'To £'"
                  :error="formError.find(item => item.field === 'max_rate_per_half_day_session')"
                  @submit="save"
                  @blur="CheckEmptyField(form.max_rate_per_half_day_session, 'max_rate_per_half_day_session')"
                />
              </div>
            </div>
            <div class="flex flex-col w-full sm:w-1/3 px-1">
              <label for="rates" class="text-xs sm:text-sm py-1">Per Whole Day Session</label>
              <div class="flex flex-row flex-no-wrap">
                <AppInput
                  v-model="form.min_rate_per_whole_day_session"
                  :type="'text'"
                  :name="'min_rate_per_whole_day_session'"
                  :label="'From £'"
                  :error="formError.find(item => item.field === 'min_rate_per_whole_day_session')"
                  @submit="save"
                  @blur="CheckEmptyField(form.min_rate_per_whole_day_session, 'min_rate_per_whole_day_session')"
                />
                <div class="mx-1"></div>
                <AppInput
                  v-model="form.max_rate_per_whole_day_session"
                  :type="'text'"
                  :name="'max_rate_per_whole_day_session'"
                  :label="'To £'"
                  :error="formError.find(item => item.field === 'max_rate_per_whole_day_session')"
                  @submit="save"
                  @blur="CheckEmptyField(form.max_rate_per_whole_day_session, 'max_rate_per_whole_day_session')"
                />
              </div>
            </div>
          </div>
        </div>
        <AppInput
          v-model="form.mandatory_training_id"
          :type="'multi-checkbox'"
          :name="'mandatory_training_id'"
          :label="'What type of Training(s) would you like to work for?'"
          :error="formError.find(item => item.field === 'mandatory_training_id')"
          :lists="mandatoryTrainings"
          @checked="form.mandatory_training_id.push(parseInt($event)), CheckEmptyField(form.mandatory_training_id, 'mandatory_training_id')"
          @unchecked="form.mandatory_training_id = form.mandatory_training_id.filter(id => id !== parseInt($event)), CheckEmptyField(form.mandatory_training_id, 'mandatory_training_id')"
        />
        <AppInput
          v-model="form.practice_type_id"
          :type="'multi-checkbox'"
          :name="'practice_type_id'"
          :label="'What type of Practice(s) would you like to work for?'"
          :error="formError.find(item => item.field === 'practice_type_id')"
          :lists="practiceTypes"
          @checked="form.practice_type_id.push(parseInt($event)), CheckEmptyField(form.practice_type_id, 'practice_type_id')"
          @unchecked="form.practice_type_id = form.practice_type_id.filter(id => id !== parseInt($event)), CheckEmptyField(form.practice_type_id, 'practice_type_id')"
        />
        <AppPostCode
          v-model="form.post_code"
          :name="'post_code'"
          :label="'The post code where I will be available at'"
          :error="formError.find(item => item.field === 'post_code')"
          @onSelect="onSelect"
          @blur="CheckEmptyField(form.post_code, 'post_code')"
        />
        <AppInput
          v-model="form.miles"
          :type="'text'"
          :name="'miles'"
          :label="`I will travel up to ${form.miles ? form.miles : 'n'} miles from this postcode`"
          :error="formError.find(item => item.field === 'miles')"
          :inStyle="'text-align:right;'"
          @blur="CheckEmptyField(form.miles, 'miles')"
        />
        <div class="text-xs sm:text-sm">Referees</div>
        <div class="rounded-lg bg-gray-400 p-8 my-2">
          <AppInput
            v-model="form.referee_1_contact_name"
            :type="'text'"
            :name="'referee_1_contact_name'"
            :label="'Contact name'"
            :inStyle="'background-color:#dae1e7;border-color:white'"
          />
          <AppInput
            v-model="form.referee_1_phone_number"
            :type="'text'"
            :name="'referee_1_phone_number'"
            :label="'Telephone number'"
            :inStyle="'background-color:#dae1e7;border-color:white'"
          />
          <AppInput
            v-model="form.referee_1_email"
            :type="'text'"
            :name="'referee_1_email'"
            :label="'Email address'"
            :inStyle="'background-color:#dae1e7;border-color:white'"
          />
        </div>
        <div class="rounded-lg bg-gray-400 p-8 my-2">
          <AppInput
            v-model="form.referee_2_contact_name"
            :type="'text'"
            :name="'referee_2_contact_name'"
            :label="'Contact name'"
            :inStyle="'background-color:#dae1e7;border-color:white'"
          />
          <AppInput
            v-model="form.referee_2_phone_number"
            :type="'text'"
            :name="'referee_2_phone_number'"
            :label="'Telephone number'"
            :inStyle="'background-color:#dae1e7;border-color:white'"
          />
          <AppInput
            v-model="form.referee_2_email"
            :type="'text'"
            :name="'referee_2_email'"
            :label="'Email address'"
            :inStyle="'background-color:#dae1e7;border-color:white'"
          />
        </div>
        <AppButton :label="'Save changes'" @click="save" />
      </div>
    </div>
    <div class="w-auto p-0 mb-4 lg:mb-0 lg:w-1/3 lg:pr-4 order-1 lg:order-2">
      <div class="shadow-lg p-8">
        <AppAvatar
          class="m-auto"
          :type="'update'"
          :src="avatar && avatar.file.url ? avatar.file.url : ''"
        />
      </div>
    </div>
  </div>
</template>
<script>
import AppFormError from "@/components/Base/AppFormError";
import AppLoading from "@/components/Base/AppLoading";
import AppInput from "@/components/Base/AppInput";
import AppPostCode from "@/components/Base/AppPostCode";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import AppButton from "@/components/Base/AppButton";
import AppAvatar from "@/components/Base/AppAvatar";
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
    AppFilterSearch,
    AppButton,
    AppAvatar
  },
  data() {
    return {
      professionCategoryId: "",
      // qualifications: [],
      form: {
        gmc_or_nmc_number: "",
        mpl_or_npl_number: "",
        nhs_smart_card_id_number: "",
        headline: "",
        short_biography: "",
        special_requirements: "",
        profession_id: "",
        qualification_id: [],
        clinical_system_id: [],
        spoken_language_id: [],
        min_rate_per_hour: "",
        max_rate_per_hour: "",
        min_rate_per_half_day_session: "",
        max_rate_per_half_day_session: "",
        min_rate_per_whole_day_session: "",
        max_rate_per_whole_day_session: "",
        practice_type_id: [],
        post_code: "",
        miles: "",
        referee_1_contact_name: "",
        referee_1_phone_number: "",
        referee_1_email: "",
        referee_2_contact_name: "",
        referee_2_phone_number: "",
        referee_2_email: ""
      },
      avatar: null,
      formError: [],
      loading: false
    };
  },
  computed: {
    professions() {
      return this.$store.getters["signUp/getProfessions"];
    },
    practiceTypes() {
      return this.$store.getters["signUp/getPracticeTypes"];
    },
    mandatoryTrainings() {
      return this.$store.getters["signUp/getMandatoryTrainings"];
    }
  },
  watch: {
    "form.profession_id"(value) {
      let profession = this.professions.find(item => item.value == value);
      if (profession.label === "GP") {
        this.professionCategoryId = 1;
      } else if (profession.label !== "GP") {
        this.professionCategoryId = 2;
      }
    },
    "form.gmc_or_nmc_number"() {
      this.CheckEmptyField(this.form.gmc_or_nmc_number, "gmc_or_nmc_number");
    },
    "form.mpl_or_npl_number"() {
      this.CheckEmptyField(this.form.mpl_or_npl_number, "mpl_or_npl_number");
    },
    "form.min_rate_per_hour"() {
      this.CheckEmptyField(this.form.min_rate_per_hour, "min_rate_per_hour");
    },
    "form.max_rate_per_hour"() {
      this.CheckEmptyField(this.form.max_rate_per_hour, "max_rate_per_hour");
    },
    "form.min_rate_per_half_day_session"() {
      this.CheckEmptyField(
        this.form.min_rate_per_half_day_session,
        "min_rate_per_half_day_session"
      );
    },
    "form.max_rate_per_half_day_session"() {
      this.CheckEmptyField(
        this.form.max_rate_per_half_day_session,
        "max_rate_per_half_day_session"
      );
    },
    "form.min_rate_per_whole_day_session"() {
      this.CheckEmptyField(
        this.form.min_rate_per_whole_day_session,
        "min_rate_per_whole_day_session"
      );
    },
    "form.max_rate_per_whole_day_session"() {
      this.CheckEmptyField(
        this.form.max_rate_per_whole_day_session,
        "max_rate_per_whole_day_session"
      );
    },
    "form.post_code"() {
      this.CheckEmptyField(this.form.post_code, "post_code");
    },
    "form.miles"() {
      this.CheckEmptyField(this.form.miles, "miles");
    }
  },
  async asyncData({ app, error }) {
    try {
      const response = await app.$axios.$get(`/api/v1/me`);
      const user =
        response.data && response.data.user ? response.data.user : null;
      return {
        user
      };
    } catch (err) {}
  },
  created() {
    this.avatar = this.user.avatar;
    this.form.gmc_or_nmc_number = this.user.locum_detail.gmc_or_nmc_number.number;
    this.form.mpl_or_npl_number = this.user.locum_detail.mpl_or_npl_number.number;
    this.form.nhs_smart_card_id_number = this.user.locum_detail.nhs_smart_card_id_number;
    this.form.headline = this.user.locum_detail.headline;
    this.form.short_biography = this.user.locum_detail.short_biography;
    this.form.special_requirements = this.user.locum_detail.special_requirements;
    // profession
    this.form.profession_id = this.user.locum_detail.profession.id;
    this.professionCategoryId = this.user.locum_detail.profession.profession_category.id;

    this.form.qualification_id = this.user.locum_detail.qualifications.map(
      qualification => {
        return { label: qualification.name, value: qualification.id };
      }
    );
    this.form.clinical_system_id = this.user.locum_detail.clinical_systems.map(
      clinicalSystem => {
        return { label: clinicalSystem.name, value: clinicalSystem.id };
      }
    );
    this.form.spoken_language_id = this.user.locum_detail.spoken_languages.map(
      spokenLanguage => {
        return { label: spokenLanguage.name, value: spokenLanguage.id };
      }
    );
    // rate
    this.form.min_rate_per_hour = this.user.locum_detail.rates.find(
      rate => rate.rate_type.id === 1
    ).min;
    this.form.max_rate_per_hour = this.user.locum_detail.rates.find(
      rate => rate.rate_type.id === 1
    ).max;
    this.form.min_rate_per_half_day_session = this.user.locum_detail.rates.find(
      rate => rate.rate_type.id === 2
    ).min;
    this.form.max_rate_per_half_day_session = this.user.locum_detail.rates.find(
      rate => rate.rate_type.id === 2
    ).max;
    this.form.min_rate_per_whole_day_session = this.user.locum_detail.rates.find(
      rate => rate.rate_type.id === 3
    ).min;
    this.form.max_rate_per_whole_day_session = this.user.locum_detail.rates.find(
      rate => rate.rate_type.id === 3
    ).max;
    //  practice type
    this.form.practice_type_id = this.user.locum_detail.practice_types.map(
      practiceType => practiceType.id
    );
    // mandatory trainings list
    this.form.mandatory_training_id = this.user.locum_detail.mandatory_trainings.map(
      mandatoryTraining => mandatoryTraining.mandatory_training.id
    );
    //
    this.form.post_code = this.user.locum_detail.post_code;
    this.form.miles = this.user.locum_detail.miles;

    this.user.locum_detail.referees.forEach((referee, index) => {
      if (index == 0) {
        this.form.referee_1_contact_name = referee.name;
        this.form.referee_1_phone_number = referee.phone_number;
        this.form.referee_1_email = referee.email;
      }
      if (index == 1) {
        this.form.referee_2_contact_name = referee.name;
        this.form.referee_2_phone_number = referee.phone_number;
        this.form.referee_2_email = referee.email;
      }
    });
  },
  methods: {
    onSelect(value) {
      let address_components = value.details.result.address_components;
      let postal_code = address_components.find(component =>
        component.types.includes("postal_code")
      );
      this.form.post_code = postal_code ? postal_code.long_name : "";
    },
    async save() {
      try {
        this.formError = [];
        this.Validate(this.form, [
          "nhs_smart_card_id_number",
          "headline",
          "short_biography",
          "special_requirements",
          "spoken_language_id",
          "referee_1_contact_name",
          "referee_1_phone_number",
          "referee_1_email",
          "referee_2_contact_name",
          "referee_2_phone_number",
          "referee_2_email"
        ]);
        if (!this.formError.length) {
          this.form.profession_id = this.form.profession_id.toString();
          this.form.qualification_id = this.form.qualification_id.length
            ? this.form.qualification_id.map(item => item.value)
            : [];
          this.form.clinical_system_id = this.form.clinical_system_id
            ? this.form.clinical_system_id.map(item => item.value)
            : [];
          this.form.spoken_language_id = this.form.spoken_language_id
            ? this.form.spoken_language_id.map(item => item.value)
            : [];
          const response = await this.$axios.$put(
            `/api/v1/locum/me/profile`,
            this.form
          );
          this.form.gmc_or_nmc_number =
            response.data.user.locum_detail.gmc_or_nmc_number.number;
          this.form.mpl_or_npl_number =
            response.data.user.locum_detail.mpl_or_npl_number.number;
          this.form.nhs_smart_card_id_number =
            response.data.user.locum_detail.nhs_smart_card_id_number;
          this.form.headline = response.data.user.locum_detail.headline;
          this.form.short_biography =
            response.data.user.locum_detail.short_biography;
          this.form.special_requirements =
            response.data.user.locum_detail.special_requirements;
          // profession
          this.form.profession_id =
            response.data.user.locum_detail.profession.id;
          //
          this.form.qualification_id = response.data.user.locum_detail.qualifications.map(
            qualification => {
              return { label: qualification.name, value: qualification.id };
            }
          );
          this.form.clinical_system_id = response.data.user.locum_detail.clinical_systems.map(
            clinicalSystem => {
              return { label: clinicalSystem.name, value: clinicalSystem.id };
            }
          );
          this.form.spoken_language_id = response.data.user.locum_detail.spoken_languages.map(
            spokenLanguage => {
              return { label: spokenLanguage.name, value: spokenLanguage.id };
            }
          );
          // rate
          this.form.min_rate_per_hour = response.data.user.locum_detail.rates.find(
            rate => rate.rate_type.id === 1
          ).min;
          this.form.max_rate_per_hour = response.data.user.locum_detail.rates.find(
            rate => rate.rate_type.id === 1
          ).max;
          this.form.min_rate_per_half_day_session = response.data.user.locum_detail.rates.find(
            rate => rate.rate_type.id === 2
          ).min;
          this.form.max_rate_per_half_day_session = response.data.user.locum_detail.rates.find(
            rate => rate.rate_type.id === 2
          ).max;
          this.form.min_rate_per_whole_day_session = response.data.user.locum_detail.rates.find(
            rate => rate.rate_type.id === 3
          ).min;
          this.form.max_rate_per_whole_day_session = response.data.user.locum_detail.rates.find(
            rate => rate.rate_type.id === 3
          ).max;
          //  practice type
          this.form.practice_type_id = response.data.user.locum_detail.practice_types.map(
            practiceType => practiceType.id
          );
          // mandatory trainings list
          this.form.mandatory_training_id = response.data.user.locum_detail.mandatory_trainings.map(
            mandatoryTraining => mandatoryTraining.mandatory_training.id
          );
          //
          this.form.post_code = response.data.user.locum_detail.post_code;
          this.form.miles = response.data.user.locum_detail.miles;

          response.data.user.locum_detail.referees.forEach((referee, index) => {
            if (index == 0) {
              this.form.referee_1_contact_name = referee.name;
              this.form.referee_1_phone_number = referee.phone_number;
              this.form.referee_1_email = referee.email;
            }
            if (index == 1) {
              this.form.referee_2_contact_name = referee.name;
              this.form.referee_2_phone_number = referee.phone_number;
              this.form.referee_2_email = referee.email;
            }
          });
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Saved !"]
          });
        } else {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: ["Please fill up all the forms"]
          });
          this.scrollToTop();
        }
      } catch (err) {
        this.formError = err.response.data.error_messages;
        this.scrollToTop();
      }
    }
  }
};
</script>


