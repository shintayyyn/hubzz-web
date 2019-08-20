<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div class="w-full p-0 lg:w-2/3 lg:pr-4 order-2 lg:order-1">
      <div class="rounded-lg shadow-lg w-full p-8">
        <AppFormError :formError="formError" v-if="formError.length > 0" />
        <AppInput
          v-model="form.gmc_or_nmc_number"
          :type="'text'"
          :name="'gmc_or_nmc_number'"
          :label="'GMC / NMC Number'"
          :placeholder="''"
          :info="'For compliance; to be verified by the hubzz team'"
        />
        <AppInput
          v-model="form.mpl_or_npl_number"
          :type="'text'"
          :name="'mpl_or_npl_number'"
          :label="'MPL / NPL Number'"
          :placeholder="''"
          :info="'For compliance; to be verified by the hubzz team'"
        />
        <AppInput
          v-model="form.nhs_smart_card_id_number"
          :type="'text'"
          :name="'nhs_smart_card_id_number'"
          :label="'Your NHS Smart Card ID number'"
          :placeholder="''"
        />
        <AppInput
          v-model="form.headline"
          :type="'text'"
          :name="'headline'"
          :label="'Headline'"
          :placeholder="''"
          :info="'A short headline about yourself to show to Practices'"
        />
        <AppTextarea
          v-model="form.short_biography"
          :name="'short_biography'"
          :label="'Short Biography'"
          :placeholder="''"
          :info="'A little bit about yourself to inform to the Practices'"
        />
        <AppTextarea
          v-model="form.special_requirements"
          :name="'special_requirements'"
          :label="'Special requirements'"
          :placeholder="''"
          :info="'Information for Practices for your own needs'"
        />
        <AppSelect
          v-model="form.profession_id"
          :name="'profession_id'"
          :label="'Profession'"
          :placeholder="'Select..'"
          :items="professions"
        />
        <AppFilterSearch
          v-model="form.qualification_id"
          :name="'qualification_id'"
          :label="'Specialty'"
          :placeholder="'Select...'"
          :items="gpQualifications"
          :info="'Choose at least one qualification'"
        />
        <AppFilterSearch
          v-model="form.clinical_system_id"
          :name="'clinical_system_id'"
          :label="'Clinical systems'"
          :placeholder="'Select...'"
          :items="clinicalSystems"
          :info="'Choose at least one IT system'"
        />
        <AppFilterSearch
          v-model="form.spoken_language_id"
          :name="'spoken_language_id'"
          :label="'Spoken languages'"
          :placeholder="'Select...'"
          :items="spokenLanguages"
          :info="'Choose other languages you can speak'"
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
                />
                <div class="mx-1"></div>
                <AppInput
                  v-model="form.max_rate_per_hour"
                  :type="'text'"
                  :name="'max_rate_per_hour'"
                  :label="'To £'"
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
                />
                <div class="mx-1"></div>
                <AppInput
                  v-model="form.max_rate_per_half_day_session"
                  :type="'text'"
                  :name="'max_rate_per_half_day_session'"
                  :label="'To £'"
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
                />
                <div class="mx-1"></div>
                <AppInput
                  v-model="form.max_rate_per_whole_day_session"
                  :type="'text'"
                  :name="'max_rate_per_whole_day_session'"
                  :label="'To £'"
                />
              </div>
            </div>
          </div>
        </div>
        <AppInput
          v-model="form.mandatory_training_id"
          :type="'multi-checkbox'"
          @checked="form.mandatory_training_id.push(parseInt($event))"
          @unchecked="uncheckMandatory($event)"
          :name="'mandatory_training_id'"
          :label="'What type of Training(s) would you like to work for?'"
          :placeholder="''"
          :lists="mandatoryTrainings"
        />
        <AppInput
          v-model="form.practice_type_id"
          :type="'multi-checkbox'"
          @checked="form.practice_type_id.push(parseInt($event))"
          @unchecked="uncheckPracticeType($event)"
          :name="'practice_type_id'"
          :label="'What type of Practice(s) would you like to work for?'"
          :placeholder="''"
          :lists="practiceTypes"
        />
        <AppPostCode
          v-model="form.post_code"
          :name="'post_code'"
          :label="'The post code where I will be available at'"
          @onSelect="onSelect"
        />
        <AppInput
          v-model="form.miles"
          :type="'text'"
          :name="'miles'"
          :label="`I will travel up to ${form.miles} miles from this postcode`"
          :placeholder="''"
          :inStyle="'text-align:right;'"
        />
        <div class="text-xs sm:text-sm">Referees</div>
        <div class="rounded-lg bg-gray-400 p-6 my-4">
          <AppInput
            v-model="form.referee_1_contact_name"
            :type="'text'"
            :name="'referee_1_contact_name'"
            :label="'Contact name'"
            :placeholder="''"
            :error="formError.find(item => item.field === 'referee_1_contact_name')"
            :inStyle="'background-color:#dae1e7;border-color:white'"
          />
          <AppInput
            v-model="form.referee_1_phone_number"
            :type="'text'"
            :name="'referee_1_phone_number'"
            :label="'Telephone number'"
            :placeholder="''"
            :error="formError.find(item => item.field === 'referee_1_phone_number')"
            :inStyle="'background-color:#dae1e7;border-color:white'"
          />
          <AppInput
            v-model="form.referee_1_email"
            :type="'text'"
            :name="'referee_1_email'"
            :label="'Email address'"
            :placeholder="''"
            :error="formError.find(item => item.field === 'referee_1_email')"
            :inStyle="'background-color:#dae1e7;border-color:white'"
          />
        </div>
        <div class="rounded-lg bg-gray-400 p-6 my-4">
          <AppInput
            v-model="form.referee_2_contact_name"
            :type="'text'"
            :name="'referee_2_contact_name'"
            :label="'Contact name'"
            :placeholder="''"
            :error="formError.find(item => item.field === 'referee_2_contact_name')"
            :inStyle="'background-color:#dae1e7;border-color:white'"
          />
          <AppInput
            v-model="form.referee_2_phone_number"
            :type="'text'"
            :name="'referee_2_phone_number'"
            :label="'Telephone number'"
            :placeholder="''"
            :error="formError.find(item => item.field === 'referee_2_phone_number')"
            :inStyle="'background-color:#dae1e7;border-color:white'"
          />
          <AppInput
            v-model="form.referee_2_email"
            :type="'text'"
            :name="'referee_2_email'"
            :label="'Email address'"
            :placeholder="''"
            :error="formError.find(item => item.field === 'referee_2_email')"
            :inStyle="'background-color:#dae1e7;border-color:white'"
          />
        </div>
        <AppButton :label="'Save changes'" @click="save" />
      </div>
    </div>
    <div class="w-auto p-0 mb-4 lg:mb-0 lg:w-1/3 lg:pr-4 order-1 lg:order-2">
      <Avatar :avatar="avatar" />
    </div>
  </div>
