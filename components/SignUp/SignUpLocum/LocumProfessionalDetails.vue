<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex m-4" style="flex: 0 1 600px;">
        <h4>Your professional details</h4>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start">
      <div class="mx-4 flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <form class="w-full">
          <AppInput
            v-model="form.gmc_or_nmc_number"
            :type="'text'"
            :name="'gmc_or_nmc_number'"
            :label="'Your GMC / NMC Number'"
            :placeholder="'GMC / NMC Number'"
            :error="formError.find(item => item.field === 'gmc_or_nmc_number')"
            :info="'For compliance; to be verified by the hubzz team'"
          />
          <AppInput
            v-model="form.mpl_or_npl_number"
            :type="'text'"
            :name="'mpl_or_npl_number'"
            :label="'Your MPL / NPL Number'"
            :placeholder="'MPL / NPL Number'"
            :error="formError.find(item => item.field === 'mpl_or_npl_number')"
            :info="'For compliance; to be verified by the hubzz team'"
          />

          <AppInput
            v-model="form.nhs_smart_card_id_number"
            :type="'text'"
            :name="'nhs_smart_card_id_number'"
            :label="'Your NHS Smart Card ID number'"
            :placeholder="'NHS Smart Card ID number'"
          />

          <AppSelect
            v-model="form.profession_id"
            :name="'profession_id'"
            :label="'Profession'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'profession_id')"
            :items="professions"
          />

          <AppFilterSearch
            v-model="form.qualification_id"
            :name="'qualification_id'"
            :label="'Specialty'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'qualification_id')"
            :items="gpQualifications"
            :info="'Choose at least one qualification'"
          />

          <AppFilterSearch
            v-model="form.clinical_system_id"
            :name="'clinical_system_id'"
            :label="'Clinical systems'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'clinical_system_id')"
            :items="clinicalSystems"
            :info="'Choose at least one IT system'"
          />

          <AppFilterSearch
            v-model="form.spoken_language_id"
            :name="'spoken_language_id'"
            :label="'Spoken languages'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'spoken_language_id')"
            :items="spokenLanguages"
            :info="'Choose other languages you can speak'"
            :defaultItem="'English'"
          />

          <div class="flex flex-col my-8">
            <div class="flex flex-row justify-between">
              <label for="rates" class="text-xs sm:text-sm py-1">Your preferred rates £</label>
              <div
                class="rounded-lg bg-gray-300 p-1 text-xs sm:text-sm"
              >To match available jobs with</div>
            </div>
            <div class="flex flex-row flex-wrap justify-between">
              <AppRate
                v-model="per_hour"
                :name="'per_hour'"
                :label="'Per hour'"
                :error="formError.find(item => item.field === 'per_hour')"
              />
              <AppRate
                v-model="per_half_day_session"
                :name="'per_half_day_session'"
                :error="formError.find(item => item.field === 'per_half_day_session')"
                :label="'Per half day session'"
              />
              <AppRate
                v-model="per_whole_day_session"
                :name="'per_whole_day_session'"
                :label="'Per whole day session'"
                :error="formError.find(item => item.field === 'per_whole_day_session')"
              />
            </div>
          </div>

          <AppInput
            v-model="form.practice_type_id"
            :type="'multi-checkbox'"
            @checked="form.practice_type_id.push(parseInt($event))"
            @unchecked="uncheckOther($event)"
            :name="'practice_type_id'"
            :label="'What type of Practice(s) would you like to work for?'"
            :placeholder="''"
            :error="this.formError.find(item => item.field === 'practice_type_id')"
            :lists="practiceTypes"
          />

          <AppSelect
            v-model="form.ir35"
            :name="'ir35'"
            :label="'Are you OK to work with Practices that are inside of scope for IR35?'"
            :placeholder="'Select'"
            :error="formError.find(item => item.field === 'ir35')"
            :items="[{value: false, label: 'No'},{value: true, label: 'Yes'}]"
            :info="'Only apply if you are self-employed'"
          />
        </form>
      </div>
    </div>

    <div class="flex justify-center mt-4">
      <AppButton
        :label="'<<'"
        @click="$store.commit('signUp/SET_ACTIVE_COMPONENT', 'LocumAddressDetails')"
      />
      <div class="mx-2"></div>
      <AppButton :label="'Next'" @click="next" />
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppSelect from "@/components/Base/AppSelect";
import AppButton from "@/components/Base/AppButton";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import AppRate from "@/components/Base/AppRate";
import { parse } from "cookie";
export default {
  components: {
    AppInput,
    AppSelect,
    AppButton,
    AppFilterSearch,
    AppRate
  },
  data() {
    return {
      pratice_types: [],
      per_hour: {
        min: 0,
        max: 0
      },
      per_half_day_session: {
        min: 0,
        max: 0
      },
      per_whole_day_session: {
        min: 0,
        max: 0
      },

      form: {
        gmc_or_nmc_number: "",
        mpl_or_npl_number: "",
        nhs_smart_card_id_number: "",
        profession_id: "",
        qualification_id: [],
        clinical_system_id: [],
        spoken_language_id: [],
        min_rate_per_hour: 0,
        max_rate_per_hour: 0,
        min_rate_per_half_day_session: 0,
        max_rate_per_half_day_session: 0,
        min_rate_per_whole_day_session: 0,
        max_rate_per_whole_day_session: 0,
        ir35: false,
        practice_type_id: [],
        mandatory_training_id: []
      },
      formError: [],
      setFocus: ""
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
    professionalDetails() {
      return this.$store.state.signUp.professional_details;
    },
    professionalFormError() {
      return this.$store.state.signUp.professional_detail_form_error;
    }
  },
  created() {
    this.pratice_types = this.practiceTypes;
    this.form.gmc_or_nmc_number = this.professionalDetails.gmc_or_nmc_number;
    this.form.mpl_or_npl_number = this.professionalDetails.mpl_or_npl_number;
    this.form.nhs_smart_card_id_number = this.professionalDetails.nhs_smart_card_id_number;
    this.form.profession_id = this.professionalDetails.profession_id;

    if (this.form.profession_id == 1) {
      this.professionalDetails.qualification_id.forEach(id => {
        this.form.qualification_id.push(
          this.gpQualifications.find(item => item.value === id)
        );
      });
    } else {
      this.professionalDetails.qualification_id.forEach(id => {
        this.form.qualification_id.push(
          this.othersQualifications.find(item => item.value === id)
        );
      });
    }

    this.professionalDetails.clinical_system_id.forEach(id => {
      this.form.clinical_system_id.push(
        this.clinicalSystems.find(item => item.value === id)
      );
    });
    this.professionalDetails.spoken_language_id.forEach(id => {
      this.form.spoken_language_id.push(
        this.spokenLanguages.find(item => item.value === id)
      );
    });

    this.per_hour.min = this.professionalDetails.min_rate_per_hour;
    this.per_hour.max = this.professionalDetails.max_rate_per_hour;
    this.per_half_day_session.min = this.professionalDetails.min_rate_per_half_day_session;
    this.per_half_day_session.max = this.professionalDetails.max_rate_per_half_day_session;
    this.per_whole_day_session.min = this.professionalDetails.min_rate_per_whole_day_session;
    this.per_whole_day_session.max = this.professionalDetails.max_rate_per_whole_day_session;
    this.form.ir35 = this.professionalDetails.ir35;

    this.form.practice_type_id = [];
    this.professionalDetails.practice_type_id.forEach(id => {
      this.form.practice_type_id.push(id);
    });
    // this.form.practice_type_id = this.professionalDetails.practice_type_id

    if (this.professionalFormError.length > 0) {
      this.professionalFormError.forEach(item => {
        this.formError.push(item);
      });
    }
  },
  watch: {
    "form.gmc_or_nmc_number"(value) {
      // splice from formerror
      let index = this.formError.findIndex(
        item => item.field === "gmc_or_nmc_number"
      );
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      // validate
      if (!value) {
        this.formError.push({
          field: "gmc_or_nmc_number",
          message: "GCM/NCM Number is Required"
        });
      }
    },

    "form.mpl_or_npl_number"(value) {
      // splice from formerror
      let index = this.formError.findIndex(
        item => item.field === "mpl_or_npl_number"
      );
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      // validate
      if (!value) {
        this.formError.push({
          field: "mpl_or_npl_number",
          message: "MPL/NPL Number is Required"
        });
      }
    },

    "form.profession_id"(value) {
      // splice from formerror
      let index = this.formError.findIndex(
        item => item.field === "profession_id"
      );
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      // validate
      if (!value) {
        this.formError.push({
          field: "profession_id",
          message: "Profession is Required"
        });
      }
    },

    "form.qualification_id"(value) {
      // splice from formerror
      let index = this.formError.findIndex(
        item => item.field === "qualification_id"
      );
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      // validate
      if (value.length < 1) {
        this.formError.push({
          field: "qualification_id",
          message: "Specialty is Required"
        });
      }
    },

    "form.clinical_system_id"(value) {
      // splice from formerror
      let index = this.formError.findIndex(
        item => item.field === "clinical_system_id"
      );
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      // validate
      if (value.length < 1) {
        this.formError.push({
          field: "clinical_system_id",
          message: "Clinical Systems is Required"
        });
      }
    },

    "form.spoken_language_id"(value) {
      // splice from formerror
      let index = this.formError.findIndex(
        item => item.field === "spoken_language_id"
      );
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      // validate
      if (value.length < 1) {
        this.formError.push({
          field: "spoken_language_id",
          message: "Spoken Language is Required"
        });
      }
    },

    "form.per_hour"(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === "per_hour");
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      if (!value.min) {
        this.formError.push({
          field: "per_hour",
          message: "Rate is Required"
        });
      } else if (!value.min >= this.form.per_hour.max) {
        this.formError.push({ field: "per_hour", message: "asdda" });
      }
    },

    "form.practice_type_id"(value) {
      console.log(this.form.practice_type_id);

      // splice from formerror
      let index = this.formError.findIndex(
        item => item.field === "practice_type_id"
      );
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
    },

    "form.ir35"(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === "ir35");
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
    }
  },
  methods: {
    uncheckOther(value) {
      this.form.practice_type_id = this.form.practice_type_id.filter(
        id => id != value
      );
    },
    next() {
      try {
        // this.Validate(this.form, ['nhs_smart_card_id_number', 'spoken_language_id', 'mandatory_training_id'])
        this.formError = [];

        if (!this.form.gmc_or_nmc_number) {
          this.formError.push({
            field: "gmc_or_nmc_number",
            message: "GCM/NCM Number is Required"
          });
        }

        if (!this.form.mpl_or_npl_number) {
          this.formError.push({
            field: "mpl_or_npl_number",
            message: "MPL/NPL Number is Required"
          });
        }

        if (!this.form.profession_id) {
          this.formError.push({
            field: "profession_id",
            message: "Profession is Required"
          });
        }

        if (this.form.qualification_id.length < 1) {
          this.formError.push({
            field: "qualification_id",
            message: "Specialty is Required"
          });
        }

        if (this.form.clinical_system_id.length < 1) {
          this.formError.push({
            field: "clinical_system_id",
            message: "Clinical systems is Required"
          });
        }

        if (this.form.spoken_language_id.length < 1) {
          this.formError.push({
            field: "spoken_language_id",
            message: "Spoken Language is Required"
          });
        }
        if (
          !this.per_hour.min ||
          parseInt(this.per_hour.max) <= parseInt(this.per_hour.min)
        ) {
          this.formError.push({
            field: "per_hour",
            message: "Invalid Rate"
          });
        }

        if (
          !this.per_half_day_session.min ||
          parseInt(this.per_half_day_session.max) <=
          parseInt(this.per_half_day_session.min)
        ) {
          this.formError.push({
            field: "per_half_day_session",
            message: "Invalid Rate"
          });
        }

        if (
          !this.per_whole_day_session.min ||
          parseInt(this.per_whole_day_session.max) <=
          parseInt(this.per_whole_day_session.min)
        ) {
          this.formError.push({
            field: "per_whole_day_session",
            message: "Invalid Rate"
          });
        }

        if (this.form.practice_type_id.length < 1) {
          this.formError.push({
            field: "practice_type_id",
            message: "Practice Types is Required"
          });
        }

        if (!this.form.ir35) {
          this.formError.push({
            field: "ir35",
            message: "IR35 is Required"
          });
        }

        if (!this.formError.length) {
          this.form.qualification_id = this.form.qualification_id.length
            ? this.form.qualification_id.map(item => item.value)
            : [];
          this.form.clinical_system_id = this.form.clinical_system_id
            ? this.form.clinical_system_id.map(item => item.value)
            : [];
          this.form.spoken_language_id = this.form.spoken_language_id
            ? this.form.spoken_language_id.map(item => item.value)
            : [];
          this.form.min_rate_per_hour = this.per_hour.min;
          this.form.max_rate_per_hour = this.per_hour.max;
          this.form.min_rate_per_half_day_session = this.per_half_day_session.min;
          this.form.max_rate_per_half_day_session = this.per_half_day_session.max;
          this.form.min_rate_per_whole_day_session = this.per_whole_day_session.min;
          this.form.max_rate_per_whole_day_session = this.per_whole_day_session.max;

          this.$store.commit("signUp/SET_PROFESSIONAL_DETAILS", this.form);
          this.$store.commit(
            "signUp/SET_ACTIVE_COMPONENT",
            "LocumCredentialDetails"
          );
        }
      } catch (e) {
        console.log(e);
      }
    },
    isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
  }
};
</script>
