<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div class="w-full p-0 lg:w-2/3 lg:pr-4">
      <div class="rounded-lg shadow-lg w-full p-8">
        <AppInput
          v-model="form.gmc_or_nmc_number.number"
          :type="'text'"
          :name="'gmc_or_nmc_number'"
          :label="'GMC / NMC Number'"
          :placeholder="''"
          :error="formError.find(item => item.field === 'gmc_or_nmc_number')"
          :info="'For compliance; to be verified by the hubzz team'"
        />
        <AppInput
          v-model="form.mpl_or_npl_number.number"
          :type="'text'"
          :name="'mpl_or_npl_number'"
          :label="'MPL / NPL Number'"
          :placeholder="''"
          :error="formError.find(item => item.field === 'mpl_or_npl_number')"
          :info="'For compliance; to be verified by the hubzz team'"
        />
        <AppInput
          v-model="form.nhs_smart_card_id_number"
          :type="'text'"
          :name="'nhs_smart_card_id_number'"
          :label="'Your NHS Smart Card ID number'"
          :placeholder="''"
          :error="formError.find(item => item.field === 'nhs_smart_card_id_number')"
        />
        <AppInput
          v-model="form.headline"
          :type="'text'"
          :name="'headline'"
          :label="'Headline'"
          :placeholder="''"
          :error="formError.find(item => item.field === 'headline')"
          :info="'A short headline about yourself to show to Practices'"
        />
        <AppTextarea
          v-model="form.short_biography"
          :name="'short_biography'"
          :label="'Short Biography'"
          :placeholder="''"
          :info="'A little bit about yourslef to inform to the Practices'"
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
              class="rounded-lg bg-grey-light p-1 text-xs sm:text-sm"
            >To match available jobs with</div>
          </div>
          <div class="flex flex-row flex-wrap justify-between">
            <AppRate v-model="per_hour" :name="'per_hour'" :label="'Per hour'"/>
            <AppRate
              v-model="per_half_day_session"
              :name="'per_half_day_session'"
              :label="'Per half day session'"
            />
            <AppRate
              v-model="per_whole_day_session"
              :name="'per_whole_day_session'"
              :label="'Per whole day session'"
            />
          </div>
        </div>
        <AppInput
          v-model="form.practice_type_id"
          :type="'multi-checkbox'"
          @checked="form.practice_type_id.push(parseInt($event))"
          @unchecked="uncheckOther($event)"
          :name="'practice_type_id'"
          :label="'What type of Practice(s) are you?'"
          :placeholder="''"
          :error="this.formError.find(item => item.field === 'practice_type_id')"
          :lists="practiceTypes"
        />
        <AppInput
          v-model="form.post_code"
          :type="'text'"
          :name="'post_code'"
          :label="'The post code where I will be available at'"
          :placeholder="''"
          :error="formError.find(item => item.field === 'post_code')"
        />
        <AppInput
          v-model="form.miles"
          :type="'text'"
          :name="'miles'"
          :label="'No further than (in miles)'"
          :placeholder="''"
          :error="formError.find(item => item.field === 'miles')"
          :inStyle="'text-align:right;'"
        />
        <div class="text-xs sm:text-sm">Referees</div>
        <div class="rounded-lg bg-grey-light p-6 my-4">
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
        <div class="rounded-lg bg-grey-light p-6 my-4">
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
        <AppButton :label="'Save changes'" @click="save"/>
      </div>
    </div>
    <div class="w-auto p-0 mt-4 lg:mt-0 lg:w-1/3 lg:pr-4">
      <Avatar :avatar="avatar"/>
    </div>
  </div>