</template>
<script>
import AppFormError from "@/components/Base/AppFormError";
import Avatar from "@/components/Account/Avatar";
import AppInput from "@/components/Base/AppInput";
import AppPostCode from "@/components/Base/AppPostCode";
import AppTextarea from "@/components/Base/AppTextarea";
import AppSelect from "@/components/Base/AppSelect";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import AppButton from "@/components/Base/AppButton";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppFormError,
    Avatar,
    AppInput,
    AppPostCode,
    AppTextarea,
    AppSelect,
    AppFilterSearch,
    AppButton
  },
  data() {
    return {
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
      formError: []
    };
  },
  computed: {
    professions() {
      return this.$store.getters["signUp/getProfessions"];
    },
    gpQualifications() {
      return this.$store.getters["signUp/getGpQualifications"];
    },
    othersQualifications() {
      return this.$store.getters["signUp/getOthersQualifications"];
    },
    clinicalSystems() {
      return this.$store.getters["signUp/getClinicalSystems"];
    },
    spokenLanguages() {
      return this.$store.getters["signUp/getSpokenLanguages"];
    },
    practiceTypes() {
      return this.$store.getters["signUp/getPracticeTypes"];
    },
    mandatoryTrainings() {
      return this.$store.getters["signUp/getMandatoryTrainings"];
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
    //
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
    uncheckPracticeType(value) {
      this.form.practice_type_id = this.form.practice_type_id.filter(
        id => id != value
      );
    },
    uncheckMandatory(value) {
      this.form.mandatory_training_id = this.form.mandatory_training_id.filter(
        id => id != value
      );
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