</template>
<script>
import Avatar from '@/components/Account/Avatar'
import AppInput from '@/components/Base/AppInput'
import AppTextarea from '@/components/Base/AppTextarea'
import AppSelect from '@/components/Base/AppSelect'
import AppFilterSearch from '@/components/Base/AppFilterSearch'
import AppRate from '@/components/Base/AppRate'
import AppButton from '@/components/Base/AppButton'
export default {
  components: {
    Avatar,
    AppInput,
    AppTextarea,
    AppSelect,
    AppFilterSearch,
    AppRate,
    AppButton
  },
  data() {
    return {
      per_hour: {
        min: '',
        max: ''
      },
      per_half_day_session: {
        min: '',
        max: ''
      },
      per_whole_day_session: {
        min: '',
        max: ''
      },
      form: {
        gmc_or_nmc_number: '',
        mpl_or_npl_number: '',
        nhs_smart_card_id_number: '',
        headline: '',
        short_biography: '',
        special_requirements: '',
        profession_id: '',
        qualification_id: [],
        clinical_system_id: [],
        spoken_language_id: [],
        min_rate_per_hour: '',
        max_rate_per_hour: '',
        min_rate_per_half_day_session: '',
        max_rate_per_half_day_session: '',
        min_rate_per_whole_day_session: '',
        max_rate_per_whole_day_session: '',
        practice_type_id: [],
        post_code: '',
        miles: '',
        referee_1_contact_name: '',
        referee_1_phone_number: '',
        referee_1_email: '',
        referee_2_contact_name: '',
        referee_2_phone_number: '',
        referee_2_email: '',
      },
      avatar: null,
      formError: []
    }
  },
  computed: {
    professions() {
      return this.$store.getters['signUp/getProfessions']
    },
    gpQualifications() {
      return this.$store.getters['signUp/getGpQualifications']
    },
    othersQualifications() {
      return this.$store.getters['signUp/getOthersQualifications']
    },
    clinicalSystems() {
      return this.$store.getters['signUp/getClinicalSystems']
    },
    spokenLanguages() {
      return this.$store.getters['signUp/getSpokenLanguages']
    },
    practiceTypes() {
      return this.$store.getters['signUp/getPracticeTypes']
    },
  },
  created() {
    this.$axios.$get('/api/v1/me').then(res => {
      console.log(res.data.user.avatar)
      this.avatar = res.data.user.avatar
      this.form.gmc_or_nmc_number = res.data.user.locum_detail.gmc_or_nmc_number,
        this.form.mpl_or_npl_number = res.data.user.locum_detail.mpl_or_npl_number,
        this.form.nhs_smart_card_id_number = res.data.user.locum_detail.nhs_smart_card_id_number,
        this.form.headline = res.data.user.locum_detail.headline,
        this.form.short_biography = res.data.user.locum_detail.short_biography,
        this.form.special_requirements = res.data.user.locum_detail.special_requirements,
        this.form.profession_id = res.data.user.locum_detail.profession.id,
        this.form.qualification_id = res.data.user.locum_detail.qualifications.map(item => {
          return { label: item.name, value: item.id }
        })
      this.form.clinical_system_id = res.data.user.locum_detail.clinical_systems.map(item => {
        return { label: item.name, value: item.id }
      })
      this.form.spoken_language_id = res.data.user.locum_detail.spoken_languages.map(item => {
        return { label: item.name, value: item.id }
      })
      this.per_hour.min = res.data.user.locum_detail.rates.find(rate => rate.rate_type.id === 1).min
      this.per_hour.max = res.data.user.locum_detail.rates.find(rate => rate.rate_type.id === 1).max
      this.per_half_day_session.min = res.data.user.locum_detail.rates.find(rate => rate.rate_type.id === 2).min
      this.per_half_day_session.max = res.data.user.locum_detail.rates.find(rate => rate.rate_type.id === 2).max
      this.per_whole_day_session.min = res.data.user.locum_detail.rates.find(rate => rate.rate_type.id === 3).min
      this.per_whole_day_session.max = res.data.user.locum_detail.rates.find(rate => rate.rate_type.id === 3).max
      this.form.practice_type_id = res.data.user.locum_detail.practice_types.map(item => {
        return item.id
      })
      this.form.post_code = res.data.user.locum_detail.post_code
      this.form.miles = res.data.user.locum_detail.miles
      if (res.data.user.locum_detail.referees[0]) {
        this.form.referee_1_contact_name = res.data.user.locum_detail.referees[0].name
        this.form.referee_1_phone_number = res.data.user.locum_detail.referees[0].phone_number
        this.form.referee_1_email = res.data.user.locum_detail.referees[0].email
      }
      if (res.data.user.locum_detail.referees[1]) {
        this.form.referee_2_contact_name = res.data.user.locum_detail.referees[1].name
        this.form.referee_2_phone_number = res.data.user.locum_detail.referees[1].phone_number
        this.form.referee_2_email = res.data.user.locum_detail.referees[1].email
      }
    })

  },
  methods: {
    uncheckOther(value) {
      this.form.practice_type_id = this.form.practice_type_id.filter(id => id != value)
    },
    save() {
      this.form.profession_id = this.form.profession_id.toString()
      this.form.gmc_or_nmc_number = this.form.gmc_or_nmc_number.number
      this.form.mpl_or_npl_number = this.form.mpl_or_npl_number.number
      this.form.qualification_id = this.form.qualification_id.length ? this.form.qualification_id.map(item => item.value) : []
      this.form.clinical_system_id = this.form.clinical_system_id ? this.form.clinical_system_id.map(item => item.value) : []
      this.form.spoken_language_id = this.form.spoken_language_id ? this.form.spoken_language_id.map(item => item.value) : []
      this.form.min_rate_per_hour = this.per_hour.min
      this.form.max_rate_per_hour = this.per_hour.max
      this.form.min_rate_per_half_day_session = this.per_half_day_session.min
      this.form.max_rate_per_half_day_session = this.per_half_day_session.max
      this.form.min_rate_per_whole_day_session = this.per_whole_day_session.max
      this.form.max_rate_per_whole_day_session = this.per_whole_day_session.max
      this.formError = []
      // this.Validate(this.form, ['contact_name_1', 'contact_telephone_number_1', 'contact_email_address_1',
      //   'nhs_smart_card_id_number', 'headline', 'short_biography', 'special_requirements',
      //   'contact_name_2', 'contact_telephone_number_2', 'contact_email_address_2'])
      // this.ValidateEmail({ email: this.form.contact_email_address_1, field: 'contact_email_address_1' })
      // this.ValidateEmail({ email: this.form.contact_email_address_2, field: 'contact_email_address_2' })
      if (!this.formError.length) {
        this.$axios.$put('/api/v1/locum/me/profile', this.form).then(res => {
          this.form.gmc_or_nmc_number = res.data.user.locum_detail.gmc_or_nmc_number,
            this.form.mpl_or_npl_number = res.data.user.locum_detail.mpl_or_npl_number,
            this.form.nhs_smart_card_id_number = res.data.user.locum_detail.nhs_smart_card_id_number,
            this.form.headline = res.data.user.locum_detail.headline,
            this.form.short_biography = res.data.user.locum_detail.short_biography,
            this.form.special_requirements = res.data.user.locum_detail.special_requirements,
            this.form.profession_id = res.data.user.locum_detail.profession.id,
            this.form.qualification_id = res.data.user.locum_detail.qualifications.map(item => {
              return { label: item.name, value: item.id }
            })
          this.form.clinical_system_id = res.data.user.locum_detail.clinical_systems.map(item => {
            return { label: item.name, value: item.id }
          })
          this.form.spoken_language_id = res.data.user.locum_detail.spoken_languages.map(item => {
            return { label: item.name, value: item.id }
          })
          this.per_hour.min = res.data.user.locum_detail.rates.find(rate => rate.rate_type.id === 1).min
          this.per_hour.max = res.data.user.locum_detail.rates.find(rate => rate.rate_type.id === 1).max
          this.per_half_day_session.min = res.data.user.locum_detail.rates.find(rate => rate.rate_type.id === 2).min
          this.per_half_day_session.max = res.data.user.locum_detail.rates.find(rate => rate.rate_type.id === 2).max
          this.per_whole_day_session.min = res.data.user.locum_detail.rates.find(rate => rate.rate_type.id === 3).min
          this.per_whole_day_session.max = res.data.user.locum_detail.rates.find(rate => rate.rate_type.id === 3).max
          this.form.practice_type_id = res.data.user.locum_detail.practice_types.map(item => {
            return item.id
          })
          this.form.post_code = res.data.user.locum_detail.post_code
          this.form.miles = res.data.user.locum_detail.miles
          if (res.data.user.locum_detail.referees[0]) {
            this.form.referee_1_contact_name = res.data.user.locum_detail.referees[0].name
            this.form.referee_1_phone_number = res.data.user.locum_detail.referees[0].phone_number
            this.form.referee_1_email = res.data.user.locum_detail.referees[0].email
          }
          if (res.data.user.locum_detail.referees[1]) {
            this.form.referee_2_contact_name = res.data.user.locum_detail.referees[1].name
            this.form.referee_2_phone_number = res.data.user.locum_detail.referees[1].phone_number
            this.form.referee_2_email = res.data.user.locum_detail.referees[1].email
          }
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved !' })
        })
      } else {
        this.loading = false
      }
    }
  }
}
</script>
<style scoped>
button:active {
  transform: translate(2px, 2px);
}
</style>


